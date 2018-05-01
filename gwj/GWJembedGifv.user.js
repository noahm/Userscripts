// ==UserScript==
// @name        GWJ: Embed imgur gifv files
// @description Upgrades the IMAGE() bbcode output to support gifv files from imgur
// @author      Noah Manneschmidt
// @namespace   gamerswithjobs
// @include     https://www.gamerswithjobs.com/*
// @version     1.0
// @grant       none
// @run-at      document-end
// @updateURL   https://github.com/noahm/Userscripts/raw/master/gwj/GWJembedGifv.user.js
// ==/UserScript==

(function() {
  'use strict';

  function replaceImgTag(img) {
    const v = document.createElement('video');
    v.autoplay = true;
    v.loop = true;
    v.style.maxHeight = '400px';
    v.style.maxWidth = '400px';
    v.src = img.src.replace(/\.gifv$/, '.mp4');
    const p = img.parentElement;
    if (!p) {
      return;
    }
    p.replaceChild(v, img);
  }

  for (const img of document.querySelectorAll('img[src$=".gifv"]')) {
    replaceImgTag(img);
  }

})();
