const fse = require("fs-extra")
const md = require("markdown-it")()
const path = require("path")
const pdf = require("html-pdf")
const yaml = require("yaml")

const options = {
    "templateName":"template-001",
    "pdfOptions":{
        "format":"A3",
        "orientation":"portrait",
        "border":{
            "top":"1cm",
            "right":"1cm",
            "bottom":"2cm",
            "left":"1cm"
        },
        "base":`file://${path.join(__dirname, "data", "template-001.css")}`
    }
}

console.log(path.join(__dirname, "data", "template-001.css"))

const generateRecipes = async () => {
    let directory = await fse.readdir(path.join(__dirname, "data"))

    for(let fileName of directory) {

        if(fileName.split(".")[1] != "md") {
            continue
        }

        let filePath = path.join(__dirname, "data", fileName)

        let html = await getHTMLFromFile(filePath)
        await generatePdfFromHTML(html, fileName)
    }
}

const getHTMLFromFile = async (filePath) => {
    let file = await fse.readFile(filePath, "utf-8")
    let lines = file.split(/\n/)

    let isReadingFrontMatter = false
    let yamlFrontMatter = ""
    let mdRecipe = ""

    for(let line of lines) {
        if(line.includes("---")) {
            isReadingFrontMatter = !isReadingFrontMatter;
        } else if(isReadingFrontMatter) {
            yamlFrontMatter += line + "\n"
        } else {
            mdRecipe += line + "\n"
        }
    }

    let frontMatter = await yaml.parse(yamlFrontMatter)
    let renderedHTML = await md.render(mdRecipe)

    let html =
    `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <link rel="stylesheet" type="text/css" href="${options.templateName + ".css"}"
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=0.2">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Document</title>
        </head>
        <body>
            <div class="container">

                <div class="recipe-top">
                    <h1>${frontMatter.title}</h1>
                    <p>${frontMatter.subtitle}</p>
                    <p>${frontMatter.time}</p>
                    <div class="stars-container">${generateStarsHTML(frontMatter.stars)}</div>
                </div>

                <div class="recipe-container">
                    ${renderedHTML}
                </div>

            </div>
        </body>
    </html>
    `

    await fse.writeFile(filePath.split(".")[0] + ".html", html, "utf-8")
    return html
}

const generatePdfFromHTML = async (html, fileName) => {
    console.log(`Generating pdf for ${fileName}...`)
    pdf.create(html, options.pdfOptions).toFile(path.join(__dirname, "recipes", `${fileName.split(".")[0]}.pdf`), (err, res) => {
        if (err) {
            console.log(err)
        }
    })
}

const generateStarsHTML = (stars) => {
    let html = `<span class="stars">`
    for(let i = 0; i < 10; i++) {
        html += `<i class="${i < stars ? "star" : "no-star"}"> </i>`
    }
    html += `</span>`
    return html
}

generateRecipes()
