const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 320,
    height: 450,
    frame: false,
    transparent: true,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile(path.join(__dirname, 'index.html'));
  win.setAlwaysOnTop(false, 'bottom'); 
}

app.whenReady().then(() => {
  createWindow();
  app.setLoginItemSettings({
    openAtLogin: true,
    path: app.getPath("exe") 
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});