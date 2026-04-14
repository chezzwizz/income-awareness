// Minimal storage usage (works in Chrome/Firefox/Opera/Safari extension popups)
const $ = id => document.getElementById(id);

const storageGet = (keys, cb) => {
	try {
		if (typeof chrome !== 'undefined' && chrome.storage) {
			chrome.storage.local.get(keys, cb);
		} else {
			const result = {};
			keys.forEach(k => { result[k] = localStorage.getItem(k); });
			cb(result);
		}
	} catch (e) { cb({}); }
};

const storageSet = (obj, cb) => {
	try {
		if (typeof chrome !== 'undefined' && chrome.storage) {
			chrome.storage.local.set(obj, cb);
		} else {
			Object.keys(obj).forEach(k => localStorage.setItem(k, obj[k]));
			cb && cb();
		}
	} catch (e) { cb && cb(); }
};

document.addEventListener('DOMContentLoaded', () => {
	const form = $('income-form');
	storageGet(['annual','monthly','hourly'], items => {
		if (items.annual) $('annual').value = items.annual;
		if (items.monthly) $('monthly').value = items.monthly;
		if (items.hourly) $('hourly').value = items.hourly;
	});

	form.addEventListener('submit', e => {
		e.preventDefault();
		const annual = $('annual').value || '';
		const monthly = $('monthly').value || '';
		const hourly = $('hourly').value || '';
		storageSet({ annual, monthly, hourly }, () => {
			$('status').textContent = 'Saved';
			setTimeout(()=> $('status').textContent = '', 1500);
		});
	});

	$('clear').addEventListener('click', () => {
		storageSet({ annual: '', monthly: '', hourly: '' }, () => {
			$('annual').value = $('monthly').value = $('hourly').value = '';
			$('status').textContent = 'Cleared';
			setTimeout(()=> $('status').textContent = '', 1000);
		});
	});
});
