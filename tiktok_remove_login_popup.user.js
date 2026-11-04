// ==UserScript==
// @name         TikTok – Supprimer la popup de connexion - Ebumna
// @namespace    https://ebumna.net/
// @version      1.1
// @license      CC BY-SA 4.0
// @description  Supprime la popup pendant le visionnage et affiche une icône quand elle est bloquée
// @author       Lénaïc JAOUEN
// @match        https://www.tiktok.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @updateURL    https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/tiktok_remove_login_popup.user.js
// @downloadURL  https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/tiktok_remove_login_popup.user.js
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const SELECTOR = '[class*="DivModalContainer"]';
    const ICON_ID = 'tm-popup-blocked-icon';
    const HIDE_DELAY = 3000; // durée d'affichage de l'icône (ms)

    GM_addStyle(`
        /* Masquage immédiat de la popup */
        ${SELECTOR},
        [class*="DivLoginContainer"],
        [class*="DivGuestModeContainer"] {
            display: none !important;
        }

        /* Icône de notification */
        #${ICON_ID} {
            position: fixed;
            top: 16px;
            right: 16px;
            z-index: 2147483647;
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 10px;
            border-radius: 999px;
            background: rgba(22, 24, 35, 0.9);
            color: #25f4ee;
            font: 600 13px/1 system-ui, sans-serif;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
            pointer-events: none;
            opacity: 0;
            transform: translateY(-8px);
            transition: opacity 0.25s ease, transform 0.25s ease;
        }
        #${ICON_ID}.visible {
            opacity: 1;
            transform: translateY(0);
        }
        #${ICON_ID} svg {
            width: 20px;
            height: 20px;
            fill: currentColor;
        }
    `);

    let count = 0;
    let hideTimer = null;

    function getIcon() {
        let icon = document.getElementById(ICON_ID);
        if (!icon) {
            icon = document.createElement('div');
            icon.id = ICON_ID;
            icon.title = 'Popup bloquée';
            icon.innerHTML = `
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 1 3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4zm-1.2 15.2-3.5-3.5 1.4-1.4 2.1 2.1 5-5 1.4 1.4-6.4 6.4z"/>
                </svg>
                <span class="count"></span>`;
            (document.body || document.documentElement).appendChild(icon);
        }
        return icon;
    }

    function notifyBlocked(n) {
        count += n;
        const icon = getIcon();
        icon.querySelector('.count').textContent = count > 1 ? 'x' + count : '';
        // force le reflow pour relancer la transition
        void icon.offsetWidth;
        icon.classList.add('visible');

        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
            icon.classList.remove('visible');
            count = 0;
        }, HIDE_DELAY);
    }

    function cleanup() {
        const modals = document.querySelectorAll(SELECTOR);
        if (modals.length) {
            modals.forEach(el => el.remove());
            notifyBlocked(modals.length);
        }

        // Restaure le scroll bloqué par la modale
        if (document.body) {
            document.body.style.removeProperty('overflow');
            document.body.style.removeProperty('padding-right');
        }
        document.documentElement.style.removeProperty('overflow');
    }

    const observer = new MutationObserver(cleanup);

    function start() {
        cleanup();
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.body) {
        start();
    } else {
        document.addEventListener('DOMContentLoaded', start);
    }
})();
