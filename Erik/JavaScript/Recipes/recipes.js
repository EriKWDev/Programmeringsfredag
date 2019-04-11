const puppeteer = require("puppeteer");
const fs = require("fs-extra");
const hbs = require("handlebars");
const path = require("path");
const merge = require('easy-pdf-merge');

const compile = async function(templateName, data) {
	const templatePath = path.join(process.cwd(), "templates", `${templateName}.hbs`);
	const html = await fs.readFile(templatePath, "utf-8");
	return hbs.compile(html)(data);
}

const createRecipePDF = async function (name) {
	try {
		console.log(`Creating PDF for "${name}.json"`);

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

		await page.goto(path.join(process.cwd(), "templates", `${templateName}.html`), {waitUntil: "networkidle2"});
		await page.emulateMedia("print");
		await page.pdf(options);

		await browser.close();
		console.log(`"${name}.pdf" created succesfully from "${name}.json"`);
		return;

	} catch (e) {
		console.log("Error:" + e);
	}
};

const createAllRecipes = async function () {
	const files = fs.readdirSync(path.join(process.cwd(), "recipes-data"));
	let filePaths = [];
	for(let i = 0; i < 100; i++) {
		console.log("");
	}
	console.log("__________ Starting Recipe Creation ___________");
	console.log("");

	for(const file of files) {
		const name = file.split(".")[0];
		await createRecipePDF(name);
		filePaths.push(path.join(process.cwd(), "pdf", `${name}.pdf`));
		console.log("");
	}

	merge(filePaths, path.join(process.cwd(), "pdf", "__Recipes.pdf"), (error) => {
		if(error) {
			return console.log("Error: ", error);
		}

		console.log("All PDFs have been succesfully combined.");
		console.log("");
		console.log("__________ Finnished Recipe Creation __________");

		for(let i = 0; i < 5; i++) {
			console.log("");
		}
		console.log("_________________ Quick Facts _________________");
		console.log("");
		console.log("Total number of Recipes: " + filePaths.length);
		console.log("_______________________________________________");
		for(let i = 0; i < 30; i++) {
			console.log("");
		}
	});

}

createAllRecipes();
