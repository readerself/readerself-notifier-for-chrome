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
			title = 'Connection error';
			badgeText = '!';
			chrome.browserAction.setTitle({ title: title });
			chrome.browserAction.setBadgeText({ text: badgeText });
		},
		success: function(data, textStatus, jqXHR) {
			if(data.logged) {
				if(data.unread > 0) {
					title = 'You have ' + data.unread + ' unread items';
				} else {
					title = 'You have no unread items';
				}
				if(data.unread > 99) {
					badgeText = '99+';
				} else {
					badgeText = data.unread;
				}
			} else {
				title = 'You are not connected';
				badgeText = '!';
			}
			chrome.browserAction.setTitle({ title: title });
			chrome.browserAction.setBadgeText({ text: badgeText });
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
			chrome.browserAction.onClicked.addListener(function() {
				if(options.url != '') {
					_update();
					chrome.tabs.create({ url: options.url });
				} else {
					chrome.tabs.create({ url: '/application/views/options.html' });
				}
			});
			_update();
		} else {
			chrome.tabs.create({ url: '/application/views/options.html' });
		}
	});
});
