var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");
var tabs = require("sdk/tabs");
var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");

var button = ToggleButton({
  id: "my-button",
  label: "miniGithub",
  icon: {
    "16": "./ghubicon.ico",
    "32": "./ghubicon.ico",
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

/*
pageMod.PageMod({
  include: "https://mbad0la.pythonanywhere.com/redirect?code=*",
  contentScriptFile: data.url("injectclose.js"),
  onAttach: function(worker) {
    worker.port.on("close_tab", function() {
      worker.tab.close();
    });
  }
});
*/



panel.port.on("redirect_to_repo",function(){
  tabs.open("https://github.com/mbad0la/MiniGithub");
  });
panel.port.on("redirect_to_github",function(){
  tabs.open("https://github.com");
  });

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

panel.port.on("gotoLink",function(data){
  tabs.open(data);
});
