// Hologram - Preload Script
// Exposes safe APIs to the renderer process

const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('hologram', {
  // API will be exposed here as we build
  version: '0.1.0-alpha',
});

