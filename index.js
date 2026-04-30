const { app, BrowserWindow, WebContentsView, ipcMain } = require('electron')
let win
let view

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
  view.webContents.loadURL('https://google.com')
  view.setBounds({ x: 0, y: 50, width: 800, height: 550 })
    view.webContents.on('did-navigate', (event, url) => {//callback when changing URL
    win.webContents.send('url-changed', url)
  })
}

ipcMain.on('go-back', () => {
  if (view.webContents.canGoBack()) view.webContents.goBack()
})

ipcMain.on('go-forward', () => {
  if (view.webContents.canGoForward()) view.webContents.goForward()
})

ipcMain.on('reload', () => {
  view.webContents.reload()
})

ipcMain.on('load-url', (event, url) => {
  view.webContents.loadURL(url)
})
app.whenReady().then(() => {
  createWindow()
  loadWebView()
})