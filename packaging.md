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

