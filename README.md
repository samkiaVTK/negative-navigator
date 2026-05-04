in this part we will add settings (setting homepage), we will use electron-store
## electron-store
Electron-store is commonly used to save electron app's settings. To install it to our project we can use this command
```
npm install electron-store
```
### module for storing config
Because this will contain lot of (currently 1) hardcoded default values, I decided to put it in separate module - separate file.

To do this create new file named *'config-store.js'* and put this inside
```
const Store = require('electron-store').default;
//some versions might need this instead
//const Store = require('electron-store')

const store = new Store({
  defaults: {
    home: "https://github.com/samkiaVTK/negative-navigator"
  }
});

module.exports = store;
```
this creates new Store instance and exports it so we can use it outside of this module.

### IPC handle
Until now we were only sending messages between processes, but now we need to have some return values (read config file to renderer process). One way is to use approach that we already know - send message to main and when it's handled send another message back. This will work, but will be "too asynchronous", and code wil be longer.

Better aproach is by using *invoke* and *handle*. To add this (for reading config) use this code (handler) in index.js

```
ipcMain.handle('config-read', async (event,key) => {
  return configStore.get(key)
})
```
and invoker in our preload.js
```
configRead: (key) => ipcRenderer.invoke('config-read',key)
```
You can see **using** this is pretty similar to just *send*ing messages, except that it has return value.

*Also add functions for writing config, these are just send which were already used in previous "chapter".*

### Creating settings page
We now have functions and this but... how do our users actually set something? They will need an UI.

first we will create *settings.html* file - it should contain some input fields (currently just one - home page), and button to confirm. There isn't really anything new, just note that our handlers return **promises** - for this simple example it just means that you must write *await* before them.
```
homePageInput.value = await api.configRead("home")
```

We also need something to let our users open that settings page - add button into index.html which will call *openSettings(true)* when clicked. Of course we will also need to implement that function.
```
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
```
Do you know where to put this? (you should), into index.js.
Note that we remove our webContentView - it will stop it from rendering, but will not reload page when it's shown again.

### Storing config changes
As already mentioned we will use electron store, we have created instance of it with defaults preset.

First of all we must import that module in our main script
```
const configStore = require('./config-store')
```
then we can use functions that Store provides
```
//write to config
configStore.set(key, value)
//read from config
value = configStore.get(key)
```
by default this will write and read to/from file *config.json* located in our app's config folder (where this folder is depends on your OS).

  **Linux** ~/.config/app-name/config.json
  
  *Windows* %appData%\app-name\config.json
  
  *MacOS*   ~/Library/Application Support/app-name/config.json
  

### More minor changes
There are also some changes which I have not mentioned here - don't need special explanation, check source files, you should already know what they do.
