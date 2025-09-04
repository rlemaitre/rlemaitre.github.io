---
{"publish":true,"permalink":"/fr/articles/til/trigger-a-ci-pipeline-from-command-line.md","aliases":"T I L : D é c l e n c h e r u n b u i l d d u C I d e p u i s l a l i g n e d e c o m m a n d e s","title":"Déclencher un build du CI depuis la ligne de commandes","created":"2021-03-09T23:10:56+01:00","tags":["git","ci","today-i-learned"],"cssclasses":""}
---




Chez [ADventori](https://adventori.com/), nous utilisons [Gitlab CI](https://docs.gitlab.com/ee/ci/) pour déployer nos environnements de staging quand le code change sur notre branche principale.
Cet après-midi, je voulais redéployer un de nos environnements sans modifier le code.

Une solution possible était de d'effectuer une modification factice sur notre base de code, par exemple ajouter une espace (ou [un espace?](https://www.druide.com/fr/enquetes/un-espace-ou-une-espace)) dans un commentaire.
Cette modification déclencherait un build dans Gitlab CI et résulterait à un nouveau déploiement.
Le problème serait résolu mais la modification du code est artificielle et superflue.

Puis, j'ai découvert l'option `--allow-empty` de `git commit` grâce à ce tweet:
![[xx_system/attachments/tweet-1366466258393161729.png]]

Ainsi, j'ai exécuté la commande suivante, poussé sur noter branche principale et noter environnement de staging fut déployé.

```bash
git commit --allow-empty -m 'Redeploy staging environment'
```

![Job done!]("https://media.giphy.com/media/jS27LWasgUIYrXtP83/giphy.gif)