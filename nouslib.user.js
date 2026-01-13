// ==UserScript==
// @name         Nouslib: Hide Users
// @namespace    https://ebumna.net/
// @version      0.5.18
// @description  Nouslib: Enhanced hidden users list with working preview and remove buttons. Fixes user card pathname error and selectors. Image preview now follows cursor on hover.
// @author       Lénaïc JAOUEN
// @match        https://www.nouslib.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nouslib.com
// @updateURL    https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/nouslib.user.js
// @downloadURL  https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/nouslib.user.js
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    let excludedUsers = GM_getValue('excludedUsers', []).map(entry => {
        if (typeof entry === 'string' && entry.includes('//')) {
            return entry;
        } else if (typeof entry === 'string' || typeof entry === 'number') {
            return `//${entry}`;
        }
        return '//';
    });
    let currentURL = window.location.href;
    let hiddenListVisible = false;
    let messageListObserver = null;
    let filterExcludedMessages = false;

    function createNoteElement() {
        const noteMenuVertical = document.createElement('menu-tabs-vertical');

        const noteElement = document.createElement('div');
        noteElement.id = 'exclusion-note';
        noteElement.style.marginBottom = '0';
        noteElement.style.padding = '0.3em 0.5em';
        noteElement.style.fontSize = '0.9em';
        noteElement.style.textAlign = 'left';
        noteMenuVertical.appendChild(noteElement);

        const separator = document.createElement('hr');
        separator.className = 'bg-neutral-lighter dark:bg-neutral-dark m-0 w-full';
        noteMenuVertical.appendChild(separator);

        const sidebarMenu = document.querySelector('desktop-layout desktop-sidebar-menu');
        if (sidebarMenu) {
            const recitsMenuItem = sidebarMenu.querySelector('menu-tabs-vertical > a[href="/stories"]').parentNode;
            if (recitsMenuItem) {
                sidebarMenu.insertBefore(noteMenuVertical, recitsMenuItem);
            } else {
                sidebarMenu.insertBefore(noteMenuVertical, sidebarMenu.firstChild);
            }

        } else {
            console.warn('desktop-sidebar-menu element not found. Note may not be placed in sidebar.');
            return null;
        }
        return noteElement;
    }


    function updateNoteElement(hiddenUsernamesOnPage) {
        let noteElement = document.getElementById('exclusion-note');
        if (!noteElement) {
            noteElement = createNoteElement();
            if (!noteElement) return;
        }

        const excludedCount = excludedUsers.length;
        const hiddenCount = hiddenUsernamesOnPage.length;

        noteElement.innerHTML = `<b>Exclus:</b> ${excludedCount}   `;

        createHiddenUserListElement(noteElement, hiddenCount, hiddenUsernamesOnPage);
    }

    function createHiddenUserListElement(noteElement, hiddenCount, hiddenUsernamesOnPage) {
        let listContainer = document.getElementById('hidden-users-list-container');
        let toggleButton;
        let userListDiv;
        let hiddenCounterSpan;
        let previewImage = document.getElementById('user-preview-image');

        if (!previewImage) {
            previewImage = document.createElement('img');
            previewImage.id = 'user-preview-image';
            previewImage.style.display = 'none';
            noteElement.appendChild(previewImage);
        }


        if (!listContainer) {
            listContainer = document.createElement('div');
            listContainer.id = 'hidden-users-list-container';
            noteElement.appendChild(listContainer);

            const counterLine = document.createElement('div');
            counterLine.style.display = 'flex';
            counterLine.style.alignItems = 'center';
            noteElement.appendChild(counterLine);


            hiddenCounterSpan = document.createElement('span');
            hiddenCounterSpan.innerHTML = `<b>Cachés:</b> ${hiddenCount} `;
            counterLine.appendChild(hiddenCounterSpan);


            toggleButton = document.createElement('button');
            toggleButton.id = 'toggle-hidden-list-button';
            toggleButton.style.marginLeft = '0.3em';
            toggleButton.innerHTML = '<span class="list-toggle-symbol expand-symbol">+</span>';
            counterLine.appendChild(toggleButton);


            userListDiv = document.createElement('div');
            userListDiv.id = 'hidden-users-list';
            userListDiv.style.display = 'none';
            userListDiv.style.marginTop = '0.3em';
            userListDiv.style.paddingLeft = '1em';
            noteElement.appendChild(userListDiv);


            toggleButton.addEventListener('click', function() {
                hiddenListVisible = !hiddenListVisible;
                userListDiv.style.display = hiddenListVisible ? 'block' : 'none';
                toggleButton.innerHTML = hiddenListVisible ? '<span class="list-toggle-symbol contract-symbol">-</span>' : '<span class="list-toggle-symbol expand-symbol">+</span>';
            });


        } else {
            toggleButton = document.getElementById('toggle-hidden-list-button');
            userListDiv = document.getElementById('hidden-users-list');
            hiddenCounterSpan = document.querySelector('#hidden-users-list-container span');
        }

        hiddenCounterSpan.innerHTML = `<b>Cachés:</b> ${hiddenCount} `;

        userListDiv.innerHTML = '';
        if (hiddenUsernamesOnPage.length > 0) {
            const ul = document.createElement('ul');
            ul.style.listStyleType = 'none';
            ul.style.paddingLeft = '0';
            hiddenUsernamesOnPage.sort().forEach(username => {
                const li = document.createElement('li');
                li.style.display = 'flex';
                li.style.alignItems = 'center';

                const usernameSpan = document.createElement('span');
                usernameSpan.style.flexGrow = '1';
                usernameSpan.textContent = username;
                li.appendChild(usernameSpan);

                const eyeIcon = document.createElement('span');
                eyeIcon.innerHTML = '<span class="list-icon eye-icon">👁</span>';
                eyeIcon.style.marginLeft = '0.3em';
                eyeIcon.style.marginRight = '0.3em';
                eyeIcon.style.position = 'relative';
                eyeIcon.addEventListener('mouseover', function(event) {
                    const userCards = document.querySelectorAll('user-card');
                    let foundUserCard = null;
                    for (const userCard of userCards) {
                        const cardUsernameElement = userCard.querySelector('user-infos h2.text-display-h3');
                        const cardUsername = cardUsernameElement ? cardUsernameElement.textContent : null;
                        if (cardUsername === username) {
                            foundUserCard = userCard;
                            break;
                        }
                    }

                    if (foundUserCard) {
                        const avatarImg = foundUserCard.querySelector('img.picture');
                        if (avatarImg) {
                            previewImage.src = avatarImg.src;
                            previewImage.style.position = 'fixed'; // Use 'fixed' for cursor-relative positioning
                            previewImage.style.pointerEvents = 'none'; // Prevent blocking hover on eye icon
                            previewImage.style.top = `${event.clientY + 10}px`; // Position 10px below cursor
                            previewImage.style.left = `${event.clientX + 10}px`; // Position 10px to the right of cursor
                            previewImage.style.display = 'block';
                        } else {
                            console.warn('Avatar image not found for user:', username);
                        }
                    } else {
                        console.warn('User card not found for user:', username);
                    }
                });
                eyeIcon.addEventListener('mousemove', function(event) { // Update position on mousemove for smooth follow
                    previewImage.style.top = `${event.clientY + 10}px`;
                    previewImage.style.left = `${event.clientX + 10}px`;
                });


                eyeIcon.addEventListener('mouseout', function() {
                    previewImage.style.display = 'none';
                });

                li.appendChild(eyeIcon);

                const removeIcon = document.createElement('span');
                removeIcon.innerHTML = '<span class="list-icon remove-icon">+</span>';
                removeIcon.style.cursor = 'pointer';
                removeIcon.title = 'Supprimer de la liste d\'exclusion';
                removeIcon.addEventListener('click', function() {
                    // Find the correct exclusion entry to remove based on username
                    let exclusionEntryToRemove = null;
                    for (const entry of excludedUsers) {
                        if (entry.startsWith(username + "//") || entry === username + "//") { // Match username with or without userId
                            exclusionEntryToRemove = entry;
                            break;
                        }
                    }
                    if (exclusionEntryToRemove) {
                        removeUserFromExclusionList({ exclusionEntry: exclusionEntryToRemove }); // Pass the full exclusion entry
                        li.remove();
                        const index = hiddenUsernamesOnPage.indexOf(username);
                        if (index > -1) {
                            hiddenUsernamesOnPage.splice(index, 1);
                        }
                        updateNoteElement(hiddenUsernamesOnPage);
                        applyScriptLogic();
                    } else {
                        console.warn("Exclusion entry not found for username:", username, "in excludedUsers list:", excludedUsers); // Log if entry not found
                    }

                });
                li.appendChild(removeIcon);

                ul.appendChild(li);
            });
            userListDiv.appendChild(ul);
        } else {
            userListDiv.textContent = 'Aucun utilisateur caché.';
        }
    }


    function hideExcludedElements() {
        let hiddenUsernamesOnPage = [];
        const isUsersIndexPage = window.location.href.startsWith('https://www.nouslib.com/users') && !window.location.href.includes('/users/');
        const isMessagePage = window.location.href.startsWith('https://www.nouslib.com/account/pmessages');


        if (isUsersIndexPage) {
            const userCards = document.querySelectorAll('user-card');
            userCards.forEach(userCard => {
                const usernameElement = userCard.querySelector('h2.text-display-h3');
                const username = usernameElement ? usernameElement.textContent : null;
                const userId = userCard.id ? userCard.id.substring(3) : null;
                let isUserExcluded = false;

                excludedUsers.forEach(excludedEntry => {
                    const [excludedUsername, excludedUserId] = excludedEntry.split('//');
                    if ((username && excludedUsername && username === excludedUsername) || (userId && excludedUserId && userId === excludedUserId) || (userId && !excludedUsername && userId === excludedUserId) || (username && !excludedUserId && username === excludedUsername)) {
                        isUserExcluded = true;
                    }
                });

                if (isUserExcluded) {
                    userCard.style.display = 'none';
                    if (!hiddenUsernamesOnPage.includes(username || 'Utilisateur inconnu')) {
                        hiddenUsernamesOnPage.push(username || 'Utilisateur inconnu');
                    }
                } else {
                    userCard.style.display = '';
                }
            });
            updateNoteElement(hiddenUsernamesOnPage);
        }


        if (isMessagePage) {
            const messageListItems = document.querySelectorAll('li[id^="conversation_"]');
            messageListItems.forEach(item => {
                const usernameElement = item.querySelector('h3');
                const username = usernameElement ? usernameElement.textContent : null;
                if (username) {
                    let isUserExcluded = false;
                    excludedUsers.forEach(excludedEntry => {
                        const [excludedUsername] = excludedEntry.split('//');
                        if (username && excludedUsername && username === excludedUsername) {
                            isUserExcluded = true;
                        }
                    });

                    if (isUserExcluded) {
                        item.style.opacity = '0.5';
                    } else {
                        item.style.opacity = '1';
                    }
                }
            });
        }


        const infotainmentTags = document.querySelectorAll('infotainment');
        infotainmentTags.forEach(infotainmentTag => {
            infotainmentTag.style.display = 'none';
        });

        filterMessageList();
    }

    function addUserToExclusionList(userDescriptor) {
        let username = userDescriptor.username || '';
        let userId = userDescriptor.userId || '';
        const exclusionEntry = `${username}//${userId}`;

        if (!excludedUsers.includes(exclusionEntry)) {
            excludedUsers.push(exclusionEntry);
            GM_setValue('excludedUsers', excludedUsers);
        }
        hideExcludedElements();
    }

    function removeUserFromExclusionList(userDescriptor) {
        excludedUsers = excludedUsers.filter(entry => {
            return entry !== userDescriptor.exclusionEntry;
        });

        GM_setValue('excludedUsers', excludedUsers);

        hideExcludedElements();
    }


    function createExcludeButton(element, elementType) {
        let username = null;
        let userId = null;
        let isExcluded = false;
        const isUserProfilePage = window.location.pathname.startsWith('/users/');

        if (elementType === 'userCard') {
            if (element.id) {
                userId = element.id.substring(3);
                const usernameElement = element.querySelector('user-infos h2.text-display-h3');
                username = usernameElement ? usernameElement.textContent : null;
            } else if (isUserProfilePage) {
                userId = window.location.pathname.split('/')[2];
                if (!userId) return;
                username = document.querySelector('user-info h2').textContent;
            } else {
                return;
            }

        } else if (elementType === 'messageList') {
            const usernameElement = element.querySelector('h3');
            username = usernameElement ? usernameElement.textContent : null;
        }

        if (!username && !userId) return;

        const userDescriptor = {username: username, userId: userId};
        const exclusionEntry = `${username}//${userId}`;
        isExcluded = excludedUsers.includes(exclusionEntry) || excludedUsers.some(excluded => excluded.endsWith(`//${userId}`)) || excludedUsers.some(excluded => excluded.startsWith(`${username}//`));


        const excludeButton = document.createElement('div');
        excludeButton.classList.add('exclude-user-button');

        const symbolSpan = document.createElement('span');
        symbolSpan.classList.add('exclude-cross-symbol');
        symbolSpan.innerHTML = isExcluded ? '+' : '×';
        excludeButton.appendChild(symbolSpan);
        excludeButton.classList.toggle('excluded', isExcluded);


        excludeButton.addEventListener('click', function(event) {
            event.preventDefault();
            const currentlyExcluded = excludeButton.classList.contains('excluded');
            if (currentlyExcluded) {
                removeUserFromExclusionList(userDescriptor);
                symbolSpan.innerHTML = '×';
            } else {
                addUserToExclusionList(userDescriptor);
                symbolSpan.innerHTML = '+';
            }
            excludeButton.classList.toggle('excluded');
            if (elementType === 'userCard' && !isUserProfilePage) {
                element.style.display = currentlyExcluded ? '' : 'none';
            }
        });

        let headerElement;
        if (elementType === 'userCard') {
            headerElement = element.querySelector('header');
        } else if (elementType === 'messageList') {
            headerElement = element;
        }


        if (headerElement) {
            headerElement.style.position = 'relative';
            headerElement.appendChild(excludeButton);
        } else {
            console.warn("Header element not found in element:", element);
            element.appendChild(excludeButton);
        }

        if (isUserProfilePage) {
            excludeButton.classList.add('profile-page-button');
        }
    }

    function addExcludeButtonsToUserCards() {
        const userCards = document.querySelectorAll('user-card');
        userCards.forEach(userCard => {
            let userId;
             if (userCard.id) {
                userId = userCard.id.substring(3);
            } else if (window.location.pathname.startsWith('/users/')) {
                userId = window.location.pathname.split('/')[2];
                 if (!userId) return;
            } else {
                return;
            }
            const usernameElement = userCard.querySelector('user-infos h2.text-display-h3');
            const username = usernameElement ? usernameElement.textContent : null;
            const userDescriptor = {username: username, userId: userId};
            const exclusionEntry = `${username}//${userId}`;
            const isExcluded = excludedUsers.includes(exclusionEntry) || excludedUsers.some(excluded => excluded.endsWith(`//${userId}`)) || excludedUsers.some(excluded => excluded.startsWith(`${username}//`));


            if (!isExcluded) {
                 createExcludeButton(userCard, 'userCard');
            } else {
                createExcludeButton(userCard, 'userCard');
                userCard.style.display = window.location.href.startsWith('https://www.nouslib.com/users') && !window.location.href.includes('/users/') ? 'none' : '';
            }
        });
    }

    function addExcludeButtonsToMessageList() {
        const messageListItems = document.querySelectorAll('li[id^="conversation_"]');
        messageListItems.forEach(item => {
            const usernameElement = item.querySelector('h3');
            const username = usernameElement ? usernameElement.textContent : null;
            if (username) {
                 const userDescriptor = {username: username};
                 const isExcluded = excludedUsers.includes(userDescriptor) || excludedUsers.some(excluded => excluded.startsWith(`${username}//`));
                if (!isExcluded) {
                    createExcludeButton(item, 'messageList');
                } else {
                    createExcludeButton(item, 'messageList');
                    item.style.display = '';
                }
            }
        });
    }

    function filterMessageList() {
        const messageListItems = document.querySelectorAll('li[id^="conversation_"]');
        messageListItems.forEach(item => {
            if (filterExcludedMessages) {
                if (item.style.opacity === '0.5') {
                    item.style.display = 'none';
                } else {
                    item.style.display = '';
                }
            } else {
                item.style.display = '';
            }
        });
    }


    function applyScriptLogic() {
        addExcludeButtonsToUserCards();
        addExcludeButtonsToMessageList();
        hideExcludedElements();
        createMessageFilterButton();
        filterMessageList();

        observeMessageList();
    }

    function observeMessageList() {
        const messageListContainer = document.querySelector('page-layout ul.mx-6.grid.gap-2');
        if (!messageListContainer) {
            console.warn('Message list container not found. MutationObserver cannot be attached.');
            return;
        }

        if (messageListObserver) {
            messageListObserver.disconnect();
        }

        messageListObserver = new MutationObserver(function(mutationsList, observer) {
            for(const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    console.log('New message list items detected. Re-applying script logic.');
                    applyScriptLogic();
                    break;
                }
            }
        });

        messageListObserver.observe(messageListContainer, { childList: true, subtree: false });
        console.log('MutationObserver attached to message list.');
    }


    function createMessageFilterButton() {
        const isMessagePage = window.location.href.startsWith('https://www.nouslib.com/account/pmessages');
        if (!isMessagePage) {
            return;
        }

        const messageNav = document.querySelector('switch-nav');
        if (!messageNav) {
            console.warn('Message nav element not found. Filter button cannot be created.');
            return;
        }

        if (document.querySelector('#filter-excluded-messages-button')) {
            return;
        }

        const filterButton = document.createElement('button');
        filterButton.id = 'filter-excluded-messages-button';
        filterButton.classList.add('button-tab');
        filterButton.textContent = 'Exclus';
        filterButton.addEventListener('click', function() {
            filterExcludedMessages = !filterExcludedMessages;
            filterButton.classList.toggle('active', filterExcludedMessages);
            filterMessageList();
        });

        messageNav.appendChild(filterButton);
    }


    applyScriptLogic();


    GM_addStyle(`
        #exclusion-note {
            margin-bottom: 0;
            padding: 0.3em 0.5em;
            border-bottom: none;
            text-align: left;
        }

        #exclusion-note b {
            font-weight: bold;
        }

        #hidden-users-list-container {
            margin-top: 0.3em;
            text-align: left;
            display: inline-flex;
            align-items: center;
        }


        #toggle-hidden-list-button {
            background-color: transparent;
            border: none;
            padding: 0;
            margin-left: 0.2em;
            display: inline-block;
        }


        #hidden-users-list {
            margin-top: 0.3em;
            padding-left: 1em;
            max-height: 150px;
            overflow-y: auto;
            font-size: 0.9em;
            text-align: left;
            scrollbar-width: thin;
            scrollbar-color: rgba(128, 128, 128, 0.3) rgba(220, 220, 220, 0.3);
        }


        #hidden-users-list::-webkit-scrollbar {
            width: 8px;
        }

        #hidden-users-list::-webkit-scrollbar-track {
            background-color: rgba(220, 220, 220, 0.3);
            border-radius: 4px;
        }

        #hidden-users-list::-webkit-scrollbar-thumb {
            background-color: rgba(128, 128, 128, 0.3);
            border-radius: 4px;
        }

        #hidden-users-list::-webkit-scrollbar-thumb:hover {
            background-color: rgba(128, 128, 128, 0.5);
        }


        .list-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 18px;
            height: 18px;
            font-size: 14px;
            border-radius: 50%;
            text-align: center;
            cursor: pointer;
            color: white;
        }

        .list-icon.eye-icon {
            background-color: #aaa;
        }

        .list-icon.remove-icon {
            background-color: green;
            font-weight: bold;
        }

        #user-preview-image {
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
             max-width: 300px;
            max-height: 300px;
            position: fixed; /* Changed to fixed */
            z-index: 100;
            pointer-events: none; /* Added pointer-events: none; */
        }


        .exclude-user-button {
            position: absolute;
            top: 8px;
            left: 8px;
            width: 24px;
            height: 24px;
            background-color: red;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.6;
            transition: opacity 0.2s ease-in-out;
            z-index: 10;
        }

        .exclude-user-button:hover {
            opacity: 1.0;
        }

        .exclude-user-button.excluded {
            background-color: green;
        }

        .exclude-user-button.profile-page-button {
            top: 43px;
        }


        .exclude-cross-symbol, .list-toggle-symbol {
            color: white;
            font-size: 20px;
            line-height: 1;
            font-weight: bold;
            display: inline-block;
            vertical-align: middle;
            text-align: center;
            width: 100%;
        }

        #filter-excluded-messages-button.active {
            font-weight: bold;
        }
    `);

    setInterval(function() {
        if (window.location.href !== currentURL) {
            currentURL = window.location.href;
            applyScriptLogic();
        }
    }, 500);

})();