// ==UserScript==
// @name         YouTube Grid Customizer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Customize the number of items per row on the YouTube subscriptions page.
// @author       Lénaïc JAOUEN
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match        *://www.youtube.com/feed/subscriptions*
// @match        *://youtube.com/feed/subscriptions*
// @match        *://www.youtube.com/@*/videos*
// @match        *://youtube.com/@*/videos*
// @updateURL    https://github.com/Ratithoglys/misc_userscripts/raw/main/youtubegrid.user.js
// @downloadURL  https://github.com/Ratithoglys/misc_userscripts/raw/main/youtubegrid.user.js
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration (Change these to your preferences) ---
    const defaultItemsPerRow = 8;  // Default number of items per row
    const minItemsPerRow = 2;      // Minimum number of items per row
    const maxItemsPerRow = 6;     // Maximum number of items per row
    const minItemWidth = 120; // Minimum width of a grid item
    // --- End of Configuration ---

    let itemsPerRow = defaultItemsPerRow;

    function applyGridStyle() {
        const itemWidthPercentage = 100 / itemsPerRow;
        GM_addStyle(`
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
            ytd-video-renderer[use-prominent-thumbs] ytd-thumbnail.ytd-video-renderer {
                min-width: 120px !important;
                max-width: 240px !important;
            }
            #contents > ytd-rich-section-renderer:not(:first-of-type) { display: none !important; }
        `);
    }

    // Apply initial styles and add control panel when the page is loaded
    applyGridStyle();
})();
