Quand on conçoit une application, on finit souvent avec des types propres au domaine, qui portent tous des contraintes qu’on essaie de faire respecter autant que possible : un âge est positif, une date de livraison ne peut pas être dans le passé, etc.
Bien modéliser les données fait partie de ce qui fait le succès de Scala et de la programmation fonctionnelle en général, mais cela amène soit du code répétitif (il faut refaire la validation encore et encore), soit une confiance pure dans les conventions.

Il y a pourtant une issue.
Voici la bibliothèque [Iron](https://github.com/Iltotore/iron).

Iron est une bibliothèque de contraintes de types qui permet d’avoir un modèle sûr, déclaratif et plus intelligent.
Elle garantit un flux continu de données valides, des endpoints de l’API jusqu’à la base de données, et élimine toute une classe de bugs.
Grâce aux types opaques, aux inlines et au nouveau système de macros, elle n’a aucun coût à l’exécution, aucune dépendance, et ne ralentit pas la compilation.
Dans ce talk, nous voyons d’abord les différentes techniques pour appliquer des contraintes dans nos domaines.
Nous présentons ensuite Iron, ses fonctionnalités, ses extensions et ses intégrations.
Nous terminons par la démonstration d’une application complète qui fait respecter ses contraintes de bout en bout.
