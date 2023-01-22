let updateTimeout = -1;

const websiteStatus = {};

class Monitoring {
	static updateStates() {
		for(const website of Monitoring.getWebsitesList()) {
			Monitoring.writeStatusAsync(website);
		}

		Monitoring.launchTimeout();
	}

	static async writeStatusAsync(website) {
		websiteStatus[website.name] = false;

		try {
			const res = await fetch(website.url);
			if(res.status < 200 || res.status > 299) {
				websiteStatus[website.name] = false;
			} else {
				websiteStatus[website.name] = true;
			}
		} catch(e) {
			websiteStatus[website.name] = false;
		}

		for(const currWindow of BrowserWindow.getAllWindows()) {
			currWindow.webContents.send('Monitoring-updateDisplay');
		}
	}

	static launchTimeout() {
		clearTimeout(updateTimeout);
		updateTimeout = setTimeout(Monitoring.updateStates, 5*60*1000);
	}

	static getWebsitesList() {
		return ConfigManager.get('monitoring', 'urls');
	}

	static getWebsitesStatus() {
		return websiteStatus;
	}
}

Monitoring.updateStates();

ipcMain.handle('Monitoring-getWebsitesList', () => Monitoring.getWebsitesList());
ipcMain.handle('Monitoring-getWebsitesStatus', () => Monitoring.getWebsitesStatus());