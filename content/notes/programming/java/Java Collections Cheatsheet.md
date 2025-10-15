---
created: 2025-07-15T11:14:42+02:00
updated: 2025-07-15T11:25:26+02:00
publish: true
title: Java Collections Cheatsheet
---
## Hiérarchie des Collections

```
Collection<E>
├── List<E>
│   ├── ArrayList<E>
│   ├── LinkedList<E>
│   ├── Vector<E>
│   └── CopyOnWriteArrayList<E>
├── Set<E>
│   ├── HashSet<E>
│   ├── LinkedHashSet<E>
│   ├── TreeSet<E>
│   ├── EnumSet<E>
│   └── CopyOnWriteArraySet<E>
└── Queue<E>
    ├── ArrayDeque<E>
    ├── PriorityQueue<E>
    ├── LinkedList<E>
    └── BlockingQueue<E>
        ├── ArrayBlockingQueue<E>
        ├── LinkedBlockingQueue<E>
        ├── PriorityBlockingQueue<E>
        └── DelayQueue<E>

Map<K,V>
├── HashMap<K,V>
├── LinkedHashMap<K,V>
├── TreeMap<K,V>
├── EnumMap<K,V>
├── WeakHashMap<K,V>
├── IdentityHashMap<K,V>
├── ConcurrentHashMap<K,V>
└── ConcurrentSkipListMap<K,V>
```
## Interface Collection
### Méthodes principales

```java
// Modification
boolean add(E e)
boolean addAll(Collection<? extends E> c)
boolean remove(Object o)
boolean removeAll(Collection<?> c)
boolean retainAll(Collection<?> c)
void clear()

// Consultation
boolean contains(Object o)
boolean containsAll(Collection<?> c)
boolean isEmpty()
int size()

// Itération
Iterator<E> iterator()
Object[] toArray()
<T> T[] toArray(T[] a)

// Comparaison
boolean equals(Object o)
int hashCode()
```
## List - Listes ordonnées avec doublons

### ArrayList
**Utilisation** : Liste dynamique basée sur un tableau redimensionnable  
**Thread-safe** : Non  
**Ordre** : Insertion

| Opération          | Complexité    | Note                           |
| ------------------ | ------------- | ------------------------------ |
| `get(int)`         | O(1)          | Accès direct par index         |
| `set(int, E)`      | O(1)          | Modification directe           |
| `add(E)`           | O(1) amortisé | O(n) lors du redimensionnement |
| `add(int, E)`      | O(n)          | Décalage des éléments          |
| `remove(int)`      | O(n)          | Décalage des éléments          |
| `remove(Object)`   | O(n)          | Recherche + suppression        |
| `contains(Object)` | O(n)          | Recherche linéaire             |
| `indexOf(Object)`  | O(n)          | Recherche linéaire             |

```java
List<String> list = new ArrayList<>();
List<String> listWithCapacity = new ArrayList<>(100);
List<String> listFromCollection = new ArrayList<>(otherCollection);
```

### LinkedList
**Utilisation** : Liste doublement chaînée  
**Thread-safe** : Non  
**Ordre** : Insertion  
**Implements** : List, Deque

| Opération          | Complexité | Note                      |
| ------------------ | ---------- | ------------------------- |
| `get(int)`         | O(n)       | Parcours depuis début/fin |
| `set(int, E)`      | O(n)       | Parcours + modification   |
| `add(E)`           | O(1)       | Ajout en fin              |
| `add(int, E)`      | O(n)       | Parcours + insertion      |
| `addFirst(E)`      | O(1)       | Ajout en début            |
| `addLast(E)`       | O(1)       | Ajout en fin              |
| `remove(int)`      | O(n)       | Parcours + suppression    |
| `removeFirst()`    | O(1)       | Suppression début         |
| `removeLast()`     | O(1)       | Suppression fin           |
| `contains(Object)` | O(n)       | Recherche linéaire        |

```java
List<String> list = new LinkedList<>();
Deque<String> deque = new LinkedList<>();
```

### Vector
**Utilisation** : Version synchronisée d'ArrayList (legacy)  
**Thread-safe** : Oui (méthodes `synchronized`)  
**Ordre** : Insertion

| Opération          | Complexité    | Note                           |
| ------------------ | ------------- | ------------------------------ |
| `get(int)`         | O(1)          | Accès direct + synchronisation |
| `set(int, E)`      | O(1)          | Modification + synchronisation |
| `add(E)`           | O(1) amortisé | O(n) lors du redimensionnement |
| `remove(Object)`   | O(n)          | Recherche + suppression        |
| `contains(Object)` | O(n)          | Recherche linéaire             |

### CopyOnWriteArrayList
**Utilisation** : Liste thread-safe pour lectures fréquentes  
**Thread-safe** : Oui  
**Ordre** : Insertion

| Opération          | Complexité | Note                      |
| ------------------ | ---------- | ------------------------- |
| `get(int)`         | O(1)       | Lecture sans lock         |
| `add(E)`           | O(n)       | Copie complète du tableau |
| `remove(Object)`   | O(n)       | Copie complète du tableau |
| `contains(Object)` | O(n)       | Recherche linéaire        |
| `iterator()`       | O(1)       | Iterator fail-safe        |
## Set - Collections sans doublons

### HashSet
**Utilisation** : Set basé sur table de hachage  
**Thread-safe** : Non  
**Ordre** : Aucun

| Opération          | Complexité | Note               |
| ------------------ | ---------- | ------------------ |
| `add(E)`           | O(1)       | O(n) worst case    |
| `remove(Object)`   | O(1)       | O(n) worst case    |
| `contains(Object)` | O(1)       | O(n) worst case    |
| `size()`           | O(1)       | -                  |
| `iterator()`       | O(h/n)     | h = capacité table |

```java
Set<String> set = new HashSet<>();
Set<String> setWithCapacity = new HashSet<>(100);
Set<String> setFromCollection = new HashSet<>(otherCollection);
```

### LinkedHashSet
**Utilisation** : HashSet avec ordre d'insertion préservé  
**Thread-safe** : Non  
**Ordre** : Insertion

| Opération          | Complexité | Note              |
| ------------------ | ---------- | ----------------- |
| `add(E)`           | O(1)       | O(n) worst case   |
| `remove(Object)`   | O(1)       | O(n) worst case   |
| `contains(Object)` | O(1)       | O(n) worst case   |
| `iterator()`       | O(1)       | Ordre d'insertion |

### TreeSet
**Utilisation** : Set trié basé sur arbre red-black
**Thread-safe** : Non  
**Ordre** : Naturel ou Comparator

| Opération          | Complexité | Note               |
| ------------------ | ---------- | ------------------ |
| `add(E)`           | O(log n)   | Insertion triée    |
| `remove(Object)`   | O(log n)   | Suppression triée  |
| `contains(Object)` | O(log n)   | Recherche binaire  |
| `first()`          | O(log n)   | Plus petit élément |
| `last()`           | O(log n)   | Plus grand élément |
| `higher(E)`        | O(log n)   | Élément suivant    |
| `lower(E)`         | O(log n)   | Élément précédent  |

```java
Set<String> set = new TreeSet<>();
Set<String> setWithComparator = new TreeSet<>(Comparator.reverseOrder());
```

### EnumSet
**Utilisation** : Set optimisé pour les énumérations  
**Thread-safe** : Non  
**Ordre** : Ordre naturel des enum

| Opération | Complexité | Note |
|-----------|------------|------|
| `add(E)` | O(1) | BitSet interne |
| `remove(Object)` | O(1) | BitSet interne |
| `contains(Object)` | O(1) | BitSet interne |
| `iterator()` | O(1) | Très efficace |

```java
EnumSet<DayOfWeek> weekdays = EnumSet.range(MONDAY, FRIDAY);
EnumSet<DayOfWeek> weekend = EnumSet.of(SATURDAY, SUNDAY);
```

### CopyOnWriteArraySet
**Utilisation** : Set thread-safe basé sur CopyOnWriteArrayList  
**Thread-safe** : Oui  
**Ordre** : Insertion

| Opération | Complexité | Note |
|-----------|------------|------|
| `add(E)` | O(n) | Vérification unicité + copie |
| `remove(Object)` | O(n) | Recherche + copie |
| `contains(Object)` | O(n) | Recherche linéaire |
| `iterator()` | O(1) | Iterator fail-safe |
## Queue et Deque - Files et Files double-ended

### ArrayDeque
**Utilisation** : Deque basé sur tableau circulaire  
**Thread-safe** : Non  
**Capacité** : Redimensionnable

| Opération | Complexité | Note |
|-----------|------------|------|
| `addFirst(E)` | O(1) amortisé | Ajout en début |
| `addLast(E)` | O(1) amortisé | Ajout en fin |
| `removeFirst()` | O(1) | Suppression début |
| `removeLast()` | O(1) | Suppression fin |
| `peekFirst()` | O(1) | Consultation début |
| `peekLast()` | O(1) | Consultation fin |

### PriorityQueue
**Utilisation** : File de priorité (tas binaire)  
**Thread-safe** : Non  
**Ordre** : Priorité (Comparable ou Comparator)

| Opération | Complexité | Note |
|-----------|------------|------|
| `add(E)` | O(log n) | Insertion dans le tas |
| `offer(E)` | O(log n) | Même que add |
| `poll()` | O(log n) | Suppression racine |
| `peek()` | O(1) | Consultation racine |
| `remove(Object)` | O(n) | Recherche + réorganisation |
| `contains(Object)` | O(n) | Recherche linéaire |
## Map<K,V> - Associations clé-valeur

### HashMap<K,V>
**Utilisation** : Map basée sur table de hachage  
**Thread-safe** : Non  
**Clés nulles** : Une seule  
**Valeurs nulles** : Multiples

| Opération | Complexité | Note |
|-----------|------------|------|
| `get(Object)` | O(1) | O(n) worst case |
| `put(K, V)` | O(1) | O(n) worst case |
| `remove(Object)` | O(1) | O(n) worst case |
| `containsKey(Object)` | O(1) | O(n) worst case |
| `containsValue(Object)` | O(n) | Parcours valeurs |

```java
Map<String, Integer> map = new HashMap<>();
Map<String, Integer> mapWithCapacity = new HashMap<>(100);
Map<String, Integer> mapFromOther = new HashMap<>(otherMap);
```

### LinkedHashMap<K,V>
**Utilisation** : HashMap avec ordre préservé  
**Thread-safe** : Non  
**Ordre** : Insertion ou accès (access-order)

| Opération | Complexité | Note |
|-----------|------------|------|
| `get(Object)` | O(1) | O(n) worst case |
| `put(K, V)` | O(1) | O(n) worst case |
| `remove(Object)` | O(1) | O(n) worst case |

```java
Map<String, Integer> insertionOrder = new LinkedHashMap<>();
Map<String, Integer> accessOrder = new LinkedHashMap<>(16, 0.75f, true);
```

### TreeMap<K,V>
**Utilisation** : Map triée basée sur arbre red-black  
**Thread-safe** : Non  
**Ordre** : Clés triées

| Opération | Complexité | Note |
|-----------|------------|------|
| `get(Object)` | O(log n) | Recherche dans arbre |
| `put(K, V)` | O(log n) | Insertion triée |
| `remove(Object)` | O(log n) | Suppression triée |
| `firstKey()` | O(log n) | Plus petite clé |
| `lastKey()` | O(log n) | Plus grande clé |
| `higherKey(K)` | O(log n) | Clé suivante |
| `lowerKey(K)` | O(log n) | Clé précédente |

### ConcurrentHashMap<K,V>
**Utilisation** : Map thread-safe haute performance  
**Thread-safe** : Oui  
**Clés/Valeurs nulles** : Non

| Opération | Complexité | Note |
|-----------|------------|------|
| `get(Object)` | O(1) | Lecture sans lock |
| `put(K, V)` | O(1) | Lock par segment |
| `remove(Object)` | O(1) | Lock par segment |
| `putIfAbsent(K, V)` | O(1) | Atomique |
| `replace(K, V)` | O(1) | Atomique |
| `compute(K, Function)` | O(1) | Atomique |

### ConcurrentSkipListMap<K,V>
**Utilisation** : Map triée thread-safe  
**Thread-safe** : Oui  
**Ordre** : Clés triées

| Opération | Complexité | Note |
|-----------|------------|------|
| `get(Object)` | O(log n) | Skip list |
| `put(K, V)` | O(log n) | Insertion triée |
| `remove(Object)` | O(log n) | Suppression triée |
## Collections Thread-Safe

### Synchronized Wrappers
```java
List<String> syncList = Collections.synchronizedList(new ArrayList<>());
Set<String> syncSet = Collections.synchronizedSet(new HashSet<>());
Map<String, Integer> syncMap = Collections.synchronizedMap(new HashMap<>());

// ⚠️ Synchronisation manuelle requise pour l'itération
synchronized(syncList) {
    for(String item : syncList) {
        // traitement
    }
}
```

### Collections Concurrent
- **ConcurrentHashMap** : Map haute performance
- **CopyOnWriteArrayList** : List pour lectures fréquentes
- **CopyOnWriteArraySet** : Set pour lectures fréquentes
- **ConcurrentLinkedQueue** : Queue non-bloquante
- **ArrayBlockingQueue** : Queue bloquante bornée
- **LinkedBlockingQueue** : Queue bloquante optionnellement bornée
## Utilitaires Collections

### Collections.emptyXXX()
```java
List<String> empty = Collections.emptyList();
Set<String> emptySet = Collections.emptySet();
Map<String, String> emptyMap = Collections.emptyMap();
```

### Collections.singletonXXX()
```java
List<String> single = Collections.singletonList("item");
Set<String> singleSet = Collections.singleton("item");
Map<String, String> singleMap = Collections.singletonMap("key", "value");
```

### Collections.unmodifiableXXX()
```java
List<String> unmodifiable = Collections.unmodifiableList(list);
Set<String> unmodifiableSet = Collections.unmodifiableSet(set);
Map<String, String> unmodifiableMap = Collections.unmodifiableMap(map);
```

### Collections.nCopies()
```java
List<String> copies = Collections.nCopies(5, "duplicate");
```
## Choix de la bonne Collection

### Critères de sélection

**Pour une List :**
- **ArrayList** : Accès par index fréquent, peu d'insertions/suppressions au milieu
- **LinkedList** : Insertions/suppressions fréquentes en début/fin, implémente Deque
- **CopyOnWriteArrayList** : Lectures très fréquentes, modifications rares, thread-safety

**Pour un Set :**
- **HashSet** : Performance maximale, pas d'ordre
- **LinkedHashSet** : Performance + ordre d'insertion
- **TreeSet** : Ordre naturel ou personnalisé, opérations de navigation
- **EnumSet** : Pour les énumérations uniquement

**Pour une Map :**
- **HashMap** : Performance maximale, pas d'ordre
- **LinkedHashMap** : Performance + ordre d'insertion ou d'accès
- **TreeMap** : Ordre naturel ou personnalisé, opérations de navigation
- **ConcurrentHashMap** : Thread-safety haute performance

**Pour une Queue :**
- **ArrayDeque** : File/pile générale
- **PriorityQueue** : File de priorité
- **LinkedList** : Si besoin des opérations List aussi
## Bonnes pratiques

1. **Programmez contre les interfaces** : `List<String>`, `Set<Integer>`, `Map<String, Object>`
2. **Spécifiez la capacité initiale** pour les collections avec croissance (HashMap, ArrayList)
3. **Utilisez les collections immutables** quand possible : `List.of()`, `Set.of()`, `Map.of()`
4. **Attention à la synchronisation** : préférez les collections concurrent aux wrappers synchronized
5. **Implémentez equals/hashCode** correctement pour les objets utilisés comme clés ou dans les Sets
6. **Utilisez les Stream API** pour les opérations de transformation et filtrage

```java
// JDK 9+ - Collections immutables
List<String> immutableList = List.of("a", "b", "c");
Set<String> immutableSet = Set.of("a", "b", "c");
Map<String, Integer> immutableMap = Map.of("a", 1, "b", 2);

// Stream API
list.stream()
    .filter(s -> s.length() > 3)
    .map(String::toUpperCase)
    .collect(Collectors.toList());
```
