// The App's settings
import * as os from 'os';
import * as fs from 'fs';

interface AppSettings {
    recentlyUsed: string[];
}

// Settings stored here 
const file = `${os.homedir()}/.t2wml/gui-settings.json`;

class Settings implements AppSettings {
    recentlyUsed: string[] = [];

    constructor() {
        try {
            const content = fs.readFileSync(file, {encoding: 'utf8'});
            if (content) {
                const contentObj: any = JSON.parse(content);
                this.recentlyUsed = contentObj.recentlyUsed || [];
            }
        } catch {
            // If the file doen't exist, don't change the defaults
        }
    }

    saveSettings() {
        fs.writeFileSync(file, JSON.stringify({recentlyUsed: this.recentlyUsed}));
    }

    addRecentlyUsed(folder: string) {
        const index = this.recentlyUsed.indexOf(folder);
        if (index > -1) {
            this.recentlyUsed.splice(index, 1);
        }
        this.recentlyUsed.unshift(folder);

        this.saveSettings();
    }
}

export default Settings;