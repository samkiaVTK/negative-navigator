const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  goBack: () => ipcRenderer.send('go-back'),
  goForward: () => ipcRenderer.send('go-forward'),
  reload: () => ipcRenderer.send('reload'),
  loadURL: (url) => ipcRenderer.send('load-url', url),

  onUrlChange: (callback) => {
    ipcRenderer.on('url-changed', (event, url) => {
      callback(url)
    })
  }
})