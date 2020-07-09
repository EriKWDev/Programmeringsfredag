
class Number {
    constructor({message="", ...variables}) {
        this.message = message
        this.actualMessage = message
        this.variables = {...variables}

        for(let key of Object.keys(this.variables)) {
            this[key] = this.variables[key] 
        }

        this.update()
    }

    updateVariables() {
        for(let key of Object.keys(this.variables)) {
            this.variables[key] = this[key]
        }
    }

    formatMessage() {
        this.actualMessage = this.message
        for(let key of Object.keys(this.variables)) {
            let search = `$${key}$`
            this.actualMessage = this.actualMessage.split(search).join(this[key])
        }
    }

    update() {
        this.updateVariables()
        this.formatMessage()
    }

    print() {
        this.update()
        console.log(this.actualMessage)
    }
}

let number = new Number({
    message: "Score: $d$, $e$%, $g$",
    d: 100,
    e: 20,
    g: "Test"
})

number.print() // Score: 100, 20%, Test
number.d = 200
number.g = "Lorem"
number.print() // Score: 200, 20%, Lorem