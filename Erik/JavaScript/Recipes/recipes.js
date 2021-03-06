const puppeteer = require("puppeteer");
const fs = require("fs-extra");
const hbs = require("handlebars");
const path = require("path");
const merge = require("easy-pdf-merge");
const FORCECREATE = true;

const log = (message="", type="info") => {

	let l = message.length;
	let terminalColumns = process.stdout.columns;
	let line = "";
	let space = "";

	switch (type.toLowerCase()) {
		default:
			console.log(`[${type}] ${message}`);
			break;

		case "space":
			console.log(`${message}`);
			break;

		case "title":

			for(let i = 0; i < terminalColumns; i++) {
				line += "_";
				if (i < terminalColumns/2 - l/2) {
					space += " ";
				}
			}

			console.log(line);
			console.log("");
			console.log(space + message);
			console.log(line);
			console.log("");
			break;

		case "title2":

			for(let i = 0; i < terminalColumns; i++) {
				line += "_";
				if (i < terminalColumns/2 - l/2) {
					space += " ";
				}
			}

			console.log(line);
			console.log("");
			console.log(space + message);
			console.log("");
			break;
	}
}

const sleep = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const compile = async (templateName, data) => {
	const templatePath = path.join(process.cwd(), "templates", `${templateName}.hbs`);
	const html = await fs.readFile(templatePath, "utf-8");
	return hbs.compile(html)(data);
}

const createRecipePDF = async (name) => {
	try {
		log(`Creating PDF for "${name}.json"`);
		console.time(name);

		const data = require(path.join(process.cwd(), "recipes-data", `${name}.json`));

		var prev_data;

		try {
			prev_data = require.resolve(path.join(process.cwd(), "tmp", `${name}.json`));
		} catch (e) {
			log("New Recipe");
			prev_data = null;
		}

		if(prev_data != null) {
			prev_data = require(path.join(process.cwd(), "tmp", `${name}.json`));
		}

		if(!FORCECREATE && prev_data != null && JSON.stringify(data) == JSON.stringify(prev_data)) {
			log("Recipe not changed. Aborting creation.");
			console.timeEnd(name);
			return;
		}

		await fs.writeFile(path.join(process.cwd(), "tmp", `${name}.json`), JSON.stringify(data), (e) => {
			if(e) {
				return log(e, "error");
			}
		});

		const templateName = "template-2";
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		const options = {
			path: path.join(process.cwd(), "pdf", `${name}.pdf`),
			format: "A4",
			printBackground: true
		};

		data.main.firstLetter = data.main.title[0];

		const recipeHTML = await compile(templateName, data);

		await fs.writeFile(path.join(process.cwd(), "html", `${name}.html`), recipeHTML, (e) => {
			if(e) {
				return log(e, "error");
			}
		});

		const htmlPath = path.join(process.cwd(), "html", `${name}.html`);
		log("Path: " + htmlPath);
		const htmlFile = await fs.read
		await page.emulateMedia("print");
		//await page.goto(`data:text/html,${recipeHTML}`, {waitUntil: "networkidle2"});
		//await page.setContent(recipeHTML);
		await page.goto("file:" + htmlPath, {waitUntil: "networkidle2"});
		await page.pdf(options);

		await browser.close();
		log(`"${name}.pdf" created succesfully from "${name}.json"`);
		console.timeEnd(name);
		await sleep(800);
		return;

	} catch (e) {
		log(e, "error");
	}
};

const createAllRecipes = async () => {
	const files = fs.readdirSync(path.join(process.cwd(), "recipes-data"));
	let filePaths = [];
	for(let i = 0; i < 100; i++) {
		log("", "space");
	}

	log("Starting Recipe Creation", "title");
	console.time("Total time");
	for(const file of files) {
		const name = file.split(".")[0];
		await createRecipePDF(name);
		filePaths.push(path.join(process.cwd(), "pdf", `${name}.pdf`));
		log("","space");
	}
	merge(filePaths, path.join(process.cwd(), "pdf", "__Recipes.pdf"), (e) => {
		if(e) {
			return log(e, "error");
		}

		console.log("All Recipe-PDFs have been merged to _Recipes.pdf");
		console.log("");
		log("Finnished Recipe Creation", "title");

		for(let i = 0; i < 2; i++) {
			console.log("");
		}
		console.log("╭━━━━━━━━━━━━━ Quick Stats ━━━━━━━━━━━━━╮");
		console.log("");
		console.log("Total number of Recipes: " + filePaths.length);
		console.log("Forced? " + FORCECREATE);
		console.log("");
		console.log("╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯");
		for(let i = 0; i < 3; i++) {
			console.log("");
		}
	});
}

createAllRecipes();
