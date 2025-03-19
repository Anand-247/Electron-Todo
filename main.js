const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 250,
    height: 300,
    minWidth: 200,
    minHeight: 250,
    maxWidth: 350,
    maxHeight: 500,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    icon: path.join(__dirname, 'assets/todo-app-icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      enableRemoteModule: true
    }
  });

  win.loadFile('index.html');

  // **Ensure always on top**
  win.setAlwaysOnTop(true, 'screen-saver');
  
  // Focus the window after load
  win.once('ready-to-show', () => {
    win.show();
    win.focus();
  });

  // Reapply always on top when window is shown
  win.on('show', () => {
    win.setAlwaysOnTop(true, 'screen-saver');
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
