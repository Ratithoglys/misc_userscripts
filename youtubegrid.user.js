// ==UserScript==
// @name         YouTube Grid Customizer
// @namespace    https://ebumna.net/
// @version      0.6
// @description  Customize the number of items per row on the YouTube subscriptions page and restore compact sidebar.
// @author       Lénaïc JAOUEN
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://github.com/Ratithoglys/misc_userscripts/raw/main/youtubegrid.user.js
// @downloadURL  https://github.com/Ratithoglys/misc_userscripts/raw/main/youtubegrid.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if (/music\.youtube\.com\//.test(document.baseURI)) {
        return;
    }

    // --- Configuration (Change these to your preferences) ---
    const defaultItemsPerRow = 8;  // Default number of items per row
    const minItemsPerRow = 2;      // Minimum number of items per row
    const maxItemsPerRow = 8;      // Maximum number of items per row
    const minItemWidth = 120;      // Minimum width of a grid item
    // --- End of Configuration ---

    let itemsPerRow = defaultItemsPerRow;

    function applyGridStyle() {
        const itemWidthPercentage = 100 / itemsPerRow;

        // Évite d'accumuler les balises style en mettant à jour une seule balise dédiée
        const styleId = 'yt-grid-customizer-style';
        let styleEl = document.getElementById(styleId);
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = styleId;
            document.head.appendChild(styleEl);
        }

        styleEl.textContent = `
            /* ==========================================================================
               1. RÉGLAGES DE LA GRILLE (Home, Subscriptions, Chaînes)
               ========================================================================== */

            ytd-rich-grid-renderer {
                --ytd-rich-grid-items-per-row: ${itemsPerRow} !important;
                margin: 0 -8px !important;
            }

            /* Désactive le conteneur de ligne pour laisser CSS Grid gérer l'alignement */
            ytd-rich-grid-row, #contents.ytd-rich-grid-row {
                display: contents !important;
            }

            /* Retaillage des vignettes de la grille principale */
            ytd-rich-grid-renderer #contents ytd-rich-item-renderer {
                width: calc(${itemWidthPercentage}% - 16px) !important;
                flex-basis: calc(${itemWidthPercentage}% - 16px) !important;
                max-width: calc(${itemWidthPercentage}% - 16px) !important;
                min-width: ${minItemWidth}px !important;
                margin: 0 8px 16px 8px !important;
            }

            /* Assure la bonne mise à l'échelle des images dans la grille principale */
            ytd-rich-grid-renderer ytd-thumbnail,
            ytd-rich-grid-renderer .yt-thumbnail-view-model {
                width: 100% !important;
                height: auto !important;
            }

            /* ==========================================================================
               2. FIX POUR LA BARRE LATÉRALE DE LECTURE (Watch Page)
               ========================================================================== */

            /* Force l'affichage horizontal (Miniature à gauche, texte à droite) */
            #secondary :is(ytd-compact-video-renderer, ytd-compact-playlist-renderer, ytd-compact-radio-renderer, yt-lockup-view-model, .yt-lockup-view-model) {
                display: flex !important;
                flex-direction: row !important;
                align-items: flex-start !important;
                margin-bottom: 8px !important;
            }

            /* Rétablit la taille normale des vignettes suggérées (168px de large) */
            #secondary :is(ytd-thumbnail, .ytLockupViewModelContentImage, .yt-thumbnail-view-model, .yt-lockup-view-model-wiz__content-image) {
                width: 168px !important;
                max-width: 168px !important;
                min-width: 168px !important;
                height: 94px !important;
                margin-right: 8px !important;
                flex-shrink: 0 !important;
            }

            /* Redimensionne l'espace du texte à côté de la vignette */
            #secondary :is(.ytLockupMetadataViewModelTextContainer, .yt-lockup-view-model__metadata, .yt-lockup-metadata-view-model-wiz) {
                flex: 1 !important;
                min-width: 0 !important;
                padding-left: 0 !important;
            }

            /* Ajuste la taille du titre */
            #secondary :is(.ytLockupMetadataViewModelTitle, .yt-lockup-metadata-view-model-wiz__title, #video-title) {
                font-size: 1.3rem !important;
                line-height: 1.6rem !important;
                max-height: 3.2rem !important;
            }

            /* ==========================================================================
               3. AUTRES CORRECTIONS D'ORIGINE
               ========================================================================== */
            ytd-video-renderer[use-prominent-thumbs] ytd-thumbnail.ytd-video-renderer {
                min-width: 120px !important;
                max-width: 240px !important;
            }
            #contents > ytd-rich-section-renderer:not(:first-of-type) {
                display: none !important;
            }
        `;
    }

    // Apply initial styles when the page is loaded
    applyGridStyle();

    // Reapply styles when navigation is finished
    window.addEventListener('yt-navigate-finish', applyGridStyle, true);
})();
