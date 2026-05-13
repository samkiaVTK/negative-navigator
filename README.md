From previous chapter (in branch basic functionality) we should have some... basic functionality. Now we will make it (a little) more usable.

## URL input
first thing that annoys me is that URL input field, it's too small, needs to have http/s://... , does not work with enter on keyboard and does not change when you navigate.
for the first one... we'll simply add some inline CSS to make it wider (it still looks ugly, but it's ok for now)
```
<input id="url" style="width:80%">
```
now we can at least see where we are.
another simple fix is that with http in url - we will simply add it *note that this is not ideal since there are more URLs than http://, but for now it's ok. Also we redirect to http and not https, determining which of them to use is too complex for this example project, most websites will redirect all http traffic to https, which must be enough for now*
```
function navigate(){
	dest = urlInput.value
	if(dest.length == 0) {return}
	if(!dest.startsWith("http")){dest = "http://"+dest}
	api.loadURL(dest)
}
```
now to handling enter - this is done by basic JS event listener 
```
  urlInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault()
      navigate()
    }
  });
```
The most difficult of this is updating the URL field when we navigate.
Remember that IPC from earlier? - we will use it, but now in the opposite direction (not truly oposite direction, you will see).
### Adding callback to did-navigate
Firstly to create callback in preload script (preload.js)
```
onUrlChange: (callback) => {
	ipcRenderer.on('url-changed', (event, url) => {
      callback(url)
    })
}
```
Now, because that WebContentsView is created by index.js, we must say it to emit that *'url-changed'* event. To do it add this code fragment to *loadWebView()* function. This adds callback to view's *'did-navigate'* which sends an IPC message to the renderer, where preload exposes it to the UI.
```
  view.webContents.on('did-navigate', (event, url) => {//callback when changing URL
    win.webContents.send('url-changed', url)
  })
```

Now hook it up in our HTML (add this into <script> tag)
```
window.api.onUrlChange((url) => {
	urlInput.value = url
	document.title = url + " - negative navigator"
})
```
we now have event which is handled by specified code - to change URL input value, and also window title
### Making webContentView autoresize
This is really simple, all that's needed is to create function which will handle resizing and set WCV's size to match it, also note that we must make the WCV a bit smaller (50px) than window because of our top menu (we will use constant to avoid magic numbers, and also because we will probbably change it), see code below
```
function resizeWv() {
  const bounds = win.getBounds();
  view.setBounds({
    x: 0,
    y: TOP_MENU_SIZE,
    width: bounds.width,
    height: bounds.height-TOP_MENU_SIZE,
  })
}
app.whenReady().then(() => {
  createWindow()
  loadWebView()
  win.on('resize',resizeWv)
  resizeWv() //call this function once at startup to set size
})
```

### Removing top menu
Default electron app ships with top menu. This can be usefull for some apps, however we don't want it there, so we will just disable it.
edit index.js, edit modules loaded from electron to add Menu, and add this line
```
Menu.setApplicationMenu(null)
```

I have also done some other stuff, but it's on same principes so i will not explain more.
