let socket = io(window.location.origin)
let uttt = document.getElementById("uttt")
let board = undefined
const colors = {
    "-1":"var(--light-grey)",
    "0":"var(--black)",
    "1":"var(--red)",
}

socket.on("getName", () => {
    let name = window.location.pathname.split("/")[1]
    socket.emit("setName", name)
})

socket.on("getRoom", () => {
    let roomId = window.location.pathname.split("/")[2]
    socket.emit("setRoom", roomId)
})

socket.on("updateBoard", (data) => {
    updateBoard(data)
})


const updateBoard = (newBoard) => {
    board = newBoard
    for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
            document.getElementById(getBoxId(i, j)).style.backgroundColor = colors[board[i][j].status]
        }
    }
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