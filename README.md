Projet Spécialité IIM - Alban Sellier & Rémi Géraud

## Création de la BDD

On commence par créer une base données en local sur Docker.

Création du conteneur :

```bash
docker compose up -d
```
## Création du fichier .env

Créer un fichier .env et y ajouter

```bash
DATABASE_URL
SESSION_SECRET (32 caractères minimum)
```

## Création de la BDD à partir du schéma :

```bash
npx prisma migrate dev --name init
```

### Installation des dépendances

```bash
npm install
```

## Démarrage du serveur

```bash
npm run dev
```

## ATTENTION - Safari vs Chromium

Dans le cadre d'un environnement de développement, si sur Safari, aller dans lib/userSession.ts et s'assurer que la ligne suivante n'est pas commentée
```
secure: process.env.NODE_ENV === 'production',
```
Inversement sur un navigateur Chromium