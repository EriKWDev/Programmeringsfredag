
const express = require("express")
const app = express()
const server = require('http').Server(app)
const io = require("socket.io")(server)
const path = require("path")
const fs = require("fs")

const options = {
  name:"UTTT",
  port:80,
}

// Helper function

const log = (msg, title=`Server`) => {
  let date = new Date()
  console.log(`[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ${title}: ${msg}`)
}

const generateBoard = () => {
  let board = {}
  for(let i = 0; i < 9; i++) {
    board[i] = {
      "clicks":0
    }
    for(let j = 0; j < 9; j++) {
      board[i][j] = {
        "status":-1
      }
    }
  }
  return board
}


// Express server

log(`Starting...`)
server.listen(options.port, () => {
  log(`Running at port ${options.port}`)
})

app.use("/static", express.static(path.join(__dirname, "static")))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"))
})

app.get("/:username", (req, res) => {
  res.sendFile(path.join(__dirname, "overview.html"))
})

app.get("/:username/:roomid", (req, res) => {
  res.sendFile(path.join(__dirname, "game.html"))
})


// Socket io

let users = {}
let rooms = {}

const addUser = (socket) => {
  users[socket.id] = {
    "socket":socket,
    "id":socket.id,
    "name":undefined,
    "roomName":undefined,
    "color":undefined,
  }

  log(`User ${socket.id} connected`)
}
const removeRoom = (roomName) => {
  log(`Removing room ${roomName}...`, roomName)
  delete rooms[roomName]
}

const removeUser = (socket) => {
  log(`User ${users[socket.id].name} disconnected`, users[socket.id].roomName)

  delete rooms[users[socket.id].roomName].users[socket.id]

  let i = 0
  for(let key in rooms[users[socket.id].roomName].users) {
    i++
  }

  if(i == 0) {
    log(`Room has no users`, users[socket.id].roomName)
    removeRoom(users[socket.id].roomName)
  }

  delete users[socket.id]
}

const setName = (socket, name) => {
  users[socket.id].name = name
}

io.on("connection", (socket) => {
  addUser(socket)

  socket.emit("getName")
  socket.emit("getRoom")

  socket.on("setName", (name) => {
    setName(socket, name)
    log(`${socket.id} set name to "${users[socket.id].name}"`, users[socket.id].roomName)
  })

  socket.on("setRoom", (roomName) => {
    log(`User ${users[socket.id].name} joined room "${roomName}"`, users[socket.id].roomName)
    socket.join(roomName)
    users[socket.id].roomName = roomName
    if(rooms[roomName] == undefined || rooms[roomName] == null) {
      rooms[roomName] = {
        "users":{},
        "name":roomName,
        "board":generateBoard()
      }
    }

    rooms[roomName].users[socket.id] = users[socket.id]
    socket.emit("updateBoard", rooms[roomName].board)
  })

  socket.on("pingy", (data) => {
    socket.emit("pong", data)
  })

  socket.on("clickBox", (data) => {
    log(`${users[socket.id].name} wants to click ${data.i}, ${data.j}`, users[socket.id].roomName)
    rooms[users[socket.id].roomName].board[data.i][data.j].status = rooms[users[socket.id].roomName].board[data.i][data.j].status == 1 ? 0 : 1
    io.to(users[socket.id].roomName).emit("updateBoard", rooms[users[socket.id].roomName].board)
  })

  socket.on("disconnect", () => {
    removeUser(socket)
  })
})