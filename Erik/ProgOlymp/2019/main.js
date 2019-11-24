const readline = require("readline")

const interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

interface.on("line", (line) => {
    let input = line.split(` `)
    let answer = compute(input[0])
    console.log(answer)
})

const compute = (input) => {
    let candy = input.toUpperCase()
    let answer = 0

    for(let i=0; i < candy.length; i++) {
        let twoHalves = getHalf(candy, i)

        let bCount = twoHalves.split(`B`).length-1
        if(bCount > answer) {
            answer = bCount
        }
    }
    
    return answer
}

const getHalf = (candy, position) => {
    return (candy.substring(position, candy.length) + candy.substring(0, position)).substring(0, Math.round(candy.length/2))
}