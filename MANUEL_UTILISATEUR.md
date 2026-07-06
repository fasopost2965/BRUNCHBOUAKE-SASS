\documentclass[11pt, a4paper]{article}
\usepackage[a4paper, top=2.2cm, bottom=2.2cm, left=2cm, right=2cm, headheight=20pt, footskip=30pt]{geometry}
\usepackage{fontspec}

% --- BLOC DE CONFIGURATION LINGUISTIQUE ET TYPOGRAPHIQUE ---
\usepackage[french, bidi=basic, provide=*]{babel}
\babelprovide[import, onchar=ids fonts]{french}
\babelprovide[import, onchar=ids fonts]{english}

% Définition de la police par défaut (Sans Serif moderne pour un guide de terrain)
\babelfont{rm}{Noto Sans}

\usepackage{enumitem}
\setlist[itemize]{label=--}

% --- PACKAGES SUPPLÉMENTAIRES ---
\usepackage{amsmath}
\usepackage{booktabs}
\usepackage{tabularx}
\usepackage{xcolor}
\usepackage{titlesec}
\usepackage{fancyhdr}

% --- PALETTE DE COULEURS BRUNCH BOUAKÉ ---
\definecolor{primary}{HTML}{0D5C3A}    % Vert Tropical / Palmier
\definecolor{secondary}{HTML}{E67E22}  % Orange Coucher de soleil
\definecolor{darkgray}{HTML}{2C3E50}   % Gris anthracite pour le texte
\definecolor{lightgray}{HTML}{F8F9FA}  % Fond de bloc
\definecolor{bordergray}{HTML}{BDC3C7} % Ligne de séparation
\definecolor{success}{HTML}{27AE60}    % Vert opérationnel
\definecolor{warning}{HTML}{F1C40F}    % Jaune d'alerte (texte noir)
\definecolor{danger}{HTML}{C0392B}     % Rouge d'interdiction / alerte critique

% --- STYLE DES TITRES ---
\titleformat{\section}{\color{primary}\normalfont\Large\bfseries}{\thesection.}{1em}{}[{\titlerule[1.5pt]}]
\titleformat{\subsection}{\color{secondary}\normalfont\large\bfseries}{\thesubsection}{1em}{}
\titleformat{\subsubsection}{\color{darkgray}\normalfont\normalsize\bfseries}{\thesubsubsection}{1em}{}

% --- CONFIGURATION EN-TÊTE ET PIED DE PAGE ---
\pagestyle{fancy}
\fancyhf{}
\renewcommand{\headrulewidth}{0.5pt}
\renewcommand{\footrulewidth}{0.5pt}
\fancyhead[L]{\textcolor{primary}{\textbf{Brunch Bouaké Hospitality}} \ -- \ Manuel Opérationnel}
\fancyhead[R]{\textcolor{darkgray}{Édition Production Complète 2026}}
\fancyfoot[C]{\thepage}

% --- COMMANDES SPÉCIALES ---
\newcommand{\badge}[3]{%
  \colorbox{#1}{\textcolor{#2}{\,\textbf{#3}\,}}%
}

\newcommand{\noteimportante}[1]{%
  \medskip
  \noindent\colorbox{lightgray}{%
    \parbox{\dimexpr\linewidth-2\fboxsep}{%
      \textcolor{primary}{\textbf{NOTE OPÉRATIONNELLE :}} \textit{#1}%
    }%
  }\medskip
}

\newcommand{\code}[1]{\texttt{#1}}

\begin{document}

% --- EN-TÊTE DU DOCUMENT ---
\begin{center}
  \textcolor{primary}{\Huge\textbf{BRUNCH BOUAKÉ HOSPITALITY}} \\
  \vspace{0.2cm}
  \textcolor{secondary}{\large\textbf{Manuel d'Utilisation Officiel \ --- \ Édition Complète 2026}} \\
  \vspace{0.4cm}
  \textbf{Établissement :} L'Hôtel Bouaké Kennedy \quad | \quad \textbf{Tenant ID :} \code{tenant-bouake-kennedy} \\
  \vspace{0.1cm}
  \small\textit{Manuel de Référence Opérationnelle et Technique de Production \ --- \ Standard de Terrain}
\end{center}
\vspace{0.3cm}
\hrule height 1.5pt
\vspace{0.6cm}

% --- INTRODUCTION ---
\section*{AKWABA \ --- \ PRÉSENTATION GÉNÉRALE}
Bienvenue dans le manuel officiel de \textbf{Brunch Bouaké Hospitality}, la plateforme de gestion intégrée tout-en-un (PMS, POS, CRM, ERP, RH, BI) spécialement conçue pour les hôtels, résidences et restaurants de Côte d'Ivoire. Ce guide exhaustif est directement corrélé au document de référence principal de l'architecture logicielle de notre suite applicative, \code{MANUEL\_UTILISATEUR.md}.

\subsection*{Sécurité et Isolation Multi-Tenant}
L'application repose sur une architecture multi-locataire (Multi-Tenant). Toutes les données d'exploitation de votre établissement sont isolées de façon étanche sous votre identifiant unique de locataire : \code{tenant-bouake-kennedy} (L'Hôtel Bouaké Kennedy).
\begin{itemize}
  \item \textbf{Isolation Absolue :} Aucune autre entité ou succursale présente sur le réseau SaaS ne peut lire, modifier ou intercepter vos données d'hébergement, vos folio-clients, vos fiches d'inventaire, vos états de caisse ou vos bulletins de paie.
  \item \textbf{Traçabilité Totale :} Chaque action effectuée sur le système (enregistrement, validation, sortie d'espèces) est nominativement rattachée à l'utilisateur connecté, horodatée avec précision et inscrite au journal d'audit de sécurité.
\end{itemize}

\noteimportante{La sécurité commence par la discrétion individuelle. Ne communiquez sous aucun prétexte votre mot de passe d'accès personnel à un autre collaborateur de l'établissement.}

% --- CHAPITRE 1 ---
\section{CONFIGURATION INITIALE \& PREMIÈRE UTILISATION}
Avant d'entamer l'exploitation en direct, l'administrateur ou le gérant de l'établissement doit renseigner et vérifier les paramètres structurants dans le panneau \textbf{Property Settings} (Paramètres de l'Établissement).

\subsection{Configuration des Informations d'Établissement}
\begin{enumerate}
  \item Accédez au module de configuration générale (icône d'engrenage ou onglet \textbf{Paramètres de l'Établissement}).
  \item Vérifiez la cohérence du nom officiel de l'établissement (\textbf{Brunch Bouaké \ --- \ Kennedy}) et de l'identifiant de la succursale active (\code{CI-BKE-01}).
  \item Configurez le taux de Taxe sur la Valeur Ajoutée (TVA) par défaut de l'établissement (fixé selon la réglementation à $18\%$ en Côte d'Ivoire pour l'hébergement et la restauration).
\end{enumerate}

\subsection{Paramétrage des Chambres et Tarifs (PMS)}
\begin{enumerate}
  \item Déclarez l'ensemble des hébergements physiques disponibles (ex : \textit{Chambre Standard 101}, \textit{Suite VIP 202}, \textit{Studio Meublé 303}).
  \item Définissez pour chaque chambre son tarif de nuitée de base exprimé en Francs CFA (XOF).
  \item Renseignez la \textbf{limite de crédit} maximale par défaut autorisée pour les transferts de consommations du maquis/restaurant vers le folio de la chambre (recommandé : \code{100 000} FCFA).
\end{enumerate}

\subsection{Création des Fiches Ingrédients \& Articles du Menu (POS)}
Le fonctionnement des alertes automatiques et de la commande tactile repose sur la liaison entre les articles du menu et les ingrédients bruts en stock :
\begin{enumerate}
  \item \textbf{Fiches Ingrédients :} Saisissez les stocks physiques initiaux de vos ingrédients bruts (poulet, huile de friture, banane plantain, sacs de riz, bouteilles de bière, sucre). Définissez pour chacun le seuil d'alerte critique sous lequel l'état passera en niveau d'alerte.
  \item \textbf{Articles du Menu :} Créez vos fiches de vente (ex : \textit{Alloco Giga}, \textit{Kedjenou de Poulet}, \textit{Bière Bock}). Renseignez les ingrédients consommés et leur quantité exacte prélevée du stock d'inventaire lors de la validation d'une portion.
\end{enumerate}

\subsection{Configuration des Employés et Profils (RH)}
\begin{enumerate}
  \item Enregistrez chaque collaborateur dans l'annuaire du personnel de l'établissement.
  \item Définissez leur salaire brut imposable de base, leur poste opérationnel (Réceptionniste, Serveur, Cuisinier, Gouvernant, Comptable) et leur numéro WhatsApp professionnel de contact.
  \item Configurez le taux de retenue sociale ouvrière obligatoire pour la Caisse Nationale de Prévoyance Sociale (CNPS), réglementairement établi à \textbf{6.3\%}.
\end{enumerate}

\subsection{Configuration de la Passerelle WhatsApp Business}
L'envoi des confirmations de réservation, des codes d'accès et des reçus de paie nécessite une configuration adéquate des variables d'environnement système :
\begin{itemize}
  \item \textbf{Numéro WhatsApp de Test Actif :} La variable \code{VITE\_WHATSAPP\_TEST\_NUMBER} définie dans le fichier de configuration de l'environnement applicatif (\code{.env.example}) est paramétrée par défaut sur le numéro de contrôle \code{+212777346787}.
  \item \textbf{Validation Technique :} Un bouton de validation d'API nommé \textbf{``Envoyer un Message de Test''} est disponible dans le panneau d'administration pour confirmer instantanément l'état de la liaison réseau en envoyant un message type au numéro de contrôle configuré.
\end{itemize}

\newpage

% --- CHAPITRE 2 ---
\section{LE GUIDE DU RÉCEPTIONNISTE (Module PMS)}
Le module \textbf{PMS (Property Management System)} orchestre l'accueil physique et virtuel, la planification dynamique des nuitées et la gestion financière des folios clients.

\subsection{Tableau Récapitulatif du Parcours Voyageur}
Le personnel d'accueil à la réception doit exécuter et valider chaque étape selon la grille de procédure ci-dessous :

\vspace{0.3cm}
\noindent
\begin{tabularx}{\textwidth}{l p{3.5cm} X X}
\toprule
\textbf{Phase Opérationnelle} & \textbf{Action Réception} & \textbf{Données Requises} & \textbf{Automatisation \& Actions Système} \\
\midrule
\textbf{1. Enregistrement} & Créer une Réservation & Nom complet, dates de séjour, téléphone portable valide & Blocage de la chambre sélectionnée et inscription immédiate au planning global. \\
\midrule
\textbf{2. Arrivée (Check-In)} & Cliquer sur le bouton \textbf{``Check-In''} & Pièce d'identité valide, contrôle des dates & Génération automatique d'un \textbf{code PIN secret à 4 chiffres} et envoi immédiat par WhatsApp. \\
\midrule
\textbf{3. Durant le Séjour} & Suivi et gestion du folio client & Ajout des nuitées et extras & Autorisation de report de facture des consommations du maquis sur saisie du PIN client. \\
\midrule
\textbf{4. Départ (Check-Out)} & Cliquer sur le bouton \textbf{``Check-Out''} & Encaissement total du solde et clôture & Impression de facture définitive, libération de la chambre et statut \badge{danger}{white}{Dirty} (Sale). \\
\bottomrule
\end{tabularx}
\vspace{0.3cm}

\subsection{Création d'une Réservation}
\begin{enumerate}
  \item Cliquez sur le bouton \textbf{``Créer une Réservation''} depuis le planning ou l'accueil du PMS.
  \item \textbf{Saisie obligatoire des informations clés :}
  \begin{itemize}
    \item \textbf{Identité Voyageur :} Nom et prénom complets (ex : \textit{Yao Kouassi Hermann}).
    \item \textbf{Numéro WhatsApp :} Le système applique un validateur strict pour assurer la délivrabilité des notifications WhatsApp. Le numéro doit être saisi au format international direct sans espace :
    \begin{itemize}
      \item \textbf{Côte d'Ivoire (CI) :} \code{+225} suivi de exactement \textbf{10 chiffres} (ex : \code{+2250708091011}).
      \item \textbf{Maroc (MA) :} \code{+212} suivi de exactement \textbf{9 chiffres} (ex : \code{+212777346787}).
      \item \textbf{Autre pays :} \code{+} suivi de l'indicatif international et du numéro de téléphone.
    \end{itemize}
    \item \textbf{Source de Distribution :} Renseignez l'origine de la réservation (Direct, Téléphonique, Booking.com, Airbnb, Expedia ou synchronisation automatique via notre passerelle Channel Manager intégrée).
  \end{itemize}
  \item Cliquez sur \textbf{``Sauvegarder''}. La chambre est instantanément bloquée sur le calendrier.
\end{enumerate}

\subsection{Le Check-In (Arrivée du Voyageur)}
\begin{enumerate}
  \item Dès l'arrivée physique du voyageur, retrouvez son dossier dans l'onglet \textbf{``Arrivées du Jour''}.
  \item Procédez à la vérification d'identité réglementaire, puis cliquez sur le bouton \textbf{``Check-In''}.
  \item \textbf{Génération de la clé d'accès virtuelle :} Le système génère instantanément un code de sécurité aléatoire unique à 4 chiffres (ex : \code{4912}).
  \item \textbf{Envoi automatique du code d'accès :} Le serveur notifie immédiatement le client sur son compte WhatsApp avec le template officiel standardisé :
  \begin{quote}
    \textit{``Akwaba M. Yao Kouassi Hermann ! Nous sommes ravis de vous accueillir à l'Hôtel Bouaké Kennedy. Votre chambre Studio Suite 101 est disponible. Votre code PIN secret d'accès et d'autorisation d'achat est \textbf{4912}. Excellent séjour chez Brunch Bouaké !''}
  \end{quote}
\end{enumerate}

\subsection{Le Check-Out (Départ du Voyageur)}
\begin{enumerate}
  \item Au moment du départ, sélectionnez la fiche de la chambre concernée et cliquez sur \textbf{``Check-Out''}.
  \item \textbf{Calcul du Solde Global :} L'application agrège dynamiquement l'ensemble des nuitées et des extras accumulés sur la facture :
  $$\text{Montant Total} = (\text{Nuitées} \times \text{Tarif Nuitée}) + \text{Extras POS Restaurant} + \text{Services Annexes} - \text{Acomptes}$$
  \item \textbf{Règlement :} Sélectionnez le mode de paiement effectif (Espèces, Wave ou Orange Money) et saisissez le montant encaissé pour équilibrer le folio.
  \item \textbf{Mise en Nettoyage :} Dès validation, la chambre est déclarée vacante et son état bascule automatiquement à la couleur rouge d'avertissement \badge{danger}{white}{Dirty} (Sale), alertant l'équipe d'étage.
\end{enumerate}

\newpage

% --- CHAPITRE 3 ---
\section{LE GUIDE DU SERVEUR \& BARMAN (Module POS \& Restauration)}
Le module \textbf{POS (Point of Sale)} équipe les serveurs en salle et les barmans pour la prise de commande mobile sur tablettes tactiles et la mise à jour immédiate des stocks.

\subsection{Tableau de Gestion de l'Inventaire et des Alertes Stocks}
Pour prévenir les ventes d'articles indisponibles, le système applique un contrôle automatique des stocks :

\vspace{0.3cm}
\noindent
\begin{tabularx}{\textwidth}{l c p{3.8cm} X}
\toprule
\textbf{Statut Ingrédient} & \textbf{Badge Visuel} & \textbf{Prise de Commande} & \textbf{Consignes pour le Personnel de Salle} \\
\midrule
\textbf{En Stock Suffisant} & \badge{success}{white}{Vert} & \textbf{Autorisée} & Prendre la commande normalement. \\
\midrule
\textbf{Seuil Critique Atteint} & \badge{warning}{black}{Jaune} & \textbf{Autorisée sous réserve} & Stock très limité en cuisine. Prévenir poliment le client qu'il reste peu de portions de ce plat. \\
\midrule
\textbf{Rupture Complète} & \badge{danger}{white}{Rouge} & \textbf{Bloquée (Système)} & L'ajout au panier est impossible. Présenter nos excuses et orienter le client vers une alternative (ex : Alloco remplacé par de l'Attiéké). \\
\bottomrule
\end{tabularx}
\vspace{0.3cm}

\subsection{Prise de Commande Rapide en Salle}
\begin{enumerate}
  \item Sur l'écran tactile de votre tablette, sélectionnez le numéro de la table active.
  \item Touchez les icônes des plats demandés par le client pour composer la commande (\textit{Brunch Ivoirien}, \textit{Kedjenou de Poulet}, \textit{Alloco Giga}, \textit{Bière Bock}).
  \item \textbf{Vérification d'inventaire :} Si l'ingrédient principal d'un plat est en rupture de stock (badge rouge), l'application désactive l'icône, rendant l'ajout au panier impossible et évitant les déceptions en cours de service.
\end{enumerate}

\subsection{Le Tunnel de Paiement Direct}
\begin{enumerate}
  \item Appuyez sur le bouton \textbf{``Payer''} de l'interface POS de votre tablette.
  \item Sélectionnez le moyen de règlement de la table :
  \begin{itemize}
    \item \textbf{Espèces :} Renseignez le montant en Francs CFA (XOF) remis par le client. L'écran affiche instantanément la monnaie exacte à restituer.
    \item \textbf{Mobile Money (Wave / Orange Money) :} Saisissez le numéro de téléphone de paiement ivoirien (\code{+225} obligatoire) pour initier l'appel de fonds. Demandez au client de composer son code d'autorisation personnel sur son propre mobile. Attendez l'affichage du reçu d'autorisation vert avant de libérer la table.
  \end{itemize}
\end{enumerate}

\subsection{Le Transfert sur Facture de Chambre}
Les résidents séjournant à l'hôtel peuvent reporter le règlement de leurs consommations sur leur note finale :
\begin{enumerate}
  \item Sur l'écran de paiement du POS, cliquez sur l'option \textbf{``Transférer sur Chambre''}.
  \item Sélectionnez le numéro de chambre du client concerné.
  \item \textbf{Vérification de la limite financière :} Le système s'assure instantanément que la dépense cumulée sur le folio ne dépasse pas la limite de crédit autorisée de la chambre.
  \item \textbf{Saisie Obligatoire du PIN de Sécurité :} Présentez l'écran de la tablette au client afin qu'il saisisse lui-même son \textbf{code PIN personnel à 4 chiffres} (reçu par WhatsApp lors de son check-in).
  \item Si le code est correct et la limite respectée, le montant est affecté au folio de la chambre et la table est automatiquement libérée en salle.
\end{enumerate}

\newpage

% --- CHAPITRE 4 ---
\section{LE GUIDE DE LA RELATION CLIENT (Module CRM \& Marketing)}
Le module \textbf{CRM} regroupe les données de fidélisation de l'établissement et permet le lancement de campagnes marketing directes via WhatsApp.

\subsection{Fiche Client et Suivi de Fidélité}
Chaque client de l'hôtel ou du restaurant dispose d'une fiche récapitulative centralisant :
\begin{itemize}
  \item \textbf{Nombre total de séjours et dépenses cumulées} pour une visibilité immédiate de sa valeur commerciale.
  \item \textbf{Préférences mémorisées :} Numéro de chambre préféré, exigences de confort (climatisation active à l'arrivée, lit king-size), ou restrictions diététiques pour le restaurant.
  \item \textbf{Niveau de Fidélité attribué automatiquement par le système :}
  \begin{itemize}
    \item \textbf{Bronze :} Profil d'accueil par défaut.
    \item \textbf{Silver (dès 5 séjours) :} Application d'une réduction automatique de $5\%$ sur l'hébergement.
    \item \textbf{Gold (dès 15 séjours) :} Réduction automatique de $10\%$ sur l'hébergement et surclassement prioritaire selon la disponibilité.
    \item \textbf{Platinum (dès 30 séjours) :} Réduction de $15\%$ sur l'hébergement, accueil VIP et encaissement différé.
  \end{itemize}
\end{itemize}

\subsection{Envoi de Campagnes Marketing WhatsApp Ciblées}
Pour optimiser le taux de remplissage en période de basse saison :
\begin{enumerate}
  \item Rendez-vous dans le sous-onglet \textbf{``CRM \& Marketing''}.
  \item \textbf{Ciblage de la clientèle :} Définissez les filtres de votre campagne (ex : \textit{tous les clients au statut Gold} ou \textit{tous les clients sans réservation depuis plus de 60 jours}).
  \item \textbf{Sélection du modèle de message standardisé (Template) :}
  \begin{itemize}
    \item \textbf{Promotion Hébergement :} \textit{``Akwaba ! Profitez de 20\% de réduction sur votre séjour du week-end à l'Hôtel Bouaké Kennedy avec le code KENNEDY20.''}
    \item \textbf{Événementiel Restauration :} \textit{``Le Grand Brunch de Bouaké revient ce dimanche ! Réservez votre table et venez déguster notre mythique Kedjenou de canard cuit au feu de bois.''}
  \end{itemize}
  \item Cliquez sur le bouton \textbf{``Envoyer la Campagne''}. Le serveur d'envoi asynchrone traite la file d'attente pour distribuer les messages nominativement sans saturer la bande passante de la succursale.
\end{enumerate}

% --- CHAPITRE 5 ---
\section{LE GUIDE DU GOUVERNANT \& ENTRETIEN (Module Tasks)}
Le module \textbf{Tasks} assure une coordination fluide et en temps réel entre la réception de l'hôtel, l'équipe d'étage pour le ménage et l'équipe technique de maintenance.

\subsection{Attribution et Traitement des Missions sur le Terrain}
Chaque agent d'entretien ou technicien de maintenance consulte son terminal mobile de service pour connaître ses priorités opérationnelles :
\begin{enumerate}
  \item \textbf{Ménage Prioritaire (Dirty Rooms) :} Les chambres dont le check-out vient d'être validé par la réception apparaissent automatiquement en priorité haute avec l'indicateur \badge{danger}{white}{Dirty}.
  \item \textbf{Tickets de Maintenance :} Les dysfonctionnements techniques signalés (ex : \textit{climatiseur bruyant dans la chambre 102}, \textit{mitigeur de douche fuyant}) apparaissent sous forme de fiches d'intervention détaillant l'urgence (Basse, Moyenne, Haute) et l'action à mener.
\end{enumerate}

\subsection{Validation de Fin de Service}
Dès que le nettoyage ou la réparation d'un équipement est finalisé :
\begin{enumerate}
  \item L'agent ouvre la tâche sur son mobile et sélectionne le statut \textbf{``Complétée / Completed''}.
  \item \textbf{Impact Instantané :} L'état de la chambre bascule immédiatement au statut \badge{success}{white}{Available} (Propre et Disponible) sur les tableaux d'en-tête de la réception. La chambre est de nouveau louable sans appel de contrôle ni déplacement physique requis.
\end{enumerate}

\newpage

% --- CHAPITRE 6 ---
\section{LE GUIDE DU MANAGER \& COMPTABLE (ERP, Caisse \& RH)}
Ce module centralise les fonctions d'analyse financière, de suivi de trésorerie et d'automatisation de la paie en conformité avec la législation de la République de Côte d'Ivoire.

\subsection{Journal de Caisse et Suivi des Dépenses de Fonctionnement}
Pour assurer une traçabilité rigoureuse et écarter tout risque de coulage de trésorerie :
\begin{enumerate}
  \item \textbf{Saisie systématique des sorties d'argent :} Pour toute dépense opérationnelle (ex : \textit{achat de gaz pour les fourneaux}, \textit{réapprovisionnement de légumes au marché}, \textit{frais de carburant pour le groupe électrogène}), cliquez sur \textbf{``Nouvelle Dépense''}.
  \item Renseignez le montant exact en Francs CFA, attribuez une catégorie comptable (Achats, Énergie, Entretien, Salaires) et ajoutez un mémo d'explication.
  \item \textbf{Suivi de Solde :} Le journal de caisse comptabilise instantanément le solde théorique physique du coffre ou du tiroir-caisse en croisant les entrées (ventes POS, acomptes PMS) et les dépenses validées.
\end{enumerate}

\subsection{Gestion du Personnel et Calcul de la Paie CNPS}
Le moteur de paie intégré applique scrupuleusement le barème légal obligatoire de Côte d'Ivoire :

\subsubsection{Répartition Standard de la Structure Salariale (Base CNPS)}
\vspace{0.3cm}
\noindent
\begin{tabularx}{\textwidth}{l c c X}
\toprule
\textbf{Composante du Bulletin} & \textbf{Taux Applicable} & \textbf{Type d'Opération} & \textbf{Rôle et Destination des Fonds} \\
\midrule
\textbf{Salaire Brut Imposable} & Base $100\%$ & Référence de calcul & Salaire de base contractuel de l'employé avant retenues. \\
\midrule
\textbf{Retenue Sociale Ouvrière} & \textbf{6.3\%} & Déduction (---) & Part salariale obligatoire versée à la Caisse Nationale de Prévoyance Sociale (CNPS) pour la retraite. \\
\midrule
\textbf{Cotisations Patronales} & Selon barème légal & Charge employeur (+) & Contribution à la charge exclusive de l'établissement versée à la CNPS. \\
\midrule
\textbf{Salaire Net à Payer} & \textbf{93.7\%} (hors primes) & Versement final ($\rightarrow$) & Rémunération nette versée sur le compte Mobile Money (Wave ou Orange Money) du salarié. \\
\bottomrule
\end{tabularx}
\vspace{0.3cm}

\subsubsection{Procédure de Génération et Validation du Bulletin de Paie}
\begin{enumerate}
  \item Ouvrez l'onglet \textbf{``Gestion RH / Paie''} et cliquez sur \textbf{``Générer Bulletin''} pour l'employé concerné. Le bulletin est créé au statut \textbf{Draft (Brouillon)}.
  \item Vérifiez le salaire brut de base et ajoutez les éventuelles indemnités ou primes autorisées. Le système calcule automatiquement la déduction de $6.3\%$ pour la CNPS.
  \item Cliquez sur le bouton \textbf{``Valider le Paiement''} pour officialiser l'écriture :
  \begin{itemize}
    \item \textbf{Impact Trésorerie :} Le montant net à payer est déduit de la caisse.
    \item \textbf{Sécurisation contre les doublons (Idempotence) :} Pour protéger les finances de l'établissement contre les clics répétés ou l'exécution simultanée par deux responsables, le système calcule une clé d'idempotence unique basée sur le binôme d'identification \code{Employé-Période} (ex : \code{EMP-04-2026-07}). Si une seconde tentative de validation est lancée pour la même période sur le même compte d'employé, le système l'intercepte et la rejette immédiatement, interdisant tout double décaissement.
  \end{itemize}
  \item \textbf{Notification de Fiche de Paie :} Cliquez sur \textbf{``Envoyer par WhatsApp''}. L'employé reçoit instantanément sur son numéro de portable le récapitulatif officiel de sa paie :
  \begin{quote}
    \textit{``Bonjour M. Kouadio Koffi Jean. Votre bulletin de paie de Juillet 2026 a été validé. Brut Imposable : 250 000 FCFA. Retenue CNPS (6.3\%) : 15 750 FCFA. Net versé : 234 250 FCFA. Merci pour votre engagement au sein de notre établissement !''}
  \end{quote}
\end{enumerate}

\newpage

% --- CHAPITRE 7 ---
\section{BUSINESS INTELLIGENCE \& ANALYSE FINANCIÈRE (BI)}
Le module de Business Intelligence (BI) convertit vos données opérationnelles en indicateurs clés de performance (KPIs) graphiques pour piloter l'établissement avec rigueur.

\subsection{Indicateurs Clés de Performance (KPIs)}
Le tableau de bord décisionnel calcule et met à jour en continu les indicateurs clés du secteur hôtelier :
\begin{itemize}
  \item \textbf{Taux d'Occupation :} Ratio mesurant l'efficacité commerciale de l'hébergement.
  $$\text{Taux d'Occupation (\%)} = \left( \frac{\text{Chambres Occupées}}{\text{Nombre Total de Chambres}} \right) \times 100$$
  \item \textbf{RevPAR (Revenue Per Available Room) :} Indicateur clé de rentabilité hôtelière mesurant le revenu moyen généré par l'ensemble des chambres exploitables.
  $$\text{RevPAR} = \frac{\text{Chiffre d'Affaires de l'Hébergement}}{\text{Nombre Total de Chambres Disponibles}}$$
  \item \textbf{Marge Brute F\&B (Food \& Beverage) :} Indice de rentabilité directe du maquis-restaurant en croisant les ventes et le coût d'achat des ingrédients bruts consommés.
  $$\text{Taux de Marge Brute (\%)} = \left( \frac{\text{Ventes} - \text{Coût Ingrédients}}{\text{Ventes}} \right) \times 100$$
\end{itemize}

\subsection{Exportation des Données Comptables}
Chaque graphique et tableau financier du module (recettes d'hébergement, journal des ventes du restaurant, relevés de dépenses, historique des paies) comporte une option d'extraction :
\begin{enumerate}
  \item Cliquez sur le bouton \textbf{``Exporter au format CSV''}.
  \item Le système compile et télécharge immédiatement un fichier structuré encodé au format standardisé \textbf{CSV (UTF-8)}.
  \item Ce fichier est optimisé pour être importé sans aucune déformation de caractères ou de formats numériques dans les logiciels de comptabilité de l'établissement ou dans \textbf{Microsoft Excel}.
\end{enumerate}

% --- CHAPITRE 8 ---
\section{CONFIGURATION SYSTÈME, SAUVEGARDE ET REPRISE SUR SINISTRE}
Pour prémunir l'établissement contre toute panne réseau, crash matériel ou vidage accidentel du cache des navigateurs locaux, la plateforme dispose d'un plan de reprise d'activité (PRA) robuste et autonome.

\subsection{Sauvegarde Hebdomadaire Complète de l'Établissement}
L'administrateur ou le gérant général de l'établissement doit obligatoirement procéder à une exportation de sécurité manuelle chaque fin de semaine :
\begin{enumerate}
  \item Rendez-vous dans le panneau \textbf{Property Settings} (Paramètres de l'Établissement).
  \item Faites défiler l'écran jusqu'à la section \textbf{``Sauvegarde \& Restauration de l'état local''}.
  \item Cliquez sur le bouton de sauvegarde. Le système compile instantanément la totalité des bases de données de votre locataire :
  \begin{itemize}
    \item Profils physiques des chambres et plannings des réservations actives.
    \item Inventaire complet et état des stocks de la cuisine.
    \item Folios clients actifs et additions en cours de transfert.
    \item Historique des dépenses et bulletins de paie validés.
    \item Annuaire du personnel et configurations de la passerelle WhatsApp.
  \end{itemize}
  \item Un fichier unique au format \textbf{JSON} (ex : \code{brunch\_bouake\_backup\_2026-07-06.json}) est alors téléchargé sur votre ordinateur.
  \item Conservez impérativement ce fichier sur une clé USB ou un dossier cloud sécurisé de l'établissement.
\end{enumerate}

\subsection{Restauration Complète du Système en Moins de 3 Secondes}
En cas de crash complet d'une tablette de service ou de changement d'ordinateur à la réception :
\begin{enumerate}
  \item Connectez-vous à l'application Brunch Bouaké sur votre nouveau terminal de travail.
  \item Accédez à l'onglet \textbf{Property Settings} (Paramètres de l'Établissement).
  \item Repérez l'encadré de restauration de base et cliquez sur le bouton \textbf{``Choisir un fichier''}.
  \item Sélectionnez votre fichier JSON de sauvegarde le plus récent enregistré sur votre support de stockage externe.
  \item Cliquez sur \textbf{``Restaurer la Base de Données''}.
  \item \textbf{Reprise Immédiate :} L'application recrée l'ensemble des plannings, des fiches de stocks et de la comptabilité locale en moins de 3 secondes, permettant de reprendre immédiatement l'exploitation sans aucune perte d'informations.
\end{enumerate}

\subsection{Vérification de la Liaison WhatsApp Business en Direct}
Pour diagnostiquer un problème de communication, le panneau d'administration propose également un onglet technique de contrôle de délivrabilité :
\begin{enumerate}
  \item Saisissez la variable active \code{VITE\_WHATSAPP\_TEST\_NUMBER} pour renseigner le numéro de test professionnel standardisé (par défaut le numéro de contrôle \code{+212777346787}).
  \item Cliquez sur le bouton de test \textbf{``Envoyer un Message de Test''}.
  \item Le système tente d'expédier un message type via l'orchestrateur de communication WhatsApp Business.
  \item L'affichage immédiat d'un badge vert de réussite ou rouge d'erreur permet de confirmer l'état de la liaison réseau en quelques secondes.
\end{enumerate}

\vspace{1.2cm}
\begin{center}
  \textcolor{primary}{\hrule height 2pt}
  \vspace{0.2cm}
  \small\textcolor{darkgray}{\textbf{Brunch Bouaké Hospitality} --- Excellence Numérique et Rigueur Opérationnelle au Service du Terroir. Issu du document d'ingénierie principal \code{MANUEL\_UTILISATEUR.md}.}
\end{center}

\end{document}
