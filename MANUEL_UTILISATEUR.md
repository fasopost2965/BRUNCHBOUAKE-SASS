# 🌴 MANUEL D'UTILISATION OFFICIEL
## Plateforme SaaS Multi-Tenant : **Brunch Bouaké Hospitality**
*Version 2.0 — Juillet 2026*

---

## 🏛️ AKWABA — PRÉSENTATION GÉNÉRALE

Bienvenue dans le guide opérationnel officiel de **Brunch Bouaké Hospitality**, la solution intégrée de gestion hôtelière (PMS), de restauration (POS) et de ressources humaines conçue spécifiquement pour répondre aux exigences des établissements de Côte d'Ivoire.

Chaque établissement (ex: **L'Hôtel Bouaké Kennedy**) fonctionne au sein d'un environnement hermétiquement cloisonné grâce à notre architecture **Multi-Tenant**. L'identifiant unique de votre établissement (`tenant-bouake-kennedy`) garantit que toutes les transactions, fiches clients, inventaires d'ingrédients et fiches de paie restent strictement isolés et sécurisés.

---

## 🔐 INTERFACE DE DÉPART : LE CONTRÔLE D'ACCÈS

L'accès à la plateforme s'effectue via un portail sécurisé exigeant une authentification nominative.

1. **Saisie des Identifiants :**
   - Saisissez votre adresse e-mail professionnelle (ex: `reception@bouake-kennedy.ci` ou `manager@bouake-kennedy.ci`).
   - Saisissez votre mot de passe secret.
2. **Cloisonnement Multi-Tenant :**
   - Une fois connecté, le système charge automatiquement la configuration et l'état de votre établissement unique.
   - Les données d'exploitation, de stocks et de caisse ne sont jamais partagées ni visibles par d'autres établissements du groupe ou des tiers. Toutes les actions de traçabilité (logs) sont horodatées et associées à votre profil utilisateur actif.

---

## 🛌 SECTION 1 : LE GUIDE DU RÉCEPTIONNISTE (Module PMS)

Le réceptionniste est le garant de la première impression du client et du suivi de son séjour. Le module **PMS (Property Management System)** lui permet de gérer l'intégralité du cycle de vie des séjours de manière intuitive et fluide.

### A. Création d'une Réservation
Pour enregistrer une nouvelle réservation :
1. Accédez au planning dynamique des chambres.
2. Cliquez sur **"Créer une Réservation"**.
3. **Formulaire de saisie obligatoire :**
   - **Nom Complet du Client :** Saisissez le nom civil exact (ex: *Koffi Yao*).
   - **Numéro WhatsApp de Contact (Crucial) :** Vous devez obligatoirement saisir le numéro de téléphone portable au format requis : **+225 suivi de 10 chiffres** pour la Côte d'Ivoire (ex: `+2250701020304`). Le système valide également le format marocain (`+212`) ou le format international standard (`+` suivi de l'indicatif pays).
   - **Dates du Séjour :** Sélectionnez précisément la date d'arrivée (Check-In) et la date de départ (Check-Out).
   - **Sélection de l'Hébergement :** Choisissez la chambre disponible adaptée à la demande (ex: *Studio Suite 101*).
   - **Canal de Réservation (Source) :** Précisez si la réservation provient d'un canal direct, de *Booking.com*, d' *Airbnb*, ou d'une autre plateforme d'ingestion externe.
4. Cliquez sur **"Confirmer la Réservation"** pour l'inscrire au planning.

### B. Procédure de Check-In (Arrivée du Voyageur)
Le jour de l'arrivée, l'activation de la réservation déclenche les protocoles de sécurité de l'établissement.
1. Localisez le client sur le planning ou dans la liste des arrivées du jour.
2. Cliquez sur le bouton **"Check-In"**.
3. **Génération et Envoi du PIN Secret :**
   - Le système génère instantanément un **code PIN secret à 4 chiffres** (ex: `7787`) et un code d'accès numérique.
   - **Envoi par WhatsApp/SMS :** La passerelle WhatsApp Business transmet immédiatement un message formaté au client contenant son message d'accueil personnalisé, les détails de sa chambre et son code PIN unique pour déverrouiller la porte et authentifier ses dépenses futures.
4. Remettez symboliquement les clés physiques ou donnez au voyageur l'accès autonome via son PIN.

### C. Procédure de Check-Out (Départ du Voyageur)
À la fin du séjour, procédez à la clôture rigoureuse du compte client :
1. Sélectionnez la chambre occupée et cliquez sur **"Check-Out"**.
2. **Facturation & Folio Client :**
   - Le système dresse la facture récapitulative comprenant le montant de la chambre et l'historique de tous les suppléments accumulés (ex: consommations au restaurant/maquis créditées sur la chambre).
3. **Enregistrement du Règlement :** Enregistrez le paiement final (Espèces, Wave, Orange Money).
4. **Bascule d'État Ménage :** Dès la validation du départ, le système fait basculer la chambre automatiquement au statut **"Dirty" (Sale/À Nettoyer)**. Elle n'est plus éligible aux réservations immédiates tant que l'équipe de gouvernance n'a pas validé son nettoyage.

---

## 🍳 SECTION 2 : LE GUIDE DU SERVEUR & BARMAN (Module POS & Restauration)

Le module **POS (Point of Sale)** est optimisé pour les tablettes tactiles des équipes de salle du maquis-restaurant. Il gère la prise de commande en temps réel et prévient les ruptures d'ingrédients en cuisine.

### A. Prise de Commande Tactile
1. Ouvrez l'interface **Point de Vente (POS)** sur votre terminal.
2. Sélectionnez la table active.
3. Touchez les icônes des plats ou boissons commandés pour les ajouter au panier :
   - *Kedjenou de Poulet*
   - *Alloco Giga*
   - *Bière Bock*
   - *Brunch Signature*
4. Le récapitulatif de la commande s'affiche instantanément à droite de l'écran.

### B. Alertes de Stock Critique en Cuisine
Le système "Brunch Bouaké Hospitality" intègre un moteur de gestion de stock par ingrédients en temps réel :
- **Badge VERT :** Les stocks d'ingrédients bruts (poulet, huile de palme, banane plantain, levure, etc.) sont suffisants. La commande peut être prise et envoyée en cuisine.
- **Badge ROUGE (Alerte Stock) :** Un ou plusieurs ingrédients clés pour cette recette sont en rupture de stock. Le système **bloque automatiquement la validation** de cet article et affiche une alerte visible en salle, évitant de décevoir les clients après coup.

### C. Le Tunnel de Paiement (Espèces, Wave, Orange Money)
Lorsqu'un client demande l'addition :
1. Cliquez sur **"Encaisser"** sur l'écran tactile.
2. Choisissez le mode de paiement souhaité par le client :
   - **Espèces :** Saisissez le montant reçu pour que le système calcule automatiquement le rendu de monnaie.
   - **Wave ou Orange Money (+225) :** Le terminal déclenche la requête vers la passerelle Mobile Money. Demandez au client de valider la transaction sur son téléphone portable et attendez la confirmation verte sur l'écran avant de libérer la table.
3. Imprimez ou envoyez le ticket de caisse électronique.

### D. Le Transfert de Consommation sur Chambre
Pour les clients logés à l'hôtel qui désirent centraliser leurs dépenses sur leur facture de chambre globale (Folio) :
1. Dans l'écran de paiement du POS, sélectionnez **"Transférer sur Chambre"**.
2. Sélectionnez le numéro de la chambre active du client.
3. **Contrôle de Sécurité Anti-Fraude :**
   - Demandez obligatoirement au client de saisir son **code PIN secret à 4 chiffres** (reçu par WhatsApp lors de son Check-In) sur l'écran.
   - Le système vérifie instantanément si le PIN correspond et s'assure que le montant de l'addition ne dépasse pas la **limite de crédit** accordée à la chambre.
4. Si la validation est un succès, l'addition est automatiquement ajoutée à la note de chambre et la table est libérée.

---

## 🧹 SECTION 3 : LE GUIDE DU GOUVERNANT & MAINTENANCE (Module Tasks)

L'équipe d'étage et de maintenance utilise le module **Tasks** pour assurer la propreté et la conformité technique de l'établissement en temps réel.

### A. Lecture du Tableau des Tâches (Mobile/Tablette)
Chaque agent dispose d'une vue simplifiée listant les priorités de la journée :
1. **Nettoyage après Départ :** Repérez les chambres marquées d'une alerte rouge clignotante ou portant l'étiquette *"Check-out effectué / À nettoyer"*.
2. **Maintenance Corrective :** Consultez les signalements techniques remontés par la réception ou les clients (ex: *climatisation en panne*, *ampoule grillée*, *problème de pression d'eau*).

### B. Changement de Statut & Libération du Stock Chambre
Une fois l'action menée sur le terrain :
1. Ouvrez la tâche correspondante sur votre écran.
2. Changez le statut de la tâche de **"Pending" (En attente)** à **"Completed" (Terminée/Validée)**.
3. **Remise en service automatique :** Dès que la tâche de nettoyage est validée comme complétée par la gouvernante, la chambre repasse instantanément au statut **"Available" (Disponible)** dans le système central. Elle redevient immédiatement louable par le personnel de réception au PMS.

---

## 📊 SECTION 4 : LE GUIDE DU MANAGER & COMPTABLE (BI, ERP & RH)

Les gestionnaires et décideurs accèdent à un tableau de bord analytique avancé pour piloter la rentabilité, superviser la conformité sociale et sauvegarder les données vitales.

### A. Business Intelligence (BI) & Rapports Financiers
Pour suivre les performances de l'établissement :
1. Accédez à l'onglet **"Reports" (Rapports)** ou **"Dashboard Overview"**.
2. **Indicateurs clés de performance (KPIs) :**
   - **Taux d'Occupation :** Pourcentage de chambres louées par rapport à la capacité totale.
   - **RevPAR (Revenue Per Available Room) :** Revenu moyen généré par chambre disponible.
   - **Taux de Marge Brute :** Analyse des coûts d'achats alimentaires par rapport au chiffre d'affaires du maquis.
3. **Journal de Caisse :** Permet d'auditer toutes les entrées et sorties physiques d'espèces ou de monnaie électronique de la journée.
4. **Exportation des Données :** Pour importer les chiffres dans vos progiciels comptables externes, cliquez sur **"Exporter au format CSV"**. Le fichier est encodé en UTF-8 standard pour une compatibilité parfaite avec Microsoft Excel.

### B. Gestion des Ressources Humaines & Établissement de la Paie
La plateforme intègre un module RH conforme au droit du travail et aux barèmes de la CNPS en Côte d'Ivoire.

#### Étape 1 : Création du Bulletin de Salaire
1. Rendez-vous dans le module **"RH / Paie"**.
2. Sélectionnez l'employé concerné et cliquez sur **"Générer un Bulletin"**. Le statut du bulletin est initialement fixé sur **"Draft" (Brouillon)**.

#### Étape 2 : Application de la retenue sociale CNPS
- Le système calcule automatiquement la cotisation sociale ouvrière **CNPS de 6.3%** sur le salaire brut imposable de l'employé.
- Les charges patronales associées sont également récapitulées pour votre comptabilité.

#### Étape 3 : Validation et Clé d'Idempotence (Anti-Double Paiement)
1. Vérifiez les montants, puis cliquez sur **"Valider le Paiement"**.
2. **Génération de la Dépense :** Le système enregistre instantanément le décaissement dans le journal de caisse sous forme de dépense.
3. **Sécurité d'Idempotence :** Pour chaque bulletin validé, une clé unique d'idempotence est calculée à partir de l'ID de l'employé et de la période de paie. Cette clé empêche le double décaissement accidentel du même salaire, même en cas de clics répétés ou d'instabilité du réseau internet.

#### Étape 4 : Notification WhatsApp de Salaire à l'Employé
1. Une fois le bulletin validé, cliquez sur le bouton **"Envoyer par WhatsApp"**.
2. Le système utilise l'orchestrateur de messagerie pour envoyer un relevé de salaire détaillé directement sur le compte WhatsApp de l'employé, lui indiquant son salaire de base, ses retenues CNPS et le net à payer versé sur son Mobile Money.

### C. Sauvegarde & Restauration Complète du Système (Disaster Recovery)
Pour garantir la sécurité absolue de vos données contre les pannes matérielles ou les mauvaises manipulations :
1. Accédez à l'onglet **"Paramètres de l'Établissement"** (Property Settings).
2. **Téléchargement d'une Sauvegarde Manuelle :**
   - Cliquez sur le bouton de sauvegarde. Le système compile l'intégralité de l'état actuel de la base de données locale (chambres, réservations, stocks, transactions, configurations) dans un fichier unique au format JSON.
   - Enregistrez ce fichier en lieu sûr (clé USB, disque externe ou cloud sécurisé).
3. **Restauration du Système :**
   - En cas d'incident ou de changement de machine, retournez dans la section de restauration, sélectionnez votre dernier fichier de sauvegarde JSON valide, et cliquez sur **"Restaurer"**. 
   - L'application recharge instantanément l'intégralité de vos données, vous permettant de reprendre votre activité là où vous l'aviez laissée sans la moindre perte d'information.

---

*Fin du Manuel d'Utilisation. Brunch Bouaké Hospitality — La technologie au service de l'hospitalité ivoirienne.*
