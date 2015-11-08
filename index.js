var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");
var tabs = require("sdk/tabs");
var user = '';

var button = ToggleButton({
  id: "my-button",
  label: "my button",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onChange: handleChange
});

var panel = panels.Panel({
  width:220,
  height:300,
  contentURL: self.data.url("text-entry.html"),
  contentScriptFile: [self.data.url("jquery1.7.2.js"),self.data.url("get-text.js")],
  onHide: handleHide
});

function handleChange(state) {
  if (state.checked) {
    panel.show({
      position: button
    });
    panel.port.emit("show",user);
    
  }
}

panel.port.on("authorised",function(data){
  user=data;
  });

panel.port.on("redirect_to_repo",function(){
  tabs.open("https://github.com/mbad0la/MiniGithub");
  });

function handleHide() {
  button.state('window', {checked: false});
}