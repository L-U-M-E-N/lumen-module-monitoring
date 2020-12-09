const fetch = require('node-fetch');

let updateTimeout = -1;

const websites = {};

const websiteStatus = {};

class Monitoring {
	static updateStates() {
		for(const website in websites) {
			Monitoring.writeStatusAsync(website);
		}

		Monitoring.launchTimeout();
	}

	static async writeStatusAsync(website) {
		websiteStatus[website] = false;

		try {
			const res = await fetch(websites[website]);
			if(res.status < 200 || res.status > 299) {
				websiteStatus[website] = false;
			} else {
				websiteStatus[website] = true;
			}
		} catch(e) {
			websiteStatus[website] = false;
		}

		if(Monitoring.updateDisplay) {
			Monitoring.updateDisplay();
		}
	}

	static setUpdateDisplay(callback) {
		Monitoring.updateDisplay = callback;

		Monitoring.updateStates();
	}

	static launchTimeout() {
		clearTimeout(updateTimeout);
		updateTimeout = setTimeout(Monitoring.updateStates, 5*60*1000);
	}

	static getWebsitesList() {
		return websites;
	}

	static getWebsitesStatus() {
		return websiteStatus;
	}
}

Monitoring.updateStates();

global.Monitoring = Monitoring;