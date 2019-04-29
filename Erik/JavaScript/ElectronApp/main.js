const electron = require("electron");
const url = require("url");
const path = require("path");

const {app, BrowserWindow, Menu} = electron;

let mainWindow;
let createInvoiceWindow;

app.on("ready", () => {
	mainWindow = new BrowserWindow({});

	mainWindow.loadURL(url.format({
		pathname: path.join(process.cwd(), "index.html"),
		protocol: "file:",
		slashes: true
	}));

	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	Menu.setApplicationMenu(mainMenu);

	mainWindow.on("closed", () => {
		app.quit();
	});
});

function createInvoice() {
	createInvoiceWindow = new BrowserWindow({
		width:500,
		height:300,
		title:"New Invoice"
	});

	mainWindow.loadURL(url.format({
		pathname: path.join(process.cwd(), "index.html"),
		protocol: "file:",
		slashes: true
	}));

	createInvoiceWindow.on("closed", () => {
		createInvoiceWindow = null;
	});
}

const cKey =  process.platform == "darwin" ? "Command+" : "Ctrl+";

const mainMenuTemplate = [
	{
		label:"File",
		submenu:[
			{
				label:"New Invoice",
				accelerator:cKey+"N",
				click() {
					createInvoice();
				}
			},
			{
				label:"Quit",
				accelerator:cKey+"Q",
				click() {
					app.quit();
				}
			}
		]
	}
];

if(process.platform == "darwin") {
	mainMenuTemplate.unshift({});
}

if(process.env.NODE_ENV != "production") {
	mainMenuTemplate.push({
		label:"Developer Tools",
		submenu:[
			{
				label:"Toogle Developer Tools",
				accelerator:cKey+"I",
				click(item, focusedWindow) {
					focusedWindow.toggleDevTools();
				}
			},
			{
				role:"reload"
			}
		]
	});
}
