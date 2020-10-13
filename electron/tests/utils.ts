// Utilities for the Electron tests

import path from "path";
import { Application } from "spectron";

export function initializeSpectronApp() {
    let electronPath = path.join(__dirname, '../node_modules', '.bin', 'electron');
    if (process.platform === 'win32') {
        electronPath += '.cmd';
    }
    const appPath = path.join(__dirname, '..', 'dist');

    return new Application({
        path: electronPath,
        args: [appPath],
        env: {
            ELECTRON_ENABLE_LOGGING: true,
            ELECTRON_ENABLE_STACK_DUMPING: true,
        },
        startTimeout: 20000,
        chromeDriverLogPath: 'chrome-driver.log',
    });
}