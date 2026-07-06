# Brunch Bouaké Backend API (Laravel 11)

Ce projet représente la partie serveur (SaaS Multi-Tenant API) de l'écosystème "Brunch Bouaké". Il gère l'isolation multi-tenant stricte par base de données MySQL et fournit une passerelle sécurisée d'ingestion des réservations externes pour Booking.com, Airbnb, etc.

---

## 📂 Arborescence des Fichiers Clés à Copier
Voici l'emplacement exact des fichiers fournis dans cette archive pour être intégrés dans votre projet Laravel 11 local (Laragon) ou de production (Hostinger) :

```text
mon-projet-laravel/
├── .env.example                                        <-- Configurer la clé de sécurité API
├── app/
│   └── Http/
│       └── Controllers/
│           └── Api/
│               └── V1/
│                   └── ChannelManagerController.php    <-- Contrôleur d'ingestion (Booking/Airbnb)
├── app/
│   └── Models/
│       ├── Room.php                                    <-- Modèle Chambre (UUID + Scope Tenant)
│       ├── Reservation.php                             <-- Modèle Réservation (UUID + Scope Tenant)
│       └── Transaction.php                             <-- Modèle Transaction (UUID + Idempotence)
├── database/
│   └── migrations/
│       ├── 2026_07_06_000001_create_rooms_table.php    <-- Migration table Rooms
│       ├── 2026_07_06_000002_create_reservations_table.php <-- Migration table Reservations
│       └── 2026_07_06_000003_create_transactions_table.php <-- Migration table Transactions
└── routes/
    └── api.php                                         <-- Déclaration de la route d'ingestion POST
```

---

## ⚙️ Configuration du fichier `.env`

Copiez le fichier `.env.example` vers `.env` et ajustez les paramètres suivants :

```env
# 1. Clé de sécurité de l'application Laravel
APP_KEY=base64:...

# 2. Informations de votre Base de données MySQL (Laragon ou Hostinger)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=brunch_bouake_db
DB_USERNAME=root
DB_PASSWORD=

# 3. Clé de sécurité pour la passerelle de Channel Manager (Booking/Airbnb)
# Ce token DOIT correspondre à l'en-tête "X-Integration-Token" ou Bearer Token envoyé par l'émetteur
CHANNEL_MANAGER_TOKEN=brunch_bouake_secure_webhook_token_2026
```

---

## 🔒 Règles de Sécurité Multi-Tenant & Idempotence
1. **Header `X-Tenant-ID` obligatoire** : Chaque requête envoyée à l'API (que ce soit pour le PMS, POS ou les intégrations) doit inclure l'en-tête HTTP `X-Tenant-ID` pour isoler de façon hermétique les données de chaque établissement (Studio Kennedy, Résidence Bouaké, etc.).
2. **Idempotence des réservations externes** : Le contrôleur valide l'en-tête de sécurité, puis utilise le champ `external_reservation_id` pour vérifier si la réservation de Booking.com ou d'Airbnb a déjà été ingérée. Si c'est le cas, elle est ignorée et renvoyée avec un statut `200 OK` (évite les doublons de réservations de chambres).
3. **Idempotence des transactions** : La table `transactions` possède un index `idempotency_key` UNIQUE. Toute tentative de transaction financière en double avec la même clé lèvera une exception, garantissant qu'aucun client ne soit débité deux fois sur Wave, Orange Money ou MTN.
