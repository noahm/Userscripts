// ==UserScript==
// @namespace    gamerswithjobs
// @name         GWJ Thread Ignore
// @description  Allows you to ignore individual threads
// @version      1.2.0
// @match        https://www.gamerswithjobs.com/*
// @grant        none
// @run-at       document-end
// @author       Noah Manneschmidt
// @updateURL    https://github.com/noahm/Userscripts/raw/master/gwj/GWJthreadignore.user.js
// ==/UserScript==

/**
 * Usage:
 * Adds a link in the top left on any tracker or fourm page to show ignore controls.
 * When ignore controls are shown, an ignore link will appear next to any thread, and
 * currently ignored threads will appear with an unignore link.
 * 
 * The list of ignored threads may be shared between browsers with the import/export
 * link added to the user hover menu. (Hover your avatar in the top right.)
 */
(function(){

// quick 'n dirty localStorage wrapper with JSON serialization
var store = {
	set: function(key, val) {
		window.localStorage.setItem(key, store.serialize(val));
	},
	get: function(key, def) {
		return store.deserialize(window.localStorage.getItem(key), def);
	},
	setRaw: function(key, val) {
		try {
			var nativeVal = store.deserialize(val, null);
			if (nativeVal) {
				window.localStorage.setItem(key, val);
				return nativeVal;
			}
		} catch (e) {
		}
		return null;
	},
	getRaw: function(key, def) {
		return window.localStorage.getItem(key) || def;
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
	},
	getRaw: function() {
		return store.getRaw(ignoreList.storeKey, []);
	},
	setRaw: function(str) {
		ignoreList.members = store.setRaw(ignoreList.storeKey, str) || ignoreList.members;
	},
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
	return $('.topic .topic-title a', row).href.match(/\/node\/(\d+)$/)[1];
}

function toggleThreadIgnore(e) {
	e.preventDefault();
	var row = this.parentElement.parentElement.parentElement;
	var id = idFromTableRow(row);
	if (ignoreList.contains(id)) {
		ignoreList.remove(id);
		this.textContent = 'ignore this thread';
		row.classList.remove('ignored');
	} else {
		ignoreList.add(id);
		this.textContent = 'unignore this thread';
		row.classList.add('ignored');
	}
}

// add styles to the document
var style = document.createElement('style');
style.textContent = '\
.ignored { opacity: 0.2; } \
.ignored, .threadMute { display: none; } \
.showMuteControls .ignored { display: table-row; } \
.showMuteControls .threadMute { display: inline; }\
#header .region-header #block-wc-core-user ul li.nav-top.user-threadignore { \
  width: 16px; height: 16px; \
  padding: 0; margin-top: 17px; \
  background-position: center center; background-repeat: no-repeat; \
  background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABd0lEQVQ4jaWSMUtcURCFD2KRyjogsqu+OyOEEETenem2jP6FBUFR/4G7lQGbmCJYWKmgv2Wx2LC5M1Za2dkolnZi8yzeZnn70Bg2A7c7353DmQNMMAPJZlzD3iRsCQsNXGjwX/BAspk3hf3l+YbH0LbIXYuh4zG0U559ehdOedYyoQtXLl59b8H7wJRFOqyIL5OEXRf2OpxyXnXhn/vA1OgDEz535cKETk34/tcXmgUAX6GlKuwaxIWPSi2fl7aVdoaiAwBw4WdfWfhcD8yU1kzosdTQgSsXSWkHLnzjwnc9YBoATPnKlR5M6LoKu9KTKV8BQA+YNuF7F74ZOTCl7wCQJGxWbf+By41hY+jghysXHmm7lgGfVG2nnFdd6cmFn134W6/Z/GBCp8OFZ+NXUD4eT7v50YTWLfLW75h9tRg6rnzryoVFOhy7Qj2w0eZaD0zoIuVZ6916pnxxrmxi6FjkrsfQ7i/PN15t3z91+2/jGvYmhgG8AGJ1AV5Z7OaYAAAAAElFTkSuQmCC\'); \
}\
#header .region-header #block-wc-core-user ul li.nav-top.user-threadignore a { \
  display: block; \
  font-size: 0; \
  margin: 0 auto; \
} \
';
$('head').appendChild(style);

var ignoreTemplate = document.createElement('span');
ignoreTemplate.classList.add('threadMute')
ignoreTemplate.innerHTML = ' <a href="#"></a>'

// loop over every displayed thread attaching controls and classes
forEach($$('table.forum-topic-list tbody tr'), function(row) {
	var id = idFromTableRow(row);
	var ignoreItem = ignoreTemplate.cloneNode(true);
	var link = $('a', ignoreItem);
	link.addEventListener('click', toggleThreadIgnore);
	if (ignoreList.contains(id)) {
		row.classList.add('ignored');
		link.textContent = 'unignore this thread';
	} else {
		link.textContent = 'ignore this thread';
	}
	$('.topic', row).appendChild(ignoreItem);
});

// add control for thread ignore at top of page
function addThreadIgnoreControl() {
	var item = document.createElement('li');
	item.classList.add('nav-top', 'user-threadignore', 'first');
	item.innerHTML = '<a href="#" title="Toggle thread ignore controls">Ignore Threads</a>';
	$('a', item).addEventListener('click', function(e) {
		e.preventDefault();
		$('body').classList.toggle('showMuteControls');
	});
	var userNav = $('#block-wc-core-user ul[role=navigation]');
	if (!userNav) {
		return;
	}
	userNav.firstChild.classList.remove('first');
	userNav.insertBefore(item, userNav.firstChild);
}
// https://www.gamerswithjobs.com/tracker*
// https://www.gamerswithjobs.com/forum/*
// https://www.gamerswithjobs.com/user/*/track*
// https://www.gamerswithjobs.com/user/*/favorites*
if (window.location.pathname.match(/^\/(tracker|forum\/|user\/.+\/(track|favorites))/)) {
	addThreadIgnoreControl();
}


// insert user scripts menu column, if necessary
function getOrCreateScriptsMenu() {
	var userMenu = $('#wc-header-user-dropdown-content');
	var scriptsMenu = $('#noahm-scripts-menu');
	if (userMenu && !scriptsMenu) {
		var div = document.createElement('div');
		div.classList.add('block', 'block-wc-header');
		div.innerHTML = '<h2>Your scripts</h2><div class="content"><div class="item-list"><ul id="noahm-scripts-menu"></ul></div></div>';
		userMenu.appendChild(div);
	}
	return scriptsMenu || $('#noahm-scripts-menu');
}

function addImportExportMenu() {
	var scriptsMenu = getOrCreateScriptsMenu();
	var threadIgnoreMenuItem = document.createElement('li');
	var linkTemplate = document.createElement('a');
	linkTemplate.href = '#';

	var importExportLink = linkTemplate.cloneNode(true);
	importExportLink.innerHTML = 'Import/Export';
	importExportLink.addEventListener('click', function(e) {
		e.preventDefault();
		var response = window.prompt(
			'Here is the current database of ignored threads. You may paste in a different one to restore from a backup.',
			ignoreList.getRaw()
		);

		switch (response) {
			case null:
				return;

			case "":
				response = "[]";

			default:
				ignoreList.setRaw(response);
		}
	});

	threadIgnoreMenuItem.appendChild(document.createTextNode('Thread Ignore '));
	threadIgnoreMenuItem.appendChild(importExportLink);
	scriptsMenu.appendChild(threadIgnoreMenuItem);
}

addImportExportMenu();

})();
