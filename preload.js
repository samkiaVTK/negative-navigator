const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  goBack: () => ipcRenderer.send('go-back'),
  loadURL: (url) => ipcRenderer.send('load-url', url),
})