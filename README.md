*before starting you should know some theory regarding electron (if you want to know what are you doing, I am also referencing to some terms) as i will not explain it much there*

# How to achieve this

## Setting up electron
refer to this official tutorial: https://www.electronjs.org/docs/latest/tutorial/tutorial-prerequisites
### Download node.js
https://nodejs.org/en/download
### Project init
create new directory, open terminal in it and run npm init
in setup guide set entry point as index.js, all other is not that important, at the end you should get json like this
```
{
  "name": "electron app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "type": "commonjs"
}
```
your directory should now contain files package.json and package-lock.json *(packages-lock.json are maybe created after creating electron, not sure now)*
### First javascript
create simple js script just to check if node is installed correctly
filename must be **index.js** and it should contain simple js code such as **console.log('hello')**
```
echo "console.log('hello')" > index.js
```
### Instaling electron
```
npm install electron --save-dev
```
your directory should now contain new dir *node_modules*

*you may also consider adding **.gitignore** file*, one can be found in official guide

now edit your **package.json**, add *"start"* to scripts
```
  ...
  "scripts": {
    "start": "electron .",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  ...
```
you can reffer to package.json contained in this repository

you can now run it using this command
```
npm run start
```
you should see "hello" in your terminal.
## First App in electron
refer to this guide: https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app
we will try to display some static html page, create whatever HTML page you want to be displayed, name it index.html
### Loading it using index.js
Now remove all from index.js and copy paste this code.
```
const { app, BrowserWindow } = require('electron')

	const createWindow = () => {
	  const win = new BrowserWindow({
	    width: 800,
	    height: 600
	  })

	  win.loadFile('index.html')
	}

	app.whenReady().then(() => {
	  createWindow()
	})
```
I find this code pretty much self explaining, note that **app.whenReady** - you can not create window until the app is initialized.

Now we can run the app again with npm run start, we should see 800x600 px window with our HTML page.

## Creating some actual browser behavior
Because electron actually is web browser itself (Chromium), this is going to be fairly simple
We need to edit our index.js file again, and add some WebView element (WebContentsViewin our case)

But first of all we need to create "global" vars for window and said webView.
*I assume you know what that means and how to do that*
### Creating WV (webView)
```
function loadWebView() {
  view = new WebContentsView()
  win.contentView.addChildView(view)
  view.webContents.loadURL('https://example.com')
  view.setBounds({ x: 0, y: 50, width: 800, height: 550 })
}
```
and call it in **app.whenReady()...** block
### Some basic UI
Create html page (index.html), this is going to be our navbar - thus it should contain some buttons and input for url
Basic HTML button looks like this
```
<button onclick="function()">btn</button>
```
But now... how to actually call that function - using IPC.

### Inter process comunication (IPC)
Because electron uses 2 (or more) processes (in different contexts) we need to add something like communication bridge between them (we actually don't need, but that will require exposing it directly which is very dangerous for web browser (except that we are exposing it only to our html file... but just do it this way).
first off all we need to create script which will handle that (called preload)
```
contextBridge.exposeInMainWorld('api', {
  goBack: () => ipcRenderer.send('go-back'),
  loadURL: (url) => ipcRenderer.send('load-url', url),
})
```
this creates "object" api accessible from rendererprocess (window.api)
now you can call something like api.goBack() from your html page it will send signal 'go-back' to main process which will then handle it

you can now finish that HTML UI, it's really simple
### Now to make it work
From previous part we have IPC script, we will now add it to our WV, it's done by adding webPreferences... see below.
```
function createWindow() {
    win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: __dirname + '/preload.js'
    }
  })
```
now we will add some functionality when receiving those signals.
```
ipcMain.on('load-url', (event, url) => {
  view.webContents.loadURL(url)
})
```
you can see that now we can call things from main process (obviously because we are inside of it), which are asynchronously triggered by renderer process.

### TADA
now add the remaining functionality (the same way) and run our app by typing **npm run start** in terminal.
