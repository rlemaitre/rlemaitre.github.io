---
title: "TIL : Configuration de la mémoire par défaut dans OpenJDK"
date: 2021-02-16T17:11:50+01:00
draft: false
toc: false
images:
tags:
  - java
  - today I learnt
---
Il s'agit du premier billet de la série "Today I learnt" (TIL, ou aujourd'hui j'ai appris en français).
Dans cette série, comme son nom l'indique, je vais écrire sur tout un tas de choses que je découvre.
Le but de tout cela est de me permettre de me souvenir plus facilement de certaines choses et, bien sûr, de les partager afin que d'autres n'aient pas de mal à les trouver.

Donc, cet après-midi, quelqu'un m'a demandé quelle était la configuration mémoire d'un tomcat s'exécutant dans Docker.
Nous n'avons pas défini de configuration particulière pour le tomcat, à l'exception du déploiement de notre application, donc la configuration par défaut est utilisée.

Donc, la question est devenue :

>  Quelle est la configuration mémoire par défaut d'une JVM OpenJDK 8 ?

D'après la [documentation Oracle](https://docs.oracle.com/javase/8/docs/technotes/tools/windows/java.html), _la valeur par défaut est choisie au runtime selon la configuration du système._

Il semble que cela dépende de l'architecture du serveur, de la mémoire système et du type de VM (serveur ou client).

Pour les configurations client, comme décrit dans le [Guide de tuning du GC](https://docs.oracle.com/javase/8/docs/technotes/guides/vm/gctuning/parallel.html#sthref30), la taille maximale de la heap est la moitié de la mémoire physique si celle-ci est inférieure à 192 mégaoctets (Mo) et sinon à un quart de la mémoire physique si celle-ci est inférieure à 1 gigaoctet (Go).

Pour les configurations serveur, comme décrit dans [le même guide](https://docs.oracle.com/javase/8/docs/technotes/guides/vm/gctuning/parallel.html#sthref31), la taille maximale de la heap est 1/4 de la mémoire physique, limité à 1 gigaoctet pour les JVM 32 bits et limité à 32 gigaoctets pour les JVM 64 bits.

Un moyen simple de savoir quelle est la valeur par défaut de votre JVM sur votre environnement est d'exécuter la commande suivante :

```bash
java -XX:+PrintFlagsFinal -version | grep MaxHeapSize
```

Le résultat pour notre JVM tournant dans un conteneur Docker est

```text
    uintx MaxHeapSize                              := 16833839104                         {product}
openjdk version "1.8.0_242"
OpenJDK Runtime Environment (build 1.8.0_242-b08)
OpenJDK 64-Bit Server VM (build 25.242-b08, mixed mode)
```

La valeur est indiquée en octets.
Donc, ici, la valeur par défaut est 16 Go, ce qui correspond à un quart de la mémoire physique de l'hôte (64 Go).

La commande `java -XX:+PrintFlagsFinal -version` affiche de nombreuses informations (plusieurs centaines de paramètres), comme la configuration de la mémoire et du garbage collector.
