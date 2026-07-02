import React, { useState } from 'react';
import { Database, GitBranch, LayoutGrid, Smartphone, Palette, ShieldCheck, CheckSquare, Layers, UserCheck } from 'lucide-react';

export default function ArchitecturalBlueprints() {
  const [activeSec, setActiveSec] = useState<'ia' | 'flows' | 'screens' | 'mobile' | 'design'>('ia');

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
      </div>
    </div>
  );
}
