let express = require("express")
let app = express()
let server = require("http").Server(app)
let io = require("socket.io")(server)

const fse = require("fs-extra")
const path = require("path")

let hashtags = {}

const getUsers = async () => {
    let JSONUsers = await fse.readJSON(path.join(__dirname, "dataGathering", "users.json"))

    let users = {}

    for(let user of JSONUsers) {
        users[user.id] = {
            profile: user.profile,
            name: user.real_name,
            alias: user.profile.display_name
        }
    }

    return users
}

const getMessages = async () => {
    let users = await getUsers()

    let messages = []

    let filenames = await fse.readdir(path.join(__dirname, "dataGathering", "citat"))

    for (let filename of filenames) {
        let JSONMessages = await fse.readJSON(path.join(__dirname, "dataGathering", "citat", filename))

        for (let message of JSONMessages) {
            if (!message.subtype && message.user_profile) {
                //console.log(message)

                let newMessage = {
                    message: message.text.replace(/\B(\#[a-zA-ZåäöÅÄÖ0-9!,.]+\b)(?!;)/g, ''),
                    name: message.user_profile.real_name,
                    alias: message.user_profile.display_name,
                    date: filename.split(".")[0],
                    tags: message.text.match(/\B(\#[a-zA-ZåäöÅÄÖ0-9!,.]+\b)(?!;)/g),
                    beingCited: message.text.match(/\B(\@[a-zA-ZåäöÅÄÖ0-9!,.]+\b)|\-\B(\ [a-zA-ZåäöÅÄÖ0-9!,.]+\b)/g),
                    votes: 0
                }

                if (newMessage.beingCited != null && newMessage.tags) {

                    for(let i in newMessage.beingCited) {
                        let user = users[newMessage.beingCited[i].split("@")[1]]
                        if(user) {
                            let name = `${user.alias} (${user.name.split(" ")[0]})`

                            newMessage.message = newMessage.message.replace(`<${newMessage.beingCited[i]}>`, `<br>${name}`)
                            newMessage.beingCited[i] = name
                        }
                    }

                    messages.push(newMessage)
                    //console.log("MESSAGE:")
                    //console.log(newMessage)
                    //console.log("\n\n\n _____________________________________________ \n\n\n")

                    for(let tag of newMessage.tags) {
                        hashtags[tag] = (hashtags[tag] == undefined ? 1 : hashtags[tag] + 1)
                    }
                }
            }
        }
    }

    return messages
}

const getRandomQuoteAndRemoveIt = (quotes) => {
    let i = Math.floor(Math.random() * quotes.length)
    let quote = QUOTES[i]
    QUOTES.splice(i, 1)
    return quote
}

let QUOTES
let ROUNDWINNERS = []

const port = 80
let game = {
    users: {},
    currentTop: {},
    currentBottom: {},
    round: 1,
    series: 1
}

const prepareGame = async () => {
    QUOTES = await getMessages()

    console.log(QUOTES.length)
    game.currentTop = getRandomQuoteAndRemoveIt(QUOTES)
    game.currentBottom = getRandomQuoteAndRemoveIt(QUOTES)
    console.log(QUOTES.length)

    console.log(`Starting server on *:${port}...`)
    server.listen(port)
    app.use(express.static("static"))
}

prepareGame()
let hasWon = false

function update() {
    if(!hasWon && game.currentTop != undefined && game.currentBottom != undefined) {
        game.currentTop.votes = 0
        game.currentBottom.votes = 0
        
        for(let key in game.users) {
            if(game.users[key].voted == "top") {
                game.currentTop.votes++
            } else if(game.users[key].voted == "bottom") {
                game.currentBottom.votes++
            }
        }

        io.emit("update", game)
    }
}

io.on("connection", (socket) => {
    socket.emit("login")

    socket.on("userInfo", (user) => {
        game.users[socket.id] = user
        game.users[socket.id].round = game.round
        console.log("Received info about new user:", user)
        update()
    })

    socket.on("vote", (vote) => {
        if(game.users[socket.id].voted != vote) {
            game.users[socket.id].voted = vote
            update()
        }
    })

    socket.on("next", () => {
        
        if(game.currentTop.votes != 0 || game.currentBottom.votes != 0) {
            if(game.currentTop.votes > game.currentBottom.votes) {
                //TOP WINS
                console.log("TOP WINS")
                if(ROUNDWINNERS.length <= 1 && QUOTES.length == 0) {
                    io.emit("win", game.currentTop)
                    hasWon = true
                }
                ROUNDWINNERS.push(game.currentTop)
            } else if(game.currentBottom.votes > game.currentTop.votes) {
                //BOTTOM WINS
                console.log("BOTTOM WINS")
                if(ROUNDWINNERS.length <= 1 && QUOTES.length == 0) {
                    io.emit("win", game.currentTop)
                    hasWon = true
                }
                ROUNDWINNERS.push(game.currentBottom)
            } else if(game.currentTop.votes == game.currentBottom.votes) {
                // TIE
                console.log("TIE")
                ROUNDWINNERS.push(game.currentTop)
                ROUNDWINNERS.push(game.currentBottom)
            }

            if (QUOTES.length <= 1) {
                QUOTES = ROUNDWINNERS.concat(QUOTES)
                ROUNDWINNERS = []
                game.series++
                game.round = 1
            }

            console.log(QUOTES.length)
            if(QUOTES.length >= 2) {
                game.currentTop = getRandomQuoteAndRemoveIt(QUOTES)
                game.currentBottom = getRandomQuoteAndRemoveIt(QUOTES)
            }
            console.log(QUOTES.length)
            
            for(let key in game.users) {
                game.users[key].voted = null
            }

            game.round++
            update()
        }
    })

    socket.on("disconnect", () => {
        console.log("User disconnected")
        delete game.users[socket.id]
        update()
    })
})

setInterval(() => { io.emit("ping"); }, 5000)
io.on("pong", () => { console.log("received pong..."); })