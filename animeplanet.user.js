// ==UserScript==
// @name         Ebumna : anime-planet
// @namespace    http://ebumna.net/
// @version      0.2
// @description  Ebumna : anime-planet
// @author       Lénaïc JAOUEN
// @match        https://www.anime-planet.com/anime/seasons/*
// @match        https://www.anime-planet.com/users/*/anime*
// @match        https://www.anime-planet.com/users/*/manga*
// @updateURL    https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/animeplanet.user.js
// @downloadURL  https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/animeplanet.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anime-planet.com
// @grant        none
// ==/UserScript==
console.log("tpMonkey: " + location.href)
document.querySelectorAll('.epsRating select.changeStatus, .entryRating select.changeStatus').forEach(
    s => {
        /// Borders
        // Unwatched(Unread) => Gray border
        if (s.value == 0) {
            s.style.border = '1px solid gray';
        }
        // Watching(Reading) / Want to Watch(Read) / ????(Stalled) + Watched existing => Light Blue border
        else if ((s.value == 2 || s.value == 4 || s.value == 5) && s.querySelector('option[value="1"]') != null) {
            s.style.border = '1px solid #6f99e4';
        }

        /// Color
        // Unwatched(Unread) / Plan to Watch(Read) + Watching(Reading) existing => Green text
        if ((s.value == 0 || s.value == 4) && s.querySelector('option[value="2"]') != null) {
            s.parentElement.style.color = '#8dea43';
        }
        // Won't Watch(Read) => Gray text
        else if (s.value == 6) {
            s.parentElement.style.color = 'gray';
        }
    }
)
