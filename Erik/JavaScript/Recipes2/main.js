const fse = require("fs-extra")
const md = require("markdown-it")()
const path = require("path")
const pdf = require("html-pdf")

const pdfOptions = {
    "format": "A4",
    "orientation": "portrait",
    "border": {
        "top": "1cm",
        "right": "1cm",
        "bottom": "2cm",
        "left": "1cm"
    }
}

fse.readdir(path.join(__dirname, "data")).then((results) => {
    results.forEach(fileName => {
        fse.readFile(path.join(__dirname, "data", fileName), "utf-8").then((file) => {
            if(fileName.split(".")[1] == "md") {
                let html = `<link rel="stylesheet" type="text/css" href="data/template-1.css" />` + md.render(file)
                console.log(html)
                console.log(`Generating pdf for ${fileName.split(".")[0]}`)
                pdf.create(html, pdfOptions).toFile(path.join(__dirname, "recipes", `${fileName.split(".")[0]}.pdf`), function(err, res) {
                    if (err) {
                      console.log(err)
                    }
                })
            }
        })
    })
})

