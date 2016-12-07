// ==UserScript==
// @name GWJ User Rename
// @namespace gamerswithjobs
// @description Rename users on the gamers with jobs forums. Your alt names may get quoted into replies. Use at your own risk.
// @match https://www.gamerswithjobs.com/tracker*
// @match https://www.gamerswithjobs.com/forum/*
// @match https://www.gamerswithjobs.com/node/*
// @version 1.0
// @grant none
// @updateURL https://github.com/noahm/Userscripts/raw/master/gwj/GWJUserRename.user.js
// ==/UserScript==

// Forked from the cloud-to-butt port here: https://gist.github.com/kalmanolah/5764435
(function() {
	var userRenames = [
		{ name: /\bClockworkHouse\b/gi, newName: 'Minarchist'},
		{ name: /\bMinarchist\b/gi, newName: 'Clocky'}
	];

	function walk(node) {
		// I stole this function from here:
		// http://is.gd/mwZp7E

		var child, next;

		switch ( node.nodeType ) {
			case Node.ELEMENT_NODE:
			case Node.DOCUMENT_NODE:
			case Node.DOCUMENT_FRAGMENT_NODE:
				child = node.firstChild;
				while ( child ) {
					next = child.nextSibling;
					walk(child);
					child = next;
				}
				break;

			case Node.TEXT_NODE:
				handleText(node);
				break;
		}
	}

	function handleText(textNode) {
		var v = textNode.nodeValue, i;

		for (i = userRenames.length-1; i >= 0; i--) {
			v = v.replace(userRenames[i].name, userRenames[i].newName);
		}

		textNode.nodeValue = v;
	}

	walk(document.getElementsByTagName('body')[0]);
	walk(document.getElementsByTagName('title')[0]);
}());
