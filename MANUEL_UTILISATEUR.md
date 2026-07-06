# 🌴 MANUEL D'UTILISATION OFFICIEL
## Plateforme SaaS Multi-Tenant : **Brunch Bouaké Hospitality**
*Édition de Production 2026 — Document de Référence Terrain*

---

## 🏛️ AKWABA — BIENVENUE

Ce guide opérationnel est conçu pour accompagner l'ensemble des collaborateurs de l'établissement **L'Hôtel Bouaké Kennedy** (identifiant système : `tenant-bouake-kennedy`) dans l'utilisation quotidienne de notre outil intégré. Grâce à l'architecture **Multi-Tenant**, toutes vos données d'exploitation, de vente, de ressources humaines et de stocks restent hermétiquement isolées et sécurisées.

Le système fonctionne sur tous types de supports : tablettes tactiles en salle, smartphones pour la gouvernance et ordinateurs pour l'administration et la comptabilité.

---

## 🔐 INTERFACE DE DÉPART : LE CONTRÔLE D'ACCÈS

Pour démarrer votre session de travail :
1. **Accès au Portail :** Ouvrez le navigateur de votre appareil de service.
2. **Authentification Nominative :** Saisissez votre e-mail professionnel et votre mot de passe secret.
3. **Sécurité et Traçabilité :** Chaque action effectuée (enregistrement de réservation, vente POS, validation de dépenses) est horodatée et marquée du sceau de votre compte. Ne partagez jamais vos identifiants.

---

## 🛌 SECTION 1 : LE GUIDE DU RÉCEPTIONNISTE (Module PMS)

Le module **PMS (Property Management System)** orchestre l'ensemble de l'activité hôtelière. Il permet de gérer le planning, l'attribution des chambres et le flux de facturation des clients.

### 📋 TABLEAU RÉCAPITULATIF DES PROCÉDURES DE SÉJOUR

| Étape Opérationnelle | Action dans l'Interface PMS | Validation Requise | Automatisation Système |
| :--- | :--- | :--- | :--- |
| **1. Enregistrement** | Cliquer sur "Créer une Réservation" | Saisir le nom + Numéro WhatsApp valide (+225) | Inscription au planning, blocage de la chambre |
| **2. Arrivée (Check-In)** | Cliquer sur "Check-In" sur la réservation | Vérifier la pièce d'identité du voyageur | Génération d'un PIN à 4 chiffres et envoi automatique via WhatsApp |
| **3. Durant le Séjour** | Gérer le compte client (Folio) | Saisie du PIN client pour imputer des frais | Centralisation automatique des additions du restaurant sur le folio |
| **4. Départ (Check-Out)** | Cliquer sur "Check-Out" | Régler le solde de la facture globale | Libération de la chambre, bascule automatique au statut *Dirty (Sale)* |

### A. Détail de la Création de Réservation
Lors de la saisie d'un dossier client :
* **Validation du Numéro WhatsApp :** Saisissez obligatoirement le numéro de portable. Le système applique un filtre strict. Sont autorisés :
  * **Côte d'Ivoire :** Format international standardisé `+225` suivi de **10 chiffres** (ex: `+2250701020304`).
  * **Maroc :** Format `+212` suivi de **9 chiffres** (ex: `+212777346787`).
  * **International :** Format standard `+` suivi de l'indicatif pays et du numéro.
* *Note : Si le format est incorrect, le système bloque la création du dossier.*

### B. Détail de la Procédure de Check-In
L'activation du check-in sur l'interface génère instantanément :
1. Un **code PIN secret à 4 chiffres** (ex: `7787`).
2. Un message formaté de bienvenue transmis instantanément au client par WhatsApp :
   > *"Akwaba chez Brunch Bouaké ! Votre chambre Studio Suite 101 est prête. Votre code PIN secret est **7787**. Présentez-le pour ouvrir votre porte et facturer vos suppléments directement sur votre note de chambre."*

### C. Détail de la Procédure de Check-Out
1. Présentez la facture au client. Elle inclut la nuitée de base et toutes les additions imputées au maquis-restaurant durant le séjour.
2. Encaissez le règlement total (Espèces, Wave ou Orange Money).
3. Dès que le check-out est validé, la chambre passe au statut **Dirty** (Couleur rouge d'avertissement), signalant à l'équipe d'étage qu'un nettoyage approfondi est requis.

---

## 🍳 SECTION 2 : LE GUIDE DU SERVEUR & BARMAN (Module POS & Restauration)

Le module **POS (Point of Sale)** équipe le personnel de salle et de bar pour une prise de commande réactive et un suivi d'inventaire automatisé.

### 📦 TABLEAU DES ALERTES STOCKS & DÉCISIONS SYSTEME

| Couleur du Badge | Niveau d'Ingrédients | Statut de la Commande | Consigne Serveur / Barman |
| :---: | :--- | :--- | :--- |
| 🟢 **Vert** | Stocks amplement suffisants | **Disponible** | Prendre la commande normalement. |
| 🟡 **Jaune** | Seuil d'alerte critique atteint | **Disponible (Alerte)** | Informer le client du nombre limité de portions restantes. |
| 🔴 **Rouge** | Rupture complète d'un ingrédient | **Bloqué** | Expliquer poliment la rupture au client et l'orienter vers une alternative. |

### A. Prise de Commande Tactile
1. Sélectionnez la table active sur votre écran.
2. Ajoutez les plats au panier en touchant les icônes correspondantes (*Kedjenou de Poulet*, *Alloco Giga*, *Bière Bock*).
3. **Vérification automatique :** Si le badge associé au plat est rouge, le système empêche l'ajout au panier. L'application prévient ainsi tout sur-engagement auprès du client.

### B. Encaissement et Tunnel de Paiement (Mobile Money / Espèces)
* **Espèces :** Saisissez le montant donné par le client, l'application affiche la monnaie exacte à rendre.
* **Paiements Wave / Orange Money :** Activez la passerelle de paiement Mobile Money. Demandez au client de composer son code de validation sur son mobile et attendez l'écran vert de confirmation système avant son départ.

### C. Procédure de Transfert sur Facture de Chambre
Si le client réside à l'hôtel et souhaite payer plus tard lors du check-out :
1. Sélectionnez l'option **"Transférer sur Chambre"** lors de l'encaissement.
2. Choisissez le numéro de chambre du client.
3. **Sécurisation par PIN :** Invitez le client à taper sur votre tablette son **code PIN personnel à 4 chiffres** (reçu par WhatsApp à l'arrivée).
4. Le système valide la correspondance du PIN et vérifie que la **limite de crédit** de la chambre est respectée avant d'imputer le montant sur le folio de la chambre.

---

## 🧹 SECTION 3 : LE GUIDE DU GOUVERNANT & MAINTENANCE (Module Tasks)

Ce module permet d'optimiser l'enchaînement des tâches d'entretien entre le départ d'un client et la remise en location d'une chambre.

### A. Réception des Ordres de Travail
Les agents d'étage et de maintenance reçoivent en temps réel leurs missions :
1. **Priorité Nettoyage :** Traitez d'abord les chambres basculées en statut **Dirty** suite à un Check-Out.
2. **Missions Maintenance :** Identifiez les anomalies signalées (climatisation bruyante, flexible de douche endommagé, etc.).

### B. Validation et Remise en Service
Dès que la tâche ménage ou réparation est effectuée :
1. Ouvrez l'application mobile et sélectionnez la tâche.
2. Modifiez le statut de **"En cours / Pending"** à **"Complétée / Completed"**.
3. **Impact Instantané :** L'état de la chambre bascule instantanément en **"Available" (Disponible / Propre)** sur les écrans de la réception. La chambre redevient immédiatement éligible à une réattribution.

---

## 📊 SECTION 4 : LE GUIDE DU MANAGER & COMPTABLE (BI, ERP & RH)

Ce module est destiné à l'analyse de rentabilité, à la gestion administrative des équipes et à la sauvegarde globale de l'exploitation.

### A. Tableau de Bord Décisionnel (Business Intelligence)
Le manager de l'établissement analyse en temps réel les indicateurs d'exploitation :
* **Taux d'Occupation :** Volume de chambres vendues exprimé en pourcentage.
* **RevPAR (Revenue Per Available Room) :** Chiffre d'affaires hébergement divisé par le nombre total de chambres de l'établissement.
* **Marge d'Exploitation POS :** Rentabilité brute du maquis calculée selon le coût des matières premières.
* **Exportations Comptables :** Téléchargez les journaux de caisse et de vente au format **CSV (UTF-8)** pour les transmettre directement à votre cabinet d'expertise comptable.

### B. Gestion des Ressources Humaines & Calcul de Paie CNPS
Le système calcule les salaires conformément au Code du Travail de la République de Côte d'Ivoire.

#### 💵 RÉPARTITION DE LA STRUCTURE SALARIALE (CNPS)

| Composante Salariale | Pourcentage applicable | Sens de l'Opération | Destination des Fonds |
| :--- | :---: | :---: | :--- |
| **Salaire Brut Imposable** | Base 100% | *Référence de calcul* | Salaire de référence de l'employé |
| **Retenue Sociale Ouvrière** | **6.3%** | ➖ Déduction | Caisse Nationale de Prévoyance Sociale |
| **Cotisations Patronales** | Selon barème en vigueur | ➕ Charge Établissement | Contribution employeur CNPS |
| **Salaire Net à Payer** | **93.7%** *(hors primes)* | 🪙 Versement Final | Compte Mobile Money de l'employé |

#### Procédure d'Établissement du Bulletin :
1. **Création :** Générez le bulletin de paie de l'employé (le document est créé en statut **Draft / Brouillon**).
2. **Validation & Idempotence :** Cliquez sur **"Valider le Paiement"**. Le système génère une dépense automatique dans le journal de caisse.
   * *Sécurisation Réseau : Chaque paiement de salaire engendre une clé d'idempotence unique basée sur le binôme (Employé, Période). Il est techniquement impossible d'enregistrer deux fois le même paiement de salaire au cours du même mois, protégeant ainsi la trésorerie de l'établissement.*
3. **Notification de Salaire :** Cliquez sur **"Envoyer par WhatsApp"**. L'orchestrateur transmet immédiatement à l'employé son récapitulatif de salaire contenant son net à payer et le détail des cotisations CNPS.

### C. Procédure de Sauvegarde & Restauration (Sécurité des Données)
Pour prévenir les sinistres numériques, une routine de sauvegarde manuelle est obligatoire chaque fin de semaine.

1. **Génération de la Sauvegarde :**
   * Allez dans l'onglet **"Paramètres de l'Établissement"** (Property Settings).
   * Cliquez sur le bouton de sauvegarde. Le système exporte l'intégralité de la base de données locale (historiques, folios, réservations, stocks, fiches de paie) dans un fichier compact au format **JSON**.
   * Conservez ce fichier dans un espace de stockage externe sécurisé.
2. **Procédure de Restauration :**
   * En cas de panne matérielle ou de perte de données sur un terminal, connectez-vous, accédez à la section de restauration, importez votre fichier JSON de sauvegarde, puis cliquez sur **"Restaurer"**.
   * L'application réintègre l'intégralité de l'état sauvegardé en moins de 3 secondes, vous permettant de reprendre l'exploitation immédiatement sans perte de continuité de service.

---
*Document de Référence Technico-Opérationnelle. Brunch Bouaké — L'alliance de l'élégance numérique et de la rigueur opérationnelle.*
