// ==UserScript==
// @namespace       gamerswithjobs
// @name            GWJ PnC Remover
// @description     Hides Politics & Controversy forums from gamerswithjobs.com
// @version         1.1
// @author          Anodyne, Noah Manneschmidt
// @match           http://www.gamerswithjobs.com/tracker*
// @match           http://www.gamerswithjobs.com/forum/*
// @grant           none
// @run-at          document-end
// ==/UserScript==

// Originally found here: http://userscripts.org/scripts/review/81262
// Updated to work with chrome directly and on the tracker pages

var trs = document.getElementsByTagName("tr");
for (i = 0; i < trs.length; i++)
{
	var tr_contents = (trs[i].innerHTML);
	
	var the_thingy = tr_contents.match("Politics and Controversy");

	if (the_thingy != null)
	{
		trs[i].parentNode.removeChild(trs[i]);
	}
}
