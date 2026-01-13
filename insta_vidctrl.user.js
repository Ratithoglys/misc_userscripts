// ==UserScript==
// @name         Instagram & Facebook Video Controls
// @namespace    https://fxzfun.com/
// @version      0.2
// @description  Adds video player controls to Instagram videos and keyboard shortcuts for fullscreen (press 'f') and mute (press 'm')
// @author       FXZFun, Lénaïc JAOUEN
// @match        https://www.instagram.com/
// @match        https://www.instagram.com/*
// @match        https://www.facebook.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @updateURL    https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/insta_vidctrl.user.js
// @updateURL    https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/insta_vidctrl.user.js
// @grant        GM_addStyle
// @license      GNU GPL v3
// ==/UserScript==

(function() {
    'use strict';

    setInterval(() => {
        document.querySelectorAll("video").forEach(el => {
            if (el.controls != "controls") {
                el.controls="controls";
            }

            if (el.getAttribute('custVol') == null) {
                el.setAttribute('custVol','on');
                el.muted = false;
                el.volume = 0.3;
            }

            if (!document.head.innerHTML.includes("::-webkit-media-controls")) {
                GM_addStyle(`
                    ::-webkit-media-controls {
                        z-index: 999999;
                        position: relative;
                    }
                    video::-webkit-media-controls {
                        opacity: 0;
                        transition: opacity 0.3s ease-in-out;
                    }
                    video:hover::-webkit-media-controls {
                        opacity: 1;
                    }
                `);
            }
            if (el.closest('article') !== null && !el.hasAttribute("loop")) {
                el.setAttribute("loop", "false");
            }
            else if (el.closest('article') === null && el.hasAttribute("loop")) {
                el.removeAttribute("loop");
            }
        });
    }, 500);

    // add event listeners to the document object
    if (!document.body.dataset.hasFullscreenShortcut) {
        document.body.dataset.hasFullscreenShortcut = true;
        document.addEventListener("keydown", function(event) {
            if (event.key === "f") {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    const videos = document.querySelectorAll("video");
                    let closestVideo = null;
                    let closestDistance = Infinity;
                    videos.forEach(video => {
                        const bounds = video.getBoundingClientRect();
                        const centerX = bounds.left + bounds.width / 2;
                        const centerY = bounds.top + bounds.height / 2;
                        const distance = Math.sqrt((window.innerWidth/2 - centerX)**2 + (window.innerHeight/2 - centerY)**2);
                        if (distance < closestDistance) {
                            closestVideo = video;
                            closestDistance = distance;
                        }
                    });
                    closestVideo.requestFullscreen();
                }
            }
        });
    }


    if (!document.body.dataset.hasMuteShortcut) {
        document.body.dataset.hasMuteShortcut = true;
        document.addEventListener("keydown", function(event) {
            if (event.key === "m") {
                const videos = document.querySelectorAll("video");
                let closestVideo = null;
                let closestDistance = Infinity;
                videos.forEach(video => {
                    const bounds = video.getBoundingClientRect();
                    const centerX = bounds.left + bounds.width / 2;
                    const centerY = bounds.top + bounds.height / 2;
                    const distance = Math.sqrt((window.innerWidth/2 - centerX)**2 + (window.innerHeight/2 - centerY)**2);
                    if (distance < closestDistance) {
                        closestVideo = video;
                        closestDistance = distance;
                    }
                });
                closestVideo.muted = !closestVideo.muted;
            }
        });
    }
})();