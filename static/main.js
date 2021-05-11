document.addEventListener("DOMContentLoaded", () => {
    get_username();
})
    var socket = io.connect(location, protocol + "//" + document.domain + ":" + location.port);
    socket.on('connect', () => {
       socket.emit('join');
        document.querySelector('#submit').disabled = true;
       document.querySelector('#msg').onkeyup = () => {
           if(document.querySelector('#msg').value.length < 0)
                document.queryelector('#submit').disabled = true;
           else
                document.querySelector('#submit').disabled = false;
       };

        document.querySelector('#nmsg').onsubmit = () => {
            const message = document.querySelector('#msg').value = '';
            document.querySelector('#submit').disabled = true;
            socket.emit('text',{'message' : message});

            return false;
        };

    });

    socket.on('announce message', data => {
        let l = localStorage.getItem("localuser");
        console.log(l);
        const li = document.createElement('li');
        let usuario = data.user;
        if (usuario != l){
            li.className = 'localchat';
        }
        else{
            li.className = 'chat'
        }
        li.innerHTML = `<b>${data.user}: <b>${data.message} / ${data.time}`;
        document.querySelector('#msg').append(li);
    });

    socket.on('joined', data => {
        const li=document.createElement('li');
        li.innerHtml =  `<b>${data.message}`;
        document.querySelector('#msg').append(li);
    });

    document.querySelector('#log').onsubmit =() => {
        const username = document.querySelector('#username').value;
        localStorage.setItem("localuser", username);
    };
