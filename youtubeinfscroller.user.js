// ==UserScript==
// @name         YouTube Infinite Scroll Manager
// @namespace    https://ebumna.net/
// @version      0.3
// @description  Contrôle discret du défilement infini avec emojis et texte adaptés
// @author       Lénaïc JAOUEN
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://github.com/Ratithoglys/Misc_Utils/raw/main/youtubeinfscroller.user.js
// @downloadURL  https://github.com/Ratithoglys/Misc_Utils/raw/main/youtubeinfscroller.user.js
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'yt-infinity-toggle';

    // On récupère l'état (vrai par défaut si rien n'est sauvegardé)
    let isEnabled = localStorage.getItem(STORAGE_KEY) !== 'false';

    // 1. On applique le lock globalement sur le <body> pour ignorer les changements de pages (SPA)
    // 2. On utilise des attributs [data-state] pour gérer dynamiquement toutes les couleurs du bouton
    GM_addStyle(`
        body[data-scroll-lock="true"] ytd-continuation-item-renderer {
            display: none !important;
        }
        #scrollManagerBtn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            color: white;
            padding: 6px 12px;
            border-radius: 18px;
            font-family: 'Roboto', Arial, sans-serif;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            border: 1px solid rgba(0,0,0,0.2);
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            transition: all 0.15s ease;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        #scrollManagerBtn span {
            font-size: 14px;
            filter: brightness(1.1);
            background-color: white;
            color: black;
            padding: 2px;
            border-radius: 8px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        /* États activés (Scrolling) */
        #scrollManagerBtn[data-state="enabled"] { background: #0F9D58; }
        #scrollManagerBtn[data-state="enabled"]:hover {
            background: #0B8043;
            transform: scale(1.03);
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        /* États désactivés (Pause) */
        #scrollManagerBtn[data-state="disabled"] { background: #CC0000; }
        #scrollManagerBtn[data-state="disabled"]:hover {
            background: #B30000;
            transform: scale(1.03);
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
    `);

    function createButton() {
        if (document.getElementById('scrollManagerBtn')) return;

        const btn = document.createElement('button');
        btn.id = 'scrollManagerBtn';
        btn.onclick = toggleScrollSystem;
        document.body.appendChild(btn);

        updateButtonAppearance(btn);
    }

    function updateButtonAppearance(btn) {
        btn.setAttribute('data-state', isEnabled ? 'enabled' : 'disabled');
        btn.innerHTML = isEnabled
            ? '<span>▶️</span> Scrolling'
            : '<span>⏸️</span> Pause';
    }

    function toggleScrollSystem() {
        isEnabled = !isEnabled;
        localStorage.setItem(STORAGE_KEY, isEnabled);
        updatePageState();

        const btn = document.getElementById('scrollManagerBtn');
        if (btn) updateButtonAppearance(btn);
    }

    function updatePageState() {
        // Au lieu de chercher `#primary` (qui crée des conflits de DOM), on cible body
        if (isEnabled) {
            document.body.removeAttribute('data-scroll-lock');
            restoreContinuationItems();
        } else {
            document.body.setAttribute('data-scroll-lock', 'true');
        }
    }

    function restoreContinuationItems() {
        // Une simple micro-simulation de défilement (invisible) suffit à réveiller
        // l'algorithme natif de YouTube (IntersectionObserver) pour charger la suite
        window.scrollBy(0, 1);
        window.scrollBy(0, -1);
    }

    // Le MutationObserver n'est pas nécessaire et est lourd pour le CPU.
    // YouTube déclenche l'événement "yt-navigate-finish" à chaque changement de page SPA.
    window.addEventListener('yt-navigate-finish', () => {
        createButton();
        updatePageState();
    });

    // Initialisation au lancement de la page
    createButton();
    updatePageState();
})();
