// ==UserScript==
// @namespace    gamerswithjobs
// @name         GWJ Thread Ignore
// @description  Allows you to ignore individual threads
// @version      1.0
// @match        http://www.gamerswithjobs.com/tracker*
// @match        http://www.gamerswithjobs.com/forum/*
// @grant        none
// @run-at       document-end
// @author       Noah Manneschmidt
// ==/UserScript==

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

// the list of ignored threads
var ignoreList = {
	storeKey: 'ignoredThreads',
	members: [],
	contains: function(id) {
		return ignoreList.members.indexOf(id) > -1;
	},
	add: function(id) {
		if (!ignoreList.contains(id)) {
			ignoreList.members.push(id);
			store.set(ignoreList.storeKey, ignoreList.members);
		}
	},
	remove: function(id) {
		ignoreList.members = ignoreList.members.filter(function(e){return e !== id});
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

function idFromTableRow(row) {
	return $('.topic > a', row).href.match(/\/node\/(\d+)$/)[1];
}

function toggleThreadIgnore() {
	var row = this.parentElement.parentElement.parentElement;
	var id = idFromTableRow(row);
	if (ignoreList.contains(id)) {
		ignoreList.remove(id);
		this.textContent = 'ignore';
		row.classList.remove('ignored');
	} else {
		ignoreList.add(id);
		this.textContent = 'unignore';
		row.classList.add('ignored');
	}
}

// add styles to the document
var style = document.createElement('style');
style.textContent = '.ignored { opacity: 0.2; } .ignored, .threadMute { display: none; } .showMuteControls .ignored { display: table-row; } .showMuteControls .threadMute { display: inline; }';
$('head').appendChild(style);

var ignoreTemplate = document.createElement('span');
ignoreTemplate.classList.add('threadMute')
ignoreTemplate.innerHTML = ' <a href="javascript:void(0);"></a>'

// loop over every displayed thread attaching controls and classes
forEach($$('tbody tr', $('#tracker, #forum')), function(row) {
	var id = idFromTableRow(row);
	var ignoreItem = ignoreTemplate.cloneNode(true);
	var link = $('a', ignoreItem);
	link.addEventListener('click', toggleThreadIgnore);
	if (ignoreList.contains(id)) {
		row.classList.add('ignored');
		link.textContent = 'unignore';
	} else {
		link.textContent = 'ignore';
	}
	$('.topic', row).appendChild(ignoreItem);
});

// add control for thread ignore at top of page
var item = document.createElement('li');
item.innerHTML = '<a href="javascript:void(0);">Thread ignore controls</a>';
$('a', item).addEventListener('click', function() {
	$('body').classList.add('showMuteControls');
});
var userNav = $('#user-navigation ul');
userNav.insertBefore(item, userNav.firstChild);
