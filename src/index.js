const electron = require('electron')
const { app, BrowserWindow, Menu, Tray, ipcMain } = electron
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
	app.quit()
}
const ip = require('internal-ip')
require('update-electron-app')()

let mainWindow, tray

function createWindow() {
	let display = electron.screen.getPrimaryDisplay()
	let displayWidth = display.bounds.width
	let displayHeight = display.bounds.height
	mainWindow = new BrowserWindow({
		width: 300,
		height: 400,
		x: displayWidth - 300,
		y: displayHeight - 400,
		movable: false,
		show: false,
		frame: false,
		fullscreenable: false,
		resizable: false,
		webPreferences: {
			nodeIntegration: true
		}
	})

	mainWindow.loadURL(`file://${__dirname}/index.html`)
	windowOutside()

	mainWindow.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null
	})
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

function createTray() {
	tray = new Tray(`${__dirname}/icon.png`)
	contextMenu = Menu.buildFromTemplate([
		{ label: 'Quit', type: 'normal' }
	])
	tray.setContextMenu(contextMenu)
	tray.setToolTip('Local IP')
	tray.on('click', event => {
		toggleWindow()
	})
}

function toggleWindow() {
	mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
}

function windowOutside() {
	// mainWindow.on('blur', () => {
	// 	mainWindow.hide()
	// })
}

app.on('ready', () => {
	createTray()
	createWindow()
})

ipcMain.on('reqIP', (event) => {
	let local = ip.v4.sync()
	tray.setToolTip(`Hello! Your IP is: ${local}`)
	event.reply('resIP', local)
})