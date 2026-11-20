# movie-app

TP 3 Angular : application qui affiche une liste de films à partir de l'API de TMDB.

Démo : https://azizgh69.github.io/movie-app/

## Fonctionnalités

- Liste des films à l'affiche (now playing)
- Recherche d'un film par titre
- Page de détails d'un film
- Wish list : on ajoute ou retire un film avec le cœur sur sa page de détails

## Lancer le projet

Il faut Node.js et une clé API TMDB (https://www.themoviedb.org/settings/api).

```
npm install
```

Ensuite, copier `src/environments/environment.example.ts` en `environment.ts` et `environment.development.ts` dans le même dossier, puis mettre sa clé API dans `apiKey`. Ces deux fichiers ne sont pas envoyés sur GitHub.

```
npm start
```

L'application est sur http://localhost:4200

## Pages

- `/` : liste des films + barre de recherche
- `/movie/:id` : détails d'un film
- `/search/:title` : résultats de recherche (touche Entrée dans la barre de recherche)
- `/wishlist` : wish list

## Postman

Les requêtes utilisées pour tester l'API sont dans `postman/tmdb-movie-app.postman_collection.json`.
