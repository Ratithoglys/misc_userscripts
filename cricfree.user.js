// ==UserScript==
// @name         Cricfree – Page épurée - Ebumna
// @namespace    https://ebumna.net/
// @version      0.1.1
// @license      CC BY-SA 4.0
// @description  Ne garde que le contenu central de la page Cricfree, en supprimant les deux autres panneaux autour du lecteur.
// @author       Lénaïc JAOUEN
// @match        https://cricfree.live/live/*
// @match        https://cricplay2.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cricfree.live
// @updateURL    https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/cricfree.user.js
// @downloadURL  https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/cricfree.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var node = document.querySelector('.channels_container').parentElement;
    if (node != null) {
        // node.children[1].className = "col-xl-12 col-md-12";
        node.removeChild(node.children[2]);
        node.removeChild(node.children[0]);

//         document.querySelector('iframe').height = 750;

//         var frame1 = document.querySelector('iframe').contentWindow.document;
//         frame1.querySelector('iframe').height = 750;
//     }
//     else {
//         console.log('#### ELSE ####')
//         var frameF = document.querySelector('iframe').contentWindow.document;
//         frameF.querySelector('iframe').height = 750;
    }
})();
