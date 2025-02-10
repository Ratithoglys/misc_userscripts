// ==UserScript==
// @name         YouTube Infinite Scroll Manager
// @namespace    http://ebumna.net/
// @version      0.1
// @description  Contrôle discret du défilement infini avec emojis et texte adaptés
// @author       Lénaïc JAOUEN
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match        https://www.youtube.com/*
// @icon         https://www.youtube.com/favicon.ico
// @updateURL    https://github.com/Ratithoglys/Misc_Utils/raw/main/youtubeinfscroller.user.js
// @downloadURL  https://github.com/Ratithoglys/Misc_Utils/raw/main/youtubeinfscroller.user.js
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'yt-infinity-toggle';
    const OBSERVER_CONFIG = { childList: true, subtree: true };

    let observer;
    let isEnabled = localStorage.getItem(STORAGE_KEY) !== 'true';

    // Style harmonisé avec les thèmes YouTube
    GM_addStyle(`
        [data-scroll-lock="true"] ytd-continuation-item-renderer {
            display: none !important;
        }
        #scrollManagerBtn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background: ${isEnabled ? '#0F9D58' : '#CC0000'};
            color: white;
            padding: 6px 12px;
            border-radius: 18px;
            font-family: 'Roboto', Arial;
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
        #scrollManagerBtn:hover {
            transform: scale(1.03);
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            background: ${isEnabled ? '#0B8043' : '#B30000'};
        }
        #scrollManagerBtn span {
            font-size: 14px;
            filter: brightness(1.1);
        }
    `);

    function createButton() {
        if (document.getElementById('scrollManagerBtn')) return;

        const btn = document.createElement('button');
        btn.id = 'scrollManagerBtn';
        updateButtonAppearance(btn);
        btn.onclick = toggleScrollSystem;
        document.body.appendChild(btn);
    }

    function updateButtonAppearance(btn) {
        btn.innerHTML = isEnabled
            ? '<span>▶️</span> Scrolling'
            : '<span>⏸️</span> Pause';
        btn.style.background = isEnabled ? '#0F9D58' : '#CC0000';
    }

    function toggleScrollSystem() {
        isEnabled = !isEnabled;
        localStorage.setItem(STORAGE_KEY, isEnabled);
        updatePageState();
        updateButtonAppearance(this);
    }

    function updatePageState() {
        const container = document.querySelector('#primary');
        if (!container) return;

        if (isEnabled) {
            container.removeAttribute('data-scroll-lock');
            restoreContinuationItems();
        } else {
            container.setAttribute('data-scroll-lock', 'true');
        }
    }

    function restoreContinuationItems() {
        const items = document.querySelectorAll('ytd-continuation-item-renderer');
        items.forEach(item => {
            item.style.display = '';
            const parent = item.closest('ytd-item-section-renderer');
            if (parent) {
                parent.dispatchEvent(new CustomEvent('yt-action', { bubbles: true }));
            }
        });
    }

    // Surveillance des changements SPA
    const spaObserver = new MutationObserver((mutations) => {
        if (document.querySelector('#primary')) {
            updatePageState();
            createButton();
        }
    });

    spaObserver.observe(document.documentElement, OBSERVER_CONFIG);

    // Initialisation
    window.addEventListener('yt-navigate-finish', () => {
        createButton();
        updatePageState();
    });

    createButton();
    updatePageState();
})();
