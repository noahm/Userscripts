// ==UserScript==
// @name        Github: Back button's back, all right!
// @namespace   http://github.com/carols10cents/github-back-button
// @description Restores the functionality of the back button on github pull requests when navigating to the commits/files tabs.
// @include     http://github.com/*
// @include     https://github.com/*
// @include     http://www.github.com/*
// @include     https://www.github.com/*
// @version     1.1
// @grant       none
// ==/UserScript==

$(".js-pull-request-tab").removeClass("js-pull-request-tab");
// Fix pjax loads
$(window).on('pjax:end', function(e) {
    $(".js-pull-request-tab").removeClass("js-pull-request-tab");
});
