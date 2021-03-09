---
title: "TIL: Déclencher un build du CI depuis la ligne de commandes"
date: 2021-03-09T23:10:56+01:00
draft: false
toc: false
images:
tags:
  - git
  - ci
  - today I learnt
---

Chez [ADventori](https://adventori.com/), nous utilisons [Gitlab CI](https://docs.gitlab.com/ee/ci/) pour déployer nos environnements de staging quand le code change sur notre branche principale.
Cet après-midi, je voulais redéployer un de nos environnements sans modifier le code.

Une solution possible était de d'effectuer une modification factice sur notre base de code, par exemple ajouter une espace (ou [un espace?](https://www.druide.com/fr/enquetes/un-espace-ou-une-espace)) dans un commentaire.
Cette modification déclencherait un build dans Gitlab CI et résulterait à un nouveau déploiement.
Le problème serait résolu mais la modification du code est artificielle et superflue.

Puis, j'ai découvert l'option `--allow-empty` de `git commit` grâce à ce tweet: {{< tweet 1366466258393161729 >}}

Ainsi, j'ai exécuté la commande suivante, poussé sur noter branche principale et noter environnement de staging fut déployé.

```bash
git commit --allow-empty -m 'Redeploy staging environment'
```

{{< image src="https://media.giphy.com/media/jS27LWasgUIYrXtP83/giphy.gif" alt="Job done!" position="center" >}}