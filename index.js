const { app, BrowserWindow, WebContentsView, ipcMain, Menu } = require('electron')
const configStore = require('./config-store')

Menu.setApplicationMenu(null)

let win
let view
let homeUrl

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: __dirname + '/preload.js'
    }
  })

  win.loadFile('index.html')
}

function loadWebView() {
  view = new WebContentsView()
  win.contentView.addChildView(view)
  view.webContents.loadURL(homeUrl)
  view.webContents.on('did-navigate', (event, url) => {//callback when changing URL
    win.webContents.send('url-changed', url)
  })
}

ipcMain.on('go-back', () => {
  if (view.webContents.navigationHistory.canGoBack()) view.webContents.navigationHistory.goBack()
})
ipcMain.on('go-forward', () => {
  if (view.webContents.navigationHistory.canGoForward()) view.webContents.navigationHistory.goForward()
})
ipcMain.on('reload', () => {
  view.webContents.reload()
})
ipcMain.on('load-url', (event, url) => {
  view.webContents.loadURL(url)
})
ipcMain.on('go-home', () => {
  view.webContents.loadURL(homeUrl)
})
ipcMain.on('open-settings', (event, openClose) => {
  if (openClose) {
    win.contentView.removeChildView(view)
    win.loadFile("settings.html")
  }
  else {
    win.contentView.addChildView(view)
    win.loadFile("index.html")
  }
})
ipcMain.on('config-save', (event, key, value) => {
  configStore.set(key, value)

  homeUrl = configStore.get("home")
})
ipcMain.handle('config-read', async (event,key) => {
  return configStore.get(key)
})
function resizeWv() {
  const bounds = win.getBounds();
  view.setBounds({
    x: 0,
    y: 50,
    width: bounds.width,
    height: bounds.height,
  })
}
app.whenReady().then(() => {
  homeUrl = configStore.get("home")
  createWindow()
  loadWebView()
  win.on('resize',resizeWv)
  resizeWv()
})