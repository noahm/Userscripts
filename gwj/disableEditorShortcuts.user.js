// ==UserScript==
// @name        Disable GWJ editor keyboard shortcuts
// @description Avoids frustration while composing a post
// @author      Noah Manneschmidt
// @namespace   gamerswithjobs
// @include     https://www.gamerswithjobs.com/*
// @version     1.1
// @grant       none
// @updateURL   https://github.com/noahm/Userscripts/raw/master/gwj/disableEditorShortcuts.user.js
// ==/UserScript==

setTimeout(function() {
	jQuery('.markItUpEditor').unbind('keydown.markItUp');
}, 5000);
