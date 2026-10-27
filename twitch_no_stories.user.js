// ==UserScript==
// @name         Twitch remove stories
// @namespace    https://ebumna.net/
// @version      0.2
// @license      CC BY-SA 4.0
// @description  Remove stories
// @author       Lénaïc JAOUEN
// @match        *://*.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @updateURL    https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/twitch_no_stories.user.js
// @downloadURL  https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/twitch_no_stories.user.js
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