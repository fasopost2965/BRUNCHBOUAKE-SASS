import React, { useState } from 'react';
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CreditCard, 
  Percent, 
  ShieldAlert, 
  Check, 
  RotateCcw, 
  FileText, 
  Sliders, 
  Save, 
  Bell, 
  Network,
  Info,
  Palette,
  Tags,
  TrendingUp,
  Plus,
  Trash2,
  Database,
  Download,
  Upload,
  MessageSquare
} from 'lucide-react';
import { PropertySettings, UserAccount } from '../types';
import { DEFAULT_PROPERTY_SETTINGS } from '../data';
import { WhatsAppOrchestrator } from '../services/whatsappService';

interface PropertySettingsProps {
  settings: PropertySettings;
  onUpdateSettings: (updated: PropertySettings) => void;
  appTheme?: 'savannah' | 'lagoon' | 'forest' | 'swiss';
  onUpdateTheme?: (theme: 'savannah' | 'lagoon' | 'forest' | 'swiss') => void;
  isProductionMode?: boolean;
  currentUser?: UserAccount | null;
  onResetToDemo?: () => void;
  onResetToProductionWipe?: () => void;
  onBackupSystem?: () => string;
  onRestoreSystem?: (backupJson: string) => boolean;
}

type SettingsSection = 'general' | 'pms' | 'finance' | 'pricing' | 'system' | 'design';

export default function PropertySettingsManager({ 
  settings, 
  onUpdateSettings,
  appTheme,
  onUpdateTheme,
  isProductionMode = false,
  currentUser,
  onResetToDemo,
  onResetToProductionWipe,
  onBackupSystem,
  onRestoreSystem
}: PropertySettingsProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const [localSettings, setLocalSettings] = useState<PropertySettings>({ 
    ...settings,
    categoryImages: settings.categoryImages || {
      studio: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
      room: 'https://images.unsplash.com/photo-1611891405110-5a30d32b1200?auto=format&fit=crop&w=600&q=80',
      apartment: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80'
    },
    pricingPolicy: settings.pricingPolicy || {
      basePrices: {
        room: 15000,
        studio: 25000,
        apartment: 45000
      },
      weekendMultiplier: 1.10,
      applyWeekendOnFri: true,
      applyWeekendOnSat: true,
      applyWeekendOnSun: false,
      commissionRateBooking: 15,
      pricingModelType: 'dynamic',
      seasonalSurcharges: [
        { id: 's1', name: 'Saison Haute / Fêtes Fin d\'Année', startMonth: 12, endMonth: 1, percentage: 15, active: true },
        { id: 's2', name: 'Période Vacances Scolaires d\'Été', startMonth: 7, endMonth: 8, percentage: 10, active: false }
      ]
    }
  });
  const [selectedBranch, setSelectedBranch] = useState<string>('CI-BKE-01'); // Bouaké Branch ID
  const [isSaved, setIsSaved] = useState(false);

  // Simulated branch list
  const branches = [
    { id: 'CI-BKE-01', name: 'Bouaké (Siège Kennedy)', status: 'active', city: 'Bouaké' },
    { id: 'CI-ABJ-02', name: 'Abidjan (Annexe Cocody)', status: 'upcoming', city: 'Abidjan' },
    { id: 'CI-YAK-03', name: 'Yamoussoukro (Annexe Assabou)', status: 'upcoming', city: 'Yamoussoukro' },
  ];

  const handleInputChange = (field: keyof PropertySettings, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [field]: value
    }));
    setIsSaved(false);
  };

  const handleNestedChange = (parent: 'paymentChannels' | 'workingHours' | 'notificationPreferences', field: string, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as Record<string, any>),
        [field]: value
      }
    }));
    setIsSaved(false);
  };

  const handleBackupClick = () => {
    if (!onBackupSystem) return;
    try {
      const dataStr = onBackupSystem();
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
      link.href = url;
      link.download = `brunch_bouake_sauvegarde_${dateStr}_${timeStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Erreur lors de la création de la sauvegarde.");
    }
  };

  const handleRestoreClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onRestoreSystem) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (window.confirm("⚠️ ATTENTION : Vous allez écraser l'INTEGRALITE de la base de données actuelle (réservations, clients, comptabilité) avec les données de ce fichier de sauvegarde.\n\nCette action est irréversible.\n\nVoulez-vous restaurer cette sauvegarde maintenant ?")) {
        onRestoreSystem(content);
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  const [waTestStatus, setWaTestStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [waTestError, setWaTestError] = useState('');
  const [waTestResponse, setWaTestResponse] = useState('');

  const handleTestWhatsApp = async () => {
    setWaTestStatus('sending');
    setWaTestError('');
    setWaTestResponse('');
    try {
      const testPhone = (import.meta as any).env.VITE_WHATSAPP_TEST_NUMBER || "+212777346787";
      const response = await WhatsAppOrchestrator.sendTemplateMessage(
        testPhone,
        'reservation_confirm',
        {
          guestName: currentUser?.name || 'Administrateur Test',
          roomName: 'Studio Suite 101',
          checkInDate: new Date().toLocaleDateString('fr-FR'),
          checkOutDate: new Date(Date.now() + 86400000 * 3).toLocaleDateString('fr-FR'),
          securityPin: '7787'
        },
        'tenant-bouake-kennedy',
        localSettings
      );

      if (response.status === 'sent') {
        setWaTestStatus('success');
        setWaTestResponse(response.message || "Message envoyé avec succès via la passerelle WhatsApp Business !");
      } else if (response.status === 'queued') {
        setWaTestStatus('success');
        setWaTestResponse("Mode Hors-ligne / File d'attente : Message de test mis en attente pour envoi différé.");
      } else {
        setWaTestStatus('error');
        setWaTestError(response.error || "Échec de l'envoi");
      }
    } catch (err: any) {
      setWaTestStatus('error');
      setWaTestError(err.message || "Une erreur inconnue est survenue.");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBranch !== 'CI-BKE-01') {
      alert("La configuration pour cette filiale est en lecture seule.");
      return;
    }
    onUpdateSettings(localSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleRestoreDefaults = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser TOUS les paramètres de l'établissement à leurs valeurs par défaut ?")) {
      setLocalSettings({ ...DEFAULT_PROPERTY_SETTINGS });
      onUpdateSettings(DEFAULT_PROPERTY_SETTINGS);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const activeBranch = branches.find(b => b.id === selectedBranch) || branches[0];

  return (
    <div className="space-y-6" id="property-settings-manager">
      
      {/* Upper Status Bar / Branch Selection */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl border border-orange-100">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-tight text-slate-800">Configuration Multi-Filiales</h3>
            <p className="text-xs text-slate-400">Configurez les règles d'exploitation globales ou par succursale hôtelière.</p>
          </div>
        </div>

        {/* Branch Switcher Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="text-xs text-slate-500 font-bold shrink-0">Filiale Active :</label>
          <select
            value={selectedBranch}
            onChange={(e) => {
              const bId = e.target.value;
              setSelectedBranch(bId);
              if (bId !== 'CI-BKE-01') {
                // If secondary read-only branch selected, load mock data or keep Kennedy template but disable inputs
                alert(`Filiale "${branches.find(b => b.id === bId)?.name}" en cours de déploiement. Affichage en mode lecture seule.`);
              }
            }}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer w-full md:w-64"
          >
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>
                {branch.name} {branch.status === 'upcoming' ? '(Simulé - Lecture Seule)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Hand Navigation Rules Menu */}
        <div className="w-full lg:w-64 shrink-0 flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-3 lg:pb-0">
          <button
            type="button"
            onClick={() => setActiveSection('general')}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all w-full text-left shrink-0 lg:shrink ${
              activeSection === 'general'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Building className="w-4 h-4 text-orange-500" />
            <span>1. Général & Identité</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('pms')}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all w-full text-left shrink-0 lg:shrink ${
              activeSection === 'pms'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Clock className="w-4 h-4 text-orange-500" />
            <span>2. Opérations PMS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('finance')}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all w-full text-left shrink-0 lg:shrink ${
              activeSection === 'finance'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <CreditCard className="w-4 h-4 text-orange-500" />
            <span>3. Finances & Caisse</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('pricing')}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all w-full text-left shrink-0 lg:shrink ${
              activeSection === 'pricing'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Tags className="w-4 h-4 text-orange-500" />
            <span>4. Politique de Prix</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('system')}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all w-full text-left shrink-0 lg:shrink ${
              activeSection === 'system'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Sliders className="w-4 h-4 text-orange-500" />
            <span>5. Paramètres Système</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('design')}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all w-full text-left shrink-0 lg:shrink ${
              activeSection === 'design'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Palette className="w-4 h-4 text-orange-500" />
            <span>6. Style & Charte</span>
          </button>

          {/* Settings info message */}
          <div className="hidden lg:block bg-orange-50/50 border border-orange-100 rounded-2xl p-4 text-[11px] text-slate-600 leading-relaxed mt-4">
            <div className="flex items-center gap-1.5 text-orange-800 font-bold mb-1">
              <Info className="w-3.5 h-3.5" />
              <span>Info Structurelle</span>
            </div>
            Ces paramètres sont chargés en mémoire vive comme l'unique source de vérité (Single Source of Truth) pour les calculs de TVA, factures ERP hôtelières et les heures réglementaires d'attribution de chambres de Brunch Bouaké.
          </div>
        </div>

        {/* Right Hand Settings Card */}
        <div className="flex-1 bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
          <form onSubmit={handleSave} className="flex flex-col h-full">
            
            {/* Header / Sub-title */}
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  {activeSection === 'general' && 'Identité Globale de l\'Établissement'}
                  {activeSection === 'pms' && 'Heures Réglementaires & PMS de Réception'}
                  {activeSection === 'finance' && 'Fiscalité, Devises & Canaux d\'Encaissement'}
                  {activeSection === 'pricing' && 'Politique Tarifaire & Module de Prix'}
                  {activeSection === 'system' && 'Configuration Technique & Notifications'}
                  {activeSection === 'design' && 'Personnalisation Visuelle & Design'}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activeSection === 'general' && 'Configurez le nom commercial, les coordonnées et les identifiants fiscaux imprimés sur les factures.'}
                  {activeSection === 'pms' && 'Régulez les heures de check-in / out et déterminez le format légal des folios et les tâches de ménage.'}
                  {activeSection === 'finance' && 'Saisissez le taux de TVA en vigueur en Côte d\'Ivoire (UEMOA), la taxe de séjour et les portefeuilles Mobile Money.'}
                  {activeSection === 'pricing' && 'Définissez la politique de prix de base par catégorie, les surcoûts saisonniers ou de week-end (Booking/OTA).'}
                  {activeSection === 'system' && 'Ajustez les heures d\'activité du maquis restaurant et paramétrez les alertes administratives de service.'}
                  {activeSection === 'design' && 'Sélectionnez un style visuel d\'ambiance adapté à votre marque et à l\'expérience de l\'établissement.'}
                </p>
              </div>

              {activeBranch.status === 'upcoming' && (
                <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-100 text-[10px] font-black uppercase rounded-lg">
                  Lecture Seule
                </span>
              )}
            </div>

            {/* Content Form Body */}
            <div className="p-6 space-y-5 text-xs text-left flex-1">
              
              {/* SECTION 1: GENERAL & IDENTITY */}
              {activeSection === 'general' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-slate-600 font-bold">Nom Commercial de l'Établissement *</label>
                    <input
                      type="text"
                      required
                      disabled={selectedBranch !== 'CI-BKE-01'}
                      value={localSettings.establishmentName}
                      onChange={(e) => handleInputChange('establishmentName', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-slate-600 font-bold">Texte de Marque / Sigle En-tête *</label>
                    <input
                      type="text"
                      required
                      disabled={selectedBranch !== 'CI-BKE-01'}
                      value={localSettings.brandLogoText}
                      onChange={(e) => handleInputChange('brandLogoText', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="block text-slate-600 font-bold">Adresse Géographique Légale *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        disabled={selectedBranch !== 'CI-BKE-01'}
                        value={localSettings.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-slate-600 font-bold">Ville *</label>
                    <input
                      type="text"
                      required
                      disabled={selectedBranch !== 'CI-BKE-01'}
                      value={localSettings.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-slate-600 font-bold">Pays *</label>
                    <input
                      type="text"
                      required
                      disabled={selectedBranch !== 'CI-BKE-01'}
                      value={localSettings.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-slate-600 font-bold">Numéros de Téléphone de Contact (Séparés par virgule) *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        disabled={selectedBranch !== 'CI-BKE-01'}
                        value={localSettings.phoneNumbers}
                        onChange={(e) => handleInputChange('phoneNumbers', e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-slate-600 font-bold">Email Officiel *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        disabled={selectedBranch !== 'CI-BKE-01'}
                        value={localSettings.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="block text-slate-600 font-bold">Identifiant Unique Fiscal / RCCM / Registre du Commerce (Imprimé sur Folio/Facture)</label>
                    <input
                      type="text"
                      disabled={selectedBranch !== 'CI-BKE-01'}
                      placeholder="Ex: CC N° 1209384 B / RCCM CI-BKE-2024-B-992"
                      value={localSettings.taxId}
                      onChange={(e) => handleInputChange('taxId', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-all font-mono text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* SECTION 2: PMS OPERATIONS */}
              {activeSection === 'pms' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-slate-600 font-bold">Heure Réglementaire d'Arrivée (Check-in)</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          disabled={selectedBranch !== 'CI-BKE-01'}
                          placeholder="14:00"
                          value={localSettings.checkInTime}
                          onChange={(e) => handleInputChange('checkInTime', e.target.value)}
                          className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-all font-mono"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 block">Heure par défaut d'attribution de la chambre pour calculer la tarification de la première nuit.</span>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-slate-600 font-bold">Heure Réglementaire de Libération (Check-out)</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          disabled={selectedBranch !== 'CI-BKE-01'}
                          placeholder="12:00"
                          value={localSettings.checkOutTime}
                          onChange={(e) => handleInputChange('checkOutTime', e.target.value)}
                          className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-all font-mono"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 block">Les départs effectués après cette heure généreront automatiquement des alertes de surcoût ou d'extra de check-out tardif.</span>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-slate-600 font-bold">Gabarit de Numérotation Folio (Factures)</label>
                      <input
                        type="text"
                        required
                        disabled={selectedBranch !== 'CI-BKE-01'}
                        value={localSettings.folioNumberFormat}
                        onChange={(e) => handleInputChange('folioNumberFormat', e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-all font-mono uppercase"
                      />
                      <span className="text-[10px] text-slate-400 block">Formats reconnus: <code className="bg-slate-100 p-0.5 rounded font-mono font-bold">{"{YYYY}"}</code> (Année active) et <code className="bg-slate-100 p-0.5 rounded font-mono font-bold">{"{SEQ}"}</code> (Numéro incrémental).</span>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-slate-600 font-bold">Statut de la Chambre sur Départ (Check-out)</label>
                      <div className="p-3 bg-orange-50/50 border border-orange-100 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="font-extrabold text-orange-950 block">Mise au ménage automatique</span>
                          <span className="text-[10px] text-slate-500 block leading-tight">Marque la chambre "À nettoyer" et crée une tâche ménage après chaque check-out.</span>
                        </div>
                        <input
                          type="checkbox"
                          disabled={selectedBranch !== 'CI-BKE-01'}
                          checked={localSettings.housekeepingOnCheckout}
                          onChange={(e) => handleInputChange('housekeepingOnCheckout', e.target.checked)}
                          className="w-4.5 h-4.5 accent-orange-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Visualisation des Statuts PMS Configurés</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <span className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl font-bold text-center">Disponible (Libre)</span>
                      <span className="p-2 bg-blue-50 text-blue-800 border border-blue-100 rounded-xl font-bold text-center">Occupé (En séjour)</span>
                      <span className="p-2 bg-orange-50 text-orange-800 border border-orange-100 rounded-xl font-bold text-center">Sale (Ménage requis)</span>
                      <span className="p-2 bg-rose-50 text-rose-800 border border-rose-100 rounded-xl font-bold text-center">Maintenance (Panne)</span>
                    </div>
                  </div>

                  <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                        Images de Couverture par Catégorie d'Hébergement
                      </span>
                      <p className="text-[10px] text-slate-500 leading-normal">
                        Définissez l'image de couverture globale par défaut pour chaque catégorie d'hébergement (Studio, Chambre, Appartement). Ces images s'afficheront dans la grille PMS pour les chambres n'ayant pas d'image individuelle configurée.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Studio Category Image */}
                      <div className="space-y-2 p-3 bg-white border border-slate-200 rounded-2xl shadow-2xs flex flex-col justify-between">
                        <div>
                          <span className="font-extrabold text-[11px] text-slate-800 uppercase block mb-1.5">1. Studios</span>
                          <div className="h-28 rounded-xl overflow-hidden relative border border-slate-100 bg-slate-50 mb-2.5">
                            <img 
                              src={localSettings.categoryImages?.studio || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=300&q=80'} 
                              alt="Studio default" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 text-[8px] text-white font-extrabold uppercase rounded-md backdrop-blur-xs">Aperçu</div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 font-bold block">URL de l'image</label>
                          <input
                            type="url"
                            placeholder="Saisissez l'URL d'image pour Studio..."
                            disabled={selectedBranch !== 'CI-BKE-01'}
                            value={localSettings.categoryImages?.studio || ''}
                            onChange={(e) => {
                              setLocalSettings(prev => ({
                                ...prev,
                                categoryImages: {
                                  ...(prev.categoryImages || {}),
                                  studio: e.target.value
                                }
                              }));
                              setIsSaved(false);
                            }}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:border-orange-500 text-slate-800 transition-all"
                          />
                        </div>
                      </div>

                      {/* Room Category Image */}
                      <div className="space-y-2 p-3 bg-white border border-slate-200 rounded-2xl shadow-2xs flex flex-col justify-between">
                        <div>
                          <span className="font-extrabold text-[11px] text-slate-800 uppercase block mb-1.5">2. Chambres Classiques</span>
                          <div className="h-28 rounded-xl overflow-hidden relative border border-slate-100 bg-slate-50 mb-2.5">
                            <img 
                              src={localSettings.categoryImages?.room || 'https://images.unsplash.com/photo-1611891405110-5a30d32b1200?auto=format&fit=crop&w=300&q=80'} 
                              alt="Chambre default" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 text-[8px] text-white font-extrabold uppercase rounded-md backdrop-blur-xs">Aperçu</div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 font-bold block">URL de l'image</label>
                          <input
                            type="url"
                            placeholder="Saisissez l'URL d'image pour Chambre..."
                            disabled={selectedBranch !== 'CI-BKE-01'}
                            value={localSettings.categoryImages?.room || ''}
                            onChange={(e) => {
                              setLocalSettings(prev => ({
                                ...prev,
                                categoryImages: {
                                  ...(prev.categoryImages || {}),
                                  room: e.target.value
                                }
                              }));
                              setIsSaved(false);
                            }}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:border-orange-500 text-slate-800 transition-all"
                          />
                        </div>
                      </div>

                      {/* Apartment Category Image */}
                      <div className="space-y-2 p-3 bg-white border border-slate-200 rounded-2xl shadow-2xs flex flex-col justify-between">
                        <div>
                          <span className="font-extrabold text-[11px] text-slate-800 uppercase block mb-1.5">3. Appartements</span>
                          <div className="h-28 rounded-xl overflow-hidden relative border border-slate-100 bg-slate-50 mb-2.5">
                            <img 
                              src={localSettings.categoryImages?.apartment || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=300&q=80'} 
                              alt="Appartement default" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 text-[8px] text-white font-extrabold uppercase rounded-md backdrop-blur-xs">Aperçu</div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 font-bold block">URL de l'image</label>
                          <input
                            type="url"
                            placeholder="Saisissez l'URL d'image pour Appartement..."
                            disabled={selectedBranch !== 'CI-BKE-01'}
                            value={localSettings.categoryImages?.apartment || ''}
                            onChange={(e) => {
                              setLocalSettings(prev => ({
                                ...prev,
                                categoryImages: {
                                  ...(prev.categoryImages || {}),
                                  apartment: e.target.value
                                }
                              }));
                              setIsSaved(false);
                            }}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:border-orange-500 text-slate-800 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 3: FINANCES & CASH */}
              {activeSection === 'finance' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-slate-600 font-bold">Devise de l'Établissement *</label>
                      <input
                        type="text"
                        required
                        disabled={selectedBranch !== 'CI-BKE-01'}
                        value={localSettings.defaultCurrency}
                        onChange={(e) => handleInputChange('defaultCurrency', e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-all font-mono font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-slate-600 font-bold">TVA (%) *</label>
                        <div className="relative">
                          <Percent className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
                          <input
                            type="number"
                            required
                            disabled={selectedBranch !== 'CI-BKE-01'}
                            min={0}
                            max={100}
                            value={localSettings.vatRate}
                            onChange={(e) => handleInputChange('vatRate', parseFloat(e.target.value) || 0)}
                            className="w-full pr-9 pl-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-all font-mono font-bold"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-slate-600 font-bold">Taxe de Séjour (FCFA/nuit) *</label>
                        <input
                          type="number"
                          required
                          disabled={selectedBranch !== 'CI-BKE-01'}
                          min={0}
                          value={localSettings.touristTaxPerNight}
                          onChange={(e) => handleInputChange('touristTaxPerNight', parseInt(e.target.value) || 0)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-all font-mono font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="block text-slate-600 font-bold mb-1.5">Canaux de Règlement Activés (Pris en charge au POS et PMS) :</label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-slate-50 p-4 border border-slate-200 rounded-2xl">
                        {[
                          { id: 'wave', label: 'Wave (CI)' },
                          { id: 'orange_money', label: 'Orange Money' },
                          { id: 'mtn', label: 'MTN MoMo' },
                          { id: 'cash', label: 'Espèces' },
                          { id: 'card', label: 'Carte Bancaire' }
                        ].map(ch => (
                          <label key={ch.id} className="flex items-center gap-2 bg-white px-3 py-2 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors select-none">
                            <input
                              type="checkbox"
                              disabled={selectedBranch !== 'CI-BKE-01'}
                              checked={(localSettings.paymentChannels as any)[ch.id]}
                              onChange={(e) => handleNestedChange('paymentChannels', ch.id, e.target.checked)}
                              className="w-4 h-4 accent-orange-500"
                            />
                            <span className="font-bold text-[11px] text-slate-700">{ch.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-slate-600 font-bold">Pied de page - Facture Folio ERP</label>
                      <textarea
                        disabled={selectedBranch !== 'CI-BKE-01'}
                        value={localSettings.invoiceFooter}
                        onChange={(e) => handleInputChange('invoiceFooter', e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-all h-20"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-slate-600 font-bold">Pied de page - Reçu de Paiement POS</label>
                      <textarea
                        disabled={selectedBranch !== 'CI-BKE-01'}
                        value={localSettings.receiptFooter}
                        onChange={(e) => handleInputChange('receiptFooter', e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-all h-20"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 4: SYSTEM */}
              {activeSection === 'system' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-slate-600 font-bold">Horaires d'Ouverture Commerciale (Maquis & Cuisine)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-0.5">Heure d'ouverture :</span>
                          <input
                            type="text"
                            required
                            disabled={selectedBranch !== 'CI-BKE-01'}
                            value={localSettings.workingHours.start}
                            onChange={(e) => handleNestedChange('workingHours', 'start', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none font-mono text-center text-slate-800"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-0.5">Heure de fermeture :</span>
                          <input
                            type="text"
                            required
                            disabled={selectedBranch !== 'CI-BKE-01'}
                            value={localSettings.workingHours.end}
                            onChange={(e) => handleNestedChange('workingHours', 'end', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none font-mono text-center text-slate-800"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-slate-600 font-bold">Rôles Utilisateurs Autorisés de Service</label>
                      <div className="grid grid-cols-2 gap-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono text-[10px] text-slate-700">
                        <span className="flex items-center gap-1.5">🛡️ Admin (Comptabilité)</span>
                        <span className="flex items-center gap-1.5">🛎️ Réceptionniste (PMS)</span>
                        <span className="flex items-center gap-1.5">🍳 Serveur / Maquis (POS)</span>
                        <span className="flex items-center gap-1.5">🧹 Gouvernante (Ménage)</span>
                      </div>
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="block text-slate-600 font-bold mb-1.5">Préférences d'Alertes Système & Notifications ERP :</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 border border-slate-200 rounded-2xl">
                        
                        <label className="flex items-center gap-3 bg-white px-4 py-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors select-none">
                          <input
                            type="checkbox"
                            disabled={selectedBranch !== 'CI-BKE-01'}
                            checked={localSettings.notificationPreferences.smsOnCheckout}
                            onChange={(e) => handleNestedChange('notificationPreferences', 'smsOnCheckout', e.target.checked)}
                            className="w-4.5 h-4.5 accent-orange-500 shrink-0"
                          />
                          <div>
                            <span className="font-extrabold text-[11px] text-slate-800 block">Notification SMS Gérant de Service</span>
                            <span className="text-[10px] text-slate-400 block leading-tight">Envoyer une alerte SMS de clôture de caisse au Gérant lors de chaque libération de chambre (Check-out).</span>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 bg-white px-4 py-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors select-none">
                          <input
                            type="checkbox"
                            disabled={selectedBranch !== 'CI-BKE-01'}
                            checked={localSettings.notificationPreferences.emailOnHighExpense}
                            onChange={(e) => handleNestedChange('notificationPreferences', 'emailOnHighExpense', e.target.checked)}
                            className="w-4.5 h-4.5 accent-orange-500 shrink-0"
                          />
                          <div>
                            <span className="font-extrabold text-[11px] text-slate-800 block">Alertes Auditeur Senior par Email</span>
                            <span className="text-[10px] text-slate-400 block leading-tight">Envoyer un rapport financier si une annulation ou une réduction supérieure à 25% est accordée au check-out.</span>
                          </div>
                        </label>

                      </div>
                    </div>

                    {/* WHATSAPP BUSINESS GATEWAY TEST INTEGRATION */}
                    <div className="md:col-span-2 border-t border-slate-100 pt-6 mt-4 space-y-4">
                      <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
                        <div className="flex items-start gap-3.5">
                          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shrink-0">
                            <MessageSquare className="w-5 h-5" />
                          </div>
                          <div className="space-y-1 flex-1">
                            <h4 className="text-xs font-black uppercase text-slate-800 tracking-tight">Test d'Intégration de la Passerelle WhatsApp Business</h4>
                            <p className="text-[11px] text-slate-500 leading-normal">
                              Vérifiez la réception immédiate d'un message type de confirmation de réservation sur votre compte WhatsApp de test. Le numéro de destination est configuré via la variable d'environnement de l'application.
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 bg-white p-4 border border-slate-100 rounded-xl space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <span className="text-[11px] font-black uppercase text-slate-800 block">Numéro WhatsApp de Test Actif</span>
                              <span className="text-xs font-bold font-mono text-blue-600 block mt-1">
                                {(import.meta as any).env.VITE_WHATSAPP_TEST_NUMBER || "+212777346787"}
                              </span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                (Défini par la variable d'environnement VITE_WHATSAPP_TEST_NUMBER)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={handleTestWhatsApp}
                              disabled={waTestStatus === 'sending'}
                              className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-extrabold text-[10px] uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shrink-0 font-sans"
                            >
                              {waTestStatus === 'sending' ? (
                                <>
                                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  <span>Envoi du Test...</span>
                                </>
                              ) : (
                                <>
                                  <MessageSquare className="w-4 h-4" />
                                  <span>Envoyer un Message de Test</span>
                                </>
                              )}
                            </button>
                          </div>

                          {waTestStatus === 'success' && (
                            <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-lg text-[11px] font-bold">
                              {waTestResponse}
                            </div>
                          )}

                          {waTestStatus === 'error' && (
                            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 rounded-lg text-[11px] font-bold">
                              ⚠️ {waTestError}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="block text-slate-600 font-bold">Catégories d'Articles d'Exploitation du Maquis POS</label>
                      <div className="flex flex-wrap gap-2 py-1">
                        <span className="px-3 py-1 bg-orange-100 text-orange-800 font-extrabold rounded-lg">Plat chaud (Braises, Kédjénous)</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 font-extrabold rounded-lg">Boissons (Bock, Sucrés)</span>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 font-extrabold rounded-lg">Accompagnements (Alloco, Attiéké)</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 font-extrabold rounded-lg">Desserts glacés</span>
                      </div>
                    </div>

                    {/* BACKUP & RESTORE SYSTEM */}
                    <div className="md:col-span-2 border-t border-slate-100 pt-6 mt-4 space-y-4">
                      <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
                        <div className="flex items-start gap-3.5">
                          <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl border border-orange-100 shrink-0">
                            <Database className="w-5 h-5" />
                          </div>
                          <div className="space-y-1 flex-1">
                            <h4 className="text-xs font-black uppercase text-slate-800 tracking-tight">Sauvegarde & Restauration de la Base de Données</h4>
                            <p className="text-[11px] text-slate-500 leading-normal">
                              Exportez l'intégralité de vos données d'activité (fiches clients, historique de réservations, ventes POS du maquis, données financières de l'ERP) pour éviter des pertes financières ou opérationnelles, ou restaurez une sauvegarde précédente.
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200/50">
                          {/* Backup Box */}
                          <div className="bg-white p-4 border border-slate-100 rounded-xl space-y-3 flex flex-col justify-between">
                            <div>
                              <span className="text-[11px] font-black uppercase text-slate-800 block">Exporter la Base de Données</span>
                              <span className="text-[10px] text-slate-400 block leading-tight mt-1">
                                Téléchargez un fichier sécurisé .json contenant l'ensemble des données de l'application Brunch Bouaké.
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={handleBackupClick}
                              className="w-full py-2.5 px-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-[10px] uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                            >
                              <Download className="w-4 h-4" />
                              <span>Télécharger la Sauvegarde (.json)</span>
                            </button>
                          </div>

                          {/* Restore Box */}
                          <div className="bg-white p-4 border border-slate-100 rounded-xl space-y-3 flex flex-col justify-between">
                            <div>
                              <span className="text-[11px] font-black uppercase text-slate-800 block">Restaurer une Sauvegarde</span>
                              <span className="text-[10px] text-slate-400 block leading-tight mt-1">
                                Importez un fichier de sauvegarde précédemment exporté pour restaurer l'état complet du système.
                              </span>
                            </div>
                            <div className="relative">
                              <input
                                type="file"
                                id="restore-file-input"
                                accept=".json"
                                onChange={handleRestoreClick}
                                className="hidden"
                              />
                              <button
                                type="button"
                                onClick={() => document.getElementById('restore-file-input')?.click()}
                                className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-[10px] uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
                              >
                                <Upload className="w-4 h-4" />
                                <span>Sélectionner et Restaurer</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DANGER ZONE & SYSTEM MAINTENANCE FOR ADMIN ONLY */}
                    <div className="md:col-span-2 border-t border-rose-100 pt-6 mt-6 space-y-4">
                      <div className="bg-rose-50/50 border border-rose-100 p-5 rounded-2xl">
                        <div className="flex items-start gap-3.5">
                          <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl border border-rose-200 shrink-0">
                            <ShieldAlert className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-black uppercase text-rose-800 tracking-tight">Zone d'Administration Sécurisée</h4>
                            <p className="text-[11px] text-slate-500 leading-normal">
                              Cette section vous permet de gérer les cycles d'activité de l'application Brunch Bouaké. Elle est strictement réservée au compte Directeur/Administrateur principal et ne doit pas être manipulée par le personnel de service.
                            </p>
                          </div>
                        </div>

                        {currentUser?.role !== 'admin' ? (
                          <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl text-[11px] text-amber-800 font-bold flex items-center gap-2">
                            <span>🔒 Accès Restreint : Seul le profil d'Administration Principal (Directeur) peut exécuter des réinitialisations usine ou de maintenance. Votre rôle de service actuel est : Manager Général.</span>
                          </div>
                        ) : (
                          <div className="mt-5 space-y-4 pt-4 border-t border-rose-100/50">
                            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 border border-slate-100 rounded-xl">
                              <div className="space-y-1.5 flex-1 min-w-[250px]">
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${isProductionMode ? 'bg-emerald-500 animate-ping' : 'bg-orange-500'}`} />
                                  <span className="text-[11px] font-black uppercase text-slate-800">
                                    Statut : {isProductionMode ? 'Mode Production Actif (Données Réelles)' : 'Mode Démo Actif (Données Simulées)'}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-400 leading-tight">
                                  {isProductionMode 
                                    ? 'Le système fonctionne sur des bases de données réelles propres de votre établissement Brunch Bouaké.' 
                                    : 'Le système utilise des comptes de test et des réservations de simulation pré-chargées pour la démonstration.'}
                                </p>
                              </div>

                              <div className="flex flex-col sm:flex-row gap-2">
                                {isProductionMode && onResetToDemo && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (window.confirm("IMPORTANT: Vous allez désactiver le mode production et recharger le jeu de données de démonstration simulées. Toutes les réservations réelles actives seront effacées.\n\nVoulez-vous continuer ?")) {
                                        onResetToDemo();
                                      }
                                    }}
                                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-[10px] uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>Repasser en Mode Démo</span>
                                  </button>
                                )}

                                {onResetToProductionWipe && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const code = Math.floor(1000 + Math.random() * 9000).toString();
                                      const input = prompt(
                                        `⚠️ ATTENTION - RÉINITIALISATION USINE EN MODE PRODUCTION !\n\nCette action va purger définitivement TOUTES les données d'activité de l'hôtel et du restaurant (folis, ventes, stocks, fiches clients) pour redémarrer à blanc tout en restant en mode production.\n\nSaisissez le code de contrôle pour valider : ${code}`
                                      );
                                      if (input === code) {
                                        onResetToProductionWipe();
                                        alert("Le système a été réinitialisé avec succès avec une base de données propre en mode production.");
                                      } else {
                                        alert("Code de contrôle incorrect. Opération annulée.");
                                      }
                                    }}
                                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[10px] uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Purger & Réinitialiser à Blanc</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 4: POLITIQUE DE PRIX */}
              {activeSection === 'pricing' && (
                <div className="space-y-6">
                  <div className="bg-orange-50/40 border border-orange-100 p-4 rounded-2xl text-xs text-slate-600 leading-relaxed flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-slate-800 uppercase block mb-1">Règles de Yield Management (Politique de Prix)</span>
                      Configurez vos tarifs standards de référence et vos multiplicateurs saisonniers ou de week-end. Ces tarifs seront suggérés automatiquement lors de la création d'inventaire de chambres et appliqués lors du calcul des nuitées de réservation.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    {/* Tarifs de base par catégorie */}
                    <div className="space-y-3 bg-slate-50 p-4 border border-slate-200 rounded-2xl md:col-span-3">
                      <span className="font-extrabold text-[11px] text-slate-500 uppercase tracking-wide block mb-1">Tarifs Journaliers Standards de Référence</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-600 font-bold block">Chambre Classique (FCFA) *</label>
                          <input
                            type="number"
                            required
                            disabled={selectedBranch !== 'CI-BKE-01'}
                            value={localSettings.pricingPolicy?.basePrices.room ?? 15000}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              setLocalSettings(prev => ({
                                ...prev,
                                pricingPolicy: {
                                  ...(prev.pricingPolicy || {
                                    basePrices: { room: 15000, studio: 25000, apartment: 45000 },
                                    weekendMultiplier: 1.10,
                                    applyWeekendOnFri: true,
                                    applyWeekendOnSat: true,
                                    applyWeekendOnSun: false,
                                    commissionRateBooking: 15,
                                    pricingModelType: 'dynamic',
                                    seasonalSurcharges: []
                                  }),
                                  basePrices: {
                                    ...(prev.pricingPolicy?.basePrices || { room: 15000, studio: 25000, apartment: 45000 }),
                                    room: val
                                  }
                                }
                              }));
                              setIsSaved(false);
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-orange-500 text-slate-800 font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-600 font-bold block">Studio (ch + salon) (FCFA) *</label>
                          <input
                            type="number"
                            required
                            disabled={selectedBranch !== 'CI-BKE-01'}
                            value={localSettings.pricingPolicy?.basePrices.studio ?? 25000}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              setLocalSettings(prev => ({
                                ...prev,
                                pricingPolicy: {
                                  ...(prev.pricingPolicy || {
                                    basePrices: { room: 15000, studio: 25000, apartment: 45000 },
                                    weekendMultiplier: 1.10,
                                    applyWeekendOnFri: true,
                                    applyWeekendOnSat: true,
                                    applyWeekendOnSun: false,
                                    commissionRateBooking: 15,
                                    pricingModelType: 'dynamic',
                                    seasonalSurcharges: []
                                  }),
                                  basePrices: {
                                    ...(prev.pricingPolicy?.basePrices || { room: 15000, studio: 25000, apartment: 45000 }),
                                    studio: val
                                  }
                                }
                              }));
                              setIsSaved(false);
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-orange-500 text-slate-800 font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-600 font-bold block">Appartement F2/F3 (FCFA) *</label>
                          <input
                            type="number"
                            required
                            disabled={selectedBranch !== 'CI-BKE-01'}
                            value={localSettings.pricingPolicy?.basePrices.apartment ?? 45000}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              setLocalSettings(prev => ({
                                ...prev,
                                pricingPolicy: {
                                  ...(prev.pricingPolicy || {
                                    basePrices: { room: 15000, studio: 25000, apartment: 45000 },
                                    weekendMultiplier: 1.10,
                                    applyWeekendOnFri: true,
                                    applyWeekendOnSat: true,
                                    applyWeekendOnSun: false,
                                    commissionRateBooking: 15,
                                    pricingModelType: 'dynamic',
                                    seasonalSurcharges: []
                                  }),
                                  basePrices: {
                                    ...(prev.pricingPolicy?.basePrices || { room: 15000, studio: 25000, apartment: 45000 }),
                                    apartment: val
                                  }
                                }
                              }));
                              setIsSaved(false);
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-orange-500 text-slate-800 font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Modèle de tarification & Commission OTA */}
                    <div className="space-y-3 p-4 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between">
                      <div>
                        <span className="font-extrabold text-[11px] text-slate-800 uppercase block mb-1">Type d'Algorithme Tarifaire</span>
                        <p className="text-[10px] text-slate-400 mb-2">Choisissez comment le système ajuste les tarifs.</p>
                        <select
                          disabled={selectedBranch !== 'CI-BKE-01'}
                          value={localSettings.pricingPolicy?.pricingModelType || 'dynamic'}
                          onChange={(e) => {
                            const val = e.target.value as any;
                            setLocalSettings(prev => ({
                              ...prev,
                              pricingPolicy: {
                                ...(prev.pricingPolicy || {
                                  basePrices: { room: 15000, studio: 25000, apartment: 45000 },
                                  weekendMultiplier: 1.10,
                                  applyWeekendOnFri: true,
                                  applyWeekendOnSat: true,
                                  applyWeekendOnSun: false,
                                  commissionRateBooking: 15,
                                  pricingModelType: 'dynamic',
                                  seasonalSurcharges: []
                                }),
                                pricingModelType: val
                              }
                            }));
                            setIsSaved(false);
                          }}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-orange-500 font-bold"
                        >
                          <option value="fixed">Prix Fixe (Aucun ajustement automatique)</option>
                          <option value="dynamic">Tarification Dynamique (Weekend & Saisons)</option>
                          <option value="occupancy_based">Basé sur le Remplissage (+15% si &gt;75% d'occupation)</option>
                        </select>
                      </div>

                      <div className="pt-3 border-t border-slate-100 mt-2">
                        <label className="text-[10px] text-slate-600 font-bold block mb-1">Taux de Commission Booking/OTAs (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="50"
                          disabled={selectedBranch !== 'CI-BKE-01'}
                          value={localSettings.pricingPolicy?.commissionRateBooking ?? 15}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setLocalSettings(prev => ({
                              ...prev,
                              pricingPolicy: {
                                ...(prev.pricingPolicy || {
                                  basePrices: { room: 15000, studio: 25000, apartment: 45000 },
                                  weekendMultiplier: 1.10,
                                  applyWeekendOnFri: true,
                                  applyWeekendOnSat: true,
                                  applyWeekendOnSun: false,
                                  commissionRateBooking: 15,
                                  pricingModelType: 'dynamic',
                                  seasonalSurcharges: []
                                }),
                                commissionRateBooking: val
                              }
                            }));
                            setIsSaved(false);
                          }}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 font-bold focus:outline-none focus:border-orange-500"
                        />
                        <span className="text-[9px] text-slate-400 block mt-1">Calculera la marge nette et le versement Booking net sur les folios.</span>
                      </div>
                    </div>

                    {/* Surcharge Week-end */}
                    <div className="space-y-3 p-4 bg-white border border-slate-200 rounded-2xl md:col-span-2">
                      <span className="font-extrabold text-[11px] text-slate-800 uppercase block mb-1">Majoration Spécifique de Week-end</span>
                      <p className="text-[10px] text-slate-400">Configurez une tarification incitative de fin de semaine pour optimiser le taux de remplissage.</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-600 font-bold block">Surcharge Multiplicatrice (Ex: 1.10 = +10%)</label>
                          <input
                            type="number"
                            step="0.05"
                            min="1.00"
                            max="2.00"
                            disabled={selectedBranch !== 'CI-BKE-01'}
                            value={localSettings.pricingPolicy?.weekendMultiplier ?? 1.10}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 1.0;
                              setLocalSettings(prev => ({
                                ...prev,
                                pricingPolicy: {
                                  ...(prev.pricingPolicy || {
                                    basePrices: { room: 15000, studio: 25000, apartment: 45000 },
                                    weekendMultiplier: 1.10,
                                    applyWeekendOnFri: true,
                                    applyWeekendOnSat: true,
                                    applyWeekendOnSun: false,
                                    commissionRateBooking: 15,
                                    pricingModelType: 'dynamic',
                                    seasonalSurcharges: []
                                  }),
                                  weekendMultiplier: val
                                }
                              }));
                              setIsSaved(false);
                            }}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 font-bold focus:outline-none focus:border-orange-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] text-slate-600 font-bold block">Jours d'application du Week-end :</label>
                          <div className="space-y-1">
                            <label className="flex items-center gap-2 cursor-pointer text-[10px] select-none font-bold">
                              <input
                                type="checkbox"
                                disabled={selectedBranch !== 'CI-BKE-01'}
                                checked={localSettings.pricingPolicy?.applyWeekendOnFri ?? false}
                                onChange={(e) => {
                                  const val = e.target.checked;
                                  setLocalSettings(prev => ({
                                    ...prev,
                                    pricingPolicy: {
                                      ...(prev.pricingPolicy || {
                                        basePrices: { room: 15000, studio: 25000, apartment: 45000 },
                                        weekendMultiplier: 1.10,
                                        applyWeekendOnFri: true,
                                        applyWeekendOnSat: true,
                                        applyWeekendOnSun: false,
                                        commissionRateBooking: 15,
                                        pricingModelType: 'dynamic',
                                        seasonalSurcharges: []
                                      }),
                                      applyWeekendOnFri: val
                                    }
                                  }));
                                  setIsSaved(false);
                                }}
                                className="accent-orange-500 cursor-pointer"
                              />
                              <span>Vendredi</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-[10px] select-none font-bold">
                              <input
                                type="checkbox"
                                disabled={selectedBranch !== 'CI-BKE-01'}
                                checked={localSettings.pricingPolicy?.applyWeekendOnSat ?? false}
                                onChange={(e) => {
                                  const val = e.target.checked;
                                  setLocalSettings(prev => ({
                                    ...prev,
                                    pricingPolicy: {
                                      ...(prev.pricingPolicy || {
                                        basePrices: { room: 15000, studio: 25000, apartment: 45000 },
                                        weekendMultiplier: 1.10,
                                        applyWeekendOnFri: true,
                                        applyWeekendOnSat: true,
                                        applyWeekendOnSun: false,
                                        commissionRateBooking: 15,
                                        pricingModelType: 'dynamic',
                                        seasonalSurcharges: []
                                      }),
                                      applyWeekendOnSat: val
                                    }
                                  }));
                                  setIsSaved(false);
                                }}
                                className="accent-orange-500 cursor-pointer"
                              />
                              <span>Samedi</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-[10px] select-none font-bold">
                              <input
                                type="checkbox"
                                disabled={selectedBranch !== 'CI-BKE-01'}
                                checked={localSettings.pricingPolicy?.applyWeekendOnSun ?? false}
                                onChange={(e) => {
                                  const val = e.target.checked;
                                  setLocalSettings(prev => ({
                                    ...prev,
                                    pricingPolicy: {
                                      ...(prev.pricingPolicy || {
                                        basePrices: { room: 15000, studio: 25000, apartment: 45000 },
                                        weekendMultiplier: 1.10,
                                        applyWeekendOnFri: true,
                                        applyWeekendOnSat: true,
                                        applyWeekendOnSun: false,
                                        commissionRateBooking: 15,
                                        pricingModelType: 'dynamic',
                                        seasonalSurcharges: []
                                      }),
                                      applyWeekendOnSun: val
                                    }
                                  }));
                                  setIsSaved(false);
                                }}
                                className="accent-orange-500 cursor-pointer"
                              />
                              <span>Dimanche</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Surcharges Saisonnières / Fêtes */}
                    <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl md:col-span-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-extrabold text-[11px] text-slate-800 uppercase block">Grille des Surcharges Saisonnières Spéciales</span>
                          <p className="text-[10px] text-slate-450 leading-tight">Surcharges appliquées automatiquement selon le mois de séjour.</p>
                        </div>
                        <button
                          type="button"
                          disabled={selectedBranch !== 'CI-BKE-01'}
                          onClick={() => {
                            const newSurcharge = {
                              id: 's-' + Date.now(),
                              name: 'Nouvelle Période Spéciale',
                              startMonth: 6,
                              endMonth: 8,
                              percentage: 10,
                              active: true
                            };
                            const currentSurcharges = localSettings.pricingPolicy?.seasonalSurcharges || [];
                            setLocalSettings(prev => ({
                              ...prev,
                              pricingPolicy: {
                                ...(prev.pricingPolicy || {
                                  basePrices: { room: 15000, studio: 25000, apartment: 45000 },
                                  weekendMultiplier: 1.10,
                                  applyWeekendOnFri: true,
                                  applyWeekendOnSat: true,
                                  applyWeekendOnSun: false,
                                  commissionRateBooking: 15,
                                  pricingModelType: 'dynamic',
                                  seasonalSurcharges: []
                                }),
                                seasonalSurcharges: [...currentSurcharges, newSurcharge]
                              }
                            }));
                            setIsSaved(false);
                          }}
                          className="px-2.5 py-1.5 bg-orange-500 text-white font-extrabold text-[9px] uppercase rounded-lg flex items-center gap-1 cursor-pointer hover:bg-orange-600 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Ajouter Période</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(!localSettings.pricingPolicy?.seasonalSurcharges || localSettings.pricingPolicy.seasonalSurcharges.length === 0) ? (
                          <p className="text-[10px] text-slate-400 italic py-2">Aucune surcharge saisonnière configurée.</p>
                        ) : (
                          localSettings.pricingPolicy.seasonalSurcharges.map((s, idx) => (
                            <div key={s.id} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-3 bg-white border border-slate-200 rounded-xl">
                              <div className="flex-1 space-y-1">
                                <label className="text-[9px] text-slate-400 uppercase font-bold block">Nom de l'événement / période</label>
                                <input
                                  type="text"
                                  required
                                  disabled={selectedBranch !== 'CI-BKE-01'}
                                  value={s.name}
                                  onChange={(e) => {
                                    const list = [...localSettings.pricingPolicy!.seasonalSurcharges];
                                    list[idx].name = e.target.value;
                                    setLocalSettings(prev => ({
                                      ...prev,
                                      pricingPolicy: { ...prev.pricingPolicy!, seasonalSurcharges: list }
                                    }));
                                    setIsSaved(false);
                                  }}
                                  className="w-full px-2 py-1 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                                />
                              </div>

                              <div className="w-24 space-y-1">
                                <label className="text-[9px] text-slate-400 uppercase font-bold block">Mois Début</label>
                                <select
                                  disabled={selectedBranch !== 'CI-BKE-01'}
                                  value={s.startMonth}
                                  onChange={(e) => {
                                    const list = [...localSettings.pricingPolicy!.seasonalSurcharges];
                                    list[idx].startMonth = parseInt(e.target.value);
                                    setLocalSettings(prev => ({
                                      ...prev,
                                      pricingPolicy: { ...prev.pricingPolicy!, seasonalSurcharges: list }
                                    }));
                                    setIsSaved(false);
                                  }}
                                  className="w-full px-2 py-1 border border-slate-200 rounded-lg text-xs"
                                >
                                  {[...Array(12)].map((_, i) => (
                                    <option key={i+1} value={i+1}>{new Date(2026, i).toLocaleString('fr-FR', { month: 'long' })}</option>
                                  ))}
                                </select>
                              </div>

                              <div className="w-24 space-y-1">
                                <label className="text-[9px] text-slate-400 uppercase font-bold block">Mois Fin</label>
                                <select
                                  disabled={selectedBranch !== 'CI-BKE-01'}
                                  value={s.endMonth}
                                  onChange={(e) => {
                                    const list = [...localSettings.pricingPolicy!.seasonalSurcharges];
                                    list[idx].endMonth = parseInt(e.target.value);
                                    setLocalSettings(prev => ({
                                      ...prev,
                                      pricingPolicy: { ...prev.pricingPolicy!, seasonalSurcharges: list }
                                    }));
                                    setIsSaved(false);
                                  }}
                                  className="w-full px-2 py-1 border border-slate-200 rounded-lg text-xs"
                                >
                                  {[...Array(12)].map((_, i) => (
                                    <option key={i+1} value={i+1}>{new Date(2026, i).toLocaleString('fr-FR', { month: 'long' })}</option>
                                  ))}
                                </select>
                              </div>

                              <div className="w-24 space-y-1">
                                <label className="text-[9px] text-slate-400 uppercase font-bold block">Surcharge (%)</label>
                                <input
                                  type="number"
                                  required
                                  min="0"
                                  max="100"
                                  disabled={selectedBranch !== 'CI-BKE-01'}
                                  value={s.percentage}
                                  onChange={(e) => {
                                    const list = [...localSettings.pricingPolicy!.seasonalSurcharges];
                                    list[idx].percentage = parseInt(e.target.value) || 0;
                                    setLocalSettings(prev => ({
                                      ...prev,
                                      pricingPolicy: { ...prev.pricingPolicy!, seasonalSurcharges: list }
                                    }));
                                    setIsSaved(false);
                                  }}
                                  className="w-full px-2 py-1 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                                />
                              </div>

                              <div className="flex items-center gap-3 pt-4 shrink-0 justify-end">
                                <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold select-none">
                                  <input
                                    type="checkbox"
                                    disabled={selectedBranch !== 'CI-BKE-01'}
                                    checked={s.active}
                                    onChange={(e) => {
                                      const list = [...localSettings.pricingPolicy!.seasonalSurcharges];
                                      list[idx].active = e.target.checked;
                                      setLocalSettings(prev => ({
                                        ...prev,
                                        pricingPolicy: { ...prev.pricingPolicy!, seasonalSurcharges: list }
                                      }));
                                      setIsSaved(false);
                                    }}
                                    className="accent-orange-500 cursor-pointer"
                                  />
                                  <span>Actif</span>
                                </label>

                                <button
                                  type="button"
                                  disabled={selectedBranch !== 'CI-BKE-01'}
                                  onClick={() => {
                                    const list = localSettings.pricingPolicy!.seasonalSurcharges.filter(item => item.id !== s.id);
                                    setLocalSettings(prev => ({
                                      ...prev,
                                      pricingPolicy: { ...prev.pricingPolicy!, seasonalSurcharges: list }
                                    }));
                                    setIsSaved(false);
                                  }}
                                  className="p-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                                  title="Supprimer cette saison"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* SECTION 5: STYLE & DESIGN */}
              {activeSection === 'design' && (
                <div className="space-y-6">
                  <div className="bg-orange-50/40 border border-orange-100 p-4 rounded-2xl text-xs text-slate-600 leading-relaxed mb-4 flex items-start gap-3">
                    <Palette className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-slate-800 uppercase block mb-1">Ambiance Interactive Directe</span>
                      Changer de design applique instantanément la nouvelle feuille de style à l'ensemble du progiciel Brunch Bouaké (PMS, caisse POS, cuisine, stocks, rapports financiers). Les couleurs, typographies, espacements et bordures s'adaptent dynamiquement.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Theme 1: Savannah */}
                    <button
                      type="button"
                      onClick={() => onUpdateTheme && onUpdateTheme('savannah')}
                      className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between h-44 cursor-pointer hover:shadow-md ${
                        appTheme === 'savannah'
                          ? 'border-orange-500 bg-orange-50/35 ring-1 ring-orange-500'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🍊</span>
                          <span className="font-extrabold text-slate-900 text-sm">Savane d'Ivoire</span>
                          {appTheme === 'savannah' && (
                            <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 font-bold rounded text-[8px] uppercase tracking-wider">Actif</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-normal">
                          L'ambiance chaleureuse d'origine. Allie des tons crème et sable avec des contrastes d'ambre et d'orange ivoirien. Lumineux, accueillant et professionnel.
                        </p>
                      </div>
                      <div className="flex gap-1.5 mt-2">
                        <span className="w-4 h-4 rounded-full bg-orange-500 border border-white shadow-xs"></span>
                        <span className="w-4 h-4 rounded-full bg-slate-50 border border-white shadow-xs"></span>
                        <span className="w-4 h-4 rounded-full bg-slate-900 border border-white shadow-xs"></span>
                      </div>
                    </button>

                    {/* Theme 2: Lagoon */}
                    <button
                      type="button"
                      onClick={() => onUpdateTheme && onUpdateTheme('lagoon')}
                      className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between h-44 cursor-pointer hover:shadow-md ${
                        appTheme === 'lagoon'
                          ? 'border-cyan-500 bg-cyan-950/20 ring-1 ring-cyan-500'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">💎</span>
                          <span className="font-extrabold text-slate-900 text-sm">Bleu Lagune (Nuit)</span>
                          {appTheme === 'lagoon' && (
                            <span className="px-1.5 py-0.5 bg-cyan-950 text-cyan-400 font-bold rounded text-[8px] uppercase tracking-wider">Actif</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-normal">
                          Un mode sombre immersif et reposant pour les yeux, inspiré de la lagune ébrié d'Abidjan. Idéal pour les exploitations nocturnes au maquis ou à la réception hôtelière.
                        </p>
                      </div>
                      <div className="flex gap-1.5 mt-2">
                        <span className="w-4 h-4 rounded-full bg-cyan-500 border border-white shadow-xs"></span>
                        <span className="w-4 h-4 rounded-full bg-[#0b1120] border border-white shadow-xs"></span>
                        <span className="w-4 h-4 rounded-full bg-[#121b2e] border border-white shadow-xs"></span>
                      </div>
                    </button>

                    {/* Theme 3: Forest */}
                    <button
                      type="button"
                      onClick={() => onUpdateTheme && onUpdateTheme('forest')}
                      className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between h-44 cursor-pointer hover:shadow-md ${
                        appTheme === 'forest'
                          ? 'border-emerald-500 bg-emerald-50/35 ring-1 ring-emerald-500'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🌿</span>
                          <span className="font-extrabold text-slate-900 text-sm">Forêt Sacrée</span>
                          {appTheme === 'forest' && (
                            <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded text-[8px] uppercase tracking-wider">Actif</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-normal">
                          Un design organique, prestigieux et naturel inspiré des forêts sacrées de Côte d'Ivoire. Vert émeraude profond marié à de subtiles touches or et terre cuite.
                        </p>
                      </div>
                      <div className="flex gap-1.5 mt-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-700 border border-white shadow-xs"></span>
                        <span className="w-4 h-4 rounded-full bg-amber-500 border border-white shadow-xs"></span>
                        <span className="w-4 h-4 rounded-full bg-[#f4f6f0] border border-white shadow-xs"></span>
                      </div>
                    </button>

                    {/* Theme 4: Swiss */}
                    <button
                      type="button"
                      onClick={() => onUpdateTheme && onUpdateTheme('swiss')}
                      className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between h-44 cursor-pointer hover:shadow-md ${
                        appTheme === 'swiss'
                          ? 'border-black bg-neutral-100 ring-2 ring-black'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🇨🇭</span>
                          <span className="font-extrabold text-slate-900 text-sm">Helvétique Stark</span>
                          {appTheme === 'swiss' && (
                            <span className="px-1.5 py-0.5 bg-black text-white font-bold rounded text-[8px] uppercase tracking-wider">Actif</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-normal">
                          Inspiré du modernisme suisse classique. Un style brut ultra-contrasté à base de lignes noires nettes, de typographie JetBrains Mono brute et d'accents rouge vif.
                        </p>
                      </div>
                      <div className="flex gap-1.5 mt-2">
                        <span className="w-4 h-4 rounded-full bg-black border border-white shadow-xs"></span>
                        <span className="w-4 h-4 rounded-full bg-red-600 border border-white shadow-xs"></span>
                        <span className="w-4 h-4 rounded-full bg-white border border-black shadow-xs"></span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Save Buttons Footer Row */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-3 justify-between items-center shrink-0">
              <button
                type="button"
                onClick={handleRestoreDefaults}
                className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restaurer Valeurs Usine</span>
              </button>

              <div className="flex gap-2 w-full sm:w-auto">
                {isSaved && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-lg text-[10px] font-extrabold animate-fade-in uppercase">
                    <Check className="w-3.5 h-3.5" />
                    <span>Sauvegarde Effectuée !</span>
                  </span>
                )}

                <button
                  type="submit"
                  disabled={selectedBranch !== 'CI-BKE-01'}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-md flex items-center justify-center gap-2 transition-all ${
                    selectedBranch === 'CI-BKE-01'
                      ? 'bg-orange-500 hover:bg-orange-600'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer la Configuration</span>
                </button>
              </div>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
}
