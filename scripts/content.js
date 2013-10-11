var url = window.location.href;

function refresh() {
	chrome.extension.sendRequest({'msg': 'refresh_from_content'});
}

chrome.storage.local.get(null, function(cfg) {
	if(cfg) {
		options = cfg;

		if(options.url) {
			if(url.indexOf(options.url) != -1) {
				setInterval('refresh()', 5000);
			}
		}
	}
});
