import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock, 
  User, 
  RotateCcw, 
  Info, 
  Briefcase, 
  Package, 
  FileText, 
  DollarSign, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { StockItem, StockMovement, UserAccount } from '../types';

interface StockManagerProps {
  stockItems: StockItem[];
  onAddStockItem: (item: StockItem) => void;
  onUpdateStockItem: (itemId: string, updated: Partial<StockItem>) => void;
  onDeleteStockItem: (itemId: string) => void;
  stockMovements: StockMovement[];
  onAddStockMovement: (mov: StockMovement) => void;
  currentUser: UserAccount | null;
}

export default function StockManager({
  stockItems,
  onAddStockItem,
  onUpdateStockItem,
  onDeleteStockItem,
  stockMovements,
  onAddStockMovement,
  currentUser
}: StockManagerProps) {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'low' | 'out'>('all');

  // Form states for creating/editing stock items
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState<'boisson' | 'nourriture' | 'ingredient' | 'autre'>('ingredient');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemUnit, setItemUnit] = useState<'bouteille' | 'casier' | 'kg' | 'portion' | 'litre' | 'unité' | 'sac'>('unité');
  const [itemMinQty, setItemMinQty] = useState('');
  const [itemPricePurchase, setItemPricePurchase] = useState('');
  const [itemLocation, setItemLocation] = useState('');

  const [itemError, setItemError] = useState('');
  const [itemSuccess, setItemSuccess] = useState('');

  // Form states for register movement
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [selectedStockItem, setSelectedStockItem] = useState<StockItem | null>(null);
  const [movementType, setMovementType] = useState<'in' | 'out' | 'loss' | 'inventory'>('in');
  const [movementQty, setMovementQty] = useState('');
  const [movementReason, setMovementReason] = useState('');
  const [movementError, setMovementError] = useState('');
  const [movementSuccess, setMovementSuccess] = useState('');

  // Tab state: Stock items vs Movements History
  const [activeSubTab, setActiveSubTab] = useState<'inventory' | 'quick_update' | 'history'>('inventory');

  // Quick inventory update state
  const [quickQuantities, setQuickQuantities] = useState<Record<string, string>>({});
  const [quickReasons, setQuickReasons] = useState<Record<string, string>>({});
  const [quickOperator, setQuickOperator] = useState(currentUser?.name || "Administrateur");
  const [quickGlobalReason, setQuickGlobalReason] = useState("Inventaire physique quotidien");
  const [quickSuccessMsg, setQuickSuccessMsg] = useState('');
  const [quickErrorMsg, setQuickErrorMsg] = useState('');

  // Initialize quick quantities if they are empty
  React.useEffect(() => {
    setQuickQuantities(prev => {
      const next = { ...prev };
      stockItems.forEach(item => {
        if (next[item.id] === undefined) {
          next[item.id] = item.quantity.toString();
        }
      });
      return next;
    });
  }, [stockItems]);

  // Open item modal for creation
  const handleOpenCreateItem = () => {
    setEditingItem(null);
    setItemName('');
    setItemCategory('boisson');
    setItemQuantity('0');
    setItemUnit('bouteille');
    setItemMinQty('10');
    setItemPricePurchase('');
    setItemLocation('');
    setItemError('');
    setItemSuccess('');
    setIsItemModalOpen(true);
  };

  // Open item modal for editing
  const handleOpenEditItem = (item: StockItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemCategory(item.category);
    setItemQuantity(item.quantity.toString());
    setItemUnit(item.unit);
    setItemMinQty(item.minQuantity.toString());
    setItemPricePurchase(item.pricePurchase.toString());
    setItemLocation(item.location || '');
    setItemError('');
    setItemSuccess('');
    setIsItemModalOpen(true);
  };

  // Submit item create/edit form
  const handleItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setItemError('');
    setItemSuccess('');

    if (!itemName.trim()) {
      setItemError("Le nom de l'article est obligatoire.");
      return;
    }

    const qtyVal = parseFloat(itemQuantity);
    const minQtyVal = parseFloat(itemMinQty);
    const purchaseVal = parseFloat(itemPricePurchase);

    if (isNaN(qtyVal) || qtyVal < 0) {
      setItemError("La quantité doit être un nombre positif ou nul.");
      return;
    }
    if (isNaN(minQtyVal) || minQtyVal < 0) {
      setItemError("Le seuil de sécurité doit être supérieur ou égal à 0.");
      return;
    }
    if (isNaN(purchaseVal) || purchaseVal < 0) {
      setItemError("Le prix d'achat doit être un nombre supérieur ou égal à 0.");
      return;
    }

    const itemData: any = {
      name: itemName.trim(),
      category: itemCategory,
      quantity: qtyVal,
      unit: itemUnit,
      minQuantity: minQtyVal,
      pricePurchase: purchaseVal,
      location: itemLocation.trim() || undefined
    };

    if (editingItem) {
      onUpdateStockItem(editingItem.id, itemData);
      
      // If quantity changed, register a movement
      if (editingItem.quantity !== qtyVal) {
        const delta = Math.abs(qtyVal - editingItem.quantity);
        const type = qtyVal > editingItem.quantity ? 'in' : 'out';
        onAddStockMovement({
          id: 'mov-' + Date.now(),
          stockItemId: editingItem.id,
          itemName: editingItem.name,
          type: type,
          quantity: delta,
          previousQty: editingItem.quantity,
          newQty: qtyVal,
          reason: "Ajustement manuel lors de la modification de la fiche",
          date: new Date().toISOString(),
          operator: currentUser?.name || "Administrateur"
        });
      }

      setItemSuccess("Fiche stock mise à jour avec succès !");
      setTimeout(() => {
        setIsItemModalOpen(false);
        setEditingItem(null);
      }, 800);
    } else {
      const newId = 'stock-' + Date.now();
      const newItem: StockItem = {
        id: newId,
        ...itemData,
        lastRestocked: qtyVal > 0 ? new Date().toISOString() : undefined
      };
      onAddStockItem(newItem);

      // Register initial movement if quantity > 0
      if (qtyVal > 0) {
        onAddStockMovement({
          id: 'mov-' + Date.now(),
          stockItemId: newId,
          itemName: newItem.name,
          type: 'in',
          quantity: qtyVal,
          previousQty: 0,
          newQty: qtyVal,
          reason: "Saisie de stock initial",
          date: new Date().toISOString(),
          operator: currentUser?.name || "Administrateur"
        });
      }

      setItemSuccess("Nouvel article ajouté au stock !");
      setTimeout(() => {
        setIsItemModalOpen(false);
      }, 800);
    }
  };

  // Open movement modal
  const handleOpenMovementModal = (item: StockItem, defaultType: 'in' | 'out' | 'loss' | 'inventory') => {
    setSelectedStockItem(item);
    setMovementType(defaultType);
    setMovementQty('');
    setMovementReason('');
    setMovementError('');
    setMovementSuccess('');
    setIsMovementModalOpen(true);
  };

  // Submit movement form
  const handleMovementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMovementError('');
    setMovementSuccess('');

    if (!selectedStockItem) return;

    const qtyVal = parseFloat(movementQty);
    if (isNaN(qtyVal) || qtyVal <= 0) {
      setMovementError("Veuillez saisir une quantité supérieure à 0.");
      return;
    }

    if (!movementReason.trim()) {
      setMovementError("Veuillez fournir une raison pour ce mouvement.");
      return;
    }

    const prevQty = selectedStockItem.quantity;
    let newQty = prevQty;

    if (movementType === 'in' || movementType === 'inventory' && qtyVal > prevQty) {
      if (movementType === 'in') {
        newQty = prevQty + qtyVal;
      } else {
        newQty = qtyVal; // Inventory set
      }
    } else {
      // subtraction or set lower
      if (movementType === 'out' || movementType === 'loss') {
        if (qtyVal > prevQty) {
          setMovementError("Quantité demandée supérieure au stock disponible.");
          return;
        }
        newQty = prevQty - qtyVal;
      } else {
        // inventory lower
        newQty = qtyVal;
      }
    }

    const finalDelta = Math.abs(newQty - prevQty);

    // Update stock item quantity
    onUpdateStockItem(selectedStockItem.id, {
      quantity: newQty,
      lastRestocked: movementType === 'in' ? new Date().toISOString() : selectedStockItem.lastRestocked
    });

    // Record movement
    onAddStockMovement({
      id: 'mov-' + Date.now(),
      stockItemId: selectedStockItem.id,
      itemName: selectedStockItem.name,
      type: movementType,
      quantity: finalDelta,
      previousQty: prevQty,
      newQty: newQty,
      reason: movementReason.trim(),
      date: new Date().toISOString(),
      operator: currentUser?.name || "Administrateur"
    });

    setMovementSuccess("Mouvement enregistré avec succès !");
    setTimeout(() => {
      setIsMovementModalOpen(false);
      setSelectedStockItem(null);
    }, 800);
  };

  // Delete item
  const handleDeleteItem = (id: string, name: string) => {
    if (confirm(`Voulez-vous vraiment supprimer "${name}" de l'inventaire des stocks ?`)) {
      onDeleteStockItem(id);
    }
  };

  // Save single quick inventory row
  const handleSaveSingleQuickItem = (item: StockItem) => {
    const enteredVal = quickQuantities[item.id];
    if (enteredVal === undefined) return;
    
    const qtyVal = parseFloat(enteredVal);
    if (isNaN(qtyVal) || qtyVal < 0) {
      setQuickErrorMsg(`La quantité physique de "${item.name}" doit être supérieure ou égale à 0.`);
      return;
    }

    const prevQty = item.quantity;
    if (prevQty === qtyVal) {
      setQuickSuccessMsg(`Aucun écart constaté pour "${item.name}".`);
      setTimeout(() => setQuickSuccessMsg(''), 2000);
      return;
    }

    const diff = qtyVal - prevQty;

    // Update stock item quantity
    onUpdateStockItem(item.id, {
      quantity: qtyVal
    });

    // Record movement
    onAddStockMovement({
      id: 'mov-' + Date.now(),
      stockItemId: item.id,
      itemName: item.name,
      type: 'inventory',
      quantity: Math.abs(diff),
      previousQty: prevQty,
      newQty: qtyVal,
      reason: quickReasons[item.id]?.trim() || quickGlobalReason.trim() || "Ajustement d'inventaire rapide",
      date: new Date().toISOString(),
      operator: quickOperator || "Administrateur"
    });

    setQuickSuccessMsg(`Inventaire de "${item.name}" validé avec succès (${diff > 0 ? '+' : ''}${diff} ${item.unit}).`);
    setTimeout(() => setQuickSuccessMsg(''), 3000);
  };

  // Save all changed items in quick inventory
  const handleSaveAllQuickItems = () => {
    setQuickErrorMsg('');
    setQuickSuccessMsg('');

    // Filter items that actually have differences
    const itemsToUpdate = stockItems.filter(item => {
      const enteredVal = quickQuantities[item.id];
      if (enteredVal === undefined) return false;
      const qtyVal = parseFloat(enteredVal);
      return !isNaN(qtyVal) && qtyVal !== item.quantity;
    });

    if (itemsToUpdate.length === 0) {
      setQuickErrorMsg("Aucun écart de stock n'a été détecté par rapport à l'état système.");
      return;
    }

    // Validate all entered values first
    for (const item of itemsToUpdate) {
      const enteredVal = quickQuantities[item.id];
      const qtyVal = parseFloat(enteredVal);
      if (isNaN(qtyVal) || qtyVal < 0) {
        setQuickErrorMsg(`Quantité invalide pour l'article "${item.name}".`);
        return;
      }
    }

    // Process updates
    let updatedCount = 0;
    const operatorName = quickOperator.trim() || currentUser?.name || "Administrateur";
    const globalReasonText = quickGlobalReason.trim() || "Ajustement d'inventaire rapide global";

    itemsToUpdate.forEach((item, index) => {
      const enteredVal = quickQuantities[item.id];
      const qtyVal = parseFloat(enteredVal);
      const prevQty = item.quantity;
      const diff = qtyVal - prevQty;

      // Update quantity
      onUpdateStockItem(item.id, {
        quantity: qtyVal
      });

      // Record movement with staggered IDs to prevent duplicates
      onAddStockMovement({
        id: `mov-quick-${Date.now()}-${index}`,
        stockItemId: item.id,
        itemName: item.name,
        type: 'inventory',
        quantity: Math.abs(diff),
        previousQty: prevQty,
        newQty: qtyVal,
        reason: quickReasons[item.id]?.trim() || globalReasonText,
        date: new Date().toISOString(),
        operator: operatorName
      });

      updatedCount++;
    });

    setQuickSuccessMsg(`Inventaire global validé ! ${updatedCount} article(s) mis à jour avec ajustement des écarts.`);
    setQuickReasons({});
    setTimeout(() => setQuickSuccessMsg(''), 4000);
  };

  // Filter stock items
  const filteredStockItems = useMemo(() => {
    return stockItems.filter(item => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Status filter (low stock, out of stock)
      if (statusFilter === 'low') {
        if (item.quantity > item.minQuantity || item.quantity <= 0) return false;
      } else if (statusFilter === 'out') {
        if (item.quantity > 0) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(query) || 
               (item.location || '').toLowerCase().includes(query);
      }

      return true;
    });
  }, [stockItems, selectedCategory, statusFilter, searchQuery]);

  // Calculations for Metrics Panel
  const metrics = useMemo(() => {
    const totalItems = stockItems.length;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let totalValuation = 0;

    stockItems.forEach(item => {
      totalValuation += item.quantity * item.pricePurchase;
      if (item.quantity <= 0) {
        outOfStockCount++;
      } else if (item.quantity <= item.minQuantity) {
        lowStockCount++;
      }
    });

    return {
      totalItems,
      lowStockCount,
      outOfStockCount,
      totalValuation
    };
  }, [stockItems]);

  // Seed default Cote d'Ivoire maquis & hotel drinks and food supplies
  const handleSeedStock = () => {
    const defaultStocks: StockItem[] = [
      { id: 'st-b-1', name: 'Caisse de Bière Beaufort (12 bout. 65cl)', category: 'boisson', quantity: 24, unit: 'casier', minQuantity: 5, pricePurchase: 14000, location: 'Réserve Cave' },
      { id: 'st-b-2', name: 'Caisse de Bière Bock Ivoire (12 bout. 65cl)', category: 'boisson', quantity: 36, unit: 'casier', minQuantity: 8, pricePurchase: 11000, location: 'Réserve Cave' },
      { id: 'st-b-3', name: 'Eau Minérale Awa (Carton de 12 bouteilles 1.5L)', category: 'boisson', quantity: 4, unit: 'casier', minQuantity: 10, pricePurchase: 4500, location: 'Réserve Bar' },
      { id: 'st-f-1', name: 'Sac de Manioc Frais d\'Ananda (50kg)', category: 'nourriture', quantity: 3, unit: 'sac', minQuantity: 2, pricePurchase: 25000, location: 'Cuisine Stockage' },
      { id: 'st-f-2', name: 'Régime de Bananes Plantains mûres (Gros calibre)', category: 'nourriture', quantity: 12, unit: 'unité', minQuantity: 4, pricePurchase: 4000, location: 'Cuisine Stockage' },
      { id: 'st-i-1', name: 'Huile de Palme raffinée Dinor (Bidon de 20L)', category: 'ingredient', quantity: 2, unit: 'litre', minQuantity: 1, pricePurchase: 23000, location: 'Épicerie' },
      { id: 'st-i-2', name: 'Carton de Poulet importé découpé (10kg)', category: 'nourriture', quantity: 1, unit: 'unité', minQuantity: 3, pricePurchase: 18000, location: 'Chambre Froide' },
      { id: 'st-i-3', name: 'Piment de Table Rouge d\'Alépé (Cagette de 5kg)', category: 'ingredient', quantity: 1, unit: 'kg', minQuantity: 2, pricePurchase: 6000, location: 'Cuisine Légumes' }
    ];

    defaultStocks.forEach(item => {
      if (!stockItems.some(s => s.name.toLowerCase() === item.name.toLowerCase())) {
        onAddStockItem(item);
        // Add movement
        onAddStockMovement({
          id: 'mov-seed-' + Math.random().toString(36).substr(2, 9),
          stockItemId: item.id,
          itemName: item.name,
          type: 'in',
          quantity: item.quantity,
          previousQty: 0,
          newQty: item.quantity,
          reason: "Peuplement initial des réserves de l'établissement",
          date: new Date().toISOString(),
          operator: currentUser?.name || "Administrateur"
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Seeds trigger */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
              <Package className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Gestion des Stocks & Épicerie</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Supervisez les approvisionnements en boissons, ingrédients et matériels. Suivez les mouvements d'entrée/sortie et minimisez les pertes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSeedStock}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition-all flex items-center gap-2 border border-slate-200/60 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-orange-500" />
            Remplir les Stocks Fictifs
          </button>
          <button
            onClick={handleOpenCreateItem}
            className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-orange-500/10 hover:shadow-orange-500/25 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nouvel Article Stock
          </button>
        </div>
      </div>

      {/* METRICS DASHBOARD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-100 border border-slate-200/50 rounded-xl flex items-center justify-center text-slate-600">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Articles Enregistrés</span>
            <span className="text-xl font-black text-slate-900 font-mono">{metrics.totalItems}</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
            metrics.lowStockCount > 0 
              ? 'bg-amber-100 text-amber-600 border-amber-200' 
              : 'bg-emerald-100 text-emerald-600 border-emerald-200'
          }`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Seuils Alerte Minimum</span>
            <span className={`text-xl font-black font-mono ${metrics.lowStockCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {metrics.lowStockCount} <span className="text-[11px] text-slate-400 font-medium">alertes</span>
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
            metrics.outOfStockCount > 0 
              ? 'bg-rose-100 text-rose-600 border-rose-200' 
              : 'bg-emerald-100 text-emerald-600 border-emerald-200'
          }`}>
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Ruptures de Stock</span>
            <span className={`text-xl font-black font-mono ${metrics.outOfStockCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {metrics.outOfStockCount} <span className="text-[11px] text-slate-400 font-medium">vide(s)</span>
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 border border-orange-200/50 rounded-xl flex items-center justify-center text-orange-600">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Valorisation des Stocks</span>
            <span className="text-sm font-black text-slate-900 font-mono">
              {metrics.totalValuation.toLocaleString()} <span className="text-[10px] text-slate-500 font-bold">FCFA</span>
            </span>
          </div>
        </div>
      </div>

      {/* SUB-TABS SELECTOR */}
      <div className="border-b border-slate-200 flex items-center gap-6">
        <button
          onClick={() => setActiveSubTab('inventory')}
          className={`py-3 text-xs font-extrabold tracking-wide uppercase border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'inventory' 
              ? 'border-orange-500 text-orange-600' 
              : 'border-transparent text-slate-400 hover:text-slate-900'
          }`}
        >
          État Réel de l'Inventaire
        </button>
        <button
          onClick={() => setActiveSubTab('quick_update')}
          className={`py-3 text-xs font-extrabold tracking-wide uppercase border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'quick_update' 
              ? 'border-orange-500 text-orange-600' 
              : 'border-transparent text-slate-400 hover:text-slate-900'
          }`}
        >
          ⚡ Saisie Physique (Mise à jour rapide)
        </button>
        <button
          onClick={() => setActiveSubTab('history')}
          className={`py-3 text-xs font-extrabold tracking-wide uppercase border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'history' 
              ? 'border-orange-500 text-orange-600' 
              : 'border-transparent text-slate-400 hover:text-slate-900'
          }`}
        >
          Historique des Mouvements ({stockMovements.length})
        </button>
      </div>

      {/* TAB CONTENT: INVENTORY */}
      {activeSubTab === 'inventory' && (
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 min-w-[200px] md:flex-initial">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, emplacement..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-xs font-medium text-slate-700 shadow-xs"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-xs font-bold text-slate-700 cursor-pointer"
              >
                <option value="all">Toutes Catégories</option>
                <option value="boisson">Boissons / Liquides</option>
                <option value="nourriture">Nourriture / Viandes</option>
                <option value="ingredient">Ingrédients / Épices</option>
                <option value="autre">Matériels / Autre</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-xs font-bold text-slate-700 cursor-pointer"
              >
                <option value="all">Tous Niveaux Stock</option>
                <option value="low">Seuils Critiques</option>
                <option value="out">En Rupture</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-4 px-5">Article de Stock</th>
                    <th className="py-4 px-4">Catégorie</th>
                    <th className="py-4 px-4">Emplacement</th>
                    <th className="py-4 px-4 text-right">Stock Actuel</th>
                    <th className="py-4 px-4 text-right">Seuil Alerte</th>
                    <th className="py-4 px-4 text-right">Prix Achat Estimé</th>
                    <th className="py-4 px-4 text-center">Statut</th>
                    <th className="py-4 px-5 text-right">Mouvements de Caisse</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredStockItems.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-slate-400">
                        Aucun article ne correspond à vos critères de recherche ou de filtre.
                      </td>
                    </tr>
                  ) : (
                    filteredStockItems.map(item => {
                      const isLow = item.quantity > 0 && item.quantity <= item.minQuantity;
                      const isOut = item.quantity <= 0;

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-all">
                          <td className="py-3 px-5 font-extrabold text-slate-900">
                            {item.name}
                          </td>
                          <td className="py-3 px-4">
                            <span className="capitalize px-2 py-0.5 bg-slate-100 rounded text-[10px] text-slate-600 font-bold">
                              {item.category === 'boisson' ? '🥤 Boisson' : item.category === 'nourriture' ? '🥩 Nourriture' : item.category === 'ingredient' ? '🌶️ Ingrédient' : '📦 Autre'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-500 text-[11px]">
                            {item.location || 'Non spécifié'}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-slate-900 font-mono">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="py-3 px-4 text-right text-slate-400 font-mono">
                            {item.minQuantity} {item.unit}
                          </td>
                          <td className="py-3 px-4 text-right text-slate-600 font-mono font-semibold">
                            {item.pricePurchase.toLocaleString()} FCFA
                          </td>
                          <td className="py-3 px-4 text-center">
                            {isOut ? (
                              <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded-full text-[9px] font-black uppercase tracking-wider">Rupture</span>
                            ) : isLow ? (
                              <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-[9px] font-black uppercase tracking-wider animate-pulse">Alerte Seuil</span>
                            ) : (
                              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-wider">Optimal</span>
                            )}
                          </td>
                          <td className="py-3 px-5 text-right flex items-center justify-end gap-1.5">
                            {/* Actions on items */}
                            <button
                              onClick={() => handleOpenMovementModal(item, 'in')}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold rounded-lg text-[9px] uppercase tracking-wide cursor-pointer"
                              title="Approvisionner"
                            >
                              + Entrée
                            </button>
                            <button
                              onClick={() => handleOpenMovementModal(item, 'out')}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold rounded-lg text-[9px] uppercase tracking-wide cursor-pointer"
                              title="Déstocker"
                            >
                              - Sortie
                            </button>
                            <button
                              onClick={() => handleOpenMovementModal(item, 'loss')}
                              className="px-1.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-extrabold rounded-lg text-[9px] uppercase tracking-wide cursor-pointer"
                              title="Déclarer perte"
                            >
                              Perte
                            </button>
                            <button
                              onClick={() => handleOpenEditItem(item)}
                              className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg cursor-pointer"
                              title="Modifier la fiche"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id, item.name)}
                              className="p-1 bg-rose-100/50 hover:bg-rose-100 text-rose-600 rounded-lg cursor-pointer"
                              title="Supprimer la fiche"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: QUICK UPDATE */}
      {activeSubTab === 'quick_update' && (
        <div className="space-y-6 animate-fade-in">
          {/* Instructions Box */}
          <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-4 flex gap-3 text-slate-800 text-xs leading-relaxed">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-extrabold text-amber-900">Saisie Rapide de l'Inventaire Physique Quotidien</p>
              <p className="text-slate-600">
                Saisissez les quantités réellement constatées sur le terrain. Le système calculera automatiquement les écarts (surplus ou pertes) et générera les mouvements de stock de type <span className="font-bold text-slate-900">"Ajustement"</span> pour harmoniser le stock théorique avec la réalité.
              </p>
            </div>
          </div>

          {/* Alert Messages */}
          {quickSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold animate-fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{quickSuccessMsg}</span>
            </div>
          )}

          {quickErrorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-bold animate-fade-in">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>{quickErrorMsg}</span>
            </div>
          )}

          {/* Controls Panel */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Opérateur de contrôle</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={quickOperator}
                  onChange={e => setQuickOperator(e.target.value)}
                  placeholder="Nom de l'opérateur"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-xs font-semibold text-slate-700 shadow-2xs"
                />
              </div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Motif général d'ajustement</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={quickGlobalReason}
                  onChange={e => setQuickGlobalReason(e.target.value)}
                  placeholder="Ex: Inventaire journalier du bar, contrôle hebdo..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-xs font-semibold text-slate-700 shadow-2xs"
                />
              </div>
            </div>

            <div className="flex items-end justify-end">
              <button
                type="button"
                onClick={() => {
                  const initial: Record<string, string> = {};
                  stockItems.forEach(item => {
                    initial[item.id] = item.quantity.toString();
                  });
                  setQuickQuantities(initial);
                  setQuickReasons({});
                  setQuickSuccessMsg("Saisie réinitialisée aux valeurs actuelles du système.");
                  setTimeout(() => setQuickSuccessMsg(''), 3000);
                }}
                className="w-full md:w-auto px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Réinitialiser la grille
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 min-w-[200px] md:flex-initial">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-xs font-medium text-slate-700 shadow-2xs"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-xs font-bold text-slate-700 cursor-pointer shadow-2xs"
              >
                <option value="all">Toutes Catégories</option>
                <option value="boisson">Boissons / Liquides</option>
                <option value="nourriture">Nourriture / Viandes</option>
                <option value="ingredient">Ingrédients / Épices</option>
                <option value="autre">Matériels / Autre</option>
              </select>
            </div>

            <div className="text-[11px] font-bold text-slate-500">
              Affichage de {filteredStockItems.length} article(s) à contrôler
            </div>
          </div>

          {/* Grid/Table of Items for count */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-4 px-5">Article de Stock</th>
                    <th className="py-4 px-4">Emplacement</th>
                    <th className="py-4 px-4 text-center w-36">Stock Système (Théorique)</th>
                    <th className="py-4 px-4 text-center w-52">Stock Physique (Réel)</th>
                    <th className="py-4 px-4 text-center w-32">Écart Constaté</th>
                    <th className="py-4 px-4">Commentaire Spécifique</th>
                    <th className="py-4 px-5 text-center w-28">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredStockItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        Aucun article ne correspond à vos critères de recherche.
                      </td>
                    </tr>
                  ) : (
                    filteredStockItems.map(item => {
                      const currentValStr = quickQuantities[item.id] ?? item.quantity.toString();
                      const currentVal = parseFloat(currentValStr);
                      const difference = isNaN(currentVal) ? 0 : currentVal - item.quantity;
                      
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/40">
                          <td className="py-3.5 px-5">
                            <div className="font-extrabold text-slate-900">{item.name}</div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 capitalize">
                              <span className="px-1.5 py-0.5 bg-slate-100 rounded-sm font-bold">{item.category}</span>
                              <span>•</span>
                              <span>Unité: {item.unit}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                            {item.location || '—'}
                          </td>
                          <td className="py-3.5 px-4 text-center font-bold text-slate-600 bg-slate-50/50">
                            <span className="font-mono text-sm">{item.quantity}</span>{' '}
                            <span className="text-[10px] text-slate-400 font-normal">{item.unit}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  const curr = parseFloat(quickQuantities[item.id] || '0');
                                  if (!isNaN(curr) && curr > 0) {
                                    setQuickQuantities(prev => ({
                                      ...prev,
                                      [item.id]: (curr - 1).toString()
                                    }));
                                  }
                                }}
                                className="w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-lg text-sm flex items-center justify-center cursor-pointer select-none border border-slate-200/50"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min="0"
                                step="any"
                                value={quickQuantities[item.id] ?? ''}
                                onChange={e => {
                                  const val = e.target.value;
                                  setQuickQuantities(prev => ({
                                    ...prev,
                                    [item.id]: val
                                  }));
                                }}
                                className="w-16 text-center py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 animate-none"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const curr = parseFloat(quickQuantities[item.id] || '0');
                                  if (!isNaN(curr)) {
                                    setQuickQuantities(prev => ({
                                      ...prev,
                                      [item.id]: (curr + 1).toString()
                                    }));
                                  }
                                }}
                                className="w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-lg text-sm flex items-center justify-center cursor-pointer select-none border border-slate-200/50"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {difference === 0 ? (
                              <span className="inline-block px-2 py-1 bg-slate-100 text-slate-500 rounded-md font-bold text-[10px]">
                                Conforme (0)
                              </span>
                            ) : difference > 0 ? (
                              <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-800 rounded-md font-black text-[10px] font-mono">
                                +{difference} (Surplus)
                              </span>
                            ) : (
                              <span className="inline-block px-2 py-1 bg-rose-100 text-rose-800 rounded-md font-black text-[10px] font-mono">
                                {difference} (Manquant)
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <input
                              type="text"
                              placeholder="Ex: Bouteille cassée, écart bar..."
                              value={quickReasons[item.id] ?? ''}
                              onChange={e => {
                                const val = e.target.value;
                                setQuickReasons(prev => ({
                                  ...prev,
                                  [item.id]: val
                                }));
                              }}
                              className="w-full px-2 py-1 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600 focus:outline-none focus:border-slate-400"
                            />
                          </td>
                          <td className="py-3.5 px-5 text-center">
                            <button
                              type="button"
                              onClick={() => handleSaveSingleQuickItem(item)}
                              disabled={difference === 0}
                              className={`w-full py-1.5 px-2 rounded-lg text-[10px] font-extrabold uppercase tracking-wide cursor-pointer transition-all ${
                                difference === 0
                                  ? 'bg-slate-50 text-slate-300 border border-slate-100/50 cursor-not-allowed'
                                  : 'bg-orange-500 hover:bg-orange-600 text-white shadow-xs'
                              }`}
                            >
                              Valider
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bulk Action Panel / Summary */}
          {stockItems.some(item => {
            const enteredVal = quickQuantities[item.id];
            return enteredVal !== undefined && parseFloat(enteredVal) !== item.quantity;
          }) && (
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 animate-slide-up">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse" />
                  <h4 className="text-sm font-black tracking-tight">Des écarts d'inventaire physique ont été saisis</h4>
                </div>
                <p className="text-xs text-slate-400">
                  Cliquez sur le bouton ci-contre pour valider d'un seul coup tous les articles modifiés et créer les mouvements de correction.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveAllQuickItems}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  Valider les Écarts de l'Inventaire
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: HISTORY */}
      {activeSubTab === 'history' && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-5">Date</th>
                  <th className="py-4 px-4">Article</th>
                  <th className="py-4 px-4">Mouvement</th>
                  <th className="py-4 px-4 text-right">Quantité</th>
                  <th className="py-4 px-4 text-right">Stock Précédent</th>
                  <th className="py-4 px-4 text-right">Nouveau Stock</th>
                  <th className="py-4 px-4">Raison / Commentaire</th>
                  <th className="py-4 px-5">Opérateur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {stockMovements.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-slate-400">
                      Aucun mouvement n'a été enregistré pour le moment.
                    </td>
                  </tr>
                ) : (
                  [...stockMovements].reverse().map(mov => (
                    <tr key={mov.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-5 font-mono text-slate-400 text-[11px]">
                        {new Date(mov.date).toLocaleDateString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {mov.itemName}
                      </td>
                      <td className="py-3 px-4">
                        {mov.type === 'in' ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1 w-fit">
                            <ArrowUpRight className="w-3.5 h-3.5" /> Entrée
                          </span>
                        ) : mov.type === 'out' ? (
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1 w-fit">
                            <ArrowDownRight className="w-3.5 h-3.5" /> Sortie
                          </span>
                        ) : mov.type === 'loss' ? (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3.5 h-3.5 animate-pulse" /> Perte / Casse
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1 w-fit">
                            <Sliders className="w-3.5 h-3.5" /> Ajustement
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-extrabold text-slate-900 font-mono">
                        {mov.quantity}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-400 font-mono">
                        {mov.previousQty}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-900 font-mono font-bold">
                        {mov.newQty}
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px] max-w-xs truncate" title={mov.reason}>
                        {mov.reason}
                      </td>
                      <td className="py-3 px-5 font-bold text-slate-600">
                        {mov.operator}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD / EDIT STOCK ITEM SHEET */}
      {isItemModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-up">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900 text-base">
                  {editingItem ? "Modifier l'article de Stock" : "Nouvel article en Inventaire"}
                </h3>
                <p className="text-[11px] text-slate-500">Configurez la fiche d'approvisionnement des réserves</p>
              </div>
              <button
                type="button"
                onClick={() => setIsItemModalOpen(false)}
                className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 rotate-45" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleItemSubmit} className="p-6 space-y-4 text-xs">
              
              {itemError && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl flex items-start gap-2.5 font-bold leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{itemError}</span>
                </div>
              )}

              {itemSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl flex items-start gap-2.5 font-bold leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 animate-pulse" />
                  <span>{itemSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* Name */}
                <div className="col-span-2 space-y-1">
                  <label className="block text-slate-500 font-bold uppercase tracking-wider text-[10px]">Désignation de l'article *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Caisse Beaufort de 12 bouteilles (65cl)"
                    value={itemName}
                    onChange={e => setItemName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-slate-800 font-medium"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="block text-slate-500 font-bold uppercase tracking-wider text-[10px]">Catégorie</label>
                  <select
                    value={itemCategory}
                    onChange={e => setItemCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-slate-800 font-medium"
                  >
                    <option value="boisson">Boisson / Bouteille / Casier</option>
                    <option value="nourriture">Nourriture / Viandes / Sacs</option>
                    <option value="ingredient">Ingrédient / Épices / Huiles</option>
                    <option value="autre">Matériel / Autre</option>
                  </select>
                </div>

                {/* Unit */}
                <div className="space-y-1">
                  <label className="block text-slate-500 font-bold uppercase tracking-wider text-[10px]">Unité de Mesure</label>
                  <select
                    value={itemUnit}
                    onChange={e => setItemUnit(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-slate-800 font-medium"
                  >
                    <option value="bouteille">Bouteilles</option>
                    <option value="casier">Casiers / Caisses</option>
                    <option value="kg">Kilogrammes (kg)</option>
                    <option value="portion">Portions</option>
                    <option value="litre">Litres</option>
                    <option value="unité">Unités</option>
                    <option value="sac">Sacs</option>
                  </select>
                </div>

                {/* Quantity */}
                <div className="space-y-1">
                  <label className="block text-slate-500 font-bold uppercase tracking-wider text-[10px]">Stock Initial Actuel *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    disabled={!!editingItem} // If editing, quantity changes must go through the dedicated +Entrée / -Sortie buttons for audit coherence!
                    placeholder="Ex: 12"
                    value={itemQuantity}
                    onChange={e => setItemQuantity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-slate-800 font-mono font-bold disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>

                {/* Min Quantity Alert threshold */}
                <div className="space-y-1">
                  <label className="block text-slate-500 font-bold uppercase tracking-wider text-[10px]">Seuil d'Alerte Minimum *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    placeholder="Ex: 5"
                    value={itemMinQty}
                    onChange={e => setItemMinQty(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-slate-800 font-mono font-bold"
                  />
                </div>

                {/* Purchase Price */}
                <div className="space-y-1">
                  <label className="block text-slate-500 font-bold uppercase tracking-wider text-[10px]">Prix d'achat estimé (FCFA) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    placeholder="Ex: 12500"
                    value={itemPricePurchase}
                    onChange={e => setItemPricePurchase(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-slate-800 font-mono font-bold"
                  />
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <label className="block text-slate-500 font-bold uppercase tracking-wider text-[10px]">Emplacement physique</label>
                  <input
                    type="text"
                    placeholder="Ex: Réserve Kennedy"
                    value={itemLocation}
                    onChange={e => setItemLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-slate-800 font-medium"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {editingItem ? 'Enregistrer les Modifications' : 'Enregistrer la fiche stock'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REGISTER STOCK MOVEMENT (AUDIT LOGS APPROVED) */}
      {isMovementModalOpen && selectedStockItem && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-up">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900 text-base">
                  Enregistrer un Mouvement de Caisse/Stock
                </h3>
                <p className="text-[11px] text-slate-500">Mouvement sur l'article : <strong className="text-orange-500">{selectedStockItem.name}</strong></p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsMovementModalOpen(false);
                  setSelectedStockItem(null);
                }}
                className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 rotate-45" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleMovementSubmit} className="p-6 space-y-4 text-xs">
              
              {movementError && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl flex items-start gap-2.5 font-bold leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{movementError}</span>
                </div>
              )}

              {movementSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl flex items-start gap-2.5 font-bold leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 animate-pulse" />
                  <span>{movementSuccess}</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Movement Type */}
                <div className="space-y-1">
                  <label className="block text-slate-500 font-bold uppercase tracking-wider text-[10px]">Type de Transaction de Stock</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setMovementType('in')}
                      className={`py-2 px-3 border rounded-xl font-bold text-center transition-all cursor-pointer ${
                        movementType === 'in'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      + Approvisionnement (Entrée)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMovementType('out')}
                      className={`py-2 px-3 border rounded-xl font-bold text-center transition-all cursor-pointer ${
                        movementType === 'out'
                          ? 'bg-rose-50 border-rose-500 text-rose-700'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      - Consommation (Sortie)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMovementType('loss')}
                      className={`py-2 px-3 border rounded-xl font-bold text-center transition-all cursor-pointer ${
                        movementType === 'loss'
                          ? 'bg-amber-50 border-amber-500 text-amber-700'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      ⚡ Perte / Casse / Périmé
                    </button>
                    <button
                      type="button"
                      onClick={() => setMovementType('inventory')}
                      className={`py-2 px-3 border rounded-xl font-bold text-center transition-all cursor-pointer ${
                        movementType === 'inventory'
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      ⚙️ Correction Inventaire
                    </button>
                  </div>
                </div>

                {/* Stock Summary */}
                <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-200/50">
                  <span className="font-bold text-slate-500 text-[10px] uppercase">Stock Physique Actuel :</span>
                  <span className="font-black text-slate-900 font-mono text-sm">{selectedStockItem.quantity} {selectedStockItem.unit}</span>
                </div>

                {/* Quantity */}
                <div className="space-y-1">
                  <label className="block text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    {movementType === 'inventory' ? 'Nouvelle Quantité Globale en Stock *' : 'Quantité du Mouvement *'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={0.01}
                      step="any"
                      placeholder="Ex: 5"
                      value={movementQty}
                      onChange={e => setMovementQty(e.target.value)}
                      className="w-full pl-4 pr-20 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-slate-800 font-mono font-black text-sm"
                    />
                    <span className="absolute right-3.5 top-3 text-[10px] text-slate-400 font-bold uppercase">{selectedStockItem.unit}</span>
                  </div>
                </div>

                {/* Reason */}
                <div className="space-y-1">
                  <label className="block text-slate-500 font-bold uppercase tracking-wider text-[10px]">Justificatif / Commentaire du mouvement *</label>
                  <input
                    type="text"
                    required
                    placeholder={
                      movementType === 'in' 
                        ? "Ex: Livraison fournisseur Ets Bakayoko" 
                        : movementType === 'out' 
                          ? "Ex: Prélèvement pour le service terrasse" 
                          : movementType === 'loss' 
                            ? "Ex: 2 bouteilles cassées lors du chargement" 
                            : "Ex: Ajustement suite à inventaire hebdomadaire"
                    }
                    value={movementReason}
                    onChange={e => setMovementReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-slate-800 font-medium placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsMovementModalOpen(false);
                    setSelectedStockItem(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Enregistrer le Mouvement
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
