document.addEventListener("DOMContentLoaded", () => {
    get_username();
})
    var socket = io.connect(location, protocol + "//" + document.domain + ":" + location.port);
    socket.on('connect', () => {
       socket.emit('join');

    });

    socket.on('announce message', data => {
        let l = localStorage.getItem("localuser")
        console.log(l)
        const li = document.createElement('li');
        let usuario = data.user
        if (usuario != l){
            li.className = 'localchat'
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
