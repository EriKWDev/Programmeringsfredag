const socket = io.connect(window.location.href)
let isLoggedIn = false
let me = null

function toggleLogin() {
    if(isLoggedIn) {
        
    } else {

    }
}

function login() {
    me = {
        id:socket.id
    }

    socket.emit("userInfo", me)
}

socket.on("login", () => {
    login()
})

socket.on("ping", () => {
    socket.emit("pong")
})

