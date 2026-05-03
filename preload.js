const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  goBack: () => ipcRenderer.send('go-back'),
  goForward: () => ipcRenderer.send('go-forward'),
  reload: () => ipcRenderer.send('reload'),
  goHome: () => ipcRenderer.send('go-home'),
  loadURL: (url) => ipcRenderer.send('load-url', url),
  openSettings: (openClose) => ipcRenderer.send('open-settings', openClose),

  onUrlChange: (callback) => {
    ipcRenderer.on('url-changed', (event, url) => {
      callback(url)
    })
  },
  configSave: (key,value) => ipcRenderer.send('config-save', key,value),
  configRead: (key) => ipcRenderer.invoke('config-read',key)
})