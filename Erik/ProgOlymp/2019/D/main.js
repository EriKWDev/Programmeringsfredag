const readline = require("readline")

const interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

interface.on("line", async (line) => {
    console.log(await compute(line))
})

const compute = async (input) => {
    let data = input.split(`\n`)
    let firstRow = data[0].split(` `)
    let numberOfTracks = parseInt(firstRow[0])
    let totalDistance = parseInt(firstRow[1])
    let walkSpeed = parseInt(firstRow[2])

    console.log(numberOfTracks, totalDistance, walkSpeed)
    data.shift()
    console.log(data)

    let n = 0

    for(let tracks in data) {
        for(let dataPoint in tracks.split(` `)) {
            n += parseInt(dataPoint)
        }
    }

    return n
}

const tester = require("../../Tester/tester")
const path = require("path")

tester.runTests([
[compute, `4 9 2
2 5 5
1 7 8
4 7 4
6 9 2
`, 13],
])
