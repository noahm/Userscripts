// ==UserScript==
// @author      Noah Manneschmidt
// @name        Hipchat Long Idle
// @namespace   net.manneschmidt.noah
// @description Makes you stay "Available" in hipchat for 8 hours of inactivity instead of 5 minutes
// @match       https://*.hipchat.com/chat
// @version     1
// @grant       none
// ==/UserScript==

app.IDLE_DELAY_MS = 28800000; // 8 hrs in milliseconds
