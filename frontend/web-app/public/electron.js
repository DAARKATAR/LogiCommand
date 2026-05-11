import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import path from 'path';
import url from 'url';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import pkg from 'electron-updater';
const { autoUpdater } = pkg;

// Recrear __dirname para Módulos de ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let backendProcess;
let osrmProcess;

// Configuración de actualizaciones
autoUpdater.autoDownload = false; // Queremos preguntar antes de descargar

function startBackend() {
    const jarPath = app.isPackaged 
        ? path.join(process.resourcesPath, 'public', 'backend', 'server.jar')
        : path.join(__dirname, 'backend', 'server.jar');

    backendProcess = spawn('java', ['-jar', jarPath]);
}

function startOsrm() {
    // Solo arranca si encontramos el binario en la carpeta de mapas
    const osrmBinary = app.isPackaged
        ? path.join(process.resourcesPath, 'public', 'maps', 'osrm-routed.exe')
        : path.join(__dirname, 'maps', 'osrm-routed.exe');
    
    const mapData = app.isPackaged
        ? path.join(process.resourcesPath, 'public', 'maps', 'colombia.osrm')
        : path.join(__dirname, 'maps', 'colombia.osrm');

    // Aquí arrancaríamos OSRM si el archivo existe. 
    // Por ahora solo preparamos la infraestructura.
    console.log("Preparado para iniciar OSRM desde:", osrmBinary);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "LogiCommand | Executive Logistics Center",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'favicon.ico')
  });

  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../dist/index.html'),
    protocol: 'file:',
    slashes: true
  });

  mainWindow.loadURL(startUrl);
  mainWindow.setMenuBarVisibility(false);

  // Lógica de actualizaciones
  autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
      type: 'info',
      title: 'Actualización Disponible',
      message: 'Una nueva versión de LogiCommand está disponible. ¿Desea descargarla ahora?',
      buttons: ['Sí', 'Más tarde']
    }).then((result) => {
      if (result.response === 0) autoUpdater.downloadUpdate();
    });
  });

  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      type: 'info',
      title: 'Actualización Lista',
      message: 'La actualización se ha descargado. La aplicación se reiniciará para aplicar los cambios.',
      buttons: ['Reiniciar Ahora']
    }).then(() => {
      autoUpdater.quitAndInstall();
    });
  });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', () => {
    startBackend();
    startOsrm();
    createWindow();
    
    // Buscar actualizaciones al iniciar
    if (app.isPackaged) {
        autoUpdater.checkForUpdatesAndNotify();
    }
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
    if (backendProcess) backendProcess.kill();
    if (osrmProcess) osrmProcess.kill();
});
