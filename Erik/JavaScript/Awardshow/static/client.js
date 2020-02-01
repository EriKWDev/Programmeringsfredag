const socket = io.connect(window.location.origin)
let isLoggedIn = false
let me = null
let hasWon = false

let colors = [
    "--yellow",
    "--green",
    "--red",
    "--blue"
]

function getRandomColor(seed) {
    return `var(${(colors[Math.floor(Math.abs(Math.sin(seed.length * 100)) * colors.length)])})`
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

function next() {
    socket.emit("next")
}

socket.on("login", () => {
    login()
})

socket.on("update", (game) => {
    if(hasWon) {
        return
    }

    document.getElementById("round").innerHTML = `Runda ${game.series} - Bracket ${game.round} : `

    console.log(game)

    for(let n = 1; n <= 2; n++) {
        let quote = n == 1 ? game.currentTop : game.currentBottom 

        for(let element of document.getElementsByClassName(`p${n}`)) {

            let HTML = ``

            let beingCited = quote.beingCited

            if(beingCited.length > 1) {
                HTML = beingCited.join(" & ")
            } else {
                HTML = beingCited[0]
            }

            element.innerHTML = HTML
        }
        
        document.getElementById(`citer-${n}`).innerHTML = `<span class="date">${quote.date}</span> skrev ${quote.alias}:`

        let quoteHTML = `<div id="quote-p${n}-container">${quote.message}</div><div class="tag-cloud">`

        for(let tag of quote.tags) {
            quoteHTML += `<span style='background-color: ${getRandomColor(tag)};' class="tag">${tag}</span>`
        }

        quoteHTML += `</div>`

        document.getElementById(`quote-p${n}`).innerHTML = quoteHTML
        document.getElementById(`votes-p${n}`).style.webkitAnimation = 'none';
        setTimeout(function() {
            document.getElementById(`votes-p${n}`).style.webkitAnimation = '';
            setTimeout(function() {
                document.getElementById(`votes-p${n}`).innerHTML = `<span class="votes">${quote.votes}</span>`
            }, 300);
        }, 10);
    }
})

socket.on("win", (winner) => {
    confetti.start()
    hasWon = true
})

socket.on("ping", () => {
    socket.emit("pong")
})

