# Snake-IT-DFS34A

Un jeu Snake classique développé en HTML/CSS/JavaScript vanilla, avec une esthétique rétro néon.

## Aperçu

Le jeu se déroule sur une grille de **8x8 cases** (400x400px). Le joueur contrôle un serpent qui doit manger des pommes pour grandir et augmenter son score, tout en évitant les murs et son propre corps.

## Fonctionnalités

- **Serpent animé** : tête avec yeux et langue animée qui suit la direction du mouvement
- **Pomme normale** : +1 point par pomme mangée
- **Pomme dorée** : apparaît aléatoirement toutes les 8 à 18 secondes, disponible pendant 5 secondes — multiplie le score par **x10**
- **Timer bonus** : barre de progression visible lors de l'apparition d'une pomme dorée
- **Score & Taille** : affichés en temps réel sous la grille
- **Écran Game Over** : affiche le score final et la taille, avec les options Retry et Annuler
- **D-pad** : contrôleur directionnel cliquable à l'écran

## Contrôles

| Action | Clavier | D-pad |
|--------|---------|-------|
| Haut   | `↑`     | Bouton haut |
| Bas    | `↓`     | Bouton bas  |
| Gauche | `←`     | Bouton gauche |
| Droite | `→`     | Bouton droite |

## Structure du projet

```
Snake-IT-DFS34A/
├── game.html       # Page principale du jeu
├── css/
│   └── main.css    # Styles et animations
└── js/
    └── main.js     # Logique du jeu
```

## Lancer le jeu

Ouvrir `game.html` dans un navigateur — aucune installation requise.

## Technologies

- HTML5
- CSS3 (animations, clip-path, keyframes)
- JavaScript vanilla (DOM manipulation)
- Police [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) (Google Fonts)
