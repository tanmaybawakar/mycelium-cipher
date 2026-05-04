const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron')
const path = require('path')
const { spawn } = require('child_process')

let mainWindow = null
let tray = null
let paperclipServer = null

// ─── Start Paperclip's backend ───────────────────────────────────────────────
function startPaperclipServer() {
    console.log('[Mycelium] Starting Paperclip engine...')

    paperclipServer = spawn('node', ['server/dist/index.js'], {
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe',
        env: { ...process.env, NODE_ENV: 'production' }
    })

    paperclipServer.stdout.on('data', (data) => {
        console.log(`[Engine] ${data.toString().trim()}`)
    })

    paperclipServer.stderr.on('data', (data) => {
        console.error(`[Engine Error] ${data.toString().trim()}`)
    })

    paperclipServer.on('exit', (code) => {
        console.log(`[Engine] Stopped with code ${code}`)
    })
}

// ─── Main window ─────────────────────────────────────────────────────────────
function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1100,
        minHeight: 700,
        titleBarStyle: 'hiddenInset',
        vibrancy: 'under-window',
        backgroundColor: '#343E40',
        show: false,                    // don't flash before ready
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        title: 'Mycelium Cipher'
    })

    // Dev: load from Vite. Prod: load built file
    const isDev = process.env.NODE_ENV === 'development'

    if (isDev) {
        mainWindow.loadURL('http://localhost:3100')
        mainWindow.webContents.openDevTools({ mode: 'detach' })
    } else {
        mainWindow.loadFile(path.join(__dirname, '../client/dist/index.html'))
    }

    // Show window only when fully ready — no white flash
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
        mainWindow.focus()
    })

    // When user closes window, hide to tray instead of quitting
    mainWindow.on('close', (event) => {
        if (!app.isQuitting) {
            event.preventDefault()
            mainWindow.hide()
        }
    })

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

// ─── Menu bar tray ───────────────────────────────────────────────────────────
function createTray() {
    // Placeholder icon — replace with real asset later
    const iconPath = path.join(__dirname, 'assets', 'tray-icon.png')
    let icon

    try {
        icon = nativeImage.createFromPath(iconPath)
        // Resize to correct menu bar size
        icon = icon.resize({ width: 18, height: 18 })
    } catch (e) {
        // If icon missing, create empty image so app still boots
        icon = nativeImage.createEmpty()
    }

    tray = new Tray(icon)
    tray.setToolTip('Mycelium Cipher')

    buildTrayMenu({ agents: 0, missions: 'None running' })

    // Left click opens window
    tray.on('click', () => {
        if (mainWindow) {
            if (mainWindow.isVisible()) {
                mainWindow.focus()
            } else {
                mainWindow.show()
                mainWindow.focus()
            }
        } else {
            createMainWindow()
        }
    })
}

function buildTrayMenu({ agents, missions }) {
    const menu = Menu.buildFromTemplate([
        {
            label: 'Mycelium Cipher',
            enabled: false,
            // Makes it a title row, not clickable
        },
        { type: 'separator' },
        {
            label: `${agents} agent${agents === 1 ? '' : 's'} active`,
            enabled: false
        },
        {
            label: missions === 'None running' ? 'No missions running' : `Mission: ${missions}`,
            enabled: false
        },
        { type: 'separator' },
        {
            label: 'Open Mycelium Cipher',
            accelerator: 'CmdOrCtrl+Shift+M',
            click: () => {
                if (mainWindow) {
                    mainWindow.show()
                    mainWindow.focus()
                } else {
                    createMainWindow()
                }
            }
        },
        { type: 'separator' },
        {
            label: 'Quit',
            accelerator: 'CmdOrCtrl+Q',
            click: () => {
                app.isQuitting = true
                app.quit()
            }
        }
    ])

    tray.setContextMenu(menu)
}

// ─── App lifecycle ────────────────────────────────────────────────────────────
app.whenReady().then(() => {
    // In dev, skip starting the server (you run it manually with pnpm dev:server)
    if (process.env.NODE_ENV !== 'development') {
        startPaperclipServer()
    }

    createMainWindow()
    createTray()

    // macOS: re-create window if dock icon clicked and no windows open
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow()
        }
    })
})

// Keep app alive in menu bar even if all windows are closed
app.on('window-all-closed', () => {
    // Do NOT quit on macOS — live in menu bar
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// Clean up backend process on quit
app.on('before-quit', () => {
    app.isQuitting = true
    if (paperclipServer) {
        paperclipServer.kill('SIGTERM')
    }
})