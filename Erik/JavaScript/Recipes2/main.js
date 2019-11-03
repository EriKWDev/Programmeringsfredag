const fse = require("fs-extra")
const md = require("markdown-it")()
const path = require("path")
const pdf = require("html5-to-pdf")
const yaml = require("yaml")

const options = {
    "templateName":"template-001",
    "pdfOptions":{
        "printBackground":true,
        "format":"A4",
        "scale":1.0,
        "landscape":false,
        "margin":{
            "top":"1cm",
            "right":"1cm",
            "bottom":"2cm",
            "left":"1cm"
        }
    }
}

console.log(path.join(__dirname, "data", "template-001.css"))
console.log(__dirname)

const generateRecipes = async () => {
    let directory = await fse.readdir(path.join(__dirname, "data"))
    await fse.emptyDir(path.join(__dirname, "recipes"))
    await fse.emptyDir(path.join(__dirname, "html"))

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
            <style type="text/css">
                @font-face {
                    font-family: Alice;
                    src: url(Alice.ttf);
                }

                body, html, p, h1, h2, h3, h4, h5, h6 {
                    font-family: Alice !important;
                }
            </style>
            <link rel="stylesheet" type="text/css" href="${options.templateName + ".css"}">
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=0.2">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Document</title>
        </head>
        <body>
            <div class="container">

                <div class="letter">${frontMatter.title.substr(0, 1).toUpperCase()}</div>

                <div class="recipe-top">
                    <h1>${frontMatter.title}</h1>
                    <p>${frontMatter.subtitle}</p>
                    <p>${frontMatter.time}</p>
                    <div class="stars-container">${generateStarsHTML(frontMatter.stars)}</div>
                </div>

                <hr />

                <div class="recipe-container">
                    ${renderedHTML}
                </div>

            </div>
        </body>
    </html>
    `
    return html
}

const generatePdfFromHTML = async (html, fileName) => {

    await fse.writeFile(path.join(__dirname, "html", `${fileName.split(".")[0]}.html`), html, "utf-8")

    console.log(`Generating pdf for ${fileName}...`)

    const html5ToPDF = new pdf({
        inputPath: path.join(__dirname, "html", `${fileName.split(".")[0]}.html`),
        outputPath: path.join(__dirname, "recipes", `${fileName.split(".")[0]}.pdf`),
        include: [
            path.join(__dirname, "data", `Alice.ttf`),
            path.join(__dirname, "data", `${options.templateName}.css`)
        ],
        pdf: options.pdfOptions,
        launchOptions: {
            headless: true
        },
        template: ""
    })

    await html5ToPDF.start()
    await html5ToPDF.build()
    await html5ToPDF.close()
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
