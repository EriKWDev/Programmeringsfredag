const puppeteer = require("puppeteer");
const path = require("path");

const MakeScreenshot = async function (name) {
	try {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		const options = {
			path: path.join(process.cwd(), "screendumps", `test.png`),
			fullPage: true,
			omitBackground: true
		};
		// await page.emulateMedia("screen");
		await page.goto("https://www.kickstarter.com/projects/magnetips/incredible-magnetic-gel-pens?ref=section-design-tech-projectcollection-staff-picks-category-newest", {waitUntil: "networkidle2"});

		await page.setViewport({
		  width: 1080*2,
		  height: 10,
		  deviceScaleFactor: 2
		});

		await page.screenshot(options);
		await browser.close();
	} catch (e) {
		console.log("Error:" + e);
	}
};

MakeScreenshot();
