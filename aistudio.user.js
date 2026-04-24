// ==UserScript==
// @name         AI Studio – Mise en valeur des messages utilisateur
// @namespace    http://ebumna.net/
// @version      1.0
// @description  Ajoute une bordure et un fond subtils aux tours de l'utilisateur pour mieux les distinguer des réponses du modèle.
// @author       Lénaïc JAOUEN
// @match        https://aistudio.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aistudio.google.com
// @updateURL    https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/aistudio.user.js
// @downloadURL  https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/aistudio.user.js
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // Style appliqué aux conteneurs des messages utilisateur
    GM_addStyle(`
        /* Conteneur principal d'un tour utilisateur */
        .chat-turn-container.render.user {
            background-color: rgba(66, 133, 244, 0.08);
            border-left: 4px solid #4285f4;
            border-radius: 8px;
            margin: 8px 0;
            transition: background-color 0.2s ease;
        }

        /* Léger renforcement au survol (optionnel) */
        .chat-turn-container.render.user:hover {
            background-color: rgba(66, 133, 244, 0.15);
        }

        /* Le label "User" prend la couleur de la bordure */
        .chat-turn-container.render.user .author-label {
            font-weight: 600;
            color: #4285f4;
        }
    `);
})();
