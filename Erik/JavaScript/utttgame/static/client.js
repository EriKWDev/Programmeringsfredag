let socket = io(window.location.origin)
let uttt = document.getElementById("uttt")
let errorBox = document.getElementById("error-box")
let infoBox = document.getElementById("info-box")
let board = undefined
let errorId = 0

const colors = {
    "-1":"var(--light-grey)",
    "0":"var(--teal)",
    "1":"var(--purple)",
    "2":"var(--red)",
    "3":"var(--yellow)",
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
    let errorHTML= `<p id="error-${errorId}">${data.message}</p>`
    errorBox.innerHTML += errorHTML
    let id = `error-${errorId}`
    setTimeout(() => {
        console.log(id)
        document.getElementById(id).style.opacity = 0;
        document.getElementById(id).style.maxHeight = "0";
        setTimeout(() => {
            document.getElementById(id).style.display = "none";
        }, 500, id)
    }, 5000, id)
    errorId++
})

const updateBoard = (newBoard) => {
    board = newBoard
    for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
            document.getElementById(getBoxId(i, j)).style.backgroundColor = colors[board[i][j].status]
        }
    }
}

const updateRoom = (room) => {
    console.log(room)
    updateBoard(room.board)
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
            <span style="${user.id == socket.id ? "font-weight: bold; border: 2px solid;" : ""} background-color:${user.type < 2 ? colors[user.type] : colors[-1]}; color:white;">${user.name}</span>
            `
        } else {
            HTML +=
            `
            <span style="${user.id == socket.id ? "font-weight: bold; border: 2px solid;" : ""} color:${user.type < 2 ? colors[user.type] : colors[-1]}">${user.name}</span>
            `
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

generateGame()

let ping = 0
window.setInterval(() => {
    socket.emit("pingy", {date: new Date()})
}, 8000)

socket.on("pong", (data) => {
    ping = new Date().getTime() - new Date(data.date).getTime()
})