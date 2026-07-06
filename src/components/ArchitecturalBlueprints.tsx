import React, { useState } from 'react';
import { 
  Database, 
  GitBranch, 
  LayoutGrid, 
  Smartphone, 
  Palette, 
  ShieldCheck, 
  CheckSquare, 
  Layers, 
  UserCheck,
  Clipboard,
  FileText,
  CheckCircle2,
  FolderTree,
  ChevronRight,
  ShieldAlert,
  Code,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function ArchitecturalBlueprints() {
  const [activeSec, setActiveSec] = useState<'ia' | 'flows' | 'screens' | 'mobile' | 'design' | 'exploitation' | 'backend'>('ia');
  const [activeSchemaTab, setActiveSchemaTab] = useState<'audit' | 'shift' | 'recipes'>('audit');
  const [activeRoadmapPhase, setActiveRoadmapPhase] = useState<1 | 2 | 3 | 4>(1);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <span className="px-3 py-1 bg-amber-50 text-amber-700 font-mono text-xs font-semibold rounded-full uppercase tracking-wider">
            Livrables Officiels
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-2 font-sans tracking-tight">
            Architecture & Spécifications de Brunch Bouaké
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Documents conceptuels et choix d'ingénierie pour le système hybride (PMS, POS, CRM, ERP).
          </p>
        </div>

        {/* Deliverables switcher */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveSec('ia')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeSec === 'ia' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            1. Architecture (IA)
          </button>
          <button
            onClick={() => setActiveSec('flows')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeSec === 'flows' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            2. Flux Utilisateurs
          </button>
          <button
            onClick={() => setActiveSec('screens')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeSec === 'screens' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            3. Liste d'Écrans
          </button>
          <button
            onClick={() => setActiveSec('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeSec === 'mobile' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            4. Stratégie Mobile
          </button>
          <button
            onClick={() => setActiveSec('design')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeSec === 'design' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            5. Design UI
          </button>
          <button
            onClick={() => setActiveSec('exploitation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeSec === 'exploitation' ? 'bg-white text-emerald-700 shadow-sm border border-emerald-100 bg-emerald-50/50' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            6. Exploitation & SaaS Terrain
          </button>
          <button
            onClick={() => setActiveSec('backend')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeSec === 'backend' ? 'bg-white text-blue-700 shadow-sm border border-blue-100 bg-blue-50/50' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-blue-600" />
            7. Architecture Backend API (Laravel 11)
          </button>
        </div>
      </div>

      <div className="py-6 min-h-[400px]">
        {/* SECTION 1: INFORMATION ARCHITECTURE */}
        {activeSec === 'ia' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-600" />
                1. Architecture de l'Information (IA)
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Le système Brunch Bouaké est architecturé de manière à unifier l'hébergement physique (Studios, Chambres, Appartements) et la restauration rapide (le Maquis) sous une seule entité financière et opérationnelle.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="text-amber-800 font-mono text-xs font-bold uppercase tracking-wide">Module PMS</div>
                <h4 className="font-semibold text-slate-800 text-sm mt-1">Gestion Hébergement</h4>
                <ul className="text-xs text-slate-500 mt-2 space-y-1.5 list-disc pl-4">
                  <li>Inventaire des Chambres/Studios</li>
                  <li>Calendrier d'Occupation (Gantt)</li>
                  <li>Check-in / Check-out Intuitif</li>
                  <li>Suivi du Statut (Nettoyage, Panne)</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="text-amber-800 font-mono text-xs font-bold uppercase tracking-wide">Module POS</div>
                <h4 className="font-semibold text-slate-800 text-sm mt-1">Point de Vente Maquis</h4>
                <ul className="text-xs text-slate-500 mt-2 space-y-1.5 list-disc pl-4">
                  <li>Prise de commande par Table/Bar</li>
                  <li>Envoi en cuisine (Statut de préparation)</li>
                  <li>Facturation hybride (Espèces, Wave, OM, ou Direct Chambre)</li>
                  <li>Menu local modulaire</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="text-amber-800 font-mono text-xs font-bold uppercase tracking-wide">Module CRM</div>
                <h4 className="font-semibold text-slate-800 text-sm mt-1">Relation Clients</h4>
                <ul className="text-xs text-slate-500 mt-2 space-y-1.5 list-disc pl-4">
                  <li>Fichier client consolidé (Hébergement + POS)</li>
                  <li>Préférences culinaires & demandes spéciales</li>
                  <li>Historique d'achats & volume de dépenses</li>
                  <li>Génération automatique de fiches de police</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="text-amber-800 font-mono text-xs font-bold uppercase tracking-wide">Module ERP / Finances</div>
                <h4 className="font-semibold text-slate-800 text-sm mt-1">Trésorerie & Opérations</h4>
                <ul className="text-xs text-slate-500 mt-2 space-y-1.5 list-disc pl-4">
                  <li>Facturation globale (Chambre + Extras Maquis)</li>
                  <li>Paiements Mobile Money (Wave, Orange, MTN)</li>
                  <li>Tâches opérationnelles du personnel</li>
                  <li>Rapports de revenus & d'occupation</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl">
              <h4 className="text-sm font-semibold text-amber-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                Sécurité & Rôles d'Accès (RBAC)
              </h4>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                Le système met en place 4 niveaux d'accès : 
                <strong className="text-amber-950"> Administrateur</strong> (accès total financier et config), 
                <strong className="text-amber-950"> Gérant</strong> (visualisation des rapports, création de réservations), 
                <strong className="text-amber-950"> Réceptionniste</strong> (check-in/check-out, encaissement chambres), et 
                <strong className="text-amber-950"> Serveur</strong> (prise de commande POS maquis uniquement, attribution de table).
              </p>
            </div>
          </div>
        )}

        {/* SECTION 2: MAIN USER FLOWS */}
        {activeSec === 'flows' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-amber-600" />
                2. Principaux Flux Utilisateurs
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                Les flux opérationnels critiques résolvent les points de friction fréquents entre la réception et le restaurant de Brunch Bouaké.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <span className="w-5 h-5 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-mono font-bold">1</span>
                  Le Flux de Check-in Simplifié
                </h4>
                <p className="text-xs text-slate-500 mt-1 pl-7">
                  Client se présente &rarr; Recherche de réservation ou création &rarr; Saisie des détails d'identité (CRM) &rarr; Assignation de la chambre &rarr; Encaissement de l'acompte &rarr; Changement d'état de la chambre à <strong className="text-amber-700">"Occupée"</strong> &rarr; Génération automatique de la tâche de bienvenue.
                </p>
              </div>

              <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <span className="w-5 h-5 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-mono font-bold">2</span>
                  Le Flux de Commande Resto "Facturé à la Chambre" (Hybridation Unique)
                </h4>
                <p className="text-xs text-slate-500 mt-1 pl-7">
                  Serveur prend commande au Maquis &rarr; Sélectionne la table &rarr; Ajoute les plats (Kedjenou, Alloco) &rarr; Coche "Facturer à la chambre" &rarr; Sélectionne la chambre occupée (ex: Studio 101) &rarr; Le montant s'ajoute en extra à la facture de séjour de la chambre &rarr; Mis à jour instantanément pour le check-out.
                </p>
              </div>

              <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <span className="w-5 h-5 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-mono font-bold">3</span>
                  Le Flux de Check-out & Régularisation Financière
                </h4>
                <p className="text-xs text-slate-500 mt-1 pl-7">
                  Client demande le départ &rarr; Réceptionniste charge sa fiche de séjour &rarr; Calcul automatique : [Chambres] + [Extras Maquis Resto] - [Acompte déjà payé] &rarr; Impression ou envoi de la facture finale &rarr; Encaissement via Wave/Cash/Orange &rarr; Libération de la chambre &rarr; Attribution automatique d'une tâche de <strong className="text-amber-700">"Nettoyage obligatoire"</strong> pour la gouvernante.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: SCREEN LIST */}
        {activeSec === 'screens' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-amber-600" />
                3. Liste des Écrans Principaux
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                Le système est structuré autour d'écrans clés pour offrir un accès instantané et éviter les allers-retours fastidieux.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-100 rounded-xl bg-white shadow-xs">
                <h4 className="font-semibold text-slate-950 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  Écran de Bord Global (Dashboard)
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Vue panoramique : Taux d'occupation en temps réel, Chiffre d'affaires combiné (Hôtel + Maquis), alertes de check-ins du jour, et liste des tâches de ménage urgentes.
                </p>
              </div>

              <div className="p-4 border border-slate-100 rounded-xl bg-white shadow-xs">
                <h4 className="font-semibold text-slate-950 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  Grille PMS & Réservations
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Visualisation spatiale de l'état des studios et appartements. Formulaire d'enregistrement, filtres de dates, et vue en ligne de temps.
                </p>
              </div>

              <div className="p-4 border border-slate-100 rounded-xl bg-white shadow-xs">
                <h4 className="font-semibold text-slate-950 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Caisse Resto POS (Le Maquis)
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Interface optimisée pour écran tactile permettant aux serveurs d'ajouter rapidement des plats, de sélectionner des tables à l'extérieur, et d'attribuer la note au client de l'hôtel.
                </p>
              </div>

              <div className="p-4 border border-slate-100 rounded-xl bg-white shadow-xs">
                <h4 className="font-semibold text-slate-950 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Gouvernance & ERP Opérations
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Kanban et checklists pour les femmes de chambre et techniciens. Suivi des pannes d'équipements de climatisation et des stocks de bières et gaz.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: MOBILE ADAPTATION STRATEGY */}
        {activeSec === 'mobile' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-amber-600" />
                4. Stratégie d'Adaptation Mobile
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                Puisque le personnel de service (serveurs du maquis, gouvernantes) utilise majoritairement des téléphones Android dans la cour, l'interface s'adapte dynamiquement.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <h4 className="font-semibold text-slate-800 text-sm mb-1.5 flex items-center gap-1">
                  <CheckSquare className="w-4 h-4 text-amber-600" /> Mode Serveur Resto
                </h4>
                <p className="text-slate-500 leading-relaxed">
                  Sur smartphone, le menu s'affiche en liste verticale compacte avec de larges zones tactiles d'incrément (+/-) pour le Kedjenou et les boissons. La barre d'état de la commande reste épinglée en bas pour un paiement mobile rapide.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <h4 className="font-semibold text-slate-800 text-sm mb-1.5 flex items-center gap-1">
                  <CheckSquare className="w-4 h-4 text-amber-600" /> Mode Gouvernante / Ménage
                </h4>
                <p className="text-slate-500 leading-relaxed">
                  Une vue en liste simplifiée permet au personnel de ménage de voir uniquement leurs chambres assignées en grand format, avec un simple bouton "Marquer comme Propre" ou "Signaler climatisation en panne" utilisable à une main.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <h4 className="font-semibold text-slate-800 text-sm mb-1.5 flex items-center gap-1">
                  <CheckSquare className="w-4 h-4 text-amber-600" /> Touch Targets minimum
                </h4>
                <p className="text-slate-500 leading-relaxed">
                  Tous les boutons de saisie sur mobile respectent la norme stricte de 44px de hauteur minimale pour éviter les erreurs de clic en situation d'activité intense au milieu du maquis.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: UI DESIGN DIRECTION */}
        {activeSec === 'design' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Palette className="w-5 h-5 text-amber-600" />
                5. Direction de Design UI / Identité Visuelle
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                L'identité graphique combine la modernité d'un outil de gestion et la chaleur de l'Afrique de l'Ouest.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="text-xs font-mono font-bold text-amber-800 uppercase">La Palette de Couleurs Chaleureuses</h4>
                <div className="flex gap-2 mt-2">
                  <div className="w-10 h-10 rounded-lg bg-amber-600 border border-amber-700 flex flex-col items-center justify-center text-[9px] text-white font-bold shadow-xs">
                    <span>Amber</span>
                    <span>#D97706</span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-600 border border-emerald-700 flex flex-col items-center justify-center text-[9px] text-white font-bold shadow-xs">
                    <span>Emerald</span>
                    <span>#059669</span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-950 flex flex-col items-center justify-center text-[9px] text-white font-bold shadow-xs">
                    <span>Slate</span>
                    <span>#0F172A</span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex flex-col items-center justify-center text-[9px] text-amber-900 font-bold shadow-xs">
                    <span>Cream</span>
                    <span>#FFFBEB</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                  Le ton <strong>Ambre Doré</strong> rappelle la convivialité des repas de midi et du soleil ivoirien. Le <strong>Vert Émeraude</strong> symbolise la rentabilité et le succès des encaissements (Wave, Cash).
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="text-xs font-mono font-bold text-amber-800 uppercase">Pairage Typographique & Marges</h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  <strong>Polices d'écriture :</strong> Utilisation de <em>"Inter"</em> pour une lisibilité impeccable des tableaux de bord financiers et <em>"JetBrains Mono"</em> pour les montants financiers (XOF) et les identifiants de transactions.
                </p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  <strong>Éléments tactiles :</strong> Ombres douces, coins arrondis en <code className="text-[10px] bg-slate-200 px-1 py-0.5 rounded text-slate-800">rounded-2xl</code> pour donner un aspect convivial mais ultra-professionnel.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 6: SAAS EXPLOITATION ET TERRAIN */}
        {activeSec === 'exploitation' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Intro Hero banner */}
            <div className="p-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-2xl border border-emerald-500/20 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              <div className="relative z-10">
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-[10px] font-bold rounded-full uppercase tracking-wider">
                  Ingénierie de Production
                </span>
                <h3 className="text-xl font-extrabold text-white mt-3 leading-snug tracking-tight">
                  Architecture d'Exploitation Réelle — Brunch Bouaké
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                  Spécifications d'exploitation pour le déploiement sur le terrain en Afrique de l'Ouest. Ce guide définit les modèles de données immuables, l'organisation modulaire du code hors-ligne (local-first) et la planification du go-live.
                </p>
              </div>
            </div>

            {/* Sub-navigation inside Exploitation */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Index of subtopics */}
              <div className="space-y-4 lg:col-span-1">
                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-1 border-b border-slate-200/60 font-mono">
                    Volets Techniques
                  </div>
                  
                  <button
                    onClick={() => setActiveSchemaTab('audit')}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left text-xs font-semibold ${
                      activeSchemaTab === 'audit'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Code className="w-3.5 h-3.5" />
                      <span>1. Schémas de Données Réels</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  <button
                    onClick={() => setActiveSchemaTab('shift')}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left text-xs font-semibold ${
                      activeSchemaTab === 'shift'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FolderTree className="w-3.5 h-3.5" />
                      <span>2. Architecture & Hooks/Contexts</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  <button
                    onClick={() => setActiveSchemaTab('recipes')}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left text-xs font-semibold ${
                      activeSchemaTab === 'recipes'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-3.5 h-3.5" />
                      <span>3. Roadmap terrain 12 Semaines</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                </div>

                {/* Info Card Regional Specifics */}
                <div className="bg-amber-50/50 border border-amber-200/70 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide flex items-center gap-1.5 font-sans">
                    <ShieldAlert className="w-4 h-4 text-amber-700" />
                    Spécificités Afrique Francophone
                  </h4>
                  <ul className="space-y-2 text-[11px] text-amber-900/90 leading-relaxed pl-1">
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-700 font-bold mt-0.5">•</span>
                      <span><strong>Arrondis financiers stricts :</strong> Pas de décimales sur le FCFA (XOF). La monnaie est indivisible au détail.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-700 font-bold mt-0.5">•</span>
                      <span><strong>Mobile Money souverain :</strong> Saisie obligatoire de l'ID de transaction (Wave, Orange, MTN) à la caisse pour lutter contre la fraude de double saisie.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-700 font-bold mt-0.5">•</span>
                      <span><strong>Réseau hautement instable :</strong> Stockage local immuable sur le téléphone avec file d'attente d'impression (ESC/POS Bluetooth ou IP) résiliente.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Column: Display area */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* SUBTAB 1: SCHEMAS DE DONNEES */}
                {activeSchemaTab === 'audit' && (
                  <div className="bg-white border border-slate-150 rounded-2xl p-5 space-y-6 animate-in fade-in duration-250">
                    <div className="border-b border-slate-100 pb-3">
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Database className="w-4 h-4 text-emerald-600" />
                        Structures de Données SQL d'Exploitation Réelle
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Schémas relationnels SQL (compatibles PostgreSQL / CockroachDB / Cloud SQL) requis pour assurer la traçabilité financière et anti-fraude.
                      </p>
                    </div>

                    {/* Schemas breakdown */}
                    <div className="space-y-6">
                      
                      {/* Audit Log Table Schema */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg font-mono">
                            1. Table: audit_logs (Journal Immuable)
                          </span>
                          <span className="text-[10px] text-rose-600 font-semibold uppercase font-mono bg-rose-50 px-2 py-0.5 rounded">
                            Anti-fraude interne
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Enregistre de manière définitive toute opération sensible (remise, annulation, modification tarifaire) avec obligation de justifier d'un motif (`reason`). Un système de chaînage cryptographique (`hash` et `prev_hash`) garantit l'intégrité de la table de logs en base de données.
                        </p>
                        <pre className="p-3.5 bg-slate-950 text-emerald-400 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed border border-slate-800 shadow-inner max-h-[220px]">
{`CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    username VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    device_fingerprint VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    action_type VARCHAR(100) NOT NULL, -- e.g. 'POS_DISCOUNT', 'RESERVATION_CANCEL'
    module VARCHAR(50) NOT NULL, -- 'POS', 'PMS', 'STOCKS', 'CASH'
    payload_before JSONB, -- État de l'enregistrement avant modif
    payload_after JSONB,  -- État de l'enregistrement après modif
    reason TEXT NOT NULL, -- Motif obligatoire !
    hash VARCHAR(64) NOT NULL, -- Hash SHA-256 (prev_hash + user_id + timestamp + payload_after)
    prev_hash VARCHAR(64)
);

CREATE INDEX idx_audit_logs_user_time ON audit_logs(user_id, timestamp);`}
                        </pre>
                      </div>

                      {/* Cash Shift Table Schema */}
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg font-mono">
                            2. Table: cash_shifts (Flux & Clôture de Caisse)
                          </span>
                          <span className="text-[10px] text-amber-600 font-semibold uppercase font-mono bg-amber-50 px-2 py-0.5 rounded">
                            Contrôle de Caisse Strict
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Gère le cycle de vie financier des rotations d'équipes (shifts). Le gérant ouvre la caisse avec un fonds initial, le système cumule les ventes théoriques par canal (Espèces, Wave, Orange Money, MTN), et à la fermeture le caissier déclare le comptage physique réel.
                        </p>
                        <pre className="p-3.5 bg-slate-950 text-emerald-400 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed border border-slate-800 shadow-inner max-h-[220px]">
{`CREATE TYPE shift_status AS ENUM ('open', 'closed', 'validated');

CREATE TABLE cash_shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id), -- Caissier responsable
    opened_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    closed_at TIMESTAMP WITH TIME ZONE,
    status shift_status DEFAULT 'open' NOT NULL,
    initial_cash DECIMAL(12,2) NOT NULL, -- Fonds de caisse en XOF
    
    -- Valeurs calculées par le système (Théorique)
    expected_cash DECIMAL(12,2) DEFAULT 0.00,
    expected_wave DECIMAL(12,2) DEFAULT 0.00,
    expected_orange DECIMAL(12,2) DEFAULT 0.00,
    expected_mtn DECIMAL(12,2) DEFAULT 0.00,
    
    -- Saisie réelle déclarée lors du comptage physique
    actual_cash DECIMAL(12,2) DEFAULT 0.00,
    actual_wave DECIMAL(12,2) DEFAULT 0.00,
    actual_orange DECIMAL(12,2) DEFAULT 0.00,
    actual_mtn DECIMAL(12,2) DEFAULT 0.00,
    
    total_expenses DECIMAL(12,2) DEFAULT 0.00, -- Petites dépenses sorties de caisse
    discrepancy_amount DECIMAL(12,2) DEFAULT 0.00, -- Écarts constatés
    discrepancy_reason TEXT,
    
    validated_by UUID REFERENCES users(id), -- Manager sur-validateur
    validated_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);`}
                        </pre>
                      </div>

                      {/* Recipe & Stock Multi-Unit Schema */}
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg font-mono">
                            3. Table: fiches_techniques & Multi-unités (Stocks F&B)
                          </span>
                          <span className="text-[10px] text-blue-600 font-semibold uppercase font-mono bg-blue-50 px-2 py-0.5 rounded">
                            Logistique & Coût de Revient
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Permet de lier chaque plat vendu au POS à ses ingrédients pour décrémenter automatiquement le stock. Gère la conversion entre l'unité d'achat en gros (ex: Sac de riz 50kg, Carton de bière) et l'unité de consommation (ex: g, cl, bouteille).
                        </p>
                        <pre className="p-3.5 bg-slate-950 text-emerald-400 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed border border-slate-800 shadow-inner max-h-[220px]">
{`CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_item_id VARCHAR(100) NOT NULL, -- Lien avec l'ID du plat/boisson du POS
    name VARCHAR(255) NOT NULL,
    portions INTEGER DEFAULT 1 NOT NULL,
    cost_price DECIMAL(12,2) NOT NULL DEFAULT 0.00, -- Calculé via ingrédients
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    stock_item_id UUID NOT NULL REFERENCES stock_items(id),
    quantity_required DECIMAL(12,3) NOT NULL, -- En unité de détail (ex: cl pour le lait, g pour le riz)
    waste_percentage DECIMAL(5,2) DEFAULT 0.00 -- Perte technique d'épluchage/cuisson (ex: 15%)
);`}
                        </pre>
                      </div>

                    </div>
                  </div>
                )}

                {/* SUBTAB 2: ARCHITECTURE DE DOSSIERS ET HOOKS */}
                {activeSchemaTab === 'shift' && (
                  <div className="bg-white border border-slate-150 rounded-2xl p-5 space-y-6 animate-in fade-in duration-250">
                    <div className="border-b border-slate-100 pb-3">
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <FolderTree className="w-4 h-4 text-emerald-600" />
                        Architecture Logicielle Local-First & Stratégie React
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Pour éviter de créer un monolithe monolithique et garantir un fonctionnement 100% autonome hors-ligne (résilience réseau PWA), les fonctionnalités d'exploitation sont isolées par modules étanches.
                      </p>
                    </div>

                    {/* Folder tree display */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-900 text-slate-300 p-4 rounded-xl border border-slate-800 font-mono text-[11px] leading-relaxed overflow-x-auto shadow-inner">
                        <div className="text-emerald-400 font-bold mb-2">// Structure des fichiers d'exploitation</div>
                        <div>src/</div>
                        <div>├── <span className="text-amber-300">contexts/</span> <span className="text-slate-500">// États isolés par contexte</span></div>
                        <div>│   ├── AuditContext.tsx</div>
                        <div>│   ├── CashShiftContext.tsx</div>
                        <div>│   └── StockContext.tsx</div>
                        <div>├── <span className="text-amber-300">hooks/</span> <span className="text-slate-500">// Logique métier pure (hooks)</span></div>
                        <div>│   ├── useAuditTrail.ts</div>
                        <div>│   ├── useCashShift.ts</div>
                        <div>│   └── useRecipes.ts</div>
                        <div>├── <span className="text-amber-300">components/</span> <span className="text-slate-500">// UI composants modulaires</span></div>
                        <div>│   ├── <span className="text-blue-400">Audit/</span></div>
                        <div>│   │   ├── AuditLogTable.tsx</div>
                        <div>│   │   └── ReasonModal.tsx</div>
                        <div>│   ├── <span className="text-blue-400">Cash/</span></div>
                        <div>│   │   ├── ShiftStatusWidget.tsx</div>
                        <div>│   │   └── CloseShiftDialog.tsx</div>
                        <div>│   └── <span className="text-blue-400">Recipes/</span></div>
                        <div>│   │   ├── RecipeEditor.tsx</div>
                        <div>│   │   └── IngredientDeductor.tsx</div>
                        <div>├── <span className="text-amber-300">types/</span></div>
                        <div>│   └── index.ts <span className="text-slate-500">// Types d'exploitation d'Afrique de l'Ouest</span></div>
                        <div>└── <span className="text-amber-300">utils/</span></div>
                        <div>    └── hash.ts <span className="text-slate-500">// Signature locale de sécurité d'Audit</span></div>
                      </div>

                      {/* Hooks design specs */}
                      <div className="space-y-4">
                        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                          <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-mono">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                            Hook: useAuditTrail
                          </h5>
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            Encapsule l'écriture des données. Toute action sensible passe par ce hook qui : 1. Ouvre un modal d'explication obligatoire, 2. Calcule le hash cryptographique, 3. Enregistre dans IndexedDB (locale) pour synchronisation future.
                          </p>
                        </div>

                        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                          <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-mono">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                            Hook: useCashShift
                          </h5>
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            Bloque le Point de Vente (POS) et l'accès PMS si aucun shift n'est ouvert par l'utilisateur. Permet de déclarer les dépenses d'exploitation quotidiennes en espèces et de gérer les écarts de caisse en forçant la validation managériale par code PIN en cas de dépassement du seuil de tolérance.
                          </p>
                        </div>

                        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                          <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-mono">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                            Hook: useRecipes
                          </h5>
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            Lie le Point de Vente aux fiches techniques de cuisine et au stock de boissons. Lors de la validation d'une table, il extrait récursivement les ingrédients en appliquant le taux de perte de cuisson, convertit les grammes et cl en unités de stockage et décrémente l'inventaire physique.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUBTAB 3: ROADMAP 12 SEMAINES */}
                {activeSchemaTab === 'recipes' && (
                  <div className="bg-white border border-slate-150 rounded-2xl p-5 space-y-6 animate-in fade-in duration-250">
                    <div className="border-b border-slate-100 pb-3">
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <GitBranch className="w-4 h-4 text-emerald-600" />
                        Roadmap d'Implémentation & Plan de Déploiement Réel (12 Semaines)
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Le planning logique d'unification pour transformer la démonstration en un produit opérationnel, sécurisé, et adapté à la réalité ouest-africaine.
                      </p>
                    </div>

                    {/* Timeline switcher */}
                    <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                      {[1, 2, 3, 4].map((phaseNum) => (
                        <button
                          key={phaseNum}
                          onClick={() => setActiveRoadmapPhase(phaseNum as any)}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                            activeRoadmapPhase === phaseNum
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Phase {phaseNum}
                        </button>
                      ))}
                    </div>

                    {/* Timeline active Phase details */}
                    <div className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 space-y-4">
                      {activeRoadmapPhase === 1 && (
                        <div className="space-y-3 animate-in fade-in duration-200">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold uppercase font-mono">
                              Semaines 1 à 3 — Solidification Technique & Sécurité Client
                            </span>
                            <span className="text-xs text-slate-500 font-semibold">Masse critique de confiance</span>
                          </div>
                          <h5 className="font-extrabold text-slate-950 text-sm">
                            Mise en place de l'Audit Log et durcissement anti-fraude
                          </h5>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            L'objectif principal est de sanctuariser les écritures financières. Nous déployons le système d'Audit Log cryptographique local, interceptons les actions sensibles au POS et PMS, et installons l'authentification rapide par code PIN à 4 chiffres à l'écran d'accueil pour le personnel de salle.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[11px]">
                            <div className="p-2.5 bg-white border border-slate-150 rounded-lg">
                              <div className="font-bold text-slate-700">Jalons clés :</div>
                              <ul className="list-disc pl-4 text-slate-500 mt-1 space-y-1">
                                <li>Intégration du hook global <code className="text-[10px] bg-slate-100 p-0.5 rounded">useAuditTrail</code></li>
                                <li>Sécurisation des mots de passe en base locale (SHA-256)</li>
                                <li>Mise en place des fiches d'explications sur les remises</li>
                              </ul>
                            </div>
                            <div className="p-2.5 bg-white border border-slate-150 rounded-lg">
                              <div className="font-bold text-amber-800">Risque & Atténuation Terrain :</div>
                              <p className="text-slate-500 mt-1">
                                <strong>Risque :</strong> Décalage d'horodatage des appareils mobiles si désynchronisés d'Internet. <br />
                                <strong>Atténuation :</strong> Utilisation d'un serveur de temps NTP ou de synchronisation d'horodatage basé sur la signature du serveur principal lors de l'établissement de la connexion de caisse.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeRoadmapPhase === 2 && (
                        <div className="space-y-3 animate-in fade-in duration-200">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold uppercase font-mono">
                              Semaines 4 à 6 — Exploitation Réelle (Caisse & Mobile Money)
                            </span>
                            <span className="text-xs text-slate-500 font-semibold">Rigueur d'exploitation</span>
                          </div>
                          <h5 className="font-extrabold text-slate-950 text-sm">
                            Shifts opérationnels, dépenses caisse et workflow Mobile Money (Wave, Orange, MTN)
                          </h5>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Nous bloquons l'accès au Point de Vente tant qu'un shift n'est pas ouvert par le caissier de garde. Nous implémentons le formulaire de déclaration d'écart physique à la fermeture de caisse et concevons le workflow d'authentification des références de paiement Wave/Orange pour l'Afrique de l'Ouest.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[11px]">
                            <div className="p-2.5 bg-white border border-slate-150 rounded-lg">
                              <div className="font-bold text-slate-700">Jalons clés :</div>
                              <ul className="list-disc pl-4 text-slate-500 mt-1 space-y-1">
                                <li>Blocage POS si <code className="text-[10px] bg-slate-100 p-0.5 rounded">CashShift</code> fermé ou non initié</li>
                                <li>Champs <code className="text-[10px] bg-slate-100 p-0.5 rounded">transaction_reference</code> obligatoires</li>
                                <li>Écran de réconciliation journalière théorique vs réel</li>
                              </ul>
                            </div>
                            <div className="p-2.5 bg-white border border-slate-150 rounded-lg">
                              <div className="font-bold text-amber-800">Risque & Atténuation Terrain :</div>
                              <p className="text-slate-500 mt-1">
                                <strong>Risque :</strong> Erreur humaine lors de la saisie manuelle des ID de transaction Mobile Money longs. <br />
                                <strong>Atténuation :</strong> Permettre de scanner le SMS de confirmation reçu sur le téléphone de la caisse via l'appareil photo avec un OCR local ou scanner de QR Code Wave.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeRoadmapPhase === 3 && (
                        <div className="space-y-3 animate-in fade-in duration-200">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold uppercase font-mono">
                              Semaines 7 à 9 — Rentabilité (Fiches Techniques & Maintenance)
                            </span>
                            <span className="text-xs text-slate-500 font-semibold">Suivi de la marge brute</span>
                          </div>
                          <h5 className="font-extrabold text-slate-950 text-sm">
                            Gestion logistique F&B et couplage PMS avec la maintenance
                          </h5>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Nous implémentons les fiches de recettes de cuisine de Brunch Bouaké (décrémentation des stocks d'ingrédients à la vente POS). Nous introduisons la typologie de démarque inconnue (casse, péremption, vol suspecté) et coupons le module de maintenance technique CMMS avec l'état PMS des chambres en cas de panne de climatiseur.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[11px]">
                            <div className="p-2.5 bg-white border border-slate-150 rounded-lg">
                              <div className="font-bold text-slate-700">Jalons clés :</div>
                              <ul className="list-disc pl-4 text-slate-500 mt-1 space-y-1">
                                <li>Multi-unités & conversions gros-détail automatisées</li>
                                <li>Décrémentation de stock en temps réel lors de l'encaissement</li>
                                <li>Bascule automatique PMS en "Indisponible" si incident technique</li>
                              </ul>
                            </div>
                            <div className="p-2.5 bg-white border border-slate-150 rounded-lg">
                              <div className="font-bold text-amber-800">Risque & Atténuation Terrain :</div>
                              <p className="text-slate-500 mt-1">
                                <strong>Risque :</strong> Les fiches techniques ne reflètent pas la cuisine réelle (différence de portions). <br />
                                <strong>Atténuation :</strong> Introduire une tolérance d'inventaire de 10% sur les ingrédients consommables, ajustable lors des inventaires mensuels de contrôle.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeRoadmapPhase === 4 && (
                        <div className="space-y-3 animate-in fade-in duration-200">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold uppercase font-mono">
                              Semaines 10 à 12 — Scalabilité (Comptes Débiteurs & CRM WhatsApp)
                            </span>
                            <span className="text-xs text-slate-500 font-semibold">Excellence client & Go-Live</span>
                          </div>
                          <h5 className="font-extrabold text-slate-950 text-sm">
                            Paiements différés d'entreprises (City Ledger) et automatisation WhatsApp
                          </h5>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Nous créons le module City Ledger de suivi des comptes clients débiteurs d'entreprises ivoiriennes. Nous configurons l'envoi de factures et rappels de réservation via l'intégration WhatsApp Business API et mettons en place la segmentation automatique CRM des gros dépensiers.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[11px]">
                            <div className="p-2.5 bg-white border border-slate-150 rounded-lg">
                              <div className="font-bold text-slate-700">Jalons clés :</div>
                              <ul className="list-disc pl-4 text-slate-500 mt-1 space-y-1">
                                <li>Mise en place de lignes de crédit d'entreprises</li>
                                <li>Modèles de messages WhatsApp automatisés (check-in, check-out)</li>
                                <li>Segmentation CRM d'Afrique de l'Ouest (Gros dépensiers, risques)</li>
                              </ul>
                            </div>
                            <div className="p-2.5 bg-white border border-slate-150 rounded-lg">
                              <div className="font-bold text-amber-800">Risque & Atténuation Terrain :</div>
                              <p className="text-slate-500 mt-1">
                                <strong>Risque :</strong> Coûts élevés de l'API officielle WhatsApp pour un petit établissement indépendant. <br />
                                <strong>Atténuation :</strong> Fournir une alternative par clic "Partager par WhatsApp Web / Mobile" qui pré-remplit le message et ouvre l'application locale sans surcoût d'API.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        {activeSec === 'backend' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header / Intro */}
            <div className="p-5 bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 text-white rounded-2xl border border-blue-500/20 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              <div className="relative z-10">
                <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono text-[10px] font-bold rounded-full uppercase tracking-wider">
                  Architecture & Spécifications API REST
                </span>
                <h3 className="text-xl font-extrabold text-white mt-3 leading-snug tracking-tight">
                  SaaS Multi-Tenant API (PHP 8.2 / Laravel 11)
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                  Cette section présente les schémas, modèles, contrôleurs et fichiers d'environnement pour l'API Rest de notre serveur "Brunch Bouaké". Il assure l'isolation multi-tenant stricte par base de données MySQL et fournit une passerelle d'ingestion de webhooks pour les réservations externes.
                </p>
              </div>
            </div>

            {/* Sub-tabs switch */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Selector Rail */}
              <div className="w-full lg:w-1/4 space-y-4">
                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-1 border-b border-slate-200/60 font-mono">
                    Composants Backend
                  </div>
                  
                  <button
                    onClick={() => setActiveSchemaTab('audit')} // Reuse activeSchemaTab for sub-navigation
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left text-xs font-semibold ${
                      activeSchemaTab === 'audit'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Database className="w-3.5 h-3.5" />
                      <span>1. Migrations MySQL</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  <button
                    onClick={() => setActiveSchemaTab('shift')}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left text-xs font-semibold ${
                      activeSchemaTab === 'shift'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Code className="w-3.5 h-3.5" />
                      <span>2. Contrôleur d'Ingestion</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  <button
                    onClick={() => setActiveSchemaTab('recipes')}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left text-xs font-semibold ${
                      activeSchemaTab === 'recipes'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FolderTree className="w-3.5 h-3.5" />
                      <span>3. Arborescence & .env</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                </div>

                <div className="p-4 bg-amber-50/50 border border-amber-200/70 rounded-2xl space-y-2.5">
                  <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide flex items-center gap-1.5 font-sans">
                    <ShieldAlert className="w-4 h-4 text-amber-700" />
                    Sécurité Multi-Tenant
                  </h4>
                  <p className="text-[11px] text-amber-900 leading-relaxed">
                    Toutes les tables possèdent une colonne <strong>tenant_id</strong>. Un Header HTTP <code>X-Tenant-ID</code> doit accompagner chaque requête pour isoler de manière hermétique les données de chaque établissement (ex: Studio 101 vs Restaurant).
                  </p>
                </div>
              </div>

              {/* Right content view */}
              <div className="w-full lg:w-3/4 space-y-4">
                {activeSchemaTab === 'audit' && (
                  <div className="bg-white border border-slate-150 rounded-2xl p-5 space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Database className="w-4 h-4 text-blue-600" />
                        Schémas de Migrations Laravel (MySQL)
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Ces scripts de migration créent les tables prioritaires `rooms`, `reservations` et `transactions` en base de données avec des index optimisés et des UUID.
                      </p>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div>
                        <div className="font-semibold text-slate-800 mb-1">1. Migration: Rooms Table (`rooms`)</div>
                        <pre className="p-3.5 bg-slate-950 text-blue-300 rounded-xl font-mono text-[11px] overflow-x-auto max-h-[160px]">
{`Schema::create('rooms', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('tenant_id')->index(); // Multi-Tenant Isolation Key
    $table->string('name'); // e.g. "Studio Bouaké Chic"
    $table->enum('type', ['studio', 'room', 'apartment']);
    $table->unsignedInteger('price_per_night'); // FCFA/XOF
    $table->enum('status', ['available', 'occupied', 'dirty', 'maintenance'])->default('available');
    $table->unsignedSmallInteger('max_guests')->default(2);
    $table->json('features')->nullable();
    $table->string('image')->nullable();
    $table->json('images')->nullable();
    $table->timestamps();

    $table->index(['tenant_id', 'status']);
});`}
                        </pre>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <div className="font-semibold text-slate-800 mb-1">2. Migration: Reservations Table (`reservations`)</div>
                        <pre className="p-3.5 bg-slate-950 text-blue-300 rounded-xl font-mono text-[11px] overflow-x-auto max-h-[160px]">
{`Schema::create('reservations', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('tenant_id')->index(); // Multi-Tenant Isolation Key
    $table->foreignUuid('room_id')->constrained('rooms')->onDelete('cascade');
    $table->string('guest_name');
    $table->string('guest_phone');
    $table->string('guest_email')->nullable();
    $table->date('check_in_date');
    $table->date('check_out_date');
    $table->unsignedSmallInteger('number_of_guests')->default(1);
    $table->enum('status', ['confirmed', 'checked-in', 'checked-out', 'cancelled'])->default('confirmed');
    $table->unsignedInteger('total_amount'); // FCFA/XOF
    $table->unsignedInteger('paid_amount')->default(0);
    $table->enum('payment_status', ['unpaid', 'partially-paid', 'fully-paid'])->default('unpaid');
    $table->text('special_requests')->nullable();
    $table->string('security_pin', 4)->nullable(); // 4-digit code for POS transfers
    $table->string('access_code', 10)->nullable();
    $table->unsignedInteger('credit_limit')->default(0);
    
    // Audit & source fields
    $table->string('nationality')->nullable();
    $table->string('id_number')->nullable();
    $table->string('address')->nullable();
    $table->string('source_of_stay')->default('Direct'); // "Walk-in", "Booking.com", "Airbnb"
    $table->string('staff_member')->nullable();
    $table->string('source_module')->nullable();
    $table->string('external_reservation_id')->nullable()->index(); // ID Booking/Airbnb
    
    $table->timestamps();

    $table->index(['tenant_id', 'status']);
    $table->index(['tenant_id', 'check_in_date', 'check_out_date']);
});`}
                        </pre>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <div className="font-semibold text-slate-800 mb-1">3. Migration: Transactions Table (`transactions`)</div>
                        <pre className="p-3.5 bg-slate-950 text-blue-300 rounded-xl font-mono text-[11px] overflow-x-auto max-h-[160px]">
{`Schema::create('transactions', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('tenant_id')->index(); // Multi-Tenant Isolation Key
    $table->string('idempotency_key')->unique(); // STRICT constraint to prevent duplicates
    $table->enum('type', ['lodging_payment', 'pos_sale', 'expense']);
    $table->unsignedInteger('amount'); // Amount in FCFA/XOF
    $table->enum('method', ['wave', 'orange_money', 'mtn', 'cash', 'card', 'room_charge']);
    $table->string('description');
    $table->string('reference_id')->nullable()->index(); // Reservation ID or Order ID
    $table->timestamps();

    $table->index(['tenant_id', 'type']);
});`}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {activeSchemaTab === 'shift' && (
                  <div className="bg-white border border-slate-150 rounded-2xl p-5 space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Code className="w-4 h-4 text-blue-600" />
                        Contrôleur d'Ingestion & Passerelle Booking (Laravel 11)
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Le contrôleur gère l'ingestion asynchrone des réservations envoyées par les OTAs via le webhook du Channel Manager.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <pre className="p-4 bg-slate-950 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed max-h-[350px] border border-slate-800 shadow-inner">
{`<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ChannelManagerController extends Controller
{
    public function ingestBooking(Request $request)
    {
        // 1. Isolation multi-tenant et vérification du jeton de sécurité
        $tenantId = $request->header('X-Tenant-ID');
        $integrationToken = $request->header('X-Integration-Token') ?: $request->bearerToken();

        if (empty($tenantId)) {
            return response()->json(['error' => 'Missing Tenant Isolation Header', 'code' => 'MISSING_TENANT_ID'], 400);
        }

        if (empty($integrationToken) || $integrationToken !== config('services.channel_manager.token')) {
            return response()->json(['error' => 'Unauthorized integration token', 'code' => 'UNAUTHORIZED'], 401);
        }

        // 2. Validation du payload
        $validator = Validator::make($request->all(), [
            'booking_id' => 'required|string',
            'room_type' => 'required|in:studio,room,apartment',
            'guest_name' => 'required|string|max:255',
            'guest_phone' => 'required|string|max:50',
            'check_in_date' => 'required|date_format:Y-m-d',
            'check_out_date' => 'required|date_format:Y-m-d|after:check_in_date',
            'number_of_guests' => 'required|integer|min:1',
            'total_amount' => 'required|numeric|min:0',
            'source' => 'required|string|in:Booking.com,Airbnb,Expedia,Direct',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Validation error', 'details' => $validator->errors()], 422);
        }

        $data = $request->all();

        // 3. Protection d'idempotence (Double ingestion)
        $existing = Reservation::where('tenant_id', $tenantId)
            ->where('external_reservation_id', $data['booking_id'])
            ->first();

        if ($existing) {
            return response()->json([
                'success' => true,
                'message' => 'Reservation already ingested (Idempotency trigger)',
                'data' => $existing,
                'idempotency_status' => 'DUPLICATE_BYPASS'
            ], 200);
        }

        // 4. Attribution automatique d'une chambre libre
        $room = Room::where('tenant_id', $tenantId)
            ->where('type', $data['room_type'])
            ->whereDoesntHave('reservations', function ($q) use ($data) {
                $q->where('status', '!=', 'cancelled')
                  ->where(function ($sq) use ($data) {
                      $sq->whereBetween('check_in_date', [$data['check_in_date'], $data['check_out_date']])
                         ->orWhereBetween('check_out_date', [$data['check_in_date'], $data['check_out_date']]);
                  });
            })->first();

        if (!$room) {
            $room = Room::where('tenant_id', $tenantId)->where('type', $data['room_type'])->first();
            if (!$room) {
                return response()->json(['error' => 'No rooms of this type', 'code' => 'ROOM_NOT_FOUND'], 404);
            }
        }

        // 5. Enregistrement transactionnel
        try {
            $reservation = DB::transaction(function () use ($tenantId, $room, $data) {
                return Reservation::create([
                    'id' => (string) Str::uuid(),
                    'tenant_id' => $tenantId,
                    'room_id' => $room->id,
                    'guest_name' => $data['guest_name'],
                    'guest_phone' => $data['guest_phone'],
                    'check_in_date' => $data['check_in_date'],
                    'check_out_date' => $data['check_out_date'],
                    'number_of_guests' => $data['number_of_guests'],
                    'status' => 'confirmed',
                    'total_amount' => (int) $data['total_amount'],
                    'security_pin' => str_pad((string) rand(0, 9999), 4, '0', STR_PAD_LEFT),
                    'access_code' => str_pad((string) rand(0, 999999), 6, '0', STR_PAD_LEFT),
                    'credit_limit' => (int) ($data['total_amount'] * 0.2),
                    'source_of_stay' => $data['source'],
                    'source_module' => 'channel_manager',
                    'external_reservation_id' => $data['booking_id'],
                    'staff_member' => 'API Gateway',
                ]);
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Booking successfully ingested',
                'data' => $reservation,
                'idempotency_status' => 'CREATED'
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Database write failure', 'message' => $e->getMessage()], 500);
        }
    }
}`}
                      </pre>
                    </div>
                  </div>
                )}

                {activeSchemaTab === 'recipes' && (
                  <div className="bg-white border border-slate-150 rounded-2xl p-5 space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <FolderTree className="w-4 h-4 text-blue-600" />
                        Arborescence Securisée & Configuration d'Environnement
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Utilisez cette configuration pour déployer le backend Laravel 11 proprement sur votre instance de serveur local (Laragon) ou cloud (Hostinger).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-2">
                        <div className="font-semibold text-slate-800">Structure des Fichiers Clés :</div>
                        <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[220px]">
                          <div className="text-emerald-400 font-bold mb-1">app/Http/Controllers/Api/V1/</div>
                          <div className="pl-4 text-slate-400">└── ChannelManagerController.php</div>
                          <div className="text-emerald-400 font-bold mt-2">app/Models/</div>
                          <div className="pl-4 text-slate-400">├── Room.php</div>
                          <div className="pl-4 text-slate-400">├── Reservation.php</div>
                          <div className="pl-4 text-slate-400">└── Transaction.php</div>
                          <div className="text-emerald-400 font-bold mt-2">database/migrations/</div>
                          <div className="pl-4 text-slate-400">├── 2026_07_06_000001_create_rooms_table.php</div>
                          <div className="pl-4 text-slate-400">├── 2026_07_06_000002_create_reservations_table.php</div>
                          <div className="pl-4 text-slate-400">└── 2026_07_06_000003_create_transactions_table.php</div>
                          <div className="text-emerald-400 font-bold mt-2">routes/</div>
                          <div className="pl-4 text-slate-400">└── api.php</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="font-semibold text-slate-800">Paramétrage du fichier `.env` :</div>
                        <pre className="p-4 bg-slate-950 text-blue-300 rounded-xl font-mono text-[11px] overflow-x-auto max-h-[220px] leading-relaxed">
{`APP_NAME="Brunch Bouaké Backend API"
APP_ENV=local
APP_KEY=base64:3t6qY+gQ+L0vUqV7jE+3vDkO6+X8fE+3vDkO6=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=brunch_bouake_db
DB_USERNAME=root
DB_PASSWORD=

CHANNEL_MANAGER_TOKEN=brunch_bouake_secure_webhook_token_2026
TENANT_HEADER_KEY=X-Tenant-ID`}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
