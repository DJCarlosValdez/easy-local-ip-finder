const electron = require('electron')
const { app, BrowserWindow, Menu, Tray, ipcMain } = electron
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
	app.quit()
}
const ip = require('internal-ip')

let mainWindow, tray
let local = ip.v4.sync()

const refreshIP = () => {
	local = ip.v4.sync()
	tray.setToolTip(`Hello! Your IP is: ${local}`)
	mainWindow.webContents.send('resIP', local)
}

app.setLoginItemSettings({
	openAtLogin: true
})

function createWindow () {
	const display = electron.screen.getPrimaryDisplay()
	const displayWidth = display.bounds.width
	const displayHeight = display.bounds.height
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

function createTray () {
	tray = new Tray(`${__dirname}/icon.png`)
	const contextMenu = Menu.buildFromTemplate([
		{ label: 'Quit', type: 'normal', role: 'quit' }
	])
	tray.setContextMenu(contextMenu)
	tray.setToolTip('My Local IP')
	tray.on('click', event => {
		toggleWindow()
	})
}

function toggleWindow () {
	mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
	refreshIP()
}

function windowOutside () {
	mainWindow.on('blur', () => {
		mainWindow.hide()
	})
}

app.on('ready', () => {
	createTray()
	createWindow()
})

ipcMain.on('reqIP', (event) => {
	refreshIP()
})
