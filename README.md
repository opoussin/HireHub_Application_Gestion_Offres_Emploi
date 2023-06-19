# SR10

## Site d'offres d'emploi SR10

## Description
Ce projet est un site d'offres d'emplois qui permet aux utilisateurs de rechercher, consulter et postuler à des offres d'emploi. Le site prend en charge trois types de profils : utilisateurs, recruteurs et administrateurs.

## Table des matières

- [Installation](#installation)
- [Utilisation](#utilisation)
- [Structure du projet](#structure)
- [Profis](#profils)
- [Authors](#authors)

## Installation
1. Clonez le dépôt : git clone https://github.com/votre-projet.git
2. Accédez au répertoire : cd ./myapp
3. Installez les dépendances : npm install 
4. Installer express, cors, jest, bcrypt, sql

## Utilisation

1. Se placer dans le répertoire myapp
2. En console faire npm run start
3. Se connecter au VPN de l'UTC
4. Accédez à l'URL : http://localhost:3000

## Structure du projet
Depuis la racine il est possible de trouver : 
- Dossier Conception
    - Maquette : Lien Figma où les maquettes du site ont été conçues
    - MLD : Modèle logique de données qui nous a permis de concevoir la BDD en 2 versions : ancienne et actuelle
    - UML : Code PlantUML permettant de générer l'UML représentant nos projet, en 2 versions
    - Usecase : Diagrammes des cas d'utilisations
    - Nommage.txt : Fichier indiquant les noms des attributs de la BDD
    - TO_DO.txt : Fichier permettant le suivi des tâches
- Dossier myapp : dossier réel du projet, reprennant une architecture classique d'un projet NodeJS
    - Modele : Dossier regroupant les fonctions faisant appel à la BDD, divisé en fonction du profil ( Candidat, Commun, Recruteur, Administrateur...) ainsi que d'autres fichiers de fonctions utilisés pour la gestion de la BDD, la connexion etc
    - routes : Dossier regroupant toutes les déclarations de routes, divisées elles aussi en fonction du type de profil, il existe aussi une route upload pour gérer séparemment le traitement des fichiers
    - test : Dossier contenant les fichiers de tests unitaires Jest de fonctions et de route de la partie Administrateur
    - views : Dossier regroupant tous les fichiers ejs utilisés pour générer les vues
    - app.js 
    - middleware.js : Middleware utilisé pour gérer les sessions



## Profils

Le site prend en charge les trois profils suivants :

1. Utilisateurs : Les utilisateurs peuvent rechercher des offres d'emploi, consulter les détails des offres, postuler et gérer leur candidature.
2. Recruteurs : Les recruteurs peuvent créer et publier des offres d'emploi, gérer les candidatures reçues et communiquer avec les candidats.
3. Administrateurs : Les administrateurs ont un accès étendu au système. Ils peuvent gérer les utilisateurs, les offres d'emploi, les candidatures et effectuer d'autres tâches administratives.

## Authors
Developpers : 
- Océane Poussin
- Chloé Gommard
