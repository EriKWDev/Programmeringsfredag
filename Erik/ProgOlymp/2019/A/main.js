const readline = require("readline")

const interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

interface.on("line", (line) => {
    console.log(compute(line))
})

const compute = (input) => {
    return input.toLowerCase().replace(/([bcdfghjklmnpqrstvwxz])\1+/g, "$1$1")
}

const tester = require("../../Tester/tester")
const path = require("path")
tester.runTests([
    [compute, "programmmmmmmmmmmmmmmmmmmmering", "programmering"],
    [compute, "jag gillllllar glassss massor", "jag gillar glass massor"],
], path.join(__dirname, __filename))
