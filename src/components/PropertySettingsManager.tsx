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
  Info
} from 'lucide-react';
import { PropertySettings } from '../types';
import { DEFAULT_PROPERTY_SETTINGS } from '../data';

interface PropertySettingsProps {
  settings: PropertySettings;
  onUpdateSettings: (updated: PropertySettings) => void;
}

type SettingsSection = 'general' | 'pms' | 'finance' | 'system';

export default function PropertySettingsManager({ settings, onUpdateSettings }: PropertySettingsProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const [localSettings, setLocalSettings] = useState<PropertySettings>({ ...settings });
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
            onClick={() => setActiveSection('system')}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all w-full text-left shrink-0 lg:shrink ${
              activeSection === 'system'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Sliders className="w-4 h-4 text-orange-500" />
            <span>4. Paramètres Système</span>
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
                  {activeSection === 'system' && 'Configuration Technique & Notifications'}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activeSection === 'general' && 'Configurez le nom commercial, les coordonnées et les identifiants fiscaux imprimés sur les factures.'}
                  {activeSection === 'pms' && 'Régulez les heures de check-in / out et déterminez le format légal des folios et les tâches de ménage.'}
                  {activeSection === 'finance' && 'Saisissez le taux de TVA en vigueur en Côte d\'Ivoire (UEMOA), la taxe de séjour et les portefeuilles Mobile Money.'}
                  {activeSection === 'system' && 'Ajustez les heures d\'activité du maquis restaurant et paramétrez les alertes administratives de service.'}
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

                    <div className="space-y-1 md:col-span-2">
                      <label className="block text-slate-600 font-bold">Catégories d'Articles d'Exploitation du Maquis POS</label>
                      <div className="flex flex-wrap gap-2 py-1">
                        <span className="px-3 py-1 bg-orange-100 text-orange-800 font-extrabold rounded-lg">Plat chaud (Braises, Kédjénous)</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 font-extrabold rounded-lg">Boissons (Bock, Sucrés)</span>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 font-extrabold rounded-lg">Accompagnements (Alloco, Attiéké)</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 font-extrabold rounded-lg">Desserts glacés</span>
                      </div>
                    </div>
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
