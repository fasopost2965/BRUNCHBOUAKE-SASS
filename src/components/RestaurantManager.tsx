import React, { useState, useMemo } from 'react';
import { 
  Utensils, 
  Wine, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Info, 
  Flame, 
  Droplet, 
  Coffee, 
  Layers, 
  DollarSign, 
  Store, 
  Grid, 
  List, 
  Save, 
  RotateCcw,
  Sliders,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { MenuItem, StockItem, UserAccount } from '../types';
import { validateMenuItem } from '../utils/validation';

interface RestaurantManagerProps {
  menu: MenuItem[];
  onAddMenuItem: (item: MenuItem) => void;
  onUpdateMenuItem: (itemId: string, updated: Partial<MenuItem>) => void;
  onDeleteMenuItem: (itemId: string) => void;
  stockItems: StockItem[];
  currentUser: UserAccount | null;
}

export default function RestaurantManager({
  menu,
  onAddMenuItem,
  onUpdateMenuItem,
  onDeleteMenuItem,
  stockItems,
  currentUser
}: RestaurantManagerProps) {
  // Config state: Restaurant vs Maquis
  const [establishmentMode, setEstablishmentMode] = useState<'restaurant' | 'maquis'>(() => {
    const saved = localStorage.getItem('bb_establishment_mode');
    return (saved as 'restaurant' | 'maquis') || 'maquis'; // Default to Maquis Bouaké style!
  });

  const handleModeToggle = (mode: 'restaurant' | 'maquis') => {
    setEstablishmentMode(mode);
    localStorage.setItem('bb_establishment_mode', mode);
  };

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal / Form state for Adding/Editing Item
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<'plat' | 'boisson' | 'accompagnement' | 'dessert'>('plat');
  const [formPrice, setFormPrice] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formAvailable, setFormAvailable] = useState(true);
  const [formIsMaquisOnly, setFormIsMaquisOnly] = useState(false);
  const [formIsRestaurantOnly, setFormIsRestaurantOnly] = useState(false);
  const [formLinkedStockId, setFormLinkedStockId] = useState('');

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Handle Edit click
  const handleEditClick = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormPrice(item.price.toString());
    setFormDescription(item.description || '');
    setFormAvailable(item.available);
    setFormIsMaquisOnly(!!item.isMaquisOnly);
    setFormIsRestaurantOnly(!!item.isRestaurantOnly);
    setFormLinkedStockId(item.linkedStockItemId || '');
    setFormError('');
    setFormSuccess('');
    setIsFormOpen(true);
  };

  // Handle Open Create Form
  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormName('');
    setFormCategory(establishmentMode === 'maquis' ? 'boisson' : 'plat');
    setFormPrice('');
    setFormDescription('');
    setFormAvailable(true);
    setFormIsMaquisOnly(establishmentMode === 'maquis');
    setFormIsRestaurantOnly(false);
    setFormLinkedStockId('');
    setFormError('');
    setFormSuccess('');
    setIsFormOpen(true);
  };

  // Form Submit handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formName.trim()) {
      setFormError("Le nom du menu/boisson est requis.");
      return;
    }

    const priceNum = parseFloat(formPrice);
    
    // Zod runtime validation
    const validation = validateMenuItem({
      name: formName.trim(),
      category: formCategory,
      price: priceNum,
      available: formAvailable,
      description: formDescription.trim() || undefined
    });

    if (!validation.success) {
      setFormError(validation.message || "Données du menu de restaurant invalides.");
      return;
    }

    const itemData: any = {
      name: formName.trim(),
      category: formCategory,
      price: priceNum,
      available: formAvailable,
      description: formDescription.trim() || undefined,
      isMaquisOnly: formIsMaquisOnly,
      isRestaurantOnly: formIsRestaurantOnly,
      linkedStockItemId: formLinkedStockId || undefined
    };

    if (editingItem) {
      onUpdateMenuItem(editingItem.id, itemData);
      setFormSuccess("Menu mis à jour avec succès !");
      setTimeout(() => {
        setIsFormOpen(false);
        setEditingItem(null);
      }, 800);
    } else {
      const newItem: MenuItem = {
        id: 'menu-' + Date.now(),
        ...itemData
      };
      onAddMenuItem(newItem);
      setFormSuccess("Nouveau menu ajouté au catalogue !");
      // Reset form
      setFormName('');
      setFormPrice('');
      setFormDescription('');
      setFormLinkedStockId('');
      setTimeout(() => {
        setIsFormOpen(false);
      }, 800);
    }
  };

  // Delete item
  const handleDeleteClick = (id: string, name: string) => {
    if (confirm(`Voulez-vous vraiment supprimer "${name}" de la carte ?`)) {
      onDeleteMenuItem(id);
    }
  };

  // Filter menu items
  const filteredItems = useMemo(() => {
    return menu.filter(item => {
      // Filter based on Establishment Mode
      if (establishmentMode === 'maquis' && item.isRestaurantOnly) return false;
      if (establishmentMode === 'restaurant' && item.isMaquisOnly) return false;

      // Filter based on Category tab
      if (selectedCategory !== 'all') {
        if (item.category !== selectedCategory) return false;
      }

      // Filter based on Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = (item.description || '').toLowerCase().includes(query);
        return matchesName || matchesDesc;
      }

      return true;
    });
  }, [menu, establishmentMode, selectedCategory, searchQuery]);

  // Demo list auto generator for easy evaluation
  const handleGenerateDefaults = () => {
    const demoItems: MenuItem[] = [
      {
        id: 'demo-plat-1',
        name: 'Braised Tilapia Royal de Kossou',
        category: 'plat',
        price: 8500,
        available: true,
        description: 'Grand poisson tilapia de Kossou mariné aux épices locales et grillé à la braise.',
        isMaquisOnly: false,
        isRestaurantOnly: false
      },
      {
        id: 'demo-boisson-1',
        name: 'Bière Bock Ivoire Étoile (65cl)',
        category: 'boisson',
        price: 1200,
        available: true,
        description: 'La bière nationale par excellence, servie glacée.',
        isMaquisOnly: true,
        isRestaurantOnly: false
      },
      {
        id: 'demo-plat-2',
        name: 'Soupe de Cabri Pimentée',
        category: 'plat',
        price: 5000,
        available: true,
        description: 'Bouillon chaud relevé et traditionnel de viande de chèvre sauvage.',
        isMaquisOnly: true,
        isRestaurantOnly: false
      },
      {
        id: 'demo-boisson-2',
        name: 'Soda Beaufort Malt Sans Alcool',
        category: 'boisson',
        price: 1000,
        available: true,
        description: 'Boisson rafraîchissante maltée sans alcool.',
        isMaquisOnly: false,
        isRestaurantOnly: false
      },
      {
        id: 'demo-dessert-1',
        name: 'Dêguê de Bouaké Onctueux',
        category: 'dessert',
        price: 1500,
        available: true,
        description: 'Couscous de mil mélangé à du yaourt artisanal doux, parfumé à la vanille.',
        isMaquisOnly: false,
        isRestaurantOnly: false
      }
    ];

    demoItems.forEach(item => {
      if (!menu.some(m => m.name.toLowerCase() === item.name.toLowerCase())) {
        onAddMenuItem(item);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Upper header section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
              <Utensils className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Configuration Resto & Maquis</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Gérez la carte de votre restaurant ou de votre maquis. Personnalisez les plats, configurez les boissons et liez-les aux stocks de l'hôtel.
          </p>
        </div>

        {/* MODE SELECTOR (RECONCILES Restaurant vs Maquis) */}
        <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 self-start md:self-auto border border-slate-200/50">
          <button
            onClick={() => handleModeToggle('restaurant')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              establishmentMode === 'restaurant'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Utensils className="w-4 h-4" />
            Mode Restaurant
          </button>
          <button
            onClick={() => handleModeToggle('maquis')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              establishmentMode === 'maquis'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/10'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Wine className="w-4 h-4 animate-bounce" />
            Mode Maquis 🇨🇮
          </button>
        </div>
      </div>

      {/* Control panel and filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 min-w-[240px] md:flex-initial">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un plat, une boisson..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl focus:border-orange-500 focus:outline-none text-xs font-medium text-slate-700 placeholder-slate-400 shadow-xs"
            />
          </div>

          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/40">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setSelectedCategory('plat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                selectedCategory === 'plat' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Utensils className="w-3 h-3 text-orange-500" />
              Plats Locaux
            </button>
            <button
              onClick={() => setSelectedCategory('boisson')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                selectedCategory === 'boisson' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Wine className="w-3 h-3 text-amber-500" />
              Boissons & Bières
            </button>
            <button
              onClick={() => setSelectedCategory('accompagnement')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === 'accompagnement' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Extras / Alloco
            </button>
            <button
              onClick={() => setSelectedCategory('dessert')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === 'dessert' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Desserts
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          <button
            onClick={handleGenerateDefaults}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition-all flex items-center gap-2 border border-slate-200/60 cursor-pointer"
            title="Générer des plats et boissons typiques de Côte d'Ivoire"
          >
            <Sparkles className="w-4 h-4 text-orange-500" />
            Générer Menus Démo
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-orange-500/10 hover:shadow-orange-500/25 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {establishmentMode === 'maquis' ? 'Ajouter Plat ou Boisson' : 'Ajouter au Menu'}
          </button>
        </div>
      </div>

      {/* Main Grid display of Menu */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Utensils className="w-8 h-8 opacity-40" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-sm font-bold text-slate-950">Aucun menu disponible</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Aucun plat ou boisson ne correspond à vos filtres de recherche pour le mode <strong className="text-orange-500 capitalize">{establishmentMode}</strong>. Cliquez sur "Générer Menus Démo" pour un remplissage instantané.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => {
            // Find if item has linked stock
            const linkedStock = stockItems.find(s => s.id === item.linkedStockItemId);
            
            return (
              <div 
                key={item.id} 
                className="bg-white border border-slate-200 rounded-3xl p-5 hover:shadow-lg hover:border-orange-500/30 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Available Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    item.available 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-rose-100 text-rose-700'
                  }`}>
                    {item.available ? 'En Stock' : 'Rupture'}
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Category icon indicator */}
                  <div className="flex items-center gap-2">
                    <span className={`p-1.5 rounded-xl ${
                      item.category === 'boisson' 
                        ? 'bg-amber-100 text-amber-600' 
                        : item.category === 'plat' 
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.category === 'boisson' ? <Wine className="w-3.5 h-3.5" /> : <Utensils className="w-3.5 h-3.5" />}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                      {item.category === 'plat' ? 'Plat Local' : item.category === 'boisson' ? 'Boisson' : item.category}
                    </span>

                    {/* Tags for special mode indicators */}
                    {item.isMaquisOnly && (
                      <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-600 rounded text-[8px] font-black uppercase">Maquis 🇨🇮</span>
                    )}
                    {item.isRestaurantOnly && (
                      <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-600 rounded text-[8px] font-black uppercase">Resto</span>
                    )}
                  </div>

                  {/* Name and Description */}
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-orange-600 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 h-8">
                      {item.description || "Aucune description fournie pour ce menu de l'établissement."}
                    </p>
                  </div>
                </div>

                {/* Bottom specs and actions */}
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3.5">
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Prix de Vente</span>
                      <span className="font-black text-slate-950 text-sm font-mono">
                        {item.price.toLocaleString()} <span className="text-[10px] text-slate-500 font-bold">FCFA</span>
                      </span>
                    </div>

                    {/* Stock status indicator */}
                    {linkedStock ? (
                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Stock Réel</span>
                        <span className={`font-mono font-bold text-xs ${
                          linkedStock.quantity <= linkedStock.minQuantity 
                            ? 'text-rose-600' 
                            : 'text-emerald-600'
                        }`}>
                          {linkedStock.quantity} {linkedStock.unit}
                        </span>
                      </div>
                    ) : (
                      <div className="text-right">
                        <span className="text-[8px] text-slate-400 font-bold uppercase block italic">Liaison Stock</span>
                        <span className="text-[10px] text-slate-400 italic font-medium">Non lié</span>
                      </div>
                    )}
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-xl text-[10px] transition-all flex items-center justify-center gap-1.5 border border-slate-200/50 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteClick(item.id, item.name)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 rounded-xl transition-colors border border-rose-200/30 cursor-pointer"
                      title="Supprimer du menu"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATION & EDITION DRAWER MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-up">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900 text-base">
                  {editingItem ? 'Modifier l\'élément' : 'Ajouter au catalogue'}
                </h3>
                <p className="text-[11px] text-slate-500">Remplissez les informations du menu de restauration/boissons</p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 rotate-45" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
              
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl flex items-start gap-2.5 font-bold leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl flex items-start gap-2.5 font-bold leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 animate-pulse" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* Name */}
                <div className="col-span-2 space-y-1">
                  <label className="block text-slate-500 font-bold uppercase tracking-wider text-[10px]">Nom de l'élément *</label>
                  <input
                    type="text"
                    required
                    placeholder={formCategory === 'boisson' ? "Ex: Bière Beaufort Glacée 65cl" : "Ex: Kedjenou de Poulet local"}
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-slate-800 font-medium"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="block text-slate-500 font-bold uppercase tracking-wider text-[10px]">Catégorie</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-slate-800 font-medium"
                  >
                    <option value="plat">Plat / Cuisine</option>
                    <option value="boisson">Boisson / Canette / Bière</option>
                    <option value="accompagnement">Accompagnement / Extras</option>
                    <option value="dessert">Dessert / Douceur</option>
                  </select>
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <label className="block text-slate-500 font-bold uppercase tracking-wider text-[10px]">Prix de vente (FCFA) *</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={0}
                      placeholder="Ex: 5500"
                      value={formPrice}
                      onChange={e => setFormPrice(e.target.value)}
                      className="w-full pl-3 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-slate-800 font-mono font-bold"
                    />
                    <span className="absolute right-3.5 top-3 text-[10px] text-slate-400 font-bold uppercase">XOF</span>
                  </div>
                </div>

                {/* Description */}
                <div className="col-span-2 space-y-1">
                  <label className="block text-slate-500 font-bold uppercase tracking-wider text-[10px]">Description & Ingrédients</label>
                  <textarea
                    rows={2}
                    placeholder="Détaillez la composition du plat ou la contenance de la bouteille..."
                    value={formDescription}
                    onChange={e => setFormDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-slate-800 font-medium placeholder-slate-400 resize-none"
                  />
                </div>

                {/* Linked Stock Item (Dynamic reconciliation) */}
                <div className="col-span-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-slate-500 font-bold uppercase tracking-wider text-[10px]">Lier à un article de Stock (Optionnel)</label>
                    <span className="text-[9px] text-orange-500 font-bold italic">Auto-Déduction lors de la vente</span>
                  </div>
                  <select
                    value={formLinkedStockId}
                    onChange={e => setFormLinkedStockId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-slate-800 font-medium"
                  >
                    <option value="">-- Ne pas lier au stock (Ration libre) --</option>
                    {stockItems.map(stock => (
                      <option key={stock.id} value={stock.id}>
                        {stock.name} ({stock.quantity} {stock.unit} restants, Emplacement: {stock.location || 'Général'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Scoping rules checkboxes */}
                <div className="col-span-2 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsMaquisOnly}
                      onChange={e => {
                        setFormIsMaquisOnly(e.target.checked);
                        if (e.target.checked) setFormIsRestaurantOnly(false);
                      }}
                      className="rounded bg-slate-50 border-slate-200 text-orange-500 focus:ring-orange-500 w-4 h-4"
                    />
                    <span className="text-[11px] text-slate-600 font-bold">Uniquement pour le Maquis 🇨🇮</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsRestaurantOnly}
                      onChange={e => {
                        setFormIsRestaurantOnly(e.target.checked);
                        if (e.target.checked) setFormIsMaquisOnly(false);
                      }}
                      className="rounded bg-slate-50 border-slate-200 text-orange-500 focus:ring-orange-500 w-4 h-4"
                    />
                    <span className="text-[11px] text-slate-600 font-bold">Uniquement Restaurant Chic</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer ml-auto">
                    <input
                      type="checkbox"
                      checked={formAvailable}
                      onChange={e => setFormAvailable(e.target.checked)}
                      className="rounded bg-slate-50 border-slate-200 text-emerald-500 focus:ring-emerald-500 w-4 h-4"
                    />
                    <span className="text-[11px] text-emerald-700 font-bold">Disponible à la vente</span>
                  </label>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {editingItem ? 'Enregistrer les Modifications' : 'Ajouter au Menu'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
