// Drink Sheet:
// https://docs.google.com/spreadsheets/d/1OhMYSx78R9zzwPTbqouh54vmJyIBmpX5qHGTL43zbCE/edit#gid=0
//


const GoogleSpreadsheet = require("google-spreadsheet");
const { promisify } = require("util");
const credentials = require("./auth.json");

const printDrink = (drink) => {
	console.log(`${drink.name}`);
	console.log(`Served in a ${drink.glass}-glass with ${drink.garnishes}`);
	console.log(`Ingredients: ${drink.ingredients}`);
	console.log(`Amounts:     ${drink.amounts}`);
	console.log(`--------------------`);
}

const accessSpreadsheet = async () => {
	const doc = new GoogleSpreadsheet("1OhMYSx78R9zzwPTbqouh54vmJyIBmpX5qHGTL43zbCE");
	await promisify(doc.useServiceAccountAuth)(credentials);
	const info = await promisify(doc.getInfo)();
	const sheet = info.worksheets[0];

	console.log(`Title: ${sheet.title}, Rows: ${sheet.rowCount}`);

	const rows = await promisify(sheet.getRows)({
		offset:3
	});

	rows.forEach(row => {
		printDrink(row);
	})
}
