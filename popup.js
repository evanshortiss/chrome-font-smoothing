
var aliasingOptions = {
  'antialiased': 'antialiased',
  'regular': 'initial',
  'none': 'none'
};

var aliasingOptionsArray = Object.keys(window.aliasingOptions);


/**
 * Update the current tab styling
 * @return {undefined}
 */
function updateCurrentTab () {
  chrome.tabs.getSelected(null, function (tab) {
    chrome.tabs.sendMessage(tab.id, {type: 'update'});
  });
}

/**
 * Event handler for clicks on our options
 * @param  {Event}   evt
 * @return {Boolean}
 */
function onRadioClick (evt) {
  event.preventDefault();

  setCurrentHostAliasing(evt.target.value || evt.target.parentElement.value);

  return false;
}

/**
 * Generates the configuration for the current host and saves it.
 * @param {String} val The aliasing style to use
 */
function setCurrentHostAliasing (val) {
  getCurrentTabHost(function (host) {
    var data = {};

    data[host] = {
      enabled: true,
      style: val
    };

    chrome.storage.sync.set(data, function () {
      onHostsContentLoaded(data);
      updateCurrentTab(data);
    });
  });
}

/**
 * Get the hostname for the current tab
 * @param  {Function} callback
 * @return {undefined}
 */
function getCurrentTabHost (callback) {
  chrome.tabs.getSelected(null, function (tab) {
    callback(new URL(tab.url).hostname);
  });
}

/**
 * Updates the plugin UI
 * @param  {Object} data
 * @return {undefined}
 */
function onHostsContentLoaded (data) {
  getCurrentTabHost(function (host) {
    var hostData = data[host];

    // Bind event listeners for toggles
    document.querySelectorAll('.mdl-radio').forEach(function (el, idx) {
      var curOption = aliasingOptions[aliasingOptionsArray[idx]];

      if (hostData && hostData.style === curOption) {
        el.className += ' is-checked';
      } else if (!hostData && curOption === 'antialiased') {
        el.className += ' is-checked';
      } else {
        el.className = el.className.replace('is-checked');
      }

      el.value = curOption;
      el.onclick = onRadioClick;

      el.querySelector('span').innerHTML = aliasingOptionsArray[idx];
    });
  });
}

chrome.tabs.onUpdated.addListener(function () {
  setCurrentHostAliasing();
});

// Each time the extension is loaded we need to ensure it refreshes its UI
window.onload = function() {
  chrome.storage.sync.get(onHostsContentLoaded);
};
