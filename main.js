const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const koa = require('./koa');

function openWindow () {
  window = new BrowserWindow({width: 600, height: 400, webPreferences: { nodeIntegration: false}});

  window.loadURL(`file://${__dirname}/public/main.html`)

  window.on('closed', function () {
    window = null
  })
}

app.on('ready', openWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  };
})

app.on('activate', function () {
  if (window === null) {
    openWindow()
  }
});
