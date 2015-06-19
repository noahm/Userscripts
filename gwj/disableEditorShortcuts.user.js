// ==UserScript==
// @name        Disable GWJ editor keyboard shortcuts
// @description Avoids frustration while composing a post
// @author      Noah Manneschmidt
// @namespace   gamerswithjobs
// @include     http://www.gamerswithjobs.com/*
// @version     1.1
// @grant       none
// ==/UserScript==

setTimeout(function() {
	jQuery('.markItUpEditor').unbind('keydown.markItUp');
}, 5000);
