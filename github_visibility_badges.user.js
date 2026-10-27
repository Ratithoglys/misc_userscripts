// ==UserScript==
// @name         GitHub – Colorisation des badges de visibilité - Ebumna
// @namespace    https://ebumna.net/
// @version      1.6.1
// @license      CC BY-SA 4.0
// @description  Colorise les badges de visibilité des dépôts GitHub : Public (vert), Private (rouge), Public archive (orange), Private archive (violet).
// @author       Lénaïc JAOUEN
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @updateURL    https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/github_visibility_badges.user.js
// @downloadURL  https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/github_visibility_badges.user.js
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    function colorBadges() {
        document.querySelectorAll('span, div').forEach(el => {
            const text = el.textContent.trim();

            // Private (normal)
            if (text === 'Private') {
                el.style.setProperty('border-color', '#f85149', 'important');
                el.style.setProperty('color', '#f85149', 'important');
                el.style.setProperty('background-color', 'rgba(248, 81, 73, 0.15)', 'important');
                el.style.setProperty('font-weight', '600', 'important');
            }

            // Public (normal)
            if (text === 'Public') {
                el.style.setProperty('border-color', '#3fb950', 'important');
                el.style.setProperty('color', '#3fb950', 'important');
                el.style.setProperty('background-color', 'rgba(63, 185, 80, 0.15)', 'important');
                el.style.setProperty('font-weight', '600', 'important');
            }

            // Private archive
            if (text === 'Private archive') {
                el.style.setProperty('border-color', '#a371f7', 'important');
                el.style.setProperty('color', '#a371f7', 'important');
                el.style.setProperty('background-color', 'rgba(163, 113, 247, 0.18)', 'important');
                el.style.setProperty('font-weight', '600', 'important');
            }

            // Public archive
            if (text === 'Public archive') {
                el.style.setProperty('border-color', '#d29922', 'important');
                el.style.setProperty('color', '#d29922', 'important');
                el.style.setProperty('background-color', 'rgba(210, 153, 34, 0.18)', 'important');
                el.style.setProperty('font-weight', '600', 'important');
            }
        });
    }

    colorBadges();

    const observer = new MutationObserver(colorBadges);
    observer.observe(document.body, { childList: true, subtree: true });
})();
