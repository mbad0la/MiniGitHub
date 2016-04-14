var { ToggleButton } = require('sdk/ui/button/toggle');
var Request = require("sdk/request").Request;
var panels = require("sdk/panel");
var self = require("sdk/self");
var tabs = require("sdk/tabs");
var data = require("sdk/self").data;
var base64 = require("sdk/base64");
var { setInterval } = require("sdk/timers");
var {Cc, Ci} = require("chrome");
var token = null;
var notify = null;

var button = ToggleButton({
  id: "my-button",
  label: "miniGithub",
  icon: {
    "16": "./ghubicon.ico",
    "32": "./ghubicon.ico",
    "64": "./icon-64.png"
  },
  badge: null,
  onChange: handleChange
});

var panel = panels.Panel({
  width: 220,
  height: 300,
  contentURL: self.data.url("addon.html"),
  contentScriptFile: [self.data.url("jquery-2.2.3.min.js"), self.data.url("script.js")],
  onHide: handleHide
});

var Services = Cc["@mozilla.org/cookiemanager;1"]
               .getService(Ci.nsICookieManager2);

var cookieStore = Services.getCookiesFromHost("minigithub");
while (cookieStore.hasMoreElements()) {
  var cookie = cookieStore.getNext();
  if (cookie instanceof Ci.nsICookie) {
    if (cookie.name == "minigithubcookie") {
      token = cookie.value.split("%")[1];
      break;
    }
  }
}

function handleHide() {
  button.state('window', {checked: false});
}

function handleChange(state) {
  if (state.checked) {
    panel.show({
      position: button
    });
    panel.port.emit("show");
  }
}

function updateBadge(response) {
  var resp = response.json;
  if (resp.length) {
    button.badge = resp.length;
  } else { button.badge = null; }
}

if (token) {
  notify = Request({
    url: "https://api.github.com/notifications",
    headers: {'Authorization': 'token ' + token, 'Accept': 'application/json', 'Content-Type': 'application/json'},
    onComplete: updateBadge
  });
  notify.get();
}

panel.port.on("linkNotifs", function() {
  if (token === null) {
    cookieStore = Services.getCookiesFromHost("minigithub");
    while (cookieStore.hasMoreElements()) {
      var cookie = cookieStore.getNext();
      if (cookie instanceof Ci.nsICookie) {
        if (cookie.name == "minigithubcookie") {
          token = decodeURIComponent((cookie.value));
          token = token.split("@")[1];
          break;
        }
      }
    }
    notify = Request({
      url: "https://api.github.com/notifications",
      headers: {'Authorization': 'token ' + token, 'Accept': 'application/json', 'Content-Type': 'application/json'},
      onComplete: updateBadge
    });
    notify.get();
  }
});
panel.port.on("redirect_to_repo", function() {
  tabs.open("https://github.com/mbad0la/MiniGithub");
});
panel.port.on("redirect_to_github", function() {
  tabs.open("https://github.com");
});
panel.port.on("gotoLink", function(data) {
  tabs.open(data);
});

setInterval(function() {
  if (token) {
    notify = Request({
      url: "https://api.github.com/notifications",
      headers: {'Authorization': 'token ' + token, 'Accept': 'application/json', 'Content-Type': 'application/json'},
      onComplete: updateBadge
    });
    notify.get();
  }
}, 60000);
