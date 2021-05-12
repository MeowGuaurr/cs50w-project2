let local = localStorage.getItem("username")
let Lchannel = localStorage.getItem("last_channel")
let Cchannel = (Lchannel) ? Lchannel : ""
let socket = null
let message_temp = null
function get_username(){
    const log_form = document.querySelector()
    const formUser = document.querySelector()
    const formSubmit = document.querySelector()
    formSubmit.disabled = true

    formUser.onkeyup = () => {
        formSubmit.disabled = (formUser.value.length > 0) ? false : true
    }

    formSubmit.onsubmit = () => {
        username = formUser.value
        localStorage.getItem('username', username)
        window.location.reload(false)
        return false
    }

    log_form.style.display = "block"
}

function triggerSocket() {
    const socketServer = io.connect(`${location.protocol} // ${document.domain}:${location.port}`)
    socketServer.on('connect', () => {
        document.querySelector().onsubmit = () => {
            socketSever.emmit("channelsnew", {"channel": document.querySelector().value})
            document.querySelector().value = ""
            return false
        }
        if(Cchannel){
            socket.emit("channels-join",{
                "username": username,
                "channel": Cchannel
            })
        }
    })

    socketServer.on('add username', data => {
        if(data.error != ""){
            window.setTimeout(function(){
                const FlackModal = document.querySelector("#FlackModal")
                flackModal.modal({backdrop: 'static', keyboard: false})
                const modalTitle = document.querySelector('.modal-title')
                modalTitle.text(data.error)
                const modalInput = document.querySelector("#modalInput")
                modalInput.val("")
                const modalButton = document.querySelector("#modalButton")
                modalTitle.attr('disabled', true)
            }, 900)
        }
        else{
            localStorage.setItem('username', username)
            const usernameID = document.querySelector("#usernameID")
            usernameID.text(localStorage.getItem("username"))

            const generalChannel = document.querySelector("#general")
            generalChannel.click()

            const messageInput = document.querySelector("#messageInput")
            messageInput.focus()
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
    message_temp = Handlebars.compile(document.querySelector().innerHtml)
    if(!username){
        get_username();
    }
    else{
        const gUser= document.querySelector('#greet')
        greet.innerHtml = `Hello, ${username}`
        greet.style.display = "block"

        socket =  triggerSocket()

        document.querySelector().style.display = "block"
    }

})
