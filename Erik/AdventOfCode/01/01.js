const fs = require("fs")

const calculateFuelFromMass = (mass) => {
    return Math.floor(mass/3) - 2
}

const compute = () => {
    try {
        const data = fs.readFileSync("01.txt", "UTF-8")
        
        const lines = data.split(/\r?\n/)
        let total = 0
    
        lines.forEach((line) => {
            let n = parseInt(line)
            while(n > 0) {
                n = calculateFuelFromMass(n)
                total += (n > 0 ? n : 0)
            }
        })
        console.log(total)
    } catch (error) {
        console.log(error)
    }
}

compute()