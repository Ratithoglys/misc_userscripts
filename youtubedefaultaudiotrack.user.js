// ==UserScript==
// @name         YouTube Default Audio Track
// @namespace    bp-yt-audio-track-default
// @version      2.7
// @description  Makes it possible to select the desired Audio Track played by default and adds a badge to indicate if multiple audio languages are available and if the language has been changed. Basé sur https://greasyfork.org/en/scripts/488877-youtube-default-audio-track
// @author       BuIlDaLiBlE
// @author       Lénaïc JAOUEN
// @match        https://*.youtube.com/*
// @icon         https://www.youtube.com/favicon.ico
// @grant        none
// @run-at       document-end
// @license      MIT
// @updateURL    https://github.com/Ratithoglys/misc_userscripts/raw/main/youtubedefaultaudiotrack.user.js
// @downloadURL  https://github.com/Ratithoglys/misc_userscripts/raw/main/youtubedefaultaudiotrack.user.js
// ==/UserScript==
"use strict";

const DESIRED_AUDIO_TRACK = "original"; // The desired audio track name (can be partial)
var trackChanged = null; // Indicator to track if the audio track has been changed
var lastUrl = null; // Variable to track the last URL

window.addEventListener("yt-navigate-finish", main, true);
const observer = new MutationObserver(
    (mutations, shortsReady = false, videoPlayerReady = false) => {
        outer: for(const mutation of mutations) {
            for(const node of mutation.addedNodes) {
                if(!shortsReady) {
                    shortsReady = node.tagName === "YTD-SHORTS";
                }
                if(!videoPlayerReady) {
                    videoPlayerReady = typeof node.className === "string" && node.className.includes("html5-main-video");
                }
                if(shortsReady || videoPlayerReady) {
                    observer.disconnect();
                    main();
                    break outer;
                }
            }
        }
    }
);
observer.observe(document.documentElement, {childList: true, subtree: true,});

async function main() {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        trackChanged = null; // Reset trackChanged when the URL changes
    }

    let player = getPlayer();
    while(!player) {
        player = getPlayer();
        await new Promise(resolve => setTimeout(resolve, 5));
    }
    forceAudioTrack(player);
}

function getPlayer() {
    let player;
    if(window.location.href.includes("youtube.com/shorts")) {
        player = document.querySelector("#shorts-player");
    }
    else {
        player = document.querySelector("#movie_player");
    }
    return player;
}

function forceAudioTrack(player) {
    try {
        if (trackChanged == null) {
            trackChanged = false;
        } else {
            return;
        }

        const availableAudioTracks = player.getAvailableAudioTracks();
        const currentAudioTrack = player.getAudioTrack();
        let languageObject;

        if(availableAudioTracks === undefined || availableAudioTracks.length == 0) {
            console.log("No available audio tracks.");
            addAudioTrackBadge(false, false, "original");
            return;
        }

        for(let object in currentAudioTrack) {
            if(currentAudioTrack[object].name) {
                languageObject = object;
                break;
            }
        }

        let currentLanguage = currentAudioTrack[languageObject].name;
        let isDefault = currentAudioTrack[languageObject].audioIsDefault;
        console.log("Audio track is:", currentLanguage, "Default:", isDefault);

        let desiredTrackFound = false;
        for(const track of availableAudioTracks) {
            if(track[languageObject].name.toLowerCase().includes(DESIRED_AUDIO_TRACK.toLowerCase()) && track[languageObject].audioIsDefault) {
                if (!isDefault || currentLanguage.toLowerCase() !== track[languageObject].name.toLowerCase()) {
                    player.setAudioTrack(track);
                    trackChanged = true;
                    currentLanguage = track[languageObject].name;
                    console.log("Audio track changed to:", currentLanguage);
                }
                desiredTrackFound = true;
                break;
            }
        }

        if (!desiredTrackFound && availableAudioTracks.length > 1) {
            for(const track of availableAudioTracks) {
                if(track[languageObject].name.toLowerCase().includes(DESIRED_AUDIO_TRACK.toLowerCase())) {
                    player.setAudioTrack(track);
                    trackChanged = true;
                    currentLanguage = track[languageObject].name;
                    console.log("Audio track changed to:", currentLanguage);
                    break;
                }
            }
        }

        console.log("Audio track not changed. Current track:", currentLanguage);

        // Add or update badge to indicate multiple audio languages and if the language has been changed
        addAudioTrackBadge(availableAudioTracks.length > 1, trackChanged, currentLanguage);
    }
    catch(error) {
        console.error("Error setting Audio Track:", error.message);
    }
}

function addAudioTrackBadge(multipleLanguages, trackChanged, currentLanguage) {
    console.log("Adding or updating audio track badge. Multiple languages:", multipleLanguages, "Track changed:", trackChanged, "Current language:", currentLanguage);

    let badge = document.getElementById('audioTrackBadge');
    if (!badge) {
        badge = document.createElement("div");
        badge.id = 'audioTrackBadge';
        badge.style.position = "fixed";
        badge.style.bottom = "20px";
        badge.style.right = "20px";
        badge.style.backgroundColor = getBadgeColor(multipleLanguages, trackChanged);
        badge.style.color = "white";
        badge.style.padding = "6px 12px";
        badge.style.borderRadius = "18px";
        badge.style.fontFamily = "'Roboto', Arial";
        badge.style.fontSize = "12px";
        badge.style.fontWeight = "500";
        badge.style.border = "1px solid rgba(0,0,0,0.2)";
        badge.style.boxShadow = "0 1px 2px rgba(0,0,0,0.1)";
        badge.style.transition = "all 0.15s ease";
        badge.style.display = "flex";
        badge.style.alignItems = "center";
        badge.style.gap = "5px";
        badge.style.zIndex = 9998;
        document.body.appendChild(badge);
    }

    // Update badge content and position
    badge.innerHTML = getBadgeText(multipleLanguages, trackChanged, currentLanguage);
    badge.style.backgroundColor = getBadgeColor(multipleLanguages, trackChanged);

    // Position the badge dynamically
    const scrollManagerBtn = document.getElementById('scrollManagerBtn');
    if (scrollManagerBtn) {
        badge.style.bottom = `${parseInt(getComputedStyle(scrollManagerBtn).bottom) + scrollManagerBtn.offsetHeight + 10}px`;
    }

    console.log("Audio track badge added or updated on the page.");
}

function getBadgeColor(multipleLanguages, trackChanged) {
    if (!multipleLanguages) {
        return '#CC0000'; // Rouge
    } else if (trackChanged) {
        return '#FF8C00'; // Orange plus foncé pour meilleur contraste
    } else {
        return '#0F9D58'; // Vert
    }
}

function getBadgeText(multipleLanguages, trackChanged, currentLanguage) {
    if (!multipleLanguages) {
        return `<span style="background-color: white; color: black; padding: 2px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center;">🔇</span> (original)`;
    } else {
        return `<span style="background-color: white; color: black; padding: 2px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center;">🔊</span> ${currentLanguage}`;
    }
}
