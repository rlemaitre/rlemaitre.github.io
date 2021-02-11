---
title: "Hello World!"
date: 2021-02-11T19:27:29+01:00
author: rlemaitre
draft: false
toc: false
images:
tags:
  - blog
---

Ça fait un long moment que je voulais avoir mon blog.
Écrire plus et mieux est l'un de mes objectifs de cette année et le blog est un moyen assez simple d'y parvenir.

Je vais essayer d'écrire à propos de sujets qui m'intéressent : le dev, l'apprentissage, les moyens de devenir plus efficace (aka productivité), les jeux de société et tout ce qui peut me passer par la tête et qui mérite d'être partagé. 

## Quelle est ma plateforme de blog ? 

Une fois que je me suis décidé à créer ce blog, que j'ai trouvé les sujets sur lesquels écrire, il me fallait trouver comment le faire.
J'avais plusieurs possibilités pour le faire :

- Écrire des posts sur [Medium](https://medium.com/@rlemaitre)
- Écrire des posts sur [dev.to](https://dev.to/rlemaitre)
- Héberger un blog en utilisant [wordpress](https://wordpress.com/)
- Utiliser un static site generator et l'héberger sur [Gitlab](https://docs.gitlab.com/ee/user/project/pages/) ou [GitHub](https://pages.github.com/)

Étant très attaché à la protection et à la confidentialité des données (à titre personnel, j'essaie d'utiliser le moins possible google, j'y reviendrai surement dans un futur article), j'ai fait le choix de ne pas utiliser un service tiers comme plateforme de publication principale.
Je suis un dev, le choix du static site generator avec des articles écrits en Markdown et un hébergement basé sur Git s'est donc naturellement imposé à moi.
Cette solution permet même de garantir une meilleure durabilité dans le temps, [comme l'écrit @brandur](https://brandur.org/fragments/graceful-degradation-time).
Je me suis tourné vers [Hugo](https://gohugo.io/) et le thème [Hello Friend NG](https://github.com/rhazdon/hugo-theme-hello-friend-ng) de [Djordje Atlialp](https://atlialp.com/).

Ce thème permettant d'avoir des versions du site et du blog en plusieurs langues, je vais essayer d'écrire au maximum mes articles [en français](/fr/posts/) et [en anglais](/posts/).

Je voulais qu'il y ait un système de commentaires sur le blog. Cependant, à cause de [problèmes de protection de données](https://supunkavinda.blog/disqus), je ne voulais pas utiliser disqus.
Je me suis orienté vers [Utterances](https://utteranc.es/) qui lui est open source, sans aucun tracking et qui stocke les commentaires comme des issues GitHub.
N'hésitez donc pas à commenter les articles, il suffit d'avoir un compte github pour le faire.

