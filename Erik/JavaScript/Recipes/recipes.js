const puppeteer = require("puppeteer");
const fs = require("fs-extra");
const hbs = require("handlebars");
const path = require("path");

const compile = async function(templateName, data) {
	const templatePath = path.join(process.cwd(), "templates", `${templateName}.hbs`);
	const html = await fs.readFile(templatePath, "utf-8");
	return hbs.compile(html)(data);
}

const createRecipePDF = async function (name) {
	try {
		console.log(`Creating PDF for: ${name}`);

		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		const options = {
			path: `pdf/${name}.pdf`,
			format: "A4",
			printBackground: true
		};

		const templateName = "template-1";
		const data = require(`./recipes-data/${name}.json`);
		const recipeHTML = await compile(templateName, data);
		await fs.writeFile(`templates/${templateName}.html`, recipeHTML, (e) => {
			if(e) {
				return console.log(e);
			}
		});

		await page.goto(path.join(process.cwd(), `templates/${templateName}.html`), {waitUntil: "networkidle2"});
		await page.emulateMedia("print");
		await page.pdf(options);

		await browser.close();
		process.exit();

	} catch (e) {
		console.log("Error:" + e);
	}
};

createRecipePDF("Yakisoba");
