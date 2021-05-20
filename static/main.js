// a partir de aqui especificamos e inicializamos las funciones a utilizar 
function loadMessages(data) {
    $('#messages').html("");
    for (x in data['channels'][activeChannel]) {
        const media=document.createElement('div');
        if (data['channels'][activeChannel][x]['username']==localStorage.getItem('username')) {
            media.className=' media d-flex flex-row-reverse'; 
        }else {
            media.className=' media';
        }
        const mediaLeft=document.createElement('div');
        mediaLeft.className=' media-left';
        const mediaBody=document.createElement('div');
        mediaBody.className=' media-left';
        const username=document.createElement('span');
        username.innerHTML=data['channels'][activeChannel][x]['username']
        username.className='text-danger';
        const p=document.createElement('p');
        p.innerHTML=data['channels'][activeChannel][x]['text']
        const time=document.createElement('small');
        time.innerHTML=data['channels'][activeChannel][x]['time'];
        time.className='text-muted pl-2';

        $('#messages').append(media);
        media.append(mediaLeft);
        media.append(mediaBody);
        mediaBody.append(username);
        mediaBody.append(time);
        mediaBody.append(p);
        
        $('#messages').scrollTop(500000);
}
}



function loadChannels(data) {
for (channel in data['channels']){
    appendChannel(channel);
}

}
function appendChannel(channel) {
const li=document.createElement('li');
li.className='sidebar-channels channel-list';
li.innerHTML='#'+channel.charAt(0).toUpperCase() + channel.slice(1);
li.setAttribute("id", channel);
$('#channelList').append(li);
}

//probando para private messages
function chooseUser(user) {
if (user!=localStorage.getItem('username')) {
    const username=localStorage.getItem('username');
    const time=new Date().toLocaleString();
    activeChannel=localStorage.getItem('activeChannel');
    privateWindow=true;
    inRoom=false;
    $('#messages').html("");
    localStorage.setItem('activeMessage',user);
    if (activeChannel!="General") {
        socket.emit('leave',{'channel':activeChannel,'mymessage':'has left the room','username':username,'time':time});
    }
}else {
    
}
$('#messageInput').focus();
}

$(function(){   
 
    var socket=io.connect(location.protocol+'//'+document.domain+':'+location.port);
    privateWindow=false;
    inRoom=false;
    socket.on('connect',()=>{
        $('#messageInput').on("keyup",function(key) {
            activeChannel=$("#channelList .active").attr('id');
            //broadcast para enviar en tiempo real
            if (key.keyCode==13 && $(this).val()!="" && !privateWindow && !inRoom) {
                const mymessage=$(this).val();
                const username=localStorage.getItem('username');
                const time=new Date().toLocaleString();
                $('#messageInput').val("")
                socket.emit('submit to all',{'mymessage':mymessage,'username':username,'time':time});
            }
            //Enviamos el mensaje a una sala en especifico en el active channel correspondiente a nuestra seleccion
            if (key.keyCode==13 && $(this).val()!="" && !privateWindow && inRoom) {
                const mymessage=$(this).val();                                      
                const username=localStorage.getItem('username');                            
                const time=new Date().toLocaleString();
                $('#messageInput').val("")
                socket.emit('submit to room',{'channel':activeChannel,'mymessage':mymessage,'username':username,'time':time});
            
            } 
        });
        //Cargar la lista de channels
        $('#channelList').on('click','li', function(){
            $('#messageInput').focus();
            if (!localStorage.getItem('activeChannel')) {
                activeChannel="General";
            } else {
                activeChannel=localStorage.getItem('activeChannel');
            }
            const username=localStorage.getItem('username');
            const time=new Date().toLocaleString();
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            $('#messages').html("");
            if (activeChannel!="General" && !privateWindow) {
                socket.emit('leave',{'channel':activeChannel,'mymessage':'has left the room','username':username,'time':time});
            }
            activeChannel=$("#channelList .active").attr('id');
            localStorage.setItem('activeChannel',activeChannel)
            if (activeChannel=='General') {
                inRoom=false;
                privateWindow=false;
                return socket.emit('come back to general');
            } else {
                inRoom=true;
                privateWindow=false;
            }
            socket.emit('join',{'channel':activeChannel,'mymessage':'has entered the room','username':username,'time':time});
         });

        if (!localStorage.getItem('username')) {
            $("#myModal").modal({backdrop: 'static', keyboard: false});
            $('.modal-title').text("Please enter your username");
            $('#modalInput').val("");
        }
    });

    socket.on('announce to all', data=> {
        if (!privateWindow){
            loadMessages(data);
        }
        
        $('.text-danger').on('click',function() {
            chooseUser($(this).text());
        });
    });

    socket.on('joined', data=> {
        loadMessages(data);
        $('#messageInput').focus();
        $('.text-danger').on('click',function() {
            chooseUser($(this).text());
        });
    });

    socket.on('left', data=> {
        loadMessages(data);
    });

    socket.on('announce to room', data=> {
        loadMessages(data);
        $('.text-danger').on('click',function() {
            chooseUser($(this).text());
        });
    }); 

    // accion para actualizar la lista de canales
    socket.on('load channels', data=> {
        $('#channelList li').remove();
        loadChannels(data);
        $('#'+localStorage.getItem('activeChannel')).click();
    });
    
    //Accion para aniadir canal
    socket.on('add channel', data=> {
        if (data["error"]!="") {
            window.setTimeout(function () {
                $("#myModal").modal({backdrop: 'static', keyboard: false});
                $('.modal-title').text(data["error"]);
                $('#modalInput').val("");
                $("#modalButton").attr('disabled',true);
            }, 900);
        } else {
            appendChannel(data['channel']);
            $('#channelList li:last').addClass('active');
            $('#channelList li:last').click();
            inRoom=true;
            var removeHash=$('#channelList li:last').text().slice(1);
            localStorage.setItem('activeChannel',removeHash);
            $('#channelList').scrollTop(500000);
            $('#messageInput').focus();
            socket.emit('update users channels',{'channel':data['channel']});
        }
    });

    socket.on('add username', data=> {
        if (data["error"]!="") {
            window.setTimeout(function () {
                $("#myModal").modal({backdrop: 'static', keyboard: false});
                $('.modal-title').text(data["error"]);
                $('#modalInput').val("");
                $("#modalButton").attr('disabled',true);
            }, 900);
        } else {
            localStorage.setItem('username',data["username"]);
            $('#username').text(localStorage.getItem('username'));
            $('#General').click();
            $('#messageInput').focus();
        }
    });

    //Accion para el modal
    $("#modalInput").on('keyup', function (key) {
        if ($(this).val().length > 0 ){
            $("#modalButton").attr('disabled',false);
            if (key.keyCode==13 ) {
                $('#modalButton').click();
            }
        }
        else {
            $("#modalButton").attr('disabled',true);
        }
    });

   
    socket.on('update channels',data => {
        if ($('#'+data['channel']).length==0){
            appendChannel(data['channel']);
        }
    });

    
    $("#modalButton").on('click', function () {
        // Cuando creamos un usuario nuevo hacemos emit
        // tomamos el valor de username
        if (!localStorage.getItem('username')) {    
            var username=$('#modalInput').val();
            username=username.charAt(0).toUpperCase() + username.slice(1);
            socket.emit('new username',{'username':username});
        // Cuando se agrega un nuevo canal hacemos un emit para visualizar elcanal
        // capitalizamos la primera linea para que se vea bomnito
        } else {                                    
            var channelName=$('#modalInput').val();
            channelName=channelName.charAt(0).toUpperCase() + channelName.slice(1);
            socket.emit('new channel',{'channel':channelName});
        }
    });
    
    //modal para ingresar el nombre del nuevo canal
    $('kbd').on('click',function (){
        $("#myModal").modal({backdrop: 'static', keyboard: false});
        $('.modal-title').text("Please enter channel name");
        $('#modalInput').val("");
        $("#modalButton").attr('disabled',true);
    });

    $('#username').text(localStorage.getItem('username'));
});

