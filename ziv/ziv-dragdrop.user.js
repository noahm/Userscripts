// ==UserScript==
// @name         Ziv Upload DragDrop
// @namespace    http://noah.manneschmidt.net/
// @version      2025-01-07_12-00
// @description  lets you drop a pack directly onto the ziv upload form to autofill some fields
// @author       Noah Manneschmidt
// @match        https://zenius-i-vanisher.com/v5.2/uploadsimfile.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zenius-i-vanisher.com
// @grant        none
// @downloadURL  https://github.com/noahm/Userscripts/raw/master/ziv/ziv-dragdrop.user.js
// @updateURL    https://github.com/noahm/Userscripts/raw/master/ziv/ziv-dragdrop.user.js
// ==/UserScript==

(async function () {
  "use strict";
  const parser = await import(
    "https://unpkg.com/simfile-parser@0.8.1/dist/browser/index.js"
  );
  const parseSong = parser.parseSongFolderOrData;

  document.body.addEventListener("dragover", (evt) => {
    evt.preventDefault();
  });

  document.body.addEventListener("drop", async (evt) => {
    console.log("handle drop");
    evt.preventDefault();
    if (!evt.dataTransfer) {
      return;
    }

    if (evt.dataTransfer.items.length !== 1) {
      console.error("too many items dropped");
      return;
    }
    try {
      const simfile = await parseSong(evt.dataTransfer.items[0]);
      if (!simfile) {
        console.log("no simfile found");
        return;
      }
      autofillSimfile(simfile);
    } catch (e) {
      console.log(e);
    }
  });

  document
    .querySelector('input[name="DWIfile"]')
    .addEventListener("change", handleFileInputChange);
  document
    .querySelector('input[name="SMfile"]')
    .addEventListener("change", handleFileInputChange);
  document
    .querySelector('input[name="SSCfile"]')
    .addEventListener("change", handleFileInputChange);

  async function handleFileInputChange(evt) {
    if (evt.currentTarget.files[0]) {
      const simfile = await parseSong(evt.currentTarget);
      if (!simfile) {
        console.log("no simfile found");
        return;
      }
      autofillSimfile(simfile);
    }
  }
})();

function autofillSimfile(simfile) {
  document.querySelector("input[name='simfilename']").value =
    simfile.title.translitTitleName || simfile.title.titleName;
  document.querySelector("input[name='simfileartist']").value = simfile.artist;
  // max min bpm
  document.querySelector("input[name='minbpm']").value = simfile.minBpm;
  document.querySelector("input[name='maxbpm']").value = simfile.maxBpm;
  // charts
  for (const chart of simfile.availableTypes) {
    try {
      const inputName = chart.mode[0] + chart.difficulty.slice(0, 3);
      document.querySelector(`select[name='${inputName}']`).value = chart.feet;
    } catch (e) {
      console.log("error when filling chart ", chart.slug, e);
    }
  }

  // other fields for QoL
  document.querySelector('select[name="mp3quality"]').value =
    "Perfect (High Quality)";
  document.querySelector('select[name="backgroundquality"]').value = "Generic";
  document.querySelector('input[name="autozip"]').checked = true;
}
