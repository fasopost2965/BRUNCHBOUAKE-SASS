# 🌴 MANUEL D'UTILISATION OFFICIEL
## Plateforme SaaS Multi-Tenant : **Brunch Bouaké Hospitality**
*Édition de Production Complète 2026 — Manuel de Référence Opérationnelle et Technique*

---

## 🏛️ AKWABA & PRÉSENTATION GÉNÉRALE

Bienvenue dans le manuel officiel de **Brunch Bouaké Hospitality**, la plateforme de gestion tout-en-un (PMS, POS, CRM, ERP, RH, BI) spécialement conçue pour les hôtels, résidences et restaurants de Côte d'Ivoire. 

### 🔒 Sécurité et Isolation Multi-Tenant
L'application repose sur une architecture multi-locataire (Multi-Tenant). Toutes les données de votre établissement sont hermétiquement isolées sous l'identifiant unique de votre locataire : **`tenant-bouake-kennedy`** (L'Hôtel Bouaké Kennedy).
* **Isolation Absolue :** Aucune autre entité sur le réseau ne peut lire ou modifier vos fiches clients, vos états financiers, votre inventaire ou vos bulletins de paie.
* **Traçabilité Totale :** Chaque action (prise de commande, check-in, sortie d'espèces) est associée à l'utilisateur connecté et enregistrée avec un horodatage précis.

---

## ⚙️ CHAPITRE 1 : CONFIGURATION INITIALE & PREMIÈRE UTILISATION

Avant de lancer l'exploitation en direct, l'administrateur ou le gérant de l'établissement doit effectuer les étapes de configuration initiales dans le panneau **Property Settings**.

### 1. Configuration des Informations de l'Établissement
1. Allez dans le module **Configuration** (icône d'engrenage ou onglet *Paramètres de l'établissement*).
2. Vérifiez le nom de l'établissement (**Brunch Bouaké - Kennedy**) et l'identifiant de la succursale active (`CI-BKE-01`).
3. Définissez le taux de Taxe sur la Valeur Ajoutée (TVA) par défaut (généralement 18% en Côte d'Ivoire pour l'hébergement et la restauration).

### 2. Paramétrage des Chambres et Tarifs (PMS)
1. Déclarez la liste de vos hébergements (ex : *Chambre Standard 101, Suite VIP 202, Studio Meublé 303*).
2. Associez à chaque chambre un tarif de nuitée de base en Francs CFA (XOF).
3. Définissez la **limite de crédit par défaut** autorisée pour les transferts de consommations du maquis/restaurant vers le folio de la chambre (ex: *100 000 FCFA*).

### 3. Création des Fiches Ingrédients & Articles du Menu (POS)
Pour que la gestion automatique des stocks et les alertes fonctionnent, vous devez lier vos plats du menu à des ingrédients bruts :
1. **Ingrédients :** Renseignez vos stocks initiaux d'ingrédients bruts (poulet, huile de friture, banane plantain, sacs de riz, bouteilles de bière, sucre). Définissez le seuil d'alerte critique pour chaque ingrédient.
2. **Menu :** Créez vos articles de vente (ex : *Alloco Giga, Kedjenou de Poulet, Bière Bock*). Spécifiez pour chaque plat la quantité d'ingrédients déduite du stock à chaque vente.

### 4. Configuration des Employés & Profils (RH)
1. Ajoutez chaque membre de l'équipe dans l'annuaire du personnel.
2. Renseignez leur salaire de base, leur poste (Réceptionniste, Serveur, Cuisinier, Gouvernant, Comptable) et leur numéro WhatsApp professionnel.
3. Configurez le taux CNPS de cotisation ouvrière obligatoire (fixé à **6.3%**).

### 5. Configuration de la Passerelle WhatsApp Business
Pour envoyer automatiquement les codes de chambre (PIN) et les bulletins de paie, la passerelle doit être alimentée par les variables d'environnement appropriées :
* **Numéro WhatsApp de Test Actif :** Configuré à l'adresse globale `VITE_WHATSAPP_TEST_NUMBER` dans le fichier `.env.example` (par défaut `+212777346787` pour l'envoi de messages de vérification).
* **Bouton de Test de Connexion :** Un bouton *"Envoyer un Message de Test"* est disponible dans le panneau d'administration pour valider immédiatement le bon fonctionnement de l'API WhatsApp Business en envoyant un message type à ce numéro.

---

## 🛌 CHAPITRE 2 : LE GUIDE DU RÉCEPTIONNISTE (Module PMS)

Le module **PMS (Property Management System)** gère la réception, le planning des chambres et la relation directe avec les clients de l'hôtel.

### 📋 TABLEAU RÉCAPITULATIF DU PARCOURS VOYAGEUR

| Phase Opérationnelle | Action Réception | Données Requises | Automatisation & Actions Système |
| :--- | :--- | :--- | :--- |
| **1. Enregistrement** | Créer une Réservation | Nom, Dates de séjour, Téléphone portable au format valide | Réservation inscrite sur le planning. Blocage de la chambre sélectionnée. |
| **2. Arrivée (Check-In)** | Activer le "Check-In" | Pièce d'identité, Validation des dates | Génération d'un **PIN secret à 4 chiffres**. Envoi instantané du message de bienvenue et du PIN sur le WhatsApp du client. |
| **3. Durant le Séjour** | Gérer le Folio Client | Suivi des dépenses de chambre | Autorisation de transférer les consommations de table du restaurant vers la chambre sur validation par code PIN. |
| **4. Départ (Check-Out)** | Déclencher le "Check-Out" | Validation des paiements cumulés | Impression de la facture finale. Libération de la chambre et passage immédiat au statut **Dirty** (Couleur rouge). |

### A. Création d'une Réservation
1. Cliquez sur **"Créer une Réservation"** depuis le tableau de bord ou le calendrier de la réception.
2. **Renseignez les champs obligatoires :**
   * **Nom et Prénom :** Ex : *Yao Kouassi Hermann*.
   * **Numéro WhatsApp de Contact :** Le système intègre un validateur de format strict pour garantir la délivrabilité des messages automatiques. Le numéro doit obligatoirement être au format international sans espace :
     * **Côte d'Ivoire (CI) :** `+225` suivi de **10 chiffres** (ex : `+2250708091011`).
     * **Maroc (MA) :** `+212` suivi de **9 chiffres** (ex : `+212777346787`).
     * **International :** `+` suivi du code pays et du numéro.
   * **Source de la Réservation :** Direct (Téléphone/Physique), Booking.com, Airbnb, Expedia, ou Ingestion Automatique (via le Channel Manager).
3. Cliquez sur **"Sauvegarder"**. La chambre sélectionnée est désormais verrouillée pour les dates choisies.

### B. Le Check-In (Arrivée du Voyageur)
À l'arrivée du client :
1. Retrouvez sa réservation sur le tableau des arrivées du jour.
2. Cliquez sur le bouton **"Check-In"**.
3. **Génération du Code PIN Unique :** Le système calcule automatiquement un code d'accès de sécurité à 4 chiffres (ex : `4912`) propre à ce séjour.
4. **Notification Automatique :** Le système sollicite instantanément la file d'attente de l'orchestrateur WhatsApp pour lui adresser le message type :
   > *"Akwaba M. Yao Kouassi Hermann ! Nous sommes ravis de vous accueillir à l'Hôtel Bouaké Kennedy. Votre chambre Studio Suite 101 est disponible. Votre code PIN secret d'accès et d'autorisation d'achat est **4912**. Bon séjour !"*

### C. Le Check-Out (Départ du Voyageur)
Au moment du départ de l'hôte :
1. Accédez à la fiche de la chambre occupée et cliquez sur **"Check-Out"**.
2. **Fermeture du Folio :** Le système calcule le solde final :
   `Montant Total = (Nuitées × Tarif) + Suppléments Maquis POS + Services annexes - Acomptes versés`
3. **Règlement de la Facture :** Enregistrez le moyen de paiement utilisé pour solder la facture (Espèces, Wave ou Orange Money).
4. **Bascule d'État Ménage :** Une fois le check-out validé, la chambre bascule instantanément au statut **Dirty** (Sale/À Nettoyer). Elle apparaît en rouge sur tous les écrans du personnel d'étage et de la réception, empêchant une nouvelle location accidentelle avant désinfection complète.

---

## 🍳 CHAPITRE 3 : LE GUIDE DU SERVEUR & BARMAN (Module POS & Restauration)

Le module **POS (Point of Sale)** est optimisé pour les tablettes tactiles utilisées par le personnel de service en salle et au bar du maquis-restaurant.

### 📦 TABLEAU DE GESTION DE L'INVENTAIRE ET DES ALERTES STOCKS

| Statut du Plat / Boisson | Couleur du Badge | Règle de Prise de Commande | Consignes pour le Personnel de Salle |
| :--- | :---: | :--- | :--- |
| **En Stock** | 🟢 Vert | **Autorisée** | Le plat est pleinement disponible. Saisir la commande normalement. |
| **Seuil Critique** | 🟡 Jaune | **Autorisée** | Le stock d'ingrédients est bas. Informer le client que les portions restantes sont limitées. |
| **Rupture d'Ingrédient** | 🔴 Rouge | **Interdite (Bloquée)** | Le système bloque la sélection de ce plat. Proposer poliment une alternative au client (ex : remplacer l'Alloco par de l'Attiéké). |

### A. Prise de Commande Rapide
1. Ouvrez l'application sur la tablette de service.
2. Sélectionnez le numéro de la table à servir.
3. Touchez les plats demandés par les clients pour les ajouter au panier (*Brunch Ivoirien, Kedjenou de Poulet, Frites d'Igname, Alloco Giga, Bière Bock*).
4. **Contrôle d'Ingrédients :** Le système vérifie en arrière-plan la disponibilité des ressources en cuisine. Si un produit est en rupture (Badge Rouge), la tablette affiche une alerte claire et bloque son ajout au panier.

### B. Le Tunnel de Paiement Direct
1. Appuyez sur le bouton **"Payer"** ou **"Encaisser"**.
2. Sélectionnez le mode de règlement convenu avec le client :
   * **Espèces :** Saisissez le montant en Francs CFA (XOF) tendu par le client. L'écran affiche instantanément le rendu de monnaie exact.
   * **Mobile Money (Wave / Orange Money) :** Saisissez le numéro de téléphone de paiement ivoirien (`+225` obligatoire). La transaction est envoyée pour traitement. Demandez au client de valider le prélèvement sur son mobile. Une fois le reçu virtuel validé par le système, le ticket est clôturé.

### C. Le Transfert sur Chambre avec Code PIN Sécurisé
Pour les résidents de l'hôtel souhaitant rattacher l'addition à leur facture de fin de séjour :
1. Sur l'écran d'encaissement du POS, sélectionnez **"Transférer sur Chambre"**.
2. Sélectionnez le numéro de la chambre active du client.
3. **Vérification de la Limite de Crédit :** Le système vérifie instantanément si le montant de la table cumulé aux frais de chambre déjà existants ne dépasse pas la limite de crédit autorisée (ex: *100 000 FCFA*).
4. **Validation par PIN Secret :** Présentez l'écran de la tablette au client. Celui-ci doit obligatoirement saisir son **code PIN personnel à 4 chiffres** (reçu par WhatsApp à son arrivée).
5. Si le PIN est valide et la limite de crédit respectée, la commande est immédiatement imputée sur sa facture d'hôtel et la table est clôturée.

---

## 👥 CHAPITRE 4 : LE GUIDE DE LA RELATION CLIENT (Module CRM & Marketing)

Le module **CRM (Customer Relationship Management)** permet de fidéliser votre clientèle, de centraliser ses préférences et de mener des campagnes promotionnelles ciblées.

### A. Fiche Client et Suivi de Fidélité
Chaque fiche client enregistrée dans la base compile un historique précieux :
* **Nombre de visites :** Fréquence globale des nuitées ou des repas consommés au maquis.
* **Panier Moyen :** Dépense moyenne calculée sur l'historique complet des achats.
* **Préférences enregistrées :** Préférences de chambre (ex : *climatisation forte, lit king-size*) ou restrictions alimentaires (ex : *allergies*).
* **Statut de Fidélité :** Attribué automatiquement selon le nombre de séjours ou le chiffre d'affaires généré :
  * ⚪ **Bronze :** Profil d'accueil standard.
  * 🥈 **Silver :** À partir de 5 séjours (5% de remise automatique sur l'hébergement).
  * 🥇 **Gold :** À partir de 15 séjours (10% de remise automatique + priorité de surclassement).
  * 💎 **Platinum :** Clients d'affaires réguliers et VIP (15% de remise + service d'accueil prioritaire).

### B. Envoi de Campagnes Marketing WhatsApp ciblées
Pour stimuler les réservations en basse saison :
1. Accédez au sous-onglet **"CRM & Marketing"**.
2. **Filtrage des Destinataires :** Sélectionnez les profils à cibler (ex : *tous les clients de niveau Gold* ou *tous les clients n'ayant pas séjourné depuis 60 jours*).
3. **Sélection du Template de Message :** Choisissez parmi les modèles validés localement :
   * **Offre Promotionnelle :** *"Akwaba ! Bénéficiez d'une réduction de 20% sur les séjours du week-end en saisissant le code BOUAKE20."*
   * **Invitation Brunch :** *"Le grand Brunch de Bouaké revient ce dimanche ! Réservez votre table et venez déguster notre Kedjenou de canard au feu de bois."*
4. Cliquez sur **"Envoyer la Campagne"**. L'orchestrateur de messagerie dépile la file d'attente pour envoyer les messages nominatifs de manière asynchrone sans surcharger le serveur.

---

## 🧹 CHAPITRE 5 : LE GUIDE DU GOUVERNANT & ENTRÉTIEN (Module Tasks)

La propreté impeccable et la conformité technique sont essentielles. Le module **Tasks** connecte l'équipe d'entretien avec la réception en temps réel.

### A. Attribution et Lecture des Tâches Terrain
Chaque gouvernant ou agent technique consulte sa liste d'actions du jour depuis un smartphone ou une tablette de service :
1. **Ménage Prioritaire :** Les chambres libérées par des check-outs récents (affichant le statut *Dirty*) apparaissent en tête de liste pour désinfection immédiate.
2. **Fiches de Maintenance :** Signalez les pannes ou les réparations nécessaires dès leur détection (ex: *climatisation en panne dans la 102*). Les tâches indiquent le niveau de priorité (Basse, Moyenne, Haute) et la description précise du problème.

### B. Mise à jour du Statut de Chambre
Dès que le nettoyage ou la réparation d'une chambre est terminé sur le terrain :
1. Sélectionnez la tâche concernée sur votre écran.
2. Cliquez sur **"Marquer comme Terminée"** (le statut passe de *Pending* à *Completed*).
3. **Mise à Jour Instantanée de la Réception :** L'état de la chambre bascule automatiquement sur **Available (Disponible/Propre)** sur le planning de la réception. Les réceptionnistes peuvent immédiatement y affecter un nouveau client arrivant sans nécessiter d'appel ou de déplacement physique pour vérification.

---

## 💳 CHAPITRE 6 : LE GUIDE DU MANAGER & COMPTABLE (ERP, Caisse & RH)

Le module **ERP / Comptabilité** centralise tous les flux monétaires de l'établissement et gère la paie du personnel dans le strict respect de la réglementation locale.

### A. Journal de Caisse & Gestion des Dépenses
Pour une gestion rigoureuse et transparente de la trésorerie physique :
1. **Enregistrement des Sorties d'Argent :** Chaque fois qu'une dépense est effectuée (ex : *achat d'ingrédients bruts au marché, règlement de facture d'électricité, achat de bouteilles de gaz*), cliquez sur **"Nouvelle Transaction / Dépense"**.
2. Renseignez le montant en Francs CFA, la catégorie (Achats, Maintenance, Énergie, Paie) et ajoutez un mémo textuel.
3. **Le Journal de Caisse :** Il affiche en temps réel le solde théorique du tiroir-caisse et trace l'historique complet des entrées (ventes POS, règlements PMS) et des sorties.

### B. Gestion Administrative du Personnel & Paie CNPS
Le module RH calcule les bulletins de salaire et automatise l'acquittement des charges sociales de Côte d'Ivoire.

#### 📊 RÉGLEMENTATION SOCIALE IVOIRIENNE (CNPS)

| Composante de la Fiche de Paie | Taux Applicable | Sens Financier | Rôle et Destination des Cotisations |
| :--- | :---: | :---: | :--- |
| **Salaire Brut Imposable** | Base 100% | *Base de calcul* | Salaire contractuel de l'employé avant prélèvements |
| **Retenue Sociale Ouvrière CNPS** | **6.3%** | ➖ Déduction | Prélevée du salaire de l'employé pour le régime de retraite CNPS |
| **Cotisations Patronales** | Selon barème légal | ➕ Charge Employeur | Payées directement par l'établissement pour la protection sociale |
| **Salaire Net à Payer** | **93.7%** *(hors primes)* | 🪙 Versement Final | Montant net crédité sur le compte Mobile Money du salarié |

#### Procédure de Génération de la Paie :
1. Allez dans le module **Ressources Humaines / Paie**.
2. Cliquez sur **"Générer Bulletin"** pour l'employé concerné. Le bulletin est créé avec le statut initial **Draft (Brouillon)**.
3. Vérifiez la concordance du salaire de base et des primes éventuelles. Le système applique automatiquement la retenue CNPS obligatoire de 6.3%.
4. Cliquez sur **"Valider le Paiement"** pour officialiser le versement :
   * **Génération automatique de la dépense :** Le montant net est automatiquement déduit du journal de caisse de l'établissement.
   * **Sécurité Anti-Double Paiement (Idempotence) :** Le système calcule instantanément une clé d'idempotence unique combinant l'identifiant de l'employé et la période concernée (ex : `EMP-04-2026-07`). Si vous ou un autre gestionnaire cliquez par mégarde une deuxième fois sur le bouton de paiement pour la même période, le système intercepte la clé existante et refuse catégoriquement d'enregistrer un deuxième décaissement, évitant ainsi des pertes de trésorerie accidentelles.
5. **Notification Reçu de Salaire :** Cliquez sur **"Envoyer par WhatsApp"**. L'orchestrateur transmet immédiatement à l'employé son récapitulatif de paie complet sur son compte WhatsApp personnel :
   > *"Bonjour M. Kouadio Koffi Jean. Votre bulletin de paie de Juillet 2026 a été validé. Brut Imposable : 250 000 FCFA. Retenue CNPS (6.3%) : 15 750 FCFA. Net à Payer versé : 234 250 FCFA. Merci pour votre dévouement !"*

---

## 📊 CHAPITRE 7 : BUSINESS INTELLIGENCE & ANALYSE FINANCIÈRE (BI)

Prenez des décisions éclairées grâce aux graphiques dynamiques et aux calculs financiers de notre moteur décisionnel intégré.

### A. Indicateurs Clés de Performance (KPIs)
Le tableau de bord analytique calcule et met à jour en continu les indicateurs clés du secteur hôtelier :
1. **Taux d'Occupation :** Détermine le taux d'utilisation de vos capacités d'hébergement.
   `Taux d'Occupation (%) = (Chambres Occupées / Nombre Total de Chambres) × 100`
2. **RevPAR (Revenue Per Available Room) :** Mesure la performance financière globale de votre parc hôtelier.
   `RevPAR = Chiffre d'Affaires Hébergement / Nombre Total de Chambres Disponibles`
3. **Marge Brute F&B (Restauration) :** Évalue la rentabilité directe du maquis-restaurant en comparant le chiffre d'affaires des ventes de repas aux coûts d'achat des ingrédients consommés.
   `Taux de Marge Brute (%) = ((Ventes - Coûts Ingrédients) / Ventes) × 100`

### B. Exportation Excel & Sauvegarde Comptable
Tous les graphiques et listes financières (Ventes POS, Revenus de réservations, Fiches de dépenses, Bulletins de paie validés) disposent d'un outil d'exportation de données :
1. Cliquez sur le bouton **"Exporter au format CSV"** situé au-dessus des tableaux ou graphiques.
2. Le système génère instantanément un fichier structuré encodé en **CSV (UTF-8)**.
3. Ce fichier est optimisé pour être ouvert et exploité sans aucune déformation de caractères ou de chiffres dans **Microsoft Excel** ou Google Sheets pour vos synthèses mensuelles.

---

## 💾 CHAPITRE 8 : CONFIGURATION SYSTÈME, SAUVEGARDE ET REPRISE SUR SINISTRE

Pour prémunir l'établissement contre toute panne réseau, crash matériel ou mauvaise manipulation humaine des terminaux de vente, la plateforme dispose d'un plan robuste de reprise d'activité (PRA).

### A. Sauvegarde Manuelle Complète de l'Établissement
L'administrateur ou le gérant général doit procéder à une exportation de sécurité chaque fin de semaine :
1. Rendez-vous dans le panneau **Property Settings** (Paramètres de l'établissement).
2. Faites défiler l'écran jusqu'à la section **Sauvegarde & Restauration de l'état local**.
3. Cliquez sur le bouton de sauvegarde. Le système va instantanément compiler la totalité des structures de données dynamiques de l'application :
   * Les profils des chambres et leurs plannings de réservation.
   * Les fiches d'inventaire et stocks d'ingrédients en cuisine.
   * L'historique complet des additions du POS et des folios clients.
   * Les transactions du journal de caisse et les bulletins de paie validés.
   * L'annuaire du personnel et l'ensemble des configurations multi-tenant.
4. Un fichier unique au format **JSON** (ex : `brunch_bouake_backup_2026-07-06.json`) est téléchargé sur votre ordinateur.
5. Conservez impérativement ce fichier sur un support de stockage externe (clé USB, disque dur externe de l'établissement ou dossier cloud sécurisé).

### B. Restauration Complète du Système en Moins de 3 Secondes
En cas de sinistre informatique (panne de tablette, perte de données de l'appareil local suite à un vidage accidentel du cache du navigateur ou changement de poste de travail) :
1. Connectez-vous sur votre nouveau terminal de travail.
2. Allez dans l'onglet **Property Settings** (Paramètres de l'établissement).
3. Repérez l'encadré de restauration et cliquez sur **"Choisir un fichier"**.
4. Sélectionnez le fichier JSON de sauvegarde le plus récent enregistré sur votre support externe.
5. Cliquez sur **"Restaurer la Base de Données"**.
6. **Reprise Immédiate :** L'application recharge et recrée l'ensemble des variables système, des plannings de chambres et des stocks d'ingrédients en cuisine en moins de 3 secondes, vous permettant de reprendre l'exploitation immédiatement sans la moindre perte d'informations.

### C. Vérification de la Liaison WhatsApp Business en Direct
Le panneau d'administration propose également un onglet technique pour tester en direct la délivrabilité de l'API de communication WhatsApp Business :
1. Renseignez la variable d'environnement active `VITE_WHATSAPP_TEST_NUMBER` pour définir votre numéro de test professionnel (ex: `+212777346787`).
2. Cliquez sur le bouton de test d'intégration **"Envoyer un Message de Test"** disponible dans le panneau.
3. Le système envoie immédiatement une fausse confirmation de séjour au numéro enregistré.
4. Les badges de réussite ou d'erreur s'affichent instantanément sous le bouton pour vous aider à diagnostiquer et résoudre les éventuelles anomalies de connexion avec le serveur WhatsApp en quelques secondes.

---

*Fin du Manuel d'Utilisation. Brunch Bouaké — L'alliance de l'élégance numérique et de la rigueur opérationnelle.*
