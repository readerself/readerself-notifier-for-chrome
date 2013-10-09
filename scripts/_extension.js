var colors = {'red': '#FF3366', 'orange': '#FF9900', 'yellow': '#FFDE00', 'green': '#66CC00', 'gray': '#CCCCCC'};

function setBrowserAction(title, badgeText, colorCode) {
	chrome.browserAction.setTitle({ title: title });
	chrome.browserAction.setBadgeText({ text: badgeText });
	chrome.browserAction.setBadgeBackgroundColor({ color: colors[colorCode] });
}
