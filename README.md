# misc_userscripts

Collection de userscripts pour Tampermonkey / Violentmonkey, par Lénaïc JAOUEN.

## Installation

Installer l'extension Tampermonkey (ou Violentmonkey), puis cliquer sur le lien
d'installation du script voulu. Les mises à jour automatiques passent par les
`@updateURL` / `@downloadURL` de chaque cartouche, qui pointent vers la branche
`main` de ce dépôt.

Les noms affichés dans Tampermonkey se terminent tous par « - Ebumna », pour
faciliter le filtrage.

## Scripts

| Fichier | Script | Fonction |
| --- | --- | --- |
| `aistudio.user.js` | AI Studio – Mise en valeur des messages utilisateur - Ebumna | Ajoute une bordure et un fond subtils aux tours de l'utilisateur dans AI Studio. |
| `animeplanet.user.js` | Anime-Planet – Colorisation des statuts de liste - Ebumna | Colore les statuts des listes Anime-Planet (non vu/lu, en cours, à voir, abandonné) par la bordure et la couleur du texte. |
| `cricfree.user.js` | Cricfree – Page épurée - Ebumna | Ne garde que le contenu central de la page Cricfree, en supprimant les deux autres panneaux autour du lecteur. |
| `gcal_today.user.js` | Google Calendar – Bouton « Aujourd'hui » - Ebumna | Ajoute une icône colorée pour définir la date à aujourd'hui (marges réduites). |
| `github_visibility_badges.user.js` | GitHub – Colorisation des badges de visibilité - Ebumna | Colorise les badges de visibilité des dépôts GitHub : Public (vert), Private (rouge), Public archive (orange), Private archive (violet). |
| `insta_vidctrl.user.js` | Instagram & Facebook – Video Controls - Ebumna | Adds video player controls to Instagram videos and keyboard shortcuts for fullscreen (press 'f') and mute (press 'm'). |
| `nouslib.user.js` | Nouslib – Hide Users - Ebumna | Enhanced hidden users list with working preview and remove buttons. |
| `twitch_no_stories.user.js` | Twitch – Remove Stories - Ebumna | Remove stories. |
| `youtubedefaultaudiotrack.user.js` | YouTube – Default Audio Track - Ebumna | Makes it possible to select the desired Audio Track played by default and adds a badge to indicate if multiple audio languages are available. |
| `youtubegrid.user.js` | YouTube – Grid Customizer - Ebumna | Customize the number of items per row on the YouTube subscriptions page. |
| `youtubehistory.user.js` | YouTube – Hide Watched Videos Extended - Ebumna | Hides watched videos (and shorts) from your YouTube subscriptions page. |
| `youtubeicon.user.js` | YouTube – Custom Favicon - Ebumna | Remplace le favicon YouTube par un favicon personnalisé, sauf sur les pages de lecture et YouTube Music. |
| `youtubeinfscroller.user.js` | YouTube – Infinite Scroll Manager - Ebumna | Contrôle discret du défilement infini avec emojis et texte adaptés. |

Installation directe (liens raw, branche `main`) :

- [aistudio.user.js](https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/aistudio.user.js)
- [animeplanet.user.js](https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/animeplanet.user.js)
- [cricfree.user.js](https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/cricfree.user.js)
- [gcal_today.user.js](https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/gcal_today.user.js)
- [github_visibility_badges.user.js](https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/github_visibility_badges.user.js)
- [insta_vidctrl.user.js](https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/insta_vidctrl.user.js)
- [nouslib.user.js](https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/nouslib.user.js)
- [twitch_no_stories.user.js](https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/twitch_no_stories.user.js)
- [youtubedefaultaudiotrack.user.js](https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/youtubedefaultaudiotrack.user.js)
- [youtubegrid.user.js](https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/youtubegrid.user.js)
- [youtubehistory.user.js](https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/youtubehistory.user.js)
- [youtubeicon.user.js](https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/youtubeicon.user.js)
- [youtubeinfscroller.user.js](https://raw.githubusercontent.com/Ratithoglys/misc_userscripts/main/youtubeinfscroller.user.js)

## Licence

Voir le fichier [LICENSE](LICENSE). Les scripts originaux sont sous CC BY-SA 4.0.
Les scripts dérivés conservent leur licence d'origine, indiquée dans leur
cartouche : GPLv3 pour `insta_vidctrl.user.js`, MIT pour
`youtubedefaultaudiotrack.user.js` et `youtubehistory.user.js`.
