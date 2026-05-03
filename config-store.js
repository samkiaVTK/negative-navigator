const Store = require('electron-store').default;
//some versions might need this instead
//const Store = require('electron-store')

const store = new Store({
  defaults: {
    home: "https://github.com/samkiaVTK/negative-navigator"
  }
});

module.exports = store;