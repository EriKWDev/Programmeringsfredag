let socket = io(window.location.origin)
let uttt = document.getElementById("uttt")
let errorBox = document.getElementById("error-box")
let infoBox = document.getElementById("info-box")
let board = undefined
let errorId = 0
let ROOM = undefined
let ME = undefined

const colors = {
    "-2":"var(--black)",
    "-1":"var(--light-grey)",
    "0":"var(--teal)",
    "1":"var(--purple)",
    "2":"var(--red)",
    "3":"var(--yellow)",
    "4":"var(--green)",
    "5":"var(--orange)",
    "6":"var(--black)",
    "7":"var(--blue)",
}

const playerTypes = [
    "Player 1",
    "Player 2",
    "Spectator"
  ]

let myColor = 1

socket.on("getName", () => {
    let name = window.location.pathname.split("/")[1]
    socket.emit("setName", name)
})

socket.on("getRoom", () => {
    let roomId = window.location.pathname.split("/")[2]
    socket.emit("setRoom", roomId)
})

socket.on("updateRoom", (data) => {
    updateRoom(data)
})

socket.on("updateBoard", (data) => {
    updateBoard(data)
})

socket.on("errorMessage", (data) => {
    sendErrorMessage(data)
})

const sendErrorMessage = (data) => {
    let errorHTML= `<p id="error-${errorId}">${data.message}</p>`
    errorBox.innerHTML += errorHTML
    let id = `error-${errorId}`
    setTimeout(() => {
        document.getElementById(id).style.opacity = 0;
        document.getElementById(id).style.maxHeight = "0";
        setTimeout(() => {
            document.getElementById(id).style.display = "none";
        }, 500, id)
    }, 3000, id)
    errorId++
}

const changeColor = () => {
    socket.emit("changeColor", {"colors": colors})
}

const updateBoard = (newBoard) => {
    board = newBoard
    for(let i = 0; i < 9; i++) {
        let small = document.getElementById(`small-${i}`)
        small.style.backgroundColor = board[i].winner != undefined ? colors[ROOM.colors[board[i].winner]] : ""
        small.style.border = board[i].open ? "2px solid " + colors[ROOM.colors[ROOM.currentPlayer]] : ""
        
        for(let j = 0; j < 9; j++) {
            document.getElementById(getBoxId(i, j)).style.backgroundColor = board[i].winner != undefined ? colors[ROOM.colors[board[i].winner]] : colors[ROOM.colors[board[i][j].status]]
        }
    }
}

const updateRoom = (room) => {
    ROOM = room
    console.log(room)
    updateBoard(room.board)

    if(room.winner != undefined) {
        document.getElementById("uttt").style.border = `3px solid ${colors[ROOM.colors[room.winner]]}`
    }

    let HTML =
    `
    <span>${room.name}</span>
    `

    let users = []

    for(let userId in room.users) {
        users.push(room.users[userId])
    }

    users.sort((a, b) => { return a.type > b.type })
    for(let user of users) {
        if(user.type == room.currentPlayer) {
            HTML +=
            `
            <span style="${user.id == socket.id ? "font-weight: bold; border: 2px solid;" : ""} background-color:${user.type < 2 ? colors[ROOM.colors[user.type]] : colors[-1]}; color:white;" ${user.id == socket.id && (user.type == 0 || user.type == 1) ? 'onClick="changeColor()"' : 'onClick="sendErrorMessage({message:`You cannot change color of that person`})"' }>${user.name}</span>
            `
        } else {
            HTML +=
            `
            <span style="${user.id == socket.id ? "font-weight: bold; border: 2px solid;" : ""} color:${user.type < 2 ? colors[ROOM.colors[user.type]] : colors[-1]}" ${user.id == socket.id && (user.type == 0 || user.type == 1) ? 'onClick="changeColor()"' : 'onclick="sendErrorMessage({message:`You cannot change color of that person`})"' }>${user.name}</span>
            `
        }

        if(user.id == socket.id) {
            ME = user
        }
    }

    infoBox.innerHTML = HTML
}

const generateGame = () => {
    let HTML = ``

    for(let i = 0; i < 9; i++) {
        HTML += `<span class="small-game" id="small-${i}">`
        for(let j = 0; j < 9; j++) {
            HTML += `<span onClick="clickBox(${i}, ${j})" class="game-box" id="box-${i}-${j}"></span>`
        }
        HTML += `</span>`
    }

    uttt.innerHTML = HTML
}

const getBoxId = (i, j) => {
    return `box-${i}-${j}`
}

const clickBox = (i, j) => {
    socket.emit("clickBox", {i: i, j:j})
}

const sendChatMessage = () => {
    if(ROOM == undefined || ME == undefined) {
        return sendErrorMessage({message: "You have not joined a room yet"})
    }

    if(document.getElementById("chat-input").value.trim() == "") {
        return sendErrorMessage({message: "You can't send an empty message"})
    }

    socket.emit("chatMessage", {from:ME, message:document.getElementById("chat-input").value.trim()})
    document.getElementById("chat-input").value = ""
}

socket.on("chatMessage", (data) => {
    console.log(data)
    let chat = document.getElementById("chat")
    let HTML =
    `
    <div class="chat-message" style="${socket.id == data.from.id ? 'color:'+colors[ROOM.colors[ME.type == 2 ? -2 : ME.type]]+'; font-weight: bold; border: 2px solid;' : 'color:' + (data.from.type >= 0 && data.from.type < 2 ? colors[ROOM.colors[data.from.type]] : colors[-2])};">${data.from.name}: ${data.message}</span>
    </div>
    `
    chat.innerHTML += HTML;
})

generateGame()

let ping = 0
window.setInterval(() => {
    socket.emit("pingy", {date: new Date()})
}, 8000)

socket.on("pong", (data) => {
    ping = new Date().getTime() - new Date(data.date).getTime()
})