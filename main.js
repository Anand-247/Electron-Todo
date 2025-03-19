const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

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
      enableRemoteModule: true,
      nodeIntegration: true, // Allow file system access
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
}

function readTasksFromFile() {
  const filePath = path.join(app.getPath('userData'), 'tasks.json');
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading tasks file:", error);
  }
  return []; // Return empty array if file doesn't exist or error occurs
}

// **Write tasks to local JSON file**
function writeTasksToFile(tasks) {
  const filePath = path.join(app.getPath('userData'), 'tasks.json');
  try {
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error("Error writing tasks file:", error);
  }
}

ipcMain.on('save-tasks', (event, tasks) => {
  writeTasksToFile(tasks);
  // syncTasksWithMongoDB();
});

ipcMain.on('load-tasks', (event) => {
  event.reply('tasks-loaded', readTasksFromFile());
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
