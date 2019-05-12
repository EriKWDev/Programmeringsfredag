import React from "react";
import Drink from "./Drink"

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

	return rows;
}

class DrinkApp extends React.Component {
	constructor() {
		super();

		this.state = {
			rows:[
				{
					id:1,
					name:"Margarita",
					ingredients:"Tequila, Cointreau, Lemon Juice"
				},
				{
					id:2,
					name:"Gin & Tonic",
					ingredients:"Gin, Tonic"
				}
			],
		};
	}

	render() {
		let drinks = this.state.rows.map(row => {
			return (
				<Drink key={row.id} drink={row} />
			);
		});

		return (
			<div>
				<h1>Drink App</h1>
				<div className="drink-container">
				{drinks}
				</div>
			</div>
		);
	}
}

export default DrinkApp;
