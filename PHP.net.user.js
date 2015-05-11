// ==UserScript==
// @name         PHP.net - Restore quick search
// @namespace    net.manneschmidt.noah
// @description  Un-hooks the forward slash key
// @include      https://php.net/*
// @version      1
// @grant        none
// @updateURL    https://github.com/noahm/Userscripts/raw/master/PHP.net.user.js
// ==/UserScript==

Mousetrap.unbind('/');
