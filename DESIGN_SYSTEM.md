# Design System — Brunch Bouaké Hospitality

> Système de Gestion Hybride Unifié (PMS · CRM · ERP · POS)
> Ce document décrit le design system existant dans `src/index.css`, utilisé par l'ensemble des modules (Dashboard, PMS, POS, ERP, CRM, RH, Stock, Reporting...).

---

## 1. Philosophie

Le design system repose sur une architecture **thème-agnostique** : les composants React sont écrits avec des classes Tailwind standards (`bg-orange-500`, `text-slate-900`, `bg-white`...), et une couche de **variables CSS + surcharges** (`src/index.css`) réinterprète ces classes selon le thème actif (`theme-savannah`, `theme-lagoon`, `theme-forest`, `theme-swiss`).

Avantage : un seul jeu de composants, quatre ambiances visuelles complètes, sans dupliquer le code des écrans.

---

## 2. Thèmes

| Thème | Nom produit | Ambiance | Usage recommandé |
|---|---|---|---|
| `theme-savannah` | **Savannah** | Orange chaleureux, clair, accueillant | Thème par défaut, accueil / réception |
| `theme-lagoon` | **Blue Lagoon** | Dark mode bleu-cyan nocturne | Utilisation de nuit, veille de sécurité, salle de contrôle |
| `theme-forest` | **Sacred Forest** | Éco-luxe émeraude & or | Communication premium, espaces "nature" |
| `theme-swiss` | **Helvetic Swiss Art** | Noir/blanc, contraste fort, monospace | Reporting, données, accessibilité renforcée |

### 2.1 Palette — variables par thème

| Variable | Savannah | Blue Lagoon | Sacred Forest | Helvetic Swiss |
|---|---|---|---|---|
| `--bg-main` | `#f8fafc` | `#0b1120` | `#f4f6f0` | `#f8f9fa` |
| `--bg-surface` | `#ffffff` | `#121b2e` | `#ffffff` | `#ffffff` |
| `--bg-input` | `#ffffff` | `#0f172a` | `#fcfdfa` | `#ffffff` |
| `--border-main` | `#e2e8f0` | `#1e293b` | `#e3e8db` | `#000000` |
| `--border-input` | `#cbd5e1` | `#334155` | `#cad2c5` | `#000000` |
| `--text-main` | `#0f172a` | `#f1f5f9` | `#132a13` | `#000000` |
| `--text-muted` | `#64748b` | `#94a3b8` | `#3f5e4d` | `#333333` |
| `--text-bright` | `#334155` | `#cbd5e1` | `#132a13` | `#000000` |
| `--primary-color` | `#f97316` | `#06b6d4` | `#2d6a4f` | `#000000` |
| `--primary-hover` | `#ea580c` | `#0891b2` | `#1b4332` | `#da1212` |
| `--accent-color` | `#f97316` | `#22d3ee` | `#2d6a4f` | `#da1212` |
| `--success-color` | `#10b981` | `#34d399` | `#40916c` | `#047857` |
| `--danger-color` | `#ef4444` | `#f87171` | `#b7094c` | `#da1212` |
| `--warning-color` | `#f59e0b` | `#fbbf24` | `#ffb703` | `#b45309` |
| `--info-color` | `#3b82f6` | `#60a5fa` | `#457b9d` | `#1d4ed8` |
| `--card-border-radius` | `24px` | `24px` | `24px` | `0px` |
| `--card-shadow` | douce, `0 4px 6px` | portée, `0 10px 15px` | douce teintée verte | dure `4px 4px 0 #000` |
| `--font-family` | hérité | hérité | hérité | `JetBrains Mono` (monospace) |

**Sidebar (`aside.bg-slate-900`)** a ses propres couleurs de fond dédiées par thème (obsidienne, océan profond, mousse forêt, noir pur), indépendantes de `--bg-surface`, pour garder un contraste fort en navigation.

---

## 3. Typographie

- **Police par défaut** : héritée du système (`--font-family: inherit`) pour Savannah, Lagoon, Forest.
- **Thème Swiss** : `JetBrains Mono` / `ui-monospace` — renforce l'aspect "données brutes / contrôle".
- Hiérarchie recommandée (Tailwind) : `text-2xl font-bold` (titres de section), `text-sm text-slate-500` (labels), `text-xs` (métadonnées / horodatages).

---

## 4. Rayons, ombres, mouvement

| Token | Valeur (thèmes ronds) | Valeur (Swiss) |
|---|---|---|
| Rayon carte | `24px` | `0px` |
| Rayon input/bouton | `calc(card-radius / 2)` = `12px` | `0px` |
| Ombre carte | douce, diffuse | `4px 4px 0 #000` (flat/brutalist) |
| Transition standard | `all 0.2s ease` / `cubic-bezier(0.4,0,0.2,1)` sur boutons primaires | idem |
| Hover bouton primaire | `translateY(-1px)` + couleur `--primary-hover` | idem |

---

## 5. Mapping sémantique Tailwind → variables

Le fichier `src/index.css` réinterprète automatiquement les classes Tailwind suivantes selon le thème actif — **les développeurs n'ont jamais besoin d'écrire de CSS spécifique à un thème** :

| Classe Tailwind utilisée dans le code | Rôle sémantique | Variable appliquée |
|---|---|---|
| `bg-white` | Surface (carte, panneau) | `--bg-surface` |
| `text-slate-900`, `text-slate-700`, `text-black`... | Texte principal fort | `--text-bright` |
| `text-slate-500`, `text-slate-400`... | Texte secondaire | `--text-muted` |
| `text-orange-500/600/700...` | Accent | `--accent-color` |
| `text-emerald-600...` | Succès | `--success-color` |
| `text-rose-600`, `text-red-600...` | Danger / erreur | `--danger-color` |
| `text-amber-600`, `text-yellow-600...` | Avertissement | `--warning-color` |
| `text-blue-600...` | Information | `--info-color` |
| `bg-orange-50/100`, `bg-emerald-50`, `bg-rose-50`, `bg-blue-50`, `bg-amber-50` | Badges / overlays translucides | couleur correspondante à 10% d'opacité (`color-mix`) |
| `bg-orange-500/600` | Bouton d'action primaire | `--primary-color` (+ hover `--primary-hover`) |
| `border-slate-200/100/300...`, `divide-slate-*` | Bordures / séparateurs | `--border-main` |
| `input`, `select`, `textarea` | Champs de formulaire | `--bg-input` / `--border-input`, focus → `--primary-color` |

> **Règle d'or** : quand vous construisez un nouvel écran, écrivez du Tailwind "normal" (orange/slate/emerald/rose/blue/amber). Le thème actif se charge de la traduction visuelle. N'introduisez pas de nouvelle couleur Tailwind sans l'ajouter à ce mapping dans `index.css`.

---

## 6. Composants clés (par module)

Modules existants dans `src/components/` : `DashboardOverview`, `PMSManager`, `POSManager`, `ERPBilling`, `CRMGuests`, `HRManager`, `StockManager`, `ReportsManager`, `RestaurantManager`, `StaffOperations`, `PropertySettingsManager`, `UserManager`, `LoginView`, `OnboardingTour` / `GuidedTourPage`, `ArchitecturalBlueprints`, `ErrorBoundary`.

Patterns communs à respecter :
- **Carte** : `bg-white` + `rounded-[--card-border-radius]` (via classes globales) + `shadow` → devient automatiquement thémée.
- **Bouton primaire** : `bg-orange-500 hover:bg-orange-600` (peu importe le thème, se transforme en couleur primaire du thème).
- **Sidebar** : structure `aside.bg-slate-900` avec état actif marqué par une bordure gauche de 3px dans la couleur d'accent du thème.
- **Graphiques (Recharts)** : tooltips et textes de `recharts-default-tooltip` / `recharts-text` sont re-stylés pour Lagoon/Forest/Swiss (fond, bordure, couleur de texte).

---

## 7. Accessibilité

- Le thème **Swiss** est le thème à privilégier pour les utilisateurs demandant un contraste renforcé (bordures 1.5px, noir/blanc pur).
- Les couleurs de texte muted/bright respectent un contraste suffisant sur chaque fond de thème — ne pas hardcoder de couleur de texte en dehors des tokens ci-dessus.
- Les focus d'inputs sont systématiquement visibles (`border-color: var(--primary-color)`, `outline: none` géré par la bordure colorée, pas de suppression pure du focus visuel).

---

## 8. Bonnes pratiques pour l'ajout de nouveaux écrans

1. Toujours utiliser les classes Tailwind sémantiques du tableau §5 plutôt que des couleurs arbitraires (`bg-[#123456]`).
2. Ne jamais coder une couleur en dur dans un composant `.tsx` — passer par les classes Tailwind mappées.
3. Si un nouvel état sémantique est nécessaire (ex. couleur "info secondaire"), l'ajouter d'abord comme variable CSS dans les 4 blocs de thème, puis créer le mapping Tailwind correspondant.
4. Tester tout nouvel écran dans les **4 thèmes** avant de livrer (bascule rapide via la classe `theme-*` sur le conteneur racine).

---

*Document généré à partir de l'analyse de `src/index.css` — à maintenir à jour à chaque évolution du système de thèmes.*
