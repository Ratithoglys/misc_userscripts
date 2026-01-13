// ==UserScript==
// @name         Twitch remove stories
// @namespace    http://ebumna.net/
// @version      0.1
// @description  Remove stories
// @author       Lénaïc JAOUEN
// @match        *://*.twitch.tv/*
// @updateURL    https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/twitch_no_stories.user.js
// @downloadURL  https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/twitch_no_stories.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.head.appendChild(document.createElement('style')).innerHTML = `
div[class*="storiesLeftNavSection"] {
    display: none !important;
}
`
})();