// ==UserScript==
// @namespace       gamerswithjobs
// @name            GWJ Spoiler Toggle Button
// @description     Adds a button to the top of each thread page to toggle all spoiler tags
// @version         1.0
// @author          Noah Manneschmidt
// @match           https://www.gamerswithjobs.com/node/*
// @grant           none
// @run-at          document-end
// @updateURL       https://github.com/noahm/Userscripts/raw/master/gwj/GWJtoggleSpoilers.user.js
// ==/UserScript==
(function() {
var li;
var toggled = false;

function toggle(e) {
	e.preventDefault();
	toggled = !toggled;
	li.style.transform = toggled ? 'rotateY(180deg)' : '';
	document.querySelectorAll('.quote.spoiler').forEach(div => {
		div.classList.toggle('spoiler-shown');
	});
}

var list = document.querySelector('ul.tabs.primary');
if (!list) {
	// Handle complete lack of tabs if user is logged out
	var tabsContainer = document.querySelector('div.tabs-actions');
	if (tabsContainer) {
		var tabs = document.createElement('div');
		tabs.classList.add('tabs-primary');
		tabs.innerHTML = '<ul class="tabs primary"></ul>';
		tabsContainer.appendChild(tabs);
		list = tabs.querySelector('ul');
	}
}
if (list) {
	// insert the new tab
	li = document.createElement('li');
	li.innerHTML = '<span><a href="#" title="Toggle All Spoilers">§</a></span>';
	li.style.display = 'inline-block';
	li.style.transition = 'transform 0.4s cubic-bezier(.77,.01,.41,1.81) 0s';
	li.querySelector('a').addEventListener('click', toggle);
	list.insertBefore(li, list.children[0]);
}

})();
