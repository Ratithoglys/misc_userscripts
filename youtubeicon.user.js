// ==UserScript==
// @name         Youtube custom favicon
// @namespace    https://ebumna.net/
// @version      0.1
// @license      MIT
// @description  Hides watched videos from extension, basé sur https://github.com/EvHaus/youtube-hide-watched v5.0
// @author       Lénaïc JAOUEN
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match        http://*.youtube.com/*
// @match        http://youtube.com/*
// @match        https://*.youtube.com/*
// @match        https://youtube.com/*
// @updateURL    https://github.com/Ratithoglys/misc_userscripts/blob/main/youtubeicon.user.js
// @downloadURL  https://github.com/Ratithoglys/misc_userscripts/blob/main/youtubeicon.user.js
// ==/UserScript==

(function() {
    'use strict';

    let mainIcon = 'data:image/x-icon;base64,AAABAAEAEBAAAAAAAABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAAAAAAAA////AAAc7wCr5/YAz87/AG6v1QCbm/8Aqub1ABIi/wDZ2f8A/fvYAKxmRACamf8AT1X/AP+p7wAAHe8Abq/WANLR/wDIiWYAyYlmABNwnQBHkrkAqub2AAAc7gBurtUA2dr/ABIj/wATI/8Aurr/AP782ADjxaIADEp/ALKy/wDv8P8AR5K6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARoaGhsaGhoaGhsaGhoaARoXFw8XFxcXFxcPDxcCDxoaGgENHAEBDQQBIBoGAREaGhoBDQEaAQ0BGgEMARoaGxoaAQ0BGwENARoBDAEBERoaGgENAQgBDQEBHBocIREaGhsBGhoaGhoBGhoaGhoaGhoBAQEaGhobARoaGhoaGhoJGhobGhoaGhoaGhoaGggZAQEBAQEBAQEBAQEBAQEBAQEBAwAKARUAEgEFAAsBAQEBAQcAHRYAAQAdFB0AAQEBAQEHAB0WAAEAHQABAAEBAQEBEAAeASIAEwEAAQABAQEBAQAOAAEBAQEBAQEBAQEBARgfAQseAQEBAQEBAQEBAYABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';

    if (!/youtube\.com\/watch\?/.test(document.baseURI)) {
        var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = mainIcon;
        document.getElementsByTagName('head')[0].appendChild(link);

        setTimeout(() => {}, 5 * 1000);
        link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.href = mainIcon;
    }

//     let icon = '🎞️';

//     const dynamicFavicon = (favicon) => {
//         const link = document.createElement("link");
//         link.rel = "shortcut icon";
//         link.type = "image/svg+xml";
//         link.href = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>" + icon + "</text></svg>";
//         document.head.appendChild(link);
//     };

//     if (/youtube\.com\/watch\?/.test(document.baseURI)) {
//         dynamicFavicon(icon);
//     }

})();
