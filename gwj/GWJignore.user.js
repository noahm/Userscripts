// ==UserScript==
// @namespace    gamerswithjobs
// @name         I Didn't Hear Anything
// @description  Increases the number of potential Tannhauserings
// @version      1.4.1
// @match        http://www.gamerswithjobs.com/node/*
// @grant        none
// @author       Chris Doggett, Noah Manneschmidt
// @updateURL    https://github.com/noahm/Userscripts/raw/master/gwj/GWJignore.user.js
// ==/UserScript==

/**
 * Usage:
 * Adds an ignore or unignore link at the bottom of every post. Click to add/remove the post's author to your ignore list.
 */
(function(){

'use strict';
// quick 'n dirty localStorage wrapper with JSON serialization
var store = {
	set: function(key, val) {
		window.localStorage.setItem(key, store.serialize(val));
	},
	get: function(key, def) {
		return store.deserialize(window.localStorage.getItem(key), def);
	},
	serialize: function(value) {
		return JSON.stringify(value);
	},
	deserialize: function(value, def) {
		if (typeof value !== 'string' || value === 'undefined') {
			return def;
		}
		return JSON.parse(value);
	}
};

// the list of ignored and evaporated users
var ignoreList = {
	storeKey: 'ignoredUsers',
	members: [],
	vaporizeKey: 'vaporizedUsers',
	vaporize: [],
	init: function() {
		ignoreList.members = store.get(ignoreList.storeKey, []);
		ignoreList.vaporize = store.get(ignoreList.vaporizeKey, []);
	},
	contains: function(username) {
		return ignoreList.members.indexOf(username) > -1;
	},
	vaporized: function(username) {
		return ignoreList.vaporize.indexOf(username) > -1;
	},
	add: function(username, evap) {
		if (typeof(evap)==='undefined') {
			evap = false;
		}
		if (!ignoreList.contains(username)) {
			ignoreList.members.push(username);
			store.set(ignoreList.storeKey, ignoreList.members);
		}
		if (evap && !ignoreList.vaporized(username)) {
			ignoreList.vaporize.push(username);
			store.set(ignoreList.vaporizeKey, ignoreList.vaporize);
		}
	},
	remove: function(username) {
		ignoreList.members = ignoreList.members.filter(function(e){return e !== username});
		ignoreList.vaporize = ignoreList.vaporize.filter(function(e){return e !== username});
		store.set(ignoreList.storeKey, ignoreList.members);
		store.set(ignoreList.evaporateKey, ignoreList.vaporize);
	}
};

// from https://developer.mozilla.org/en-US/docs/Code_snippets/QuerySelector
// select a single element
function $ (selector, el) {
	if (!el) {el = document;}
	return el.querySelector(selector);
}
// select an array of elements
function $$ (selector, el) {
	if (!el) {el = document;}
	//return el.querySelectorAll(selector);
	// Note: the returned object is a NodeList.
	// If you'd like to convert it to a Array for convenience, use this instead:
	return Array.prototype.slice.call(el.querySelectorAll(selector));
}

// simple recursive search for a particular parent
function firstParentMatching(element, className) {
	if (element.parentElement === null) {
		return;
	}
	if (element.parentElement.classList.contains(className)) {
		return element.parentElement;
	}
	return firstParentMatching(element.parentElement, className);
}

// from http://userscripts.org/guides/46
function forEach(lst, cb) {
	var i, len;
	if(!lst)
		return;
	if (lst.snapshotItem) {
		for (i = 0, len = lst.snapshotLength, snp = lst.snapshotItem; i < len; ++i)
			cb(snp(i), i, lst);
	} else if (lst.iterateNext) {
		var item, next = lst.iterateNext;
		while (item = next())
			cb(item, lst);
	} else if (typeof lst.length != 'undefined') {
		for (i = 0, len = lst.length; i < len; ++i)
			cb(lst[i], i, lst);
	} else if (typeof lst == "object") {
		for (i in lst)
			cb(lst[i], i, lst);
	}
}

/**
 * Hides an element and inserts a placeholder element before it,
 * attaching the unhide function to an anchor found in the placeholder
 *
 * @var element     the element in the document to hide
 * @var placeholder the element containing an anchor to be displayed instead
 */
function hide(element, placeholder) {
	var unhideLink = $('a', placeholder);
	if (typeof element == 'undefined') {
		return;
	}
	if (unhideLink) {
		unhideLink.addEventListener('click', unhide);
	}
	element.style.display = 'none';
	element.parentElement.insertBefore(placeholder, element);
}

function unhide() {
	this.parentElement.nextSibling.style.display = 'block';
	this.parentElement.remove();
}

// Setup placeholder elements for cloning
var unhideCommentEl = document.createElement('div');
unhideCommentEl.className = 'links ignore-placeholder';
unhideCommentEl.innerHTML = '<a class="gwj_unignore" href="javascript:void(0);">Did <span class="username"></span> Tannhauser me?</a>';
var unhideQuoteEl = document.createElement('span');
unhideQuoteEl.className = 'links bb-quote-user ignore-placeholder';
unhideQuoteEl.innerHTML = ' <a class="gwj_unignore_quote" href="javascript:void(0);">Really need to see some context?</a>';
var vaporizedCommentEl = document.createElement('div');
vaporizedCommentEl.className = 'links ignore-placeholder';
vaporizedCommentEl.innerHTML = 'This post quoted <span class="username"></span> and has been summarily vaporized.';

// insert a brief stylesheet for our created elements
var style = document.createElement('style');
style.innerHTML = '.ignore-placeholder { font-weight: bold; } div.ignore-placeholder { margin: 1em; }';

// hides all content on the page for a given username
function hideUserContent(name) {
	var placeholder, comment;

	// hide posts
	forEach($$("div.author-name a"), function(el) {
		if (el.textContent !== name) return;
		placeholder = unhideCommentEl.cloneNode(true);
		$('.username', placeholder).textContent = name;
		hide(firstParentMatching(el, 'comment'), placeholder);
	});

	if (ignoreList.vaporized(name)) {
		// hide quotes
		forEach($$("div.content span.bb-quote-user"), function(el) {
			if (!el.textContent.match(name)) return; // match operates like .startsWith()
			// hide parent post if not written by the vaporized user
			comment = firstParentMatching(el, 'comment');
			if ($('div.author-name a', comment).text !== name) {
				placeholder = vaporizedCommentEl.cloneNode(true);
				$('.username', placeholder).textContent = name;
				hide(comment, placeholder);
			}// else this will already have been hidden by the previous post search
		});
	} else {
		// just hide the quotes
		forEach($$("div.content span.bb-quote-user"), function(el) {
			if (!el.textContent.match(name)) return; // match operates like .startsWith()
			hide(el.nextSibling, unhideQuoteEl.cloneNode(true));
		});
	}
}

// create controls for ignoring and unignoring on this page
function toggleUserIgnore() {
	var username = firstParentMatching(this, 'comment').querySelector('div.author-name a').text;
	if (ignoreList.contains(username)) {
		ignoreList.remove(username);
		this.parentElement.parentElement.removeChild(this.parentElement);
		if (confirm('Reload the page to show all posts from '+username+'?')) {
			document.location.reload();
		}
	} else {
		ignoreList.add(username, confirm(
			"Click OK to adopt a zero tolerance policy. (If you accept, all posts with any quotes attributing "+username+" will also be hidden.)"
		));
		hideUserContent(username);
		this.innerHTML = 'unignore';
	}
}

var ignorePosterItem = document.createElement('li');
ignorePosterItem.innerHTML = '<a href="javascript:void(0);"></a>';

// inserts the ignore/unignore link into a ul.links element
function addIgnoreLink(el) {
	var listItem = ignorePosterItem.cloneNode(true);
	el.appendChild(listItem);
	var link = $('a', listItem);
	var username = el.parentElement.parentElement.querySelector('div.author-name a').text;
	link.addEventListener('click', toggleUserIgnore);
	if (ignoreList.contains(username)) {
		link.innerHTML = 'unignore';
	} else {
		link.innerHTML = 'ignore';
	}
}

function goTime() {
	ignoreList.init();

	// add our stylesheet
	$('head').appendChild(style);

	// loop over all currently ignored users
	forEach(ignoreList.members, hideUserContent);

	// add ignore buttons to all posts
	forEach($$('div.comment ul.links'), addIgnoreLink);
}

if (document.readyState === 'loading') {
	document.addEventListener("DOMContentLoaded", goTime);
} else {
	goTime();
}

})();
