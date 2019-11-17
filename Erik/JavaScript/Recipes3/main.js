const yaml = require("js-yaml")
const fs = require("fs-extra")
const path = require("path")
const puppeteer = require("puppeteer")

let main = async () => {
    let dirPath = path.join(__dirname, `data`)
    let files = await fs.readdir(dirPath)
    
    for(let fileName of files) {
        let filePath = path.join(dirPath, fileName)
        let file = await fs.readFile(filePath, "UTF-8")
        let data = yaml.load(file)
        
        const browser = await puppeteer.launch({headless: false})
        const page = await browser.newPage()
        await page.goto("https://example.com")
        await page.screenshot({path: "example.png"})

        await browser.close()
    }
}

main()


