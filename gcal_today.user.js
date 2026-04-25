// ==UserScript==
// @name         Google Calendar - Bouton "Aujourd'hui"
// @namespace    http://ebumna.net/
// @version      1.1
// @description  Ajoute une icône colorée pour définir la date à aujourd'hui (marges réduites).
// @author       Lénaïc JAOUEN
// @match        https://calendar.google.com/calendar/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=calendar.google.com
// @updateURL    https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/gcal_today.user.js
// @downloadURL  https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/gcal_today.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Fonction indispensable pour que Google Calendar (React) comprenne la mise à jour
    function updateReactInput(el, value) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(el, value);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
        el.blur();
    }

    function processEditPage() {
        // Cherche le champ de date
        let dateInputs = Array.from(document.querySelectorAll('input[type="text"]')).filter(i =>
            /date|début|start/i.test(i.getAttribute('aria-label') || '') ||
            /date|début|start/i.test(i.placeholder || '')
        );

        if (dateInputs.length > 0) {
            let startDateInput = dateInputs[0];

            if (!document.getElementById('btn-set-today')) {
                let btn = document.createElement('button');
                btn.id = 'btn-set-today';
                btn.title = "Mettre à aujourd'hui";

                // Style mis à jour : taille réduite (28px au lieu de 40), marges minimes, et couleur bleue Google
                btn.style.cssText = 'background: transparent; border: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; margin-left: 2px; margin-right: 4px; color: #4285F4; height: 28px; width: 28px; padding: 0; flex-shrink: 0; transition: background 0.2s;';

                // Effet au survol de la souris (bleu translucide)
                btn.onmouseover = () => btn.style.background = 'rgba(66, 133, 244, 0.15)';
                btn.onmouseout = () => btn.style.background = 'transparent';

                // Création du SVG méthode sécurisée
                let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('height', '20'); // Icône légèrement plus petite pour tenir dans les 28px
                svg.setAttribute('width', '20');
                svg.setAttribute('viewBox', '0 -960 960 960');
                svg.setAttribute('fill', 'currentColor'); // Prend le bleu défini dans le parent
                svg.style.pointerEvents = 'none';

                let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                // Icône calendrier "Aujourd'hui"
                path.setAttribute('d', 'M160-120q-33 0-56.5-23.5T80-200v-560q0-33 23.5-56.5T160-840h80v-80h80v80h320v-80h80v80h80q33 0 56.5 23.5T880-760v560q0 33-23.5 56.5T800-120H160Zm0-80h640v-400H160v400Zm320-120q25 0 42.5-17.5T540-380q0-25-17.5-42.5T480-440q-25 0-42.5 17.5T420-380q0 25 17.5 42.5T480-320ZM160-680h640v-80H160v80Zm0 0v-80 80Z');

                svg.appendChild(path);
                btn.appendChild(svg);

                // Action : Met la date à aujourd'hui
                btn.onclick = (e) => {
                    e.preventDefault();
                    let today = new Date();
                    let dateStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
                    updateReactInput(startDateInput, dateStr);
                };

                // Insertion AVANT le champ date
                let inputContainer = startDateInput.parentElement;
                if (inputContainer && inputContainer.parentElement) {
                    let parentRow = inputContainer.parentElement;
                    parentRow.style.display = 'flex';
                    parentRow.style.alignItems = 'center';
                    parentRow.insertBefore(btn, inputContainer);
                }
            }
        }
    }

    // Le script tourne en fond
    setInterval(() => {
        if (window.location.href.includes('/eventedit')) {
            processEditPage();
        }
    }, 500);

})();
