// ==UserScript==
// @namespace    gamerswithjobs
// @name         I Didn't Hear Anything
// @description  Increases the number of potential Tannhauserings
// @version      1.3.1
// @match        http://www.gamerswithjobs.com/node/*
// @grant        none
// @run-at       document-end
// @author       Chris Doggett, Noah Manneschmidt
// ==/UserScript==

/**
 * Usage:
 * Adds an ignore or unignore link at the bottom of every post.
 */

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

// the list of ignored users
var ignoreList = {
	storeKey: 'ignoredUsers',
	members: [],
	contains: function(username) {
		return ignoreList.members.indexOf(username) > -1;
	},
	add: function(username) {
		if (!ignoreList.contains(username)) {
			ignoreList.members.push(username);
			store.set(ignoreList.storeKey, ignoreList.members);
		}
	},
	remove: function(username) {
		ignoreList.members = ignoreList.members.filter(function(e){return e !== username});
		store.set(ignoreList.storeKey, ignoreList.members);
	}
};
ignoreList.members = store.get(ignoreList.storeKey, []);

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

// from http://userscripts.org/guides/46
function forEach(lst, cb) {
	if(!lst)
		return;
	if (lst.snapshotItem)
		for (var i = 0, len = lst.snapshotLength,
				 snp = lst.snapshotItem; i < len; ++i)
			cb(snp(i), i, lst);
	else if (lst.iterateNext) {
		var item, next = lst.iterateNext;
		while (item = next())
			cb(item, lst);
	} else if (typeof lst.length != 'undefined')
		for (var i = 0, len = lst.length; i < len; ++i)
			cb(lst[i], i, lst);
	else if (typeof lst == "object")
		for (var i in lst)
			cb(lst[i], i, lst);
}

function unhide() {
	this.parentElement.nextSibling.style.display = 'block';
	this.parentElement.remove();
}

// Setup elements for cloning
var unhideCommentEl = document.createElement('div');
unhideCommentEl.className = 'links';
unhideCommentEl.innerHTML = '<a class="gwj_unignore" href="javascript:void(0);">Did <span class="username"></span> Tannhauser me?</a>';
var unhideQuoteEl = document.createElement('span');
unhideQuoteEl.className = 'links bb-quote-user';
unhideQuoteEl.innerHTML = ' <a class="gwj_unignore_quote" href="javascript:void(0);">Really need to see some context?</a>';

var style = document.createElement('style');
style.innerHTML = 'a.gwj_unignore { font-weight: bold; }';
$('head').appendChild(style);

// hides all content on the page for a given username
function hideUserContent(name) {
	// hide posts
	forEach($$("div.author-name a"), function(el) {
		if (el.textContent !== name) return;
		var comment = el.parentElement.parentElement.parentElement,
			hideBlock = unhideCommentEl.cloneNode(true);
		$('.username', hideBlock).textContent = name;
		comment.style.display = 'none';
		comment.parentElement.insertBefore(hideBlock, comment);
		$('a', hideBlock).addEventListener('click', unhide);
	});

	// hide quotes
	forEach($$("div.content span.bb-quote-user"), function(el) {
		if (!el.textContent.match(name)) return; // match operates like .startsWith()
		var quote = el.nextSibling,
			hideBlock = unhideQuoteEl.cloneNode(true);
		quote.style.display = 'none';
		quote.parentElement.insertBefore(hideBlock, quote);
		$('a', hideBlock).addEventListener('click', unhide);
	});
}

// loop over all currently ignored users
forEach(ignoreList.members, hideUserContent);

// create controls for ignoring and unignoring on this page
function toggleUserIgnore() {
	var username = this.parentElement.parentElement.parentElement.parentElement.querySelector('div.author-name a').text;
	if (ignoreList.contains(username)) {
		ignoreList.remove(username);
		this.parentElement.parentElement.removeChild(this.parentElement);
		if (confirm('Reload the page to show all posts from '+username+'?')) {
			document.location.reload();
		}
	} else {
		ignoreList.add(username);
		hideUserContent(username);
		this.innerHTML = 'unignore';
	}
}

var ignorePosterItem = document.createElement('li');
ignorePosterItem.innerHTML = '<a href="javascript:void(0);"></a>';

// add ignore buttons to all posts
forEach($$('div.comment ul.links'), function(el) {
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
});
