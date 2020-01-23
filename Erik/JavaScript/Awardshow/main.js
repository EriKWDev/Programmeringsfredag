let express = require("express")
let app = express()
let server = require("http").Server(app)
let io = require("socket.io")(server)

const port = 80

// Express
console.log(`Starting server on *:${port}...`)
server.listen(port)
app.use(express.static("static"))

// Socket.io

let game = {
    users: {}
}

function update() {
    io.emit("update", game)
    console.log(game)
}

io.on("connection", (socket) => {
    socket.emit("login")

    socket.on("userInfo", (user) => {
        game.users[socket.id] = user
        console.log("Received info about new user:", user)
        update()
    })

    socket.on("disconnect", () => {
        console.log("User disconnected")
        delete game.users[socket.id]
        update()
    })
})

setInterval(() => { console.log("pinging..."); io.emit("ping"); }, 5000)
io.on("pong", () => { console.log("received pong..."); })