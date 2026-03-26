const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        title: 'Claude Code Desktop',
        icon: path.join(__dirname, 'icon.png'),
        backgroundColor: '#030712',
        titleBarStyle: 'hiddenInset',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'app', 'index.html'));

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

const menuTemplate = [
    {
        label: 'Claude Code',
        submenu: [
            { label: 'About Claude Code Desktop', role: 'about' },
            { type: 'separator' },
            { label: 'Preferences...', accelerator: 'CmdOrCtrl+,', click: () => {} },
            { type: 'separator' },
            { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'selectAll' }
        ]
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
            { type: 'separator' },
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    {
        label: 'Terminal',
        submenu: [
            { label: 'New Terminal', accelerator: 'CmdOrCtrl+Shift+`', click: () => {
                mainWindow.webContents.executeJavaScript('document.getElementById("input").focus()');
            }},
            { label: 'Clear Terminal', accelerator: 'CmdOrCtrl+K', click: () => {
                mainWindow.webContents.executeJavaScript('handleCommand("/clear")');
            }},
            { type: 'separator' },
            { label: 'Run Build', accelerator: 'CmdOrCtrl+B', click: () => {
                mainWindow.webContents.executeJavaScript('handleCommand("npm run build")');
            }}
        ]
    },
    {
        label: 'Help',
        submenu: [
            { label: 'Documentation', click: () => shell.openExternal('https://docs.anthropic.com') },
            { label: 'Report Issue', click: () => shell.openExternal('https://github.com/anthropics/claude-code/issues') },
            { type: 'separator' },
            { label: 'About', click: () => {
                mainWindow.webContents.executeJavaScript('handleCommand("/version")');
            }}
        ]
    }
];

app.whenReady().then(() => {
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
    createWindow();
});

app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
