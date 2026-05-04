const { contextBridge } = require('electron')

// Expose safe APIs to the renderer (React app)
// We'll expand this as we add features per layer
contextBridge.exposeInMainWorld('mycelium', {
    version: '0.1.0',
    platform: process.platform,
})