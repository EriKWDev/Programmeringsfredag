const express = require("express")
const app = express()
const server = require('http').Server(app)
const io = require("socket.io")(server)
const path = require("path")
const fs = require("fs")

/* Dangerous Chat Message:

<span onclick='setInterval(() => { 
changeColor();
document.getElementsByTagName("body")[0].style.backgroundColor = colors[ROOM.colors[ME.type]];
}, 500)'>
Click <i>this</i>!
</span>

*/

const options = {
  name:"UTTT",
  port:process.env.PORT || 80,
}

const playerTypes = [
  "player1",
  "player2",
  "spectator"
]

// Helper function

const checkWin = (game, winner) => {
  for(let n = 0; n < 9; n+=3) {
    if(game[n+0].status == winner && game[n+1].status == winner && game[n+2].status == winner) {
      return true
    }
  }

  for(let n = 0; n < 3; n+=1) {
    if(game[n+0].status == winner && game[n+3].status == winner && game[n+6].status == winner) {
      return true
    }
  }

  if(game[0].status == winner && game[4].status == winner && game[8].status == winner) {
    return true
  }

  if(game[2].status == winner && game[4].status == winner && game[6].status == winner) {
    return true
  }

  return false
}

const serverMessageToRoom = (socket, msg) => {
  io.to(users[socket.id].roomName).emit("chatMessage", {from: {type:-2, id:"SERVER", name:"Server"}, message:msg})
}

const log = (msg, title=`Server`) => {
  let date = new Date()
  console.log(`[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ${title}: ${msg}`)
}

const generateBoard = () => {
  let board = {}
  for(let i = 0; i < 9; i++) {
    board[i] = {
      "clicks":0,
      "open":true,
      "closed":false,
      "status":-1,
      "winner":undefined
    }
    for(let j = 0; j < 9; j++) {
      board[i][j] = {
        "status":-1
      }
    }
  }
  return board
}

const checkMove = (i, j, currentPlayer, player, board) => {
  return board[i].open && currentPlayer == player && board[i][j].status == -1
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

app.get("/:username/", (req, res) => {
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
    "id":socket.id,
    "name":undefined,
    "roomName":undefined,
    "color":undefined,
    "type":undefined
  }

  log(`User ${socket.id} connected`)
}

const removeRoom = (roomName) => {
  log(`Removing room ${roomName}...`, roomName)
  delete rooms[roomName]
}

const removeUser = (socket) => {
  if(users[socket.id].roomName != undefined) {
    log(`User ${users[socket.id].name} disconnected`, users[socket.id].roomName)
    delete rooms[users[socket.id].roomName].users[socket.id]

    io.to(users[socket.id].roomName).emit("updateRoom", rooms[users[socket.id].roomName])
    overviewIo.emit("updateRooms", rooms)
    serverMessageToRoom(socket, `${users[socket.id].name} has left the room`)

    if(rooms[users[socket.id].roomName] == undefined || Object.keys(rooms[users[socket.id].roomName].users).length <= 0) {
      log(`Room has no users`, users[socket.id].roomName)
      removeRoom(users[socket.id].roomName)
    }
  }

  delete users[socket.id]
}

const setName = (socket, name) => {
  users[socket.id].name = name
}

let overviewIo = io.of("/overview")
overviewIo.on("connection", (socket) => {
  log("Socket has joined the Overview.", "Overview")

  socket.emit("updateRooms", rooms)

  socket.on("disconnect", () => {

  })
})

io.on("connection", (socket) => {
  addUser(socket)
  log(`Currently connected sockets: ${Object.keys(users).length}`)

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
        "board":generateBoard(),
        "currentPlayer":undefined,
        "colors":[
          0,
          1
        ],
        "winner":undefined
      }
    }

    let usersInRoom = Object.keys(rooms[roomName].users).length
    if(usersInRoom <= 0) {
      users[socket.id].type = 0
      users[socket.id].color = 0
      rooms[users[socket.id].roomName].currentPlayer = 0
      serverMessageToRoom(socket, `${users[socket.id].name}(Player 1) has joined the room`)
    } else if(usersInRoom == 1) {
      users[socket.id].type = 1
      users[socket.id].color = 1
      serverMessageToRoom(socket, `${users[socket.id].name}(Player 2) has joined the room`)
    } else {
      users[socket.id].type = 2
      users[socket.id].color = -1
      serverMessageToRoom(socket, `${users[socket.id].name}(Spectator) has joined the room`)
    }

    log(`Player ${users[socket.id].name} joined group ${users[socket.id].type}`, users[socket.id].roomName)

    rooms[roomName].users[socket.id] = users[socket.id]
    io.to(roomName).emit("updateRoom", rooms[roomName])
    overviewIo.emit("updateRooms", rooms)
  })

  socket.on("pingy", (data) => {
    socket.emit("pong", data)
  })

  socket.on("clickBox", (data) => {
    if(users[socket.id].type == 2) {
      return socket.emit("errorMessage", {message: "You are only a spectator of this game and cannot interact with it."})
    }

    if(rooms[users[socket.id].roomName].currentPlayer == undefined) {
      rooms[users[socket.id].roomName].currentPlayer = 0
    }

    if(Object.keys(rooms[users[socket.id].roomName].users).length < 2) {
      return socket.emit("errorMessage", {message: "Waiting for player 2 to join..."})
    }

    if(rooms[users[socket.id].roomName].currentPlayer != users[socket.id].type) {
      return socket.emit("errorMessage", {message: "It is not your turn yet"})
    }

    // log(`${users[socket.id].name} wants to click ${data.i}, ${data.j}`, users[socket.id].roomName)

    let isValidMove = checkMove(data.i, data.j, rooms[users[socket.id].roomName].currentPlayer, users[socket.id].type, rooms[users[socket.id].roomName].board)

    if(isValidMove == false) {
      return socket.emit("errorMessage", {message: "That is an invalid move"})
    }

    rooms[users[socket.id].roomName].board[data.i][data.j].status = users[socket.id].type
    rooms[users[socket.id].roomName].board[data.i].clicks++

    // Check for wins
    let board = rooms[users[socket.id].roomName].board
    let winner = users[socket.id].type

    let gameWin = checkWin(board[data.i], winner)

    rooms[users[socket.id].roomName].board[data.i].winner = gameWin ? winner : undefined
    rooms[users[socket.id].roomName].board[data.i].status = gameWin ? winner : -1

    rooms[users[socket.id].roomName].board[data.i].closed = rooms[users[socket.id].roomName].board[data.i].clicks >= 9 || (rooms[users[socket.id].roomName].board[data.i].winner != undefined)

    let bigWin = false
    if(gameWin) {
      bigWin = checkWin(board, winner)
      rooms[users[socket.id].roomName].winner = bigWin ? winner : undefined
    }

    // Open correct games based on if they're closed or not
    if(rooms[users[socket.id].roomName].board[data.j].closed) {
      let n = 0
      for(let i = 0; i < 9; i++) {
        rooms[users[socket.id].roomName].board[i].open = !rooms[users[socket.id].roomName].board[i].closed
        n += rooms[users[socket.id].roomName].board[i].closed ? 1 : 0
      }

      if(n >= 9) {
        serverMessageToRoom(socket, "The game is a tie")
      }
    } else {
      for(let i = 0; i < 9; i++) {
        rooms[users[socket.id].roomName].board[i].open = false
      }
      rooms[users[socket.id].roomName].board[data.j].open = true
    }

    if(bigWin) {
      for(let i = 0; i < 9; i++) {
        rooms[users[socket.id].roomName].board[i].open = false
      }
      serverMessageToRoom(socket, `${users[socket.id].name} has won the game!`)
    }

    rooms[users[socket.id].roomName].currentPlayer = rooms[users[socket.id].roomName].currentPlayer ? 0 : 1
    io.to(users[socket.id].roomName).emit("updateRoom", rooms[users[socket.id].roomName])
    overviewIo.emit("updateRooms", rooms)
  })

  socket.on("changeColor", (data) => {
    if(users[socket.id].type != 0 && users[socket.id].type != 1) {
      return socket.emit("errorMessage", {message: "You cannot change color"})
    }

    let n = (Object.keys(data.colors).length-2)
    rooms[users[socket.id].roomName].colors[users[socket.id].type] = (rooms[users[socket.id].roomName].colors[users[socket.id].type] + 1)%n

    while(rooms[users[socket.id].roomName].colors[users[socket.id].type] == rooms[users[socket.id].roomName].colors[users[socket.id].type ? 0 : 1]) {
      rooms[users[socket.id].roomName].colors[users[socket.id].type] = (rooms[users[socket.id].roomName].colors[users[socket.id].type] + 1)%n
    }

    io.to(users[socket.id].roomName).emit("updateRoom", rooms[users[socket.id].roomName])
    overviewIo.emit("updateRooms", rooms)
  })

  socket.on("chatMessage", (data) => {
    data.message.trim()

    if(data.message == "") {
      return
    }

    io.to(users[socket.id].roomName).emit("chatMessage", data)
  })

  socket.on("disconnect", () => {
    removeUser(socket)
    log(`Currently connected sockets: ${Object.keys(users).length}`)
  })
})