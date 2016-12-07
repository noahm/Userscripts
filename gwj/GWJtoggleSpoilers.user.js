// ==UserScript==
// @namespace       gamerswithjobs
// @name            GWJ Spoiler Toggle Button
// @description     Adds a button to the top of each thread page to toggle all spoiler tags
// @version         1.0
// @author          Noah Manneschmidt
// @match           https://www.gamerswithjobs.com/node/*
// @grant           none
// @run-at          document-end
// ==/UserScript==
(function() {
var li;
var toggled = false;

function toggle() {
	toggled = !toggled;
	if (toggled) {
		li.style.transform = 'rotateY(180deg)';
	} else {
		li.style.transform = '';
	}
	document.querySelectorAll('.quote.spoiler').forEach(div => {
		div.classList.toggle('spoiler-shown');
	});
}

var list = document.querySelector('ul.tabs.primary');
if (!list) {
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
	li = document.createElement('li');
	li.innerHTML = '<span><a href="#" title="Toggle All Spoilers">§</a></span>';
	li.style.display = 'inline-block';
	li.style.transition = 'transform 0.4s cubic-bezier(.77,.01,.41,1.81) 0s';
	li.querySelector('a').addEventListener('click', toggle);
	list.insertBefore(li, list.children[0]);
}

})();
