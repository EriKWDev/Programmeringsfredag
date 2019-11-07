const express = require("express")
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server)
const path = require("path")
const fs = require("fs-extra")

const options = {
    port: 80,
}

// Helper functions

const log = (msg, title=`Server`) => {
    let date = new Date()
    console.log(`[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ${title}: ${msg}`)
}


// Express server

log(`Starting...`)
server.listen(options.port, () => {
  log(`Running at port ${options.port}`)
})

app.use("/static", express.static(path.join(__dirname, "static")))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "static", "index.html"))
})

// Socket.io


io.on("connection", (socket) => {
    log("New connection")
    socket.on("save", async (data) => {
        log("Saving data...")
        let str = `${data.metod}, ${data.typ}`
        for(let kaffe of data.kaffen) {
            for(let value of kaffe.values) {
                str += `, ${value}`
            }
        }
        log(`Saving: ${str}`)

        fs.appendFileSync(path.join(__dirname, "data", "kaffedata.csv"), `${str}\n`)

    })

    socket.on("disconnect", () => {

    })
  })