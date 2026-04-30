From previous chapter (in branch basic functionality) we should have some... basic functionality. Now we will make it (a little) more usable.

## URL input
first thing that annoys me is that URL input field, it's too small, needs to have http/s://... and does not change when you navigate.
for the first one... we'll simply add some inline CSS to make it wider (it still looks ugly, but it's ok for now)
```
<input id="url" style="width:80%">
```
now we can at least see where we are.
another simple fix is that with http in url - we will simply add it (note that it won't work with https - but most modern websites will redirect us, which is enough for now)
```
function navigate(){
        dest = urlInput.value
        if(dest.length == 0) {return}
        if(!dest.startsWith("http")){dest = "http://"+dest}
        api.loadURL(dest)
      }
```

The most difficult of this is updating the URL field when we navigate.
Remember that IPC from earlier? - we will use it, but now in the opposite direction (not truly oposite direction, you will see).

Firstly to create callback in preload script (preload.js)
```
  onUrlChange: (callback) => {
    ipcRenderer.on('url-changed', (event, url) => {
      callback(url)
    })
  }
```
Now hook it up in our HTML (add this into <script> tag)
```
	window.api.onUrlChange((url) => {
		urlInput.value = url
        windowTitle.innerText = url + " - negative navigator"
      })
```
we now have event which is handled by specified code - to change URL input value, and also window title(by editing innerText of <title> element
