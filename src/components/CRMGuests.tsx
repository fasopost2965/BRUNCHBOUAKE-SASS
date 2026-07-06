import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  UserPlus, 
  Phone, 
  Mail, 
  Globe, 
  FileText, 
  Star, 
  Tag, 
  Award,
  BookOpen,
  Edit,
  X,
  Save,
  MapPin,
  CreditCard
} from 'lucide-react';
import { GuestRecord } from '../types';

interface CRMProps {
  guests: GuestRecord[];
  onUpdateGuests: (updated: GuestRecord[]) => void;
}

export default function CRMGuests({
  guests,
  onUpdateGuests
}: CRMProps) {
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<GuestRecord | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Profile edit fields
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editNationality, setEditNationality] = useState('');
  const [editIdNumber, setEditIdNumber] = useState('');
  const [editAddress, setEditAddress] = useState('');

  // Filtered guests
  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          guest.phone.includes(searchQuery) ||
                          (guest.email && guest.email.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const handleUpdateNotes = (guestId: string) => {
    const updated = guests.map(g => g.id === guestId ? { ...g, notes: editingNotes } : g);
    onUpdateGuests(updated);
    
    // update current selection
    const updatedGuest = updated.find(g => g.id === guestId);
    if (updatedGuest) setSelectedGuest(updatedGuest);
    
    alert("Préférences et notes du client enregistrées avec succès !");
  };

  const handleSelectGuest = (g: GuestRecord) => {
    setSelectedGuest(g);
    setEditingNotes(g.notes || '');
    setEditName(g.name || '');
    setEditPhone(g.phone || '');
    setEditEmail(g.email || '');
    setEditNationality(g.nationality || 'Ivoirienne');
    setEditIdNumber(g.idNumber || '');
    setEditAddress(g.address || '');
    setIsEditingProfile(false);
  };

  const handleEditGuestClick = (e: React.MouseEvent, g: GuestRecord) => {
    e.stopPropagation();
    setSelectedGuest(g);
    setEditingNotes(g.notes || '');
    setEditName(g.name || '');
    setEditPhone(g.phone || '');
    setEditEmail(g.email || '');
    setEditNationality(g.nationality || 'Ivoirienne');
    setEditIdNumber(g.idNumber || '');
    setEditAddress(g.address || '');
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    if (!selectedGuest) return;
    if (!editName.trim()) {
      alert("Erreur: Le nom du client est requis.");
      return;
    }
    if (!editPhone.trim()) {
      alert("Erreur: Le numéro de téléphone est requis.");
      return;
    }

    const updated = guests.map(g => {
      if (g.id === selectedGuest.id) {
        return {
          ...g,
          name: editName.trim(),
          phone: editPhone.trim(),
          email: editEmail.trim(),
          nationality: editNationality.trim(),
          idNumber: editIdNumber.trim(),
          address: editAddress.trim(),
          notes: editingNotes.trim()
        };
      }
      return g;
    });

    onUpdateGuests(updated);
    
    // update local selection
    const updatedGuest = updated.find(g => g.id === selectedGuest.id);
    if (updatedGuest) setSelectedGuest(updatedGuest);
    setIsEditingProfile(false);
    alert("Les informations du client ont été mises à jour avec succès !");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* LEFT COLUMN: GUEST LIST & SEARCH */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Users className="w-5 h-5 text-orange-500" />
                Fichier Clients Brunch Bouaké (CRM)
              </h3>
              <p className="text-xs text-slate-500">Suivi des préférences culinaires, séjours et fidélité</p>
            </div>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, téléphone, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-orange-500 transition-all text-slate-800"
            />
          </div>

          {/* Guests directory table */}
          <div className="border border-slate-150 rounded-2xl overflow-hidden bg-white text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Client</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3 text-center">Séjours</th>
                  <th className="p-3 text-right">Dépenses Cumulées</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredGuests.map((guest) => (
                  <tr 
                    key={guest.id} 
                    onClick={() => handleSelectGuest(guest)}
                    className={`cursor-pointer transition-all hover:bg-slate-50 ${
                      selectedGuest?.id === guest.id ? 'bg-orange-50/25 font-medium' : ''
                    }`}
                  >
                    <td className="p-3">
                      <div className="font-bold text-slate-800 flex items-center gap-1">
                        {guest.name}
                        {guest.visitCount >= 5 && (
                          <Award className="w-3.5 h-3.5 text-orange-600" title="Client VIP Fidèle" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">ID: {guest.id} | {guest.nationality || 'Ivoirienne'}</span>
                    </td>
                    <td className="p-3 space-y-0.5 text-slate-600">
                      <div className="font-mono text-[10px]">{guest.phone}</div>
                      <div className="text-[10px] text-slate-400">{guest.email || 'Pas d\'email'}</div>
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-slate-800">
                      {guest.visitCount}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900 text-sm">
                      {guest.totalSpent.toLocaleString('fr-FR')} F
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={(e) => handleEditGuestClick(e, guest)}
                        className="p-1 text-orange-600 hover:bg-orange-50 rounded-lg transition-all flex items-center justify-center gap-1 mx-auto"
                        title="Modifier les coordonnées et préférences"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold">Modifier</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: DETAIL PROFILE VIEW & EDIT PREFERENCES */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs h-fit space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-orange-500" />
            <h4 className="font-bold text-slate-900 text-sm">Fiche Préférences Client</h4>
          </div>
          {selectedGuest && !isEditingProfile && (
            <button
              type="button"
              onClick={() => setIsEditingProfile(true)}
              className="flex items-center gap-1 px-2.5 py-1 bg-orange-100 hover:bg-orange-200 text-orange-700 font-extrabold rounded-lg text-[10px] transition-all cursor-pointer shadow-2xs"
              title="Modifier les informations de ce client"
            >
              <Edit className="w-3 h-3" />
              <span>Modifier</span>
            </button>
          )}
        </div>

        {selectedGuest ? (
          isEditingProfile ? (
            <div className="space-y-4 text-xs animate-fade-in">
              <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-100/50 space-y-0.5">
                <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-orange-700">Mode Édition</span>
                <p className="text-[10px] text-slate-500">Mettez à jour les informations enregistrées dans le fichier CRM</p>
              </div>

              <div className="space-y-3 text-left">
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Nom complet du client *</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none font-bold text-slate-800"
                    placeholder="Ex: Konan Koffi Serge"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Téléphone de contact *</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none font-mono font-bold text-slate-800"
                    placeholder="Ex: +225 07 48 29 10 11"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Adresse E-mail</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none font-mono text-slate-700"
                    placeholder="Ex: serge.konan@gmail.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Nationalité</label>
                    <input
                      type="text"
                      value={editNationality}
                      onChange={(e) => setEditNationality(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-slate-700"
                      placeholder="Ivoirienne"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">N° CNI / Passeport</label>
                    <input
                      type="text"
                      value={editIdNumber}
                      onChange={(e) => setEditIdNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none font-mono text-slate-700"
                      placeholder="Ex: C01482910"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Adresse de résidence</label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-slate-700"
                    placeholder="Ex: Abidjan, Cocody"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Notes Internes & Demandes Récurrentes</label>
                  <textarea
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    placeholder="Ex: Préfère chambre calme, piment à part pour le Kedjenou..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 h-20 text-slate-700"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="w-1/2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer text-center transition-all"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="w-1/2 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1 transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Enregistrer</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs animate-fade-in text-left">
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-800">{selectedGuest.name}</h3>
                <p className="text-slate-500 font-medium flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-400 font-medium" />
                  <span>Nationalité : {selectedGuest.nationality || 'Ivoirienne'}</span>
                </p>
                <p className="text-slate-400 font-mono text-[10px] flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  <span>CNI / Passeport : {selectedGuest.idNumber || 'Non renseigné'}</span>
                </p>
                {selectedGuest.address && (
                  <p className="text-slate-400 font-mono text-[10px] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Adresse : {selectedGuest.address}</span>
                  </p>
                )}
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Visites</span>
                  <div className="text-lg font-bold font-mono text-orange-950 mt-1">{selectedGuest.visitCount} fois</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Total Injecté</span>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-1">{selectedGuest.totalSpent.toLocaleString('fr-FR')} F</div>
                </div>
              </div>

              {/* Loyalty tier badge */}
              <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 flex items-center gap-2 text-orange-900">
                <Star className="w-5 h-5 fill-orange-500 text-orange-500 shrink-0" />
                <div>
                  <span className="font-bold">Statut : {selectedGuest.visitCount >= 5 ? 'Client Platine' : 'Voyageur Régulier'}</span>
                  <p className="text-[10px] text-orange-700">Donne droit à 10% sur les brunchs du maquis le dimanche.</p>
                </div>
              </div>

              {/* Editable guest preferences block */}
              <div className="space-y-2">
                <label className="block text-slate-600 font-bold">Notes Internes & Demandes Récurrentes :</label>
                <textarea
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Ex: Préfère chambre calme au 1er, piment à part pour le Kedjenou, check-out à 14h..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 h-24 text-slate-700 font-medium"
                />
                <button
                  type="button"
                  onClick={() => handleUpdateNotes(selectedGuest.id)}
                  className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Sauvegarder les préférences
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="text-center py-20 text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <Users className="w-10 h-10 text-slate-300 stroke-1" />
            <span>Aucun client sélectionné.</span>
            <span>Cliquez sur un client dans le fichier de gauche pour charger sa fiche de préférences.</span>
          </div>
        )}
      </div>

    </div>
  );
}
