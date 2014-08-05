// ==UserScript==
// @author      Noah Manneschmidt
// @name        Hipchat Hiding System Messages
// @namespace   net.manneschmidt.noah
// @description Adds a new option to hide system messages (integrated 3rd party services)
// @match       https://*.hipchat.com/chat
// @version     1
// @grant       none
// ==/UserScript==

var displaySystemRow = $('<tr><td><input id="settings_displaysystem" type="checkbox" checked="checked"><td><label for="settings_displaysystem">Display system messages (3rd party services)</label></tr>');
var displaySystemInput = displaySystemRow.find('input');
var stylesheet = $('<style>').text('#chats div.systemMessage { display: none; }');

// add checkbox to settings
$('#settings table.form tbody').append(displaySystemRow);

displaySystemInput.change(function(){
  if (!$(this).attr('checked')) {
    $(document.head).append(stylesheet);
  } else {
    stylesheet.detach();
  }
});
