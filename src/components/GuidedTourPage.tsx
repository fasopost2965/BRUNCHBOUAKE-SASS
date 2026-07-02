import React, { useState } from 'react';
import { 
  Sparkles, 
  Settings, 
  MapPin, 
  BedDouble, 
  UtensilsCrossed, 
  Receipt, 
  Users, 
  ShieldCheck,
  ChevronRight,
  Play,
  CheckCircle2,
  Building
} from 'lucide-react';
import { PropertySettings } from '../types';

interface GuidedTourPageProps {
  settings: PropertySettings;
  onUpdateSettings: (s: PropertySettings) => void;
  onStartOnboarding: () => void;
}

export default function GuidedTourPage({
  settings,
  onUpdateSettings,
  onStartOnboarding
}: GuidedTourPageProps) {
  const [establishmentName, setEstablishmentName] = useState(settings.establishmentName);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!establishmentName.trim()) return;
    
    onUpdateSettings({
      ...settings,
      establishmentName: establishmentName.trim()
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const steps = [
    {
      title: "1. Tableau de bord & Vue d'ensemble",
      description: "Visualisez en un clin d'œil les indicateurs clés de votre établissement : taux d'occupation, chiffre d'affaires, tâches en attente et statut de synchronisation en direct.",
      icon: CheckCircle2,
      color: "text-emerald-500 bg-emerald-50"
    },
    {
      title: "2. Module PMS (Hébergement)",
      description: "Notre tout nouveau menu de service à gauche vous permet de naviguer facilement entre l'Aperçu global, l'inventaire des chambres, le planning glissant de 15 jours et la grille de statuts en temps réel.",
      icon: BedDouble,
      color: "text-orange-500 bg-orange-50"
    },
    {
      title: "3. Point de Vente POS (Caisse Maquis & Restaurant)",
      description: "Prenez les commandes des clients, gérez les tables en direct, encaissez via Mobile Money (Wave, Orange Money, MTN) ou facturez directement sur la chambre d'un client.",
      icon: UtensilsCrossed,
      color: "text-amber-500 bg-amber-50"
    },
    {
      title: "4. Comptabilité & ERP de Trésorerie",
      description: "Suivez chaque entrée et sortie d'argent. Facturation automatique des séjours, encaissements POS sécurisés et rapports financiers exportables.",
      icon: Receipt,
      color: "text-blue-500 bg-blue-50"
    },
    {
      title: "5. Plan Conceptuel & Blueprints",
      description: "Découvrez les schémas d'architecture et les spécifications techniques du projet, conçu pour fonctionner en mode hors-ligne fluide et résistant aux pannes de courant.",
      icon: ShieldCheck,
      color: "text-rose-500 bg-rose-50"
    }
  ];

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      
      {/* Hero Header Card with Animation */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-orange-950 text-white rounded-3xl p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-10 bottom-0 w-60 h-60 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 font-mono text-[10px] font-black rounded-full uppercase tracking-wider">
              Espace d'Exploration
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-orange-500 animate-bounce" />
            Visite Guidée Interactive
          </h1>
          
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Bienvenue dans le guide d'utilisation de votre système hybride PMS & POS de <strong>{settings.establishmentName}</strong>. 
            Découvrez nos fonctionnalités innovantes, adaptées aux réalités locales avec synchronisation hors-ligne.
          </p>

          <div className="pt-4 flex flex-wrap gap-3">
            <button
              onClick={onStartOnboarding}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current text-white" />
              Lancer la Visite Interactive d'Intégration
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Establishment Name Configurator */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs relative">
        <div className="absolute top-4 right-4 text-orange-500/20">
          <Building className="w-12 h-12" />
        </div>
        
        <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-4 h-4 text-orange-500" />
          Nom de l'Établissement (Configuration Rapide)
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-xl">
          Changez le nom de votre hôtel, motel ou maquis. Le nouveau nom sera instantanément pris en compte dans le guide interactif, la barre de navigation et vos en-têtes de facturation.
        </p>

        <form onSubmit={handleSaveName} className="mt-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={establishmentName}
              onChange={(e) => setEstablishmentName(e.target.value)}
              placeholder="Ex: Brunch Bouaké, Résidence de la Paix..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-orange-500 transition-all text-slate-800 font-bold"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-950 text-white hover:bg-slate-900 font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            Mettre à jour le nom
          </button>
        </form>

        {isSaved && (
          <div className="mt-3 p-2 bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] font-bold rounded-lg flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Le nom de l'établissement a été mis à jour avec succès et enregistré localement.
          </div>
        )}
      </div>

      {/* Interactive Timeline steps */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-black text-slate-900 tracking-tight">
            Parcours de Découverte de l'Établissement
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Découvrez comment chaque section contribue au bon fonctionnement opérationnel et à la résilience locale.
          </p>
        </div>

        <div className="grid gap-4">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div 
                key={idx}
                className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-slate-100 transition-all text-left group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 shadow-xs ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-950 uppercase tracking-wide flex items-center gap-1.5">
                    {s.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
