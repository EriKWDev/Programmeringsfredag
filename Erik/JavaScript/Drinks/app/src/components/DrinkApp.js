// Drink Sheet:
// https://docs.google.com/spreadsheets/d/1OhMYSx78R9zzwPTbqouh54vmJyIBmpX5qHGTL43zbCE/edit#gid=0

import React from "react";
import Drink from "./Drink"
import Config from "./Config"

function fetchDrinks(callback) {
	window.gapi.client.load("sheets", "v4", () => {
		window.gapi.client.sheets.spreadsheets.values.get({
			spreadsheetId: Config.spreadsheetId,
			range: "Drinks!A1:H"
		}).then(response => {
			const data = response.result.values;
			console.log(data);
			const rows = data.map(row => ({
				name: row[0],
				glass: row[1],
				garnishes: row[2],
				cost: row[3],
				alc: row[4],
				ingredients: row[5],
				amounts: row[6],
				id: row[7]
			})) || [];

			rows.splice(0, 1);

			callback({
				rows
			});
		},
		response => {
			callback(false, response.result.error);
		}
		);
	});
}

class DrinkApp extends React.Component {
	constructor() {
		super();

		this.state = {
			rows:[],
			error: null,
			loading: true
		};

		this.showDrink = this.showDrink.bind(this);
		this.onLoad = this.onLoad.bind(this);
		this.initClient = this.initClient.bind(this);
	}

	showDrink(id) {
		this.setState(previousState => {
			const newRows = previousState.rows.map (row => {
				if(row.id === id) {
					row.show = !row.show;
				}

				return row;
			});

			return ({
				rows: newRows,
				error: previousState.error,
				loading: previousState.loading
			});
		});
	}

	async componentDidMount() {
		await window.gapi.load("client", this.initClient);
	}

	initClient() {
		this.setState(previousState => {
			return ({
				rows: previousState.rows,
				error:  previousState.error,
				loading: true
			});
		});

		window.gapi.client.init({
			apiKey: Config.apiKey,
			discoveryDocs: Config.discoveryDocs,
		}).then(() => {
			fetchDrinks(this.onLoad);
		});
	}

	onLoad(data, error) {
		this.setState(previousState => {
			for(let newRow of data.rows) {
				for(let oldRow of previousState.rows) {
					if(newRow.id === oldRow.id) {
						newRow.show = oldRow.show;
					}
				}
			}

			return ({
				rows: data.rows,
				error: error,
				loading: false
			});
		});
	}

	render() {
		if(this.state.error) {
			return (
				<div>{this.state.error}</div>
			);
		}

		let drinks = this.state.rows.map(row => {
			return (
				<Drink key={row.id} drink={row} show={(id) => { this.showDrink(id) }}/>
			);
		});

		return (
			<div className="appCointainer">
				<h1>Menu</h1>
				<a onClick={this.initClient} className="myButton">Refresh</a>
				<div className="drink-container">
				<div className="loading" style={{opacity:this.state.loading ? 1 : 0}}></div>
				{drinks}
				</div>
			</div>
		);
	}
}

export default DrinkApp;
