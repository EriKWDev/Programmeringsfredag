const readline = require("readline")

const interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

interface.on("line", (line) => {
    let input = line.split(` `)
    console.log(compute(input[0]))
})

const compute = (input) => {
    let candy = input.toUpperCase()
    let secondHalft = candy.substring(Math.round(candy.length/2), candy.length)
    let firstHalf = candy.substring(0, Math.round(candy.length/2))
    let bCount = firstHalf.split(`B`).length-1
    let maxBCount = bCount

    firstHalf = firstHalf.split(``)
    secondHalft = secondHalft.split(``)

    for(let i = 0; i <= candy.length; i++) {
        let newLetter = secondHalft.pop()
        let oldLetter = firstHalf.pop()
        secondHalft.unshift(oldLetter)
        firstHalf.unshift(newLetter)

        if(newLetter == `B` && oldLetter == `V`) {
            bCount += 1
        } else if(newLetter == `V` && oldLetter == `B`) {
            bCount -= 1
        }

        maxBCount = bCount > maxBCount ? bCount : maxBCount
    }
    
    return maxBCount
}

const tester = require("../../Tester/tester")
tester.runTests([
    [compute, "BBVVBVVVBB", 4],
    [compute, "BVBVBVBV", 2],
    [compute, "BBVBVVVBBVVBBBVBVVBV", 6],
    [compute, "BBBBBBBBBBVVVVVVVVVVBBBBBBBBBBVVVVVVVVVV", 10],
    [compute, "BBVVVBBBVVBVBBVBVV", 6],
    [compute, "BBVVBB", 3],
    [compute, "VVVVVVVVVVVVBBBBVVVVVVB", 5],
])
