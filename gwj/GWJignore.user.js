// ==UserScript==
// @namespace    gamerswithjobs
// @name         I Didn't Hear Anything
// @description  Increases the number of potential Tannhauserings
// @version      1.2
// @match        http://www.gamerswithjobs.com/node/*
// @grant        none
// @run-at       document-end
// @author       Chris Doggett, Noah Manneschmidt
// ==/UserScript==

// Add or remove users to this array to ignore/unignore them on the forums. Still working on a way to store these permanently, but without GM_setvalue/GM_getvalue, it's difficult.
var usersToIgnore = [
	"Floomi",
	"Bonus_Eruptus"
];

// from https://developer.mozilla.org/en-US/docs/Code_snippets/QuerySelector
function $ (selector, el) {
	if (!el) {el = document;}
	return el.querySelector(selector);
}
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

document.styleSheets[0].addRule('a.gwj_unignore', 'font-weight: bold;');

forEach(usersToIgnore, function(name) {
	// hide posts
	forEach($$("div.author-name a"), function(el) {
		if (el.innerText !== name) return;
		var comment = el.parentElement.parentElement.parentElement,
			hideBlock = unhideCommentEl.cloneNode(true);
		$('.username', hideBlock).innerText = name;
		comment.style.display = 'none';
		comment.parentElement.insertBefore(hideBlock, comment);
		$('a', hideBlock).addEventListener('click', unhide);
	});

	// hide quotes
	forEach($$("span.bb-quote-user"), function(el) {
		if (!el.innerText.match(name)) return; // match operates like .startsWith()
		var quote = el.nextSibling,
			hideBlock = unhideQuoteEl.cloneNode(true);
		quote.style.display = 'none';
		quote.parentElement.insertBefore(hideBlock, quote);
		$('a', hideBlock).addEventListener('click', unhide);
	});
});
