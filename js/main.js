const websites = {};

let updateTimeout = -1;

class Monitoring {
	static init() {
		const DOMElt = document.querySelector('.module-monitoring table tbody');

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

		Monitoring.updateStates();
	}

	static updateStates() {
		for(const website in websites) {
			const element = document.getElementById('monitoring-' + website);

			Monitoring.writeStatusAsync(websites[website], element);
		}

		Monitoring.launchTimeout();
	}

	static async writeStatusAsync(url, element) {
		let error = false;
		try {
			const res = await fetch(url);

			// console.debug(res);
			if(res.status < 200 || res.status > 299) {
				error = true;
			}
		} catch(e) {
			error = true;
		}

		if(error) {
			element.style.color = 'red';
			element.innerText = 'KO';
		} else {
			element.style.color = 'green';
			element.innerText = 'OK';
		}
	}

	static launchTimeout() {
		clearTimeout(updateTimeout);
		updateTimeout = setTimeout(Monitoring.updateStates, 5*60*1000);
	}
}
window.addEventListener('load', Monitoring.init);
