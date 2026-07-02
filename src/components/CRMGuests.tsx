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
  BookOpen
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: DETAIL PROFILE VIEW & EDIT PREFERENCES */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs h-fit space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <BookOpen className="w-5 h-5 text-orange-500" />
          <h4 className="font-bold text-slate-900 text-sm">Fiche Préférences Client</h4>
        </div>

        {selectedGuest ? (
          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">{selectedGuest.name}</h3>
              <p className="text-slate-500 font-medium">Nationalité : {selectedGuest.nationality || 'Ivoirienne'}</p>
              <p className="text-slate-400 font-mono text-[10px]">CNI / Passeport : {selectedGuest.idNumber || 'Non renseigné'}</p>
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
                className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-xs transition-colors"
              >
                Sauvegarder les préférences
              </button>
            </div>
          </div>
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
