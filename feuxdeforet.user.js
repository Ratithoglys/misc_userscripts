// ==UserScript==
// @name         FeuxDeForet.fr – Bloqueur de Popups & Pubs - Ebumna
// @namespace    https://ebumna.net/
// @version      1.2.1
// @license      CC BY-SA 4.0
// @description  Supprime les popups d'application, bannières publicitaires et overlays sur feuxdeforet.fr
// @author       Lénaïc JAOUEN
// @match        https://feuxdeforet.fr/*
// @match        https://*.feuxdeforet.fr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=feuxdeforet.fr
// @updateURL    https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/feuxdeforet.user.js
// @downloadURL  https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/feuxdeforet.user.js
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==


(function() {
    'use strict';

    // === Styles CSS pour cacher les éléments indésirables ===
    GM_addStyle(`
        /* Popups généraux */
        div[class*="popup"], div[id*="popup"],
        div[class*="modal"], div[id*="modal"],
        .app-popup, .download-app, .install-app,
        [class*="overlay"], [id*="overlay"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            overflow: hidden !important;
        }

        /* Bannière application mobile */
        .app-banner, .mobile-app-promo,
        [class*="app-promotion"], [class*="play-store"],
        a[href*="play.google.com"] img,
        a[href*="apps.apple.com"] {
            display: none !important;
        }

        /* Publicités et trackers */
        .ad, .ads, .advert, .pub, .publicite,
        iframe[src*="ads"], iframe[src*="doubleclick"],
        div[class*="ad-"], div[id*="ad-"] {
            display: none !important;
        }
    `);

    // Fonction pour supprimer les éléments dynamiquement
    function removePopups() {
        const selectors = [
            // Popups & modals
            'div[class*="popup"]', 'div[id*="popup"]',
            'div[class*="modal"]', 'div[id*="modal"]',
            '.app-popup', '.install-banner', '.promo-app',

            // Liens vers l'app
            'a[href*="play.google.com/store/apps/details?id=com.montardy.feuxdeforet"]',
            'a[href*="apps.apple.com"]',

            // Conteneurs de pubs
            '.ad', '.adsbygoogle', '[id*="google_ads"]',
            'ins.adsbygoogle'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.remove();
            });
        });

        // Supprime les overlays qui couvrent l'écran
        document.querySelectorAll('body > div').forEach(div => {
            const style = window.getComputedStyle(div);
            if (style.position === 'fixed' &&
                (style.zIndex > 1000 || style.backgroundColor.includes('rgba'))) {
                div.remove();
            }
        });
    }

    // Exécution multiple pour contrer le chargement dynamique
    const observer = new MutationObserver(removePopups);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Exécutions immédiates
    setTimeout(removePopups, 100);
    setTimeout(removePopups, 500);
    setTimeout(removePopups, 1000);
    setTimeout(removePopups, 2000);

    console.log('✅ UserScript FeuxDeForet Anti-Popup chargé !');
})();