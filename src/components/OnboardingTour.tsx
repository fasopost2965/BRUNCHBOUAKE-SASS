import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Sparkles, 
  HelpCircle,
  Play,
  CheckCircle,
  UserCheck
} from 'lucide-react';
import { UserRole } from '../types';

export interface OnboardingStep {
  title: string;
  subtitle: string;
  description: string;
  tab: 'dashboard' | 'pms' | 'pos' | 'stocks' | 'staff' | 'settings';
  role: UserRole;
  targetId: string;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: "📈 Tableau de Bord & Indicateurs",
    subtitle: "Le centre de contrôle en temps réel",
    description: "Visualisez le chiffre d'affaires, le taux d'occupation des chambres et l'état des caisses d'un coup d'œil. C'est ici que vous suivez la santé globale de l'établissement.",
    tab: 'dashboard',
    role: 'admin',
    targetId: 'nav-dashboard'
  },
  {
    title: "🏨 Réception & PMS Hôtelier",
    subtitle: "Gestion des Chambres & Réservations",
    description: "Planifiez les séjours, enregistrez les arrivées (check-in) et départs (check-out), et contrôlez la propreté des chambres. Les clients reçoivent un code PIN sécurisé par SMS lors de leur check-in !",
    tab: 'pms',
    role: 'receptionist',
    targetId: 'nav-pms'
  },
  {
    title: "🍹 Caisse Maquis POS",
    subtitle: "Prise de commande & Facturation ultra-rapide",
    description: "Saisissez les boissons, viandes braisées ou plats de résistance. Les commandes peuvent être encaissées immédiatement (espèces, Orange Money, MTN, Moov) ou transférées sur la note de la chambre d'un client de l'hôtel !",
    tab: 'pos',
    role: 'waiter',
    targetId: 'nav-pos'
  },
  {
    title: "📦 Gestion des Stocks & Menus",
    subtitle: "Suivi des stocks & Fiches techniques",
    description: "Pilotez l'inventaire en temps réel (bières, Koutoukou, poulets, etc.). Le système déduit automatiquement les ingrédients en stock lors de chaque vente au maquis !",
    tab: 'stocks',
    role: 'admin',
    targetId: 'nav-stocks'
  },
  {
    title: "👥 Équipe, Tâches & Badgeuse",
    subtitle: "Planning, tâches ménagères & RH",
    description: "Attribuez les corvées (ménage des chambres, maintenance de la piscine) et suivez le statut de réalisation en temps réel. Les employés disposent d'un système de badgeuse d'arrivée pour le calcul des heures de travail.",
    tab: 'staff',
    role: 'admin',
    targetId: 'nav-staff'
  },
  {
    title: "🎨 Ambiance Visuelle & Design",
    subtitle: "Adaptez l'apparence à vos besoins",
    description: "Personnalisez Brunch Bouaké avec nos 4 chartes graphiques : Orange Savane (chaleureux), Lagune Sombre (reposant pour la nuit), Forêt Sacrée (luxueux) ou Helvétique Stark (brut rétro). Changez de style à tout moment !",
    tab: 'settings',
    role: 'admin',
    targetId: 'nav-settings'
  }
];

interface OnboardingTourProps {
  currentStepIndex: number; // -1 for Welcome Screen, 0-5 for steps, 6 for Completion Screen
  onSetStepIndex: (index: number) => void;
  onCloseTour: () => void;
  currentRole: UserRole;
  onSetRole: (role: UserRole) => void;
  activeTab: string;
  onSetTab: (tab: any) => void;
  establishmentName?: string;
}

export default function OnboardingTour({
  currentStepIndex,
  onSetStepIndex,
  onCloseTour,
  currentRole,
  onSetRole,
  activeTab,
  onSetTab,
  establishmentName = "Brunch Bouaké"
}: OnboardingTourProps) {
  
  const finalEstablishmentName = establishmentName || "Brunch Bouaké";
  
  // Go to next step
  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    onSetStepIndex(nextIndex);
    
    // Apply role and tab changes to let user visualize
    if (nextIndex >= 0 && nextIndex < ONBOARDING_STEPS.length) {
      const step = ONBOARDING_STEPS[nextIndex];
      onSetTab(step.tab);
      onSetRole(step.role);
    }
  };

  // Go to previous step
  const handlePrev = () => {
    const prevIndex = currentStepIndex - 1;
    onSetStepIndex(prevIndex);
    
    if (prevIndex >= 0 && prevIndex < ONBOARDING_STEPS.length) {
      const step = ONBOARDING_STEPS[prevIndex];
      onSetTab(step.tab);
      onSetRole(step.role);
    } else if (prevIndex === -1) {
      onSetTab('dashboard');
    }
  };

  // Launch the tour from welcome screen
  const handleStartTour = () => {
    onSetStepIndex(0);
    const step = ONBOARDING_STEPS[0];
    onSetTab(step.tab);
    onSetRole(step.role);
  };

  const isWelcome = currentStepIndex === -1;
  const isComplete = currentStepIndex === ONBOARDING_STEPS.length;
  const currentStep = !isWelcome && !isComplete ? ONBOARDING_STEPS[currentStepIndex] : null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center p-4">
      {/* Dimmed backdrop, clicking it on step cards doesn't dismiss to avoid accidental clicks, but has pointers */}
      <div 
        className="absolute inset-0 bg-slate-950/65 backdrop-blur-xs pointer-events-auto transition-all"
        onClick={onCloseTour}
      />

      {/* Main Tour dialog */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="bg-white border-2 border-slate-900 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl pointer-events-auto relative z-10"
        id="onboarding-card-panel"
      >
        {/* Top absolute indicator for Swiss / custom styles to feel perfectly integrated */}
        <div className="absolute -top-3 left-6 px-3 py-1 bg-orange-500 text-white font-mono text-[9px] font-extrabold uppercase tracking-widest rounded-md border border-slate-900 shadow-xs">
          Guide de Démarrage • {finalEstablishmentName}
        </div>

        {/* Close Button */}
        <button
          onClick={onCloseTour}
          className="absolute top-4 right-4 p-1.5 rounded-full border border-slate-200 hover:border-slate-900 bg-white hover:bg-slate-50 transition-colors"
          title="Fermer la visite"
        >
          <X className="w-4 h-4 text-slate-500 hover:text-slate-900" />
        </button>

        <AnimatePresence mode="wait">
          {/* WELCOME SCREEN */}
          {isWelcome && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5 py-2"
            >
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center border border-orange-200 shadow-xs">
                <Sparkles className="w-8 h-8 text-orange-600 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                  Bienvenue dans l'équipe {finalEstablishmentName} ! 👋
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wider font-mono">
                  Visite interactive d'intégration des nouveaux employés
                </p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ce progiciel hybride gère l'ensemble de notre établissement : de la réception de l'hôtel (PMS) au service de restauration (maquis, bar, caisse POS), ainsi que la gestion des stocks et l'équipe.
              </p>
              <div className="bg-orange-50/50 border border-orange-100 p-3.5 rounded-2xl text-[11px] text-slate-600 leading-relaxed">
                <span className="font-bold text-orange-800 block mb-0.5">💡 Comment ça marche ?</span>
                La visite va surligner les sections stratégiques du menu latéral gauche. À chaque étape, l'application changera automatiquement de page et de rôle simulé pour vous montrer le système en action.
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleStartTour}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5"
                >
                  <Play className="w-4 h-4" />
                  <span>Démarrer la visite interactive</span>
                </button>
                <button
                  onClick={onCloseTour}
                  className="px-4 bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold py-3 rounded-xl text-xs border border-slate-200"
                >
                  Passer
                </button>
              </div>
            </motion.div>
          )}

          {/* ACTIVE STEPS */}
          {currentStep && (
            <motion.div
              key={`step-${currentStepIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4 py-2"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-mono text-[9px] font-extrabold rounded-md uppercase tracking-wider border border-slate-200">
                  Étape {currentStepIndex + 1} sur {ONBOARDING_STEPS.length}
                </span>
                
                <span className="text-[10px] text-orange-600 font-bold flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  Rôle : {currentStep.role === 'admin' ? 'Directeur' : currentStep.role === 'receptionist' ? 'Réceptionniste' : 'Serveur'}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
                  {currentStep.title}
                </h3>
                <p className="text-xs text-slate-400 font-bold font-mono">
                  {currentStep.subtitle}
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {currentStep.description.replace(/Brunch Bouaké/g, finalEstablishmentName)}
              </p>

              {/* Dynamic instruction helper box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-500 leading-normal">
                <span className="font-bold text-slate-700 block mb-0.5">🎯 Ce que vous observez :</span>
                Le menu latéral gauche est maintenant surligné en orange clignotant. L'écran en arrière-plan s'est adapté pour refléter ce module sous le profil d'un <span className="font-bold text-slate-800">{currentStep.role === 'admin' ? 'Administrateur' : currentStep.role === 'receptionist' ? 'Réceptionniste' : 'Serveur'}</span>.
              </div>

              {/* Footer navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Précédent</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={onCloseTour}
                    className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-600"
                  >
                    Passer
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold px-4 py-2 rounded-xl text-xs border border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5"
                  >
                    <span>{currentStepIndex === ONBOARDING_STEPS.length - 1 ? 'Terminer' : 'Suivant'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* COMPLETION SCREEN */}
          {isComplete && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5 py-2 text-center"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center border border-emerald-200 shadow-xs mx-auto">
                <CheckCircle className="w-9 h-9 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                  Parfait ! Vous êtes prêt 🚀
                </h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider font-mono">
                  Intégration terminée avec succès
                </p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                Félicitations ! Vous avez exploré toutes les sections clés de {finalEstablishmentName}. Vous maîtrisez désormais l'architecture du système et les rôles associés.
              </p>
              <div className="bg-emerald-50/40 border border-emerald-100 p-3 rounded-2xl text-[11px] text-emerald-800 leading-relaxed text-left">
                <span className="font-bold block mb-0.5">ℹ️ À savoir :</span>
                Vous pouvez relancer cette visite guidée à tout moment grâce au bouton <span className="font-extrabold text-slate-800">« Guide d'Intégration »</span> situé tout en bas du menu latéral gauche.
              </div>
              <button
                onClick={onCloseTour}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 px-4 rounded-xl text-xs border border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5"
              >
                Accéder à mon espace de travail
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
