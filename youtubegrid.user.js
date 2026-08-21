// ==UserScript==
// @name         YouTube Grid Customizer
// @namespace    https://ebumna.net/
// @version      0.7
// @description  Customize the number of items per row on the YouTube subscriptions page.
// @author       Lénaïc JAOUEN
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    if (/music\.youtube\.com\//.test(document.baseURI)) {
        return;
    }

    // --- Configuration ---
    const defaultItemsPerRow = 8;  // Nombre d'éléments par ligne
    const minItemWidth = 120;      // Largeur minimale d'un élément
    // --- Fin de Configuration ---

    let itemsPerRow = defaultItemsPerRow;

    function applyGridStyle() {
        const itemWidthPercentage = 100 / itemsPerRow;
        GM_addStyle(`
            /* 1. Grille et colonnes */
            ytd-rich-grid-renderer #contents ytd-rich-item-renderer .ytd-rich-grid-renderer {
                width: calc(${itemWidthPercentage}% - 16px) !important;
                flex-basis: calc(${itemWidthPercentage}% - 16px) !important; /* Adjust for margin */
                max-width: calc(${itemWidthPercentage}% - 16px) !important;
                min-width: ${minItemWidth}px !important; /* Enforce minimum width */
            }
            ytd-rich-grid-renderer {
                --ytd-rich-grid-items-per-row: ${itemsPerRow} !important;
                margin: 0 -8px !important; /* Reduce spacing between items */
            }
            ytd-rich-grid-row {
                margin: initial !important;
            }

            /* 2. Avatar conservé (marge optimisée) */
            ytd-rich-grid-renderer .ytLockupMetadataViewModelAvatar {
                display: block !important;
                margin-right: 8px !important;
            }
            ytd-rich-grid-renderer .ytSpecAvatarShapeAvatarSizeMedium {
                width: 32px !important;
                height: 32px !important;
            }

            /* 3. Titre ajusté à 1.5em */
            ytd-rich-grid-renderer .ytLockupMetadataViewModelTitle {
                font-size: 1.5rem !important;
                line-height: 2.0rem !important;
                font-weight: 500 !important;
            }

            /* 4. Métadonnées plus petites */
            ytd-rich-grid-renderer .ytContentMetadataViewModelHost,
            ytd-rich-grid-renderer .ytContentMetadataViewModelMetadataRow {
                font-size: 1.15rem !important;
                line-height: 1.4rem !important;
            }

            /* 5. Organisation en Flexbox */
            ytd-rich-grid-renderer .ytContentMetadataViewModelMetadataRow {
                display: flex !important;
                flex-wrap: wrap !important;
                align-items: center !important;
                row-gap: 2px !important;
            }

            /* 6. Saut de ligne forcé sur le 1er délimiteur (entre Chaîne et Vues) */
            ytd-rich-grid-renderer .ytContentMetadataViewModelMetadataRow > .ytContentMetadataViewModelDelimiter:not(:has(+ .ytContentMetadataViewModelMetadataTextLastPart)) {
                display: block !important;
                flex-basis: 100% !important;
                width: 100% !important;
                height: 0 !important;
                margin: 0 !important;
                opacity: 0 !important;
            }

            /* 7. Maintien des vues, du point et de la date ensemble sur la 2ème ligne */
            ytd-rich-grid-renderer .ytContentMetadataViewModelMetadataRow > .ytContentMetadataViewModelDelimiter:has(+ .ytContentMetadataViewModelMetadataTextLastPart) {
                display: inline-block !important;
                margin: 0 4px !important;
            }
            ytd-rich-grid-renderer .ytContentMetadataViewModelLeadingIcon,
            ytd-rich-grid-renderer .ytContentMetadataViewModelMetadataTextLastPart {
                white-space: nowrap !important;
            }

            /* 8. Éléments annexes & sidebar */
            #related .ytLockupViewModelContentImage { width: 25% !important; }
            ytd-video-renderer[use-prominent-thumbs] ytd-thumbnail.ytd-video-renderer {
                min-width: 120px !important;
                max-width: 240px !important;
            }
            #contents > ytd-rich-section-renderer:not(:first-of-type) { display: none !important; }
        `);
    }

    applyGridStyle();

    // Reapply styles when navigation is finished
    window.addEventListener('yt-navigate-finish', applyGridStyle, true);
})();