# Packaging your app

When you are ready to distribute your app, you can do it by following this tutorial.

*you can also use this one:* https://www.electronjs.org/docs/latest/tutorial/tutorial-packaging

## Electron forge
Electron itself does not provide any option to pack your app, we will use Electron forge - recomended packaging tool for electron apps.
### Installation
Firstly we have to install it, and import our project with
```
npm install --save-dev @electron-forge/cli
npx electron-forge import
```
the second line (import script) should add following entries into our package.json
```
  "scripts": {
    "start": "electron-forge start",
    "package": "electron-forge package",
    "make": "electron-forge make"
  },
```
also new file ```forge.config.js``` should be created - it contains info for bundling your app (you may want to edit to add/remove some targets, I have not installed rpmbuild (and don't need it) thus disabled rpm target)

### Packaging app

```
npm run make
```
This will bundle your code with electron into a folder, and then pack it into app bundle for specified targets (Linux, macOS, Windows)
### Electron autoupdate

You can make your app check and auto download updates, this will not be covered int this tutorial. (yet?)

### Note about signing code
You may also want to sign your code because your users should know that you (trusted developer) made this app and it wasn't tampered by some malicious acter (hacker, bad guy). Also some systems will not let you install unsigned code by default, and if you ever wanted to use electron auto update you must have signed code. Once more, this tutorial does not (yet?) cover it.