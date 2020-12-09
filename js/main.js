class Monitoring {
	static init() {
		if(currentWindow !== 'index') {
			const DOMElt = document.querySelector('.main-monitoring table tbody');

			for(const website in remote.getGlobal('Monitoring').getWebsitesList()) {
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

		remote.getGlobal('Monitoring').setUpdateDisplay(Monitoring.updateDisplay);
	}

	static updateDisplay() {
		const websiteStatus = remote.getGlobal('Monitoring').getWebsitesStatus();

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
}
window.addEventListener('load', Monitoring.init);
