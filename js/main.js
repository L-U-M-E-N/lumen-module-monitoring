const websites = {};

const websiteStatus = {

};

let updateTimeout = -1;

class Monitoring {
	static init() {
		if(currentWindow !== 'index') {
			const DOMElt = document.querySelector('.main-monitoring table tbody');

			for(const website in websites) {
				const tr = document.createElement('tr');

				const tdName = document.createElement('td');
				tdName.innerText = website;
				tr.append(tdName);

				const tdStatus = document.createElement('td');
				tdStatus.id = 'monitoring-' + website;
				tdStatus.innerText = '?';
				tr.append(tdStatus);

				DOMElt.append(tr);
			}
		} else {
			document.getElementById('module-monitoring-cicle-status').addEventListener('click', () => {
				document.getElementById('monitoring').click();
			});
		}

		Monitoring.updateStates();
	}

	static updateDisplay() {
		if(currentWindow === 'index') {
			const statusCircle = document.getElementById('module-monitoring-cicle-status');
			const statusMessage = document.getElementById('module-monitoring-statusMessage');
			if(Object.values(websiteStatus).every((e) => e)) {
				statusCircle.setAttribute('stroke', '#2ECC71');
				statusMessage.innerText = 'OK';
			} else {
				statusCircle.setAttribute('stroke', '#E74C3C');
				statusMessage.innerText = 'KO';
			}
		} else {
			const DOMElt = document.querySelector('.module-monitoring table tbody');

			for(const website in websiteStatus) {
				const element = document.getElementById('monitoring-' + website);

				if(websiteStatus[website]) {
					element.style.color = 'green';
					element.innerText = 'OK';
				} else {
					element.style.color = 'red';
					element.innerText = 'KO';
				}
			}
		}
	}

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

		Monitoring.updateDisplay();
	}

	static launchTimeout() {
		clearTimeout(updateTimeout);
		updateTimeout = setTimeout(Monitoring.updateStates, 5*60*1000);
	}
}
window.addEventListener('load', Monitoring.init);
