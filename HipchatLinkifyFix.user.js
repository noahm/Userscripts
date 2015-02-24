// ==UserScript==
// @author      Noah Manneschmidt
// @name        Hipchat Linkify Fix
// @namespace   net.manneschmidt.noah
// @description Correctly recognizes a colon (:) as a valid character in a URL
// @match       https://*.hipchat.com/chat
// @version     1
// @grant       none
// ==/UserScript==

linkify.RE_URL = linkify.RE_URL.replace(/(@!\$&'\*\+,;=)/, '$1:');
