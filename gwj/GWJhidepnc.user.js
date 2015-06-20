// ==UserScript==
// @namespace       gamerswithjobs
// @name            GWJ PnC Remover
// @description     Hides Politics & Controversy forums from gamerswithjobs.com
// @version         1.1
// @author          Anodyne, Noah Manneschmidt
// @match           https://www.gamerswithjobs.com/tracker*
// @match           https://www.gamerswithjobs.com/forum/*
// @grant           none
// @run-at          document-end
// ==/UserScript==

// Originally found here: http://userscripts.org/scripts/review/81262
// Updated to work with chrome directly and on the tracker pages

var rows = document.getElementsByTagName("tr"), removeList = [], row;

for (i = 0; i < rows.length; i++) {
	if (rows[i].innerHTML.match("Politics and Controversy")) {
		removeList.push(rows[i]);
	}
}

while (row = removeList.pop()) {
	row.parentNode.removeChild(row);
}
