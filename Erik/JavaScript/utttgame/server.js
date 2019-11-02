var app = require("http").createServer(handler)
var io = require("socket.io")(app)
var fs = require("fs")
var config = require("./config.json")
var twitter = require("node-tweet-stream")(config)

twitter.track("tic tac toe");
twitter.track("ultimate tic tac toe");
twitter.track("javascript");
twitter.track("socket.io");
twitter.track("nodejs");
twitter.track("python");

twitter.on("tweet", (tweet) => {
  io.emit("tweet", tweet);
});

app.listen(80)

console.log("Starting uttt server...")

function handler (req, res) {
  fs.readFile(`${__dirname}/${req.url}`,
  function (err, data) {
    if (err) {
      res.writeHead(500)
      return res.end("Error loading index.html")
    }

    res.writeHead(200)
    res.end(data)
  })
}

io.on("connection", function (socket) {

  socket.on("test", function (data) {
    console.log(data)
  })
})