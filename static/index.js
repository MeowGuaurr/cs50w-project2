document.addEventListener('DOMContentLoaded',()=>{
 var socket;
            $(document).ready(function(){
                socket = io.connect('http://' + document.domain + ':' + location.port + '/chat');
                socket.on('connect', ()=> {
                    socket.emit('join', { username });
                    setup(socket);
                });
                socket.on('status', (data) => {
                    $('#chat').val($('#chat').val() + '<' + data.msg + '>\n');
                    $('#chat').scrollTop($('#chat')[0].scrollHeight);
                });

                const show_message = data => {
                    let ul = document.querySelector("#messageL");
                    let li = document.createElement("li");
                    li.classList.add("list-group-item");
                    li.innerHTML = `<strong>${data.username}</strong>: ${data.message}`;

                    ul.appendChild(li);

                    ul.scrollTop = ul.scrollHeight - ul.clientHeight;
                };
                //socket.on('message',(data) => {
                  //  $('#chat').val($('#chat').val() + data.msg + '\n');
                    //$('#chat').scrollTop($('#chat')[0].scrollHeight);
                //});
                $('#send').addEventListener("submit",e => {
                        text = $('#text').val();
                        $('#text').val('');
                        socket.emit('text', {msg: text});
                });
            });
            function leave_room() {
                socket.emit('left', {}, function() {
                    socket.disconnect();
                    // go back to the login page
                    window.location.href = "{{ url_for('index') }}";
                });
            }

})