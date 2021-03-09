---
title: "Using Joplin as Note Taking Tool"
date: 2021-02-10T22:26:20+01:00
draft: true
toc: true
images:
tags:
- knowledge management
---

## Outils de prise de notes

* [Roam Research](https://roamresearch.com/)
* [Apple Notes](https://www.icloud.com/notes)
* [RemNote](https://remnote.io/)
* [Joplin](https://joplinapp.org)
* [Obsidian](https://obsidian.md/)
* [Foam](https://foambubble.github.io/foam/)
* [The Archive](https://zettelkasten.de/the-archive/)

| Outil         | Markdown | Liens bidirectionnels | Client macOS | Client iOS | Stockage     |
| ------------- |:--------:|:---------------------:|:------------:|:----------:|:------------:|
| Apple Notes   | ❌       | ❌                    | ✅           | ✅         |              |
| Roam Research | ✅       | ✅                    | Web          | Web        | Propriétaire |
| RemNote       | ✅       | ✅                    | Web          | ✅         |              |
| Joplin        | ✅       | ✅  (avec un plugin)  | ✅           | ✅         |              |
| Obsidian      | ✅       | ✅                    | ✅           | ❌         |              |
| Foam          | ✅       | ✅                    | ✅ (VS Code) | ❌         |              |
| The Archive   | ✅       | ❌                    | ✅           | ❌         |              |


## Paramétrage de Joplin

### Installation

L'installation de Joplin est simple sur macOs. Comme j'utilise [brew](https://brew.sh/) pour gérer mes applications (s’il existe une formula ou un cask bien sûr), il m'a suffit d'exécuter

```bash
brew install --cask joplin
```

Pour ceux qui n'utilisent pas brew ou sont sur un autre OS, il est possible de télécharger les fichiers d'installation sur le [Github du projet](https://github.com/laurent22/joplin/releases/).

Pour le client iOS, c'est très simple, il est disponible dans l'[AppStore](https://itunes.apple.com/us/app/joplin/id1315599797)

### Mise en place de la synchronisation

Il est possible de synchroniser ses notes sur différents appareils. J'utilise la version macOs et la version iPhone.
Plusieurs méthodes existent pour la synchronisation :

* Dropbox
* File system
* WebDAV
* Onedrive
* Nextcloud
* S3
* Joplin serveur

Je voulais garder la main sur le stockage de mes notes, j’utilise donc WebDAV pour copier les fichiers sur mon espace [Fastmail](https://ref.fm/u22615752) (si vous passez par ce lien pour souscrire un abonnement à [Fastmail](https://ref.fm/u22615752), vous aurez 10% de réduction).

J'ai un peu lutté pour faire fonctionner la réplication, mais grâce à [ce commentaire](https://github.com/laurent22/joplin/issues/563#issuecomment-419618248), tout s'est passé comme sur des roulettes.
Il fallait donc:

1. créer un répertoire `joplin` dans l'espace fichier de Fastmail
2. créer un [mot de passe d'application](https://www.fastmail.help/hc/en-us/articles/360058752854) dans Fastmail avec les droits **Files (FTP/WebDAV)**
3. dans Joplin, aller dans **Préférences > Synchronisation**
4. Choisir `WebDAV` comme **cible de la synchronisation**
5. Renseigner `https://myfiles.fastmail.com/joplin/` dans le champ **WebDAV : URL**
6. Renseigner l'adresse fastmail complète dans le champ **Utilisateur** et le **mot de passe** créé lors de l'étape 2
7. Recommencer les étapes 3 à 6 sur tous les appareils à synchroniser

Et voilà, vous êtes prêts à saisir vos notes !





