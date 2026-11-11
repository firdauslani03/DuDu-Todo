const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let win;
let isMaximizedState = false;
let prevBounds = { width: 900, height: 600 };

function createWindow() {
  win = new BrowserWindow({
    width: 900,
    height: 600,
    minWidth: 320,
    minHeight: 480,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000', // Enforces full alpha transparency canvas
    resizable: true,
    skipTaskbar: false,
    icon: path.join(__dirname, '../cuteyejun.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile(path.join(__dirname, 'index.html'));

  ipcMain.on('window-control', (event, action) => {
    if (!win) return;

    if (action === 'to-widget') {
      isMaximizedState = false;
      win.setSize(320, 480);
      win.setResizable(false);
      win.setSkipTaskbar(true);
      win.setAlwaysOnTop(false, 'bottom');
    } else if (action === 'to-app') {
      isMaximizedState = false;
      win.setResizable(true);
      win.setSize(900, 600);
      win.setSkipTaskbar(false);
      win.setAlwaysOnTop(false);
      win.center();
    } else if (action === 'minimize-to-taskbar') {
      win.minimize();
    } else if (action === 'toggle-maximize') {
      if (isMaximizedState || win.isMaximized()) {
        isMaximizedState = false;
        if (prevBounds && prevBounds.x !== undefined) {
          win.setBounds(prevBounds);
        } else {
          win.unmaximize();
          win.setSize(900, 600);
          win.center();
        }
      } else {
        prevBounds = win.getBounds();
        isMaximizedState = true;
        win.maximize();
      }
    } else if (action === 'close') {
      win.close();
    }
  });
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