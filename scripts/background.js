var options;

function _update() {
	if(options.url.slice(-1) === '/') {
		options.url = options.url.slice(0, -1);
	}
	$.ajax({
		async: true,
		cache: false,
		dataType: 'json',
		error: function(jqXHR, textStatus, errorThrown) {
			title = 'URL error';
			badgeText = '!';
			colorCode = 'orange'
			setBrowserAction(title, badgeText, colorCode);
		},
		success: function(data, textStatus, jqXHR) {
			if(data.logged) {
				if(data.unread > 0) {
					title = 'You have ' + data.unread + ' unread items';
					colorCode = 'green'
				} else {
					title = 'You have no unread items';
					colorCode = 'gray'
				}
				if(data.unread > 99) {
					badgeText = '99+';
				} else {
					badgeText = data.unread;
				}
			} else {
				title = 'You are not connected';
				badgeText = '!';
				colorCode = 'yellow'
			}
			setBrowserAction(title, badgeText, colorCode);
		},
		type: 'GET',
		url: options.url + '/extension/background'
	});
}
$(document).ready(function() {
	chrome.storage.local.get(null, function(cfg) {
		if(cfg) {
			options = cfg;

			chrome.alarms.create({periodInMinutes: 1});
			chrome.alarms.onAlarm.addListener(_update);

			if(options.url) {
				_update();
			} else {
				title = 'Set your URL';
				badgeText = '!';
				colorCode = 'red'
				setBrowserAction(title, badgeText, colorCode);
			}

			chrome.browserAction.onClicked.addListener(function() {
				if(options.url) {
					_update();
					chrome.tabs.create({ url: options.url });
				} else {
					chrome.tabs.create({ url: '/application/views/options.html' });
				}
			});
		}
	});
});
