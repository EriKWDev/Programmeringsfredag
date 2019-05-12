const puppeteer = require("puppeteer");
const request = require("request");
const fs = require("fs-extra");
const path = require("path");
const url = require("url");
const hbs = require("handlebars");

const makeSwishObject = (amount, id, transparent=false) => {
	let swishObject = {
	    url:"https://mpc.getswish.net/qrg-swish/api/v1/prefilled",
	    method:"POST",
	    json:true,
	    body:{
			"format":"png",
			"payee":{
				"value":"+46764284704"
			},
			"message":{
				"value":id
			},
			"amount":{
				"value":amount,
				"editable":false
			},
			"size":300,
			"border":4,
			"transparent":transparent
		},
		encoding:"binary"
	}
	return swishObject;
}

const swishRequest = (amount, id, transparent=false) => {
	return new Promise((resolve, reject, transparent) => {
		request(makeSwishObject(amount, id), (error, res, body) => {
			if (!error && res.statusCode == 200) {
				resolve(body);
			} else {
				reject(error);
			}
    	});
	});
}

const main = async () => {
	try {
		const templateName = "invoice1";
		const id = "#00001";

		const cwd = process.cwd();
		const invoicesPath = path.join(cwd, "Invoices");
		const currentInvoicePath = path.join(invoicesPath, `invoice-${id}`);
		const swishPath = path.join(currentInvoicePath, "img", "swish.png");

		const invoiceData = {
			id:id,
			swishPath:"swish.png",
	        items: [{
	                name: "item 1",
	                price: 100
	            },
	            {
	                name: "item 2",
	                price: 200
	            },
	            {
	                name: "item 3",
	                price: 300
	            }
	        ],
	        total: 600,
	        isWatermark: false
		};
		const options = {
			path: path.join(currentInvoicePath, `invoice-${id}.pdf`),
			format: "A4",
			printBackground: true,
			margin: {
	            top: "1cm",
	            bottom: "1cm",
				left:"1cm",
				right:"1cm"
        	},
		};

		// Generate Swish PNG
		const swishPNG = await swishRequest(invoiceData.total, id);
		await fs.outputFile(swishPath, swishPNG, "binary", (e) => {
			if(e) {
				console.log(e);
			} else {
				console.log("Succesfully created " + swishPath);
			}
		});
		await fs.outputFile(path.join(cwd, "templates", "swish.png"), swishPNG, "binary", (e) => {
			if(e) {
				console.log(e);
			} else {
				console.log("Succesfully created " + swishPath);
			}
		});

		// Generate HTML form hbs-template
		const hbsTemplate = await fs.readFile(path.join(cwd, "templates", `${templateName}.html`), "utf-8");
		const invoiceHTML = await hbs.compile(hbsTemplate)(invoiceData);
		console.log(invoiceData.swishPath);

		// Generate PDF from HTML
		const browser = await puppeteer.launch();
		const page = await browser.newPage();

		await page.setContent(invoiceHTML, {
			waitUntil:"networkidle2"
		});

		await page.pdf(options);
   		await browser.close();

	} catch (e) {
		console.log(e);
	}
}

main();
