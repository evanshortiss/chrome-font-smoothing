'use strict';

function onHostsContentLoaded (hostConfigurations) {
  var hostData = hostConfigurations[window.location.hostname];

  if (!hostData) {
    // If no setting exists for the host just apply the default
    document.body.style.webkitFontSmoothing = 'antialiased';
  } else if (hostData.enabled) {
    document.body.style.webkitFontSmoothing = hostData.style || 'antialiased';
  }
}

// When the script initially loads we want to apply settings
chrome.storage.sync.get(onHostsContentLoaded);

// Register a listener so that changes made using the popup can be applied
chrome.runtime.onMessage.addListener(function(request/*, sender, sr*/) {
  if (request.type === 'update') {
    chrome.storage.sync.get(onHostsContentLoaded);
  }
});
