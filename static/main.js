document.addEventListener("DOMContentLoaded", () => {
    get_username();
})

const get_username =() => {
    let username = localStorage.getItem("username");
    if(!username){
         $(".modal").modal({ show: true, backdrop: "static"});
        document.querySelector("#new-username").addEventListener("submit", e =>{
            e.preventDefault();
            username = document.querySelector("#user-name").value;
            console.log(username);

            if(typeof username == "string"){
                username = username.trim()
                if (username == ""){
                    username = null;
                }
                else{
                    localStorage.setItem("username", username);
                    $(".modal").modal("hide");
                    initialize(username);
                }
            }
        });
    }

    else{
        initialize(username);
    }

};

const initialize = username =>{
    let socket= io.connect(location, protocol + "//" + document.domain + ":" + location.port);
    socket.on("connect", () =>{
        socket.emit("userdata", {username});
        setup(socket);

    socket.on("new", data => {
        show_channel(data.name, socket);
    });
    
    socket.on
    });
};

