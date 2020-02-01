const socket = io.connect(window.location.origin)
let isLoggedIn = false
let me = null

function vote(name) {
    socket.emit("vote", name)
}

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