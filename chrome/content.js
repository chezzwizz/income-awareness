// Very small placeholder: find simple currency-like patterns and append a parenthetical
(function injectSamplePercent() {
	if (window.__incomeAwarenessInjected) return;
	window.__incomeAwarenessInjected = true;

	// Simple regex: currencies like $12.34, €12, 12.34 USD
	const priceRegex = /(\p{Sc}\s?\d{1,3}(?:[,\d{3}]*)(?:\.\d+)?|\d+(?:\.\d+)?\s?(?:USD|EUR|GBP))/ugi;

	// Walk text nodes and replace with spans (non-destructive minimal approach)
	function walk(node) {
		if (!node) return;
		if (node.nodeType === Node.TEXT_NODE) {
			const txt = node.nodeValue;
			if (!txt) return;
			const match = priceRegex.exec(txt);
			priceRegex.lastIndex = 0; // reset
			if (match) {
				const span = document.createElement('span');
				span.className = 'ia-price-wrapper';
				const before = document.createTextNode(txt.slice(0, match.index));
				const matched = document.createElement('span');
				matched.className = 'ia-price';
				matched.textContent = match[0];
				const injected = document.createElement('span');
				injected.className = 'ia-percent';
				injected.textContent = ' (0.00% of income)'; // placeholder
				const after = document.createTextNode(txt.slice(match.index + match[0].length));
				span.appendChild(before);
				span.appendChild(matched);
				span.appendChild(injected);
				span.appendChild(after);
				node.parentNode.replaceChild(span, node);
			}
		} else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE' && !node.classList.contains('ia-price-wrapper')) {
			for (let i = 0; i < node.childNodes.length; i++) {
				walk(node.childNodes[i]);
			}
		}
	}

	// Run initial pass
	walk(document.body);

	// Observe DOM changes and apply the same injection on added nodes (very small, not production-ready)
	const obs = new MutationObserver(muts => {
		muts.forEach(m => {
			m.addedNodes.forEach(n => walk(n));
		});
	});
	obs.observe(document.body, { childList: true, subtree: true });

	// Lightweight styles to help visibility (user override via config later)
	const style = document.createElement('style');
	style.textContent = '.ia-percent{ color: #0366d6; font-style: italic; margin-left:2px; }';
	document.head && document.head.appendChild(style);
})();
