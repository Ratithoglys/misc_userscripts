// ==UserScript==
// @name         Nouslib – Export de conversation - Ebumna
// @namespace    https://ebumna.net/
// @version      1.0.2
// @license      CC BY-SA 4.0
// @description  Ajoute un bouton d'export (JSON / CSV / Markdown / TXT) sur une conversation de courriers, en distinguant mes messages de ceux de l'interlocuteur. Un bouton à côté de chaque message de l'interlocuteur exporte la fin de la conversation à partir de ce message.
// @author       Lénaïc JAOUEN
// @match        https://www.nouslib.com/*
// @match        https://nouslib.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nouslib.com
// @updateURL    https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/nouslib_export_conversation.user.js
// @downloadURL  https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/nouslib_export_conversation.user.js
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const BTN_ID = 'nlx-export-btn';
    const MENU_ID = 'nlx-export-menu';
    const MSG_BTN_CLASS = 'nlx-export-msg-btn';
    let menuAnchor = null;

    /* ---------- Extraction ---------- */

    // Convertit le contenu HTML d'un message en texte brut (<p> => paragraphes, <br> => retour ligne)
    function nodeToText(node) {
        let out = '';
        node.childNodes.forEach((n) => {
            if (n.nodeType === Node.TEXT_NODE) {
                out += n.textContent.replace(/\s+/g, ' ');
            } else if (n.nodeType === Node.ELEMENT_NODE) {
                const tag = n.tagName;
                if (tag === 'BR') out += '\n';
                else if (tag === 'IMG') out += n.getAttribute('alt') || '';
                else if (tag === 'P' || tag === 'DIV') out += nodeToText(n) + '\n\n';
                else out += nodeToText(n);
            }
        });
        return out;
    }

    function cleanText(raw) {
        return raw
            .replace(/[ \t]*\n[ \t]*/g, '\n') // espaces autour des retours ligne
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    }

    // "Le 12/11/2026" -> "2026-11-12"
    function parseDateLabel(label) {
        const m = (label || '').match(/(\d{2})\/(\d{2})\/(\d{4})/);
        return m ? `${m[3]}-${m[2]}-${m[1]}` : null;
    }

    // "13h08" -> "13:08"
    function parseTime(label) {
        const m = (label || '').match(/(\d{1,2})\s*h\s*(\d{2})/i);
        return m ? `${m[1].padStart(2, '0')}:${m[2]}` : null;
    }

    function getMyUsername() {
        const a = document.querySelector('#main-nav-submenu a[href="/account"]');
        return a ? a.textContent.trim() : 'moi';
    }

    function extractConversation() {
        const header = document.querySelector('conversation-header');
        const contactName =
            (header && header.querySelector('strong') && header.querySelector('strong').textContent.trim()) ||
            'interlocuteur';
        const profileLink = header && header.querySelector('a[href*="/users/"]');
        const profileUrl = profileLink ? profileLink.href : null;
        const contactId = profileUrl ? (profileUrl.match(/users\/(\d+)/) || [])[1] || null : null;
        const myName = getMyUsername();
        const subject = (document.querySelector('.page-header-title') || {}).textContent || null;
        const convId = (location.pathname.match(/pmessages\/([0-9a-f]+)/) || [])[1] || null;

        const list = document.querySelector('scroll-box ul');
        const messages = [];
        let currentDate = null;
        let idx = 0;

        if (list) {
            Array.from(list.children).forEach((li) => {
                const tag = li.querySelector(':scope > span.tag');
                if (tag) {
                    currentDate = parseDateLabel(tag.textContent);
                    return;
                }
                const card = li.querySelector('message-card');
                if (!card) return;

                const isMe =
                    card.getAttribute('owner') === 'current-user' ||
                    !!li.querySelector('message-item.is-outgoing');
                const contentEl = card.querySelector('message-content .break-words') || card.querySelector('message-content');
                const footer = li.querySelector('message-footer');
                const time = parseTime(footer ? footer.textContent : '');

                idx += 1;
                messages.push({
                    index: idx,
                    date: currentDate,
                    time: time,
                    datetime: currentDate && time ? `${currentDate}T${time}` : null,
                    sender: isMe ? 'me' : 'contact',
                    author: isMe ? myName : contactName,
                    text: contentEl ? cleanText(nodeToText(contentEl)) : '',
                });
            });
        }

        return {
            source: 'nouslib.com',
            exportedAt: new Date().toISOString(),
            url: location.href,
            conversationId: convId,
            subject: subject ? subject.trim() : null,
            me: { username: myName },
            contact: { username: contactName, id: contactId, profileUrl },
            messageCount: messages.length,
            messages,
        };
    }

    /* ---------- Formats ---------- */

    function toJSON(d) {
        return JSON.stringify(d, null, 2);
    }

    function csvCell(v) {
        const s = v == null ? '' : String(v);
        return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    }

    function toCSV(d) {
        const cols = ['index', 'date', 'time', 'sender', 'author', 'text'];
        const rows = [cols.join(',')];
        d.messages.forEach((m) => rows.push(cols.map((c) => csvCell(m[c])).join(',')));
        return '\uFEFF' + rows.join('\r\n'); // BOM pour Excel
    }

    function toMarkdown(d) {
        const lines = [];
        lines.push(`# Conversation : ${d.me.username} ↔ ${d.contact.username}`);
        if (d.subject) lines.push(`_Sujet : ${d.subject}_`);
        lines.push(`_Exportée le ${new Date(d.exportedAt).toLocaleString('fr-FR')} — ${d.messageCount} messages_`);
        lines.push('');
        let lastDate = null;
        d.messages.forEach((m) => {
            if (m.date !== lastDate) {
                lines.push(`\n## ${m.date || 'Date inconnue'}\n`);
                lastDate = m.date;
            }
            const who = m.sender === 'me' ? `**${m.author} (moi)**` : `**${m.author}**`;
            const quoted = m.text.split('\n').join('\n> ');
            lines.push(`${who} — ${m.time || '??:??'}\n> ${quoted}\n`);
        });
        return lines.join('\n');
    }

    function toTXT(d) {
        const lines = [];
        let lastDate = null;
        d.messages.forEach((m) => {
            if (m.date !== lastDate) {
                lines.push(`\n=== ${m.date || 'Date inconnue'} ===`);
                lastDate = m.date;
            }
            const tag = m.sender === 'me' ? '[MOI]' : '[LUI/ELLE]';
            lines.push(`${m.time || '??:??'} ${tag} ${m.author} : ${m.text.replace(/\n/g, '\n      ')}`);
        });
        return lines.join('\n').trim();
    }

    const FORMATS = {
        json: { label: 'JSON', ext: 'json', mime: 'application/json', fn: toJSON },
        csv: { label: 'CSV', ext: 'csv', mime: 'text/csv', fn: toCSV },
        md: { label: 'Markdown', ext: 'md', mime: 'text/markdown', fn: toMarkdown },
        txt: { label: 'Texte brut', ext: 'txt', mime: 'text/plain', fn: toTXT },
    };

    // Ne garde que les messages à partir de l'index donné (0-based) jusqu'à la fin
    function sliceFrom(data, startIndex) {
        if (!startIndex) return data;
        data.messages = data.messages.slice(startIndex);
        data.messageCount = data.messages.length;
        return data;
    }

    // Position (0-based) du message dans le tableau extrait = nb de message-card avant ce <li>
    function messageOrdinal(li) {
        const list = document.querySelector('scroll-box ul');
        if (!list) return 0;
        let n = 0;
        for (const child of list.children) {
            if (child === li) return n;
            if (child.querySelector('message-card')) n += 1;
        }
        return n;
    }

    /* ---------- Téléchargement ---------- */

    function download(filename, content, mime) {
        const blob = new Blob([content], { type: mime + ';charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
    }

    function runExport(key, startIndex = 0) {
        const data = sliceFrom(extractConversation(), startIndex);
        const f = FORMATS[key];
        const safe = (s) => String(s).replace(/[^\w\-]+/g, '_');
        const stamp = new Date().toISOString().slice(0, 10);
        const suffix = startIndex > 0 ? `_partiel-msg${startIndex + 1}` : '';
        download(`nouslib_${safe(data.contact.username)}_${stamp}${suffix}.${f.ext}`, f.fn(data), f.mime);
    }

    async function copyJSON(startIndex = 0) {
        const txt = toJSON(sliceFrom(extractConversation(), startIndex));
        try {
            await navigator.clipboard.writeText(txt);
        } catch (e) {
            const ta = document.createElement('textarea');
            ta.value = txt;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
        }
    }

    /* ---------- UI ---------- */

    function injectStyle() {
        if (document.getElementById('nlx-style')) return;
        const st = document.createElement('style');
        st.id = 'nlx-style';
    st.textContent = `
      #${BTN_ID}{cursor:pointer;border:0;background:transparent;font-size:20px;line-height:1;padding:6px 8px;color:inherit}
      #${MENU_ID}{position:fixed;z-index:99999;min-width:170px;padding:6px;border-radius:10px;
        background:#fff;color:#222;box-shadow:0 6px 24px rgba(0,0,0,.25);font:14px/1.3 system-ui,sans-serif}
      @media (prefers-color-scheme:dark){#${MENU_ID}{background:#2f2727;color:#eee}}
      #${MENU_ID} button{display:block;width:100%;text-align:left;border:0;background:transparent;
        color:inherit;padding:8px 10px;border-radius:6px;cursor:pointer;font:inherit}
      #${MENU_ID} button:hover{background:rgba(128,128,128,.2)}
      #${MENU_ID} hr{border:0;border-top:1px solid rgba(128,128,128,.3);margin:4px 0}
      .${MSG_BTN_CLASS}{cursor:pointer;border:0;background:transparent;font-size:14px;line-height:1;padding:2px 4px;color:inherit;opacity:.65}
      .${MSG_BTN_CLASS}:hover{opacity:1}
    `;
        document.head.appendChild(st);
    }

    function closeMenu() {
        const m = document.getElementById(MENU_ID);
        if (m) m.remove();
        menuAnchor = null;
        document.removeEventListener('click', outsideClick, true);
    }

    function outsideClick(e) {
        const m = document.getElementById(MENU_ID);
        if (m && !m.contains(e.target) && e.target.id !== BTN_ID && !e.target.closest('.' + MSG_BTN_CLASS)) closeMenu();
    }

    function openMenu(anchor, startIndex = 0) {
        closeMenu();
        menuAnchor = anchor;
        const menu = document.createElement('div');
        menu.id = MENU_ID;

        Object.entries(FORMATS).forEach(([key, f]) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.textContent = `Exporter en ${f.label}`;
            b.addEventListener('click', () => {
                runExport(key, startIndex);
                closeMenu();
            });
            menu.appendChild(b);
        });
        menu.appendChild(document.createElement('hr'));
        const c = document.createElement('button');
        c.type = 'button';
        c.textContent = 'Copier le JSON';
        c.addEventListener('click', async () => {
            await copyJSON(startIndex);
            c.textContent = 'Copié ✓';
            setTimeout(closeMenu, 700);
        });
        menu.appendChild(c);

        document.body.appendChild(menu);
        const r = anchor.getBoundingClientRect();
        menu.style.top = r.bottom + 6 + 'px';
        menu.style.left = Math.max(8, Math.min(window.innerWidth - menu.offsetWidth - 8, r.right - menu.offsetWidth)) + 'px';
        setTimeout(() => document.addEventListener('click', outsideClick, true), 0);
    }

    function ensureButton() {
        if (!/\/account\/pmessages\//.test(location.pathname)) return;
        if (document.getElementById(BTN_ID)) return;
        const trailing = document.querySelector('.header-trailing');
        if (!trailing || !document.querySelector('conversation-header')) return;

        injectStyle();
        const btn = document.createElement('button');
        btn.id = BTN_ID;
        btn.type = 'button';
        btn.title = 'Exporter la conversation';
        btn.textContent = '⬇️';
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (document.getElementById(MENU_ID) && menuAnchor === btn) closeMenu();
            else openMenu(btn, 0);
        });
        trailing.insertBefore(btn, trailing.firstChild);
    }

    // Un petit bouton ⬇️ à côté de chaque message de l'interlocuteur :
    // exporte la fin de la conversation à partir de ce message
    function ensureMessageButtons() {
        if (!/\/account\/pmessages\//.test(location.pathname)) return;
        const list = document.querySelector('scroll-box ul');
        if (!list) return;

        injectStyle();
        Array.from(list.children).forEach((li) => {
            if (li.querySelector(':scope > span.tag')) return; // séparateur de date
            const card = li.querySelector('message-card');
            if (!card) return;
            if (li.querySelector('.' + MSG_BTN_CLASS)) return; // déjà fait
            const isMe =
                card.getAttribute('owner') === 'current-user' ||
                !!li.querySelector('message-item.is-outgoing');
            if (isMe) return;

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = MSG_BTN_CLASS;
            btn.title = 'Exporter à partir de ce message';
            btn.textContent = '⬇️';
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (document.getElementById(MENU_ID) && menuAnchor === btn) closeMenu();
                else openMenu(btn, messageOrdinal(li));
            });
            const footer = li.querySelector('message-footer');
            (footer || li).appendChild(btn);
        });
    }

    function ensureAll() {
        ensureButton();
        ensureMessageButtons();
    }

    // Le site utilise Turbo : on réinjecte les boutons après chaque navigation / changement du DOM
    ensureAll();
    new MutationObserver(ensureAll).observe(document.documentElement, { childList: true, subtree: true });
    document.addEventListener('turbo:load', ensureAll);
})();
