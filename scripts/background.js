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
				if(data.unread > 999) {
					badgeText = '999+';
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
chrome.storage.local.get(null, function(cfg) {
	if(cfg) {
		options = cfg;

		chrome.alarms.create({periodInMinutes: 10});
		chrome.alarms.onAlarm.addListener(_update);

		if(options.saved_version) {
			saved_version_compare = options.saved_version;
		} else {
			saved_version_compare = '1.1';
		}

		var manifestData = chrome.app.getDetails();
		current_version = manifestData.version;
		chrome.storage.local.set( {'saved_version': current_version} );

		if(saved_version_compare != current_version) {
			var options_notification = {
				'type': 'basic',
				'title': 'Reader Self',
				'message': 'Updated to version ' + current_version,
				'iconUrl': '/medias/readerself_48x48.png'
			};
			chrome.notifications.create(current_version, options_notification, function() {
			});
		}

		if(options.url) {
			chrome.extension.onRequest.addListener(function(request, sender) {
				if(request.msg == 'refresh_from_content') {
					_update();
				}
			});
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
