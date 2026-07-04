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
  TrendingDown,
  Sliders,
  AlertCircle,
  Activity,
  ShieldCheck,
  Home,
  BedDouble,
  RefreshCw
} from 'lucide-react';
import { StockItem, StockMovement, UserAccount, Room } from '../types';

interface StockManagerProps {
  stockItems: StockItem[];
  onAddStockItem: (item: StockItem) => void;
  onUpdateStockItem: (itemId: string, updated: Partial<StockItem>) => void;
  onDeleteStockItem: (itemId: string) => void;
  stockMovements: StockMovement[];
  onAddStockMovement: (mov: StockMovement) => void;
  currentUser: UserAccount | null;
  rooms?: Room[];
}

export default function StockManager({
  stockItems,
  onAddStockItem,
  onUpdateStockItem,
  onDeleteStockItem,
  stockMovements,
  onAddStockMovement,
  currentUser,
  rooms = []
}: StockManagerProps) {
  // Main view switcher: Maquis/Restaurant vs Lingerie/Chambres
  const [activeSection, setActiveSection] = useState<'maquis' | 'lingerie'>('maquis');

  // Sub-tabs
  const [activeSubTab, setActiveSubTab] = useState<'inventory' | 'quick_update' | 'history'>('inventory');
  const [lingerieSubTab, setLingerieSubTab] = useState<'inventory' | 'charter' | 'audit' | 'laundry'>('inventory');

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'low' | 'out'>('all');

  // Form states for creating/editing stock items
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState<'boisson' | 'nourriture' | 'ingredient' | 'lingerie' | 'autre'>('ingredient');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemUnit, setItemUnit] = useState<'bouteille' | 'casier' | 'kg' | 'portion' | 'litre' | 'unité' | 'sac' | 'paquet'>('unité');
  const [itemMinQty, setItemMinQty] = useState('');
  const [itemPricePurchase, setItemPricePurchase] = useState('');
  const [itemLocation, setItemLocation] = useState('');

  const [itemError, setItemError] = useState('');
  const [itemSuccess, setItemSuccess] = useState('');

  // Form states for registering a movement
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [selectedStockItem, setSelectedStockItem] = useState<StockItem | null>(null);
  const [movementType, setMovementType] = useState<'in' | 'out' | 'loss' | 'inventory'>('in');
  const [movementQty, setMovementQty] = useState('');
  const [movementReason, setMovementReason] = useState('');
  const [movementError, setMovementError] = useState('');
  const [movementSuccess, setMovementSuccess] = useState('');

  // Quick inventory update state
  const [quickQuantities, setQuickQuantities] = useState<Record<string, string>>({});
  const [quickReasons, setQuickReasons] = useState<Record<string, string>>({});
  const [quickOperator, setQuickOperator] = useState(currentUser?.name || "Gouvernante");
  const [quickGlobalReason, setQuickGlobalReason] = useState("Inventaire physique hebdomadaire");
  const [quickSuccessMsg, setQuickSuccessMsg] = useState('');
  const [quickErrorMsg, setQuickErrorMsg] = useState('');

  // --- LINGERIE & ROOMS SPECIFIC STATES ---
  
  // Room Type Minimums configuration (Room Charter)
  const [roomMinimums, setRoomMinimums] = useState<Record<string, Record<string, number>>>(() => {
    const saved = localStorage.getItem('bb_room_minimums');
    if (saved) return JSON.parse(saved);
    return {
      'studio': { 
        'Draps de lit King Size (Blanc hôtelier)': 2, 
        'Couvre-lits Brodés (Brunch Signature)': 1, 
        'Oreillers Confort Soft & Taies': 2, 
        'Serviettes de bain Éponge (Coton)': 2, 
        'Savons de toilette d\'accueil (Brunch)': 2,
        'Drap simple': 0,
        'Couvre-lit': 0,
        'Serviette': 2
      },
      'room': { 
        'Draps de lit King Size (Blanc hôtelier)': 2, 
        'Couvre-lits Brodés (Brunch Signature)': 1, 
        'Oreillers Confort Soft & Taies': 2, 
        'Serviettes de bain Éponge (Coton)': 1, 
        'Savons de toilette d\'accueil (Brunch)': 1,
        'Drap simple': 2,
        'Couvre-lit': 1,
        'Serviette': 1
      },
      'apartment': { 
        'Draps de lit King Size (Blanc hôtelier)': 4, 
        'Couvre-lits Brodés (Brunch Signature)': 2, 
        'Oreillers Confort Soft & Taies': 4, 
        'Serviettes de bain Éponge (Coton)': 4, 
        'Savons de toilette d\'accueil (Brunch)': 4,
        'Drap simple': 4,
        'Couvre-lit': 2,
        'Serviette': 4
      }
    };
  });

  // Save room minimums whenever changed
  const handleUpdateMinimum = (roomType: string, itemName: string, change: number) => {
    setRoomMinimums(prev => {
      const next = { ...prev };
      if (!next[roomType]) next[roomType] = {};
      const current = next[roomType][itemName] || 0;
      next[roomType][itemName] = Math.max(0, current + change);
      localStorage.setItem('bb_room_minimums', JSON.stringify(next));
      return next;
    });
  };

  const handleRemoveFromMinimum = (roomType: string, itemName: string) => {
    setRoomMinimums(prev => {
      const next = { ...prev };
      if (next[roomType]) {
        delete next[roomType][itemName];
        localStorage.setItem('bb_room_minimums', JSON.stringify(next));
      }
      return { ...next };
    });
  };

  const handleAddToMinimum = (roomType: string, itemName: string, qty: number) => {
    if (!itemName) return;
    setRoomMinimums(prev => {
      const next = { ...prev };
      if (!next[roomType]) next[roomType] = {};
      next[roomType][itemName] = qty;
      localStorage.setItem('bb_room_minimums', JSON.stringify(next));
      return { ...next };
    });
  };

  // Laundry stock tracking (items currently sent out to wash)
  const [laundryStock, setLaundryStock] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('bb_laundry_stock');
    if (saved) return JSON.parse(saved);
    return {
      'Draps de lit King Size (Blanc hôtelier)': 12,
      'Couvre-lits Brodés (Brunch Signature)': 3,
      'Oreillers Confort Soft & Taies': 6,
      'Serviettes de bain Éponge (Coton)': 8
    };
  });

  // Saved audits history per room
  const [roomAudits, setRoomAudits] = useState<Record<string, { date: string, operator: string, items: Record<string, number>, notes?: string }>>(() => {
    const saved = localStorage.getItem('bb_room_audits');
    if (saved) return JSON.parse(saved);
    return {};
  });

  // Active room selected for audit
  const [selectedAuditRoom, setSelectedAuditRoom] = useState<Room | null>(null);
  const [auditCounts, setAuditCounts] = useState<Record<string, string>>({});
  const [auditNotes, setAuditNotes] = useState('');
  const [auditSuccessMsg, setAuditSuccessMsg] = useState('');

  // Laundry transaction form states
  const [isLaundryModalOpen, setIsLaundryModalOpen] = useState(false);
  const [laundryAction, setLaundryAction] = useState<'send' | 'receive'>('send');
  const [selectedLaundryItemName, setSelectedLaundryItemName] = useState('Draps de lit King Size (Blanc hôtelier)');
  const [laundryQtyInput, setLaundryQtyInput] = useState('');
  const [laundryError, setLaundryError] = useState('');
  const [laundrySuccess, setLaundrySuccess] = useState('');

  // --- DETAILED JOURNAL SPECIFIC STATES ---
  const [selectedJournalItem, setSelectedJournalItem] = useState<StockItem | null>(null);
  const [journalHistoryFilter, setJournalHistoryFilter] = useState<'all' | 'in' | 'out' | 'loss'>('all');
  const [associatedItemToAdd, setAssociatedItemToAdd] = useState<Record<string, string>>({}); // roomType -> stockItemId
  const [associatedItemQty, setAssociatedItemQty] = useState<Record<string, string>>({}); // roomType -> quantity string

  // --- INITIALIZERS & COMPUTED METRICS ---

  // Initialize quick quantities if empty
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

  // Dynamic Metrics computed separately based on current top-level tab (Maquis vs Lingerie)
  const metrics = useMemo(() => {
    const itemsOfSection = stockItems.filter(item => 
      activeSection === 'lingerie' 
        ? item.category === 'lingerie' 
        : item.category !== 'lingerie'
    );

    const totalItems = itemsOfSection.length;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let totalValuation = 0;

    itemsOfSection.forEach(item => {
      totalValuation += item.quantity * item.pricePurchase;
      if (item.quantity <= 0) {
        outOfStockCount++;
      } else if (item.quantity <= item.minQuantity) {
        lowStockCount++;
      }
    });

    // Special calculations for laundry and audit compliance
    const totalInLaundry = (Object.values(laundryStock) as number[]).reduce((a, b) => a + b, 0);
    
    // Count rooms with active non-compliance
    let nonCompliantRoomsCount = 0;
    rooms.forEach(r => {
      const audit = roomAudits[r.id];
      if (audit) {
        const typeMinimums = roomMinimums[r.type] || {};
        let isCompliant = true;
        Object.keys(typeMinimums).forEach(key => {
          const standard = typeMinimums[key] || 0;
          const actual = audit.items[key] ?? standard;
          if (actual < standard) isCompliant = false;
        });
        if (!isCompliant) nonCompliantRoomsCount++;
      }
    });

    return {
      totalItems,
      lowStockCount,
      outOfStockCount,
      totalValuation,
      totalInLaundry,
      nonCompliantRoomsCount
    };
  }, [stockItems, activeSection, laundryStock, rooms, roomAudits, roomMinimums]);

  // Filtered Stock Items based on current selection
  const filteredStockItems = useMemo(() => {
    return stockItems.filter(item => {
      // 1. Enforce active section category
      if (activeSection === 'lingerie') {
        if (item.category !== 'lingerie') return false;
      } else {
        if (item.category === 'lingerie') return false;
        // Apply maquis categories filters
        if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      }

      // 2. Status filter
      if (statusFilter === 'low') {
        if (item.quantity > item.minQuantity || item.quantity <= 0) return false;
      } else if (statusFilter === 'out') {
        if (item.quantity > 0) return false;
      }

      // 3. Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(query) || 
               (item.location || '').toLowerCase().includes(query);
      }

      return true;
    });
  }, [stockItems, activeSection, selectedCategory, statusFilter, searchQuery]);

  // --- DETAILED JOURNAL CALCULATED METRICS ---
  const journalStats = useMemo(() => {
    // Filter stock items for the active section
    const items = stockItems.filter(item => {
      if (activeSection === 'lingerie') {
        return item.category === 'lingerie';
      } else {
        return item.category !== 'lingerie';
      }
    });

    const stats: Record<string, {
      totalIn: number;
      totalOut: number;
      totalLoss: number;
      lossValue: number;
    }> = {};

    items.forEach(item => {
      stats[item.id] = { totalIn: 0, totalOut: 0, totalLoss: 0, lossValue: 0 };
    });

    stockMovements.forEach(mov => {
      const itemId = mov.stockItemId;
      const item = stockItems.find(s => s.id === itemId);
      if (!item) return;

      // Verify if the item is in the current section
      const isLingerieItem = item.category === 'lingerie';
      if ((activeSection === 'lingerie' && !isLingerieItem) || (activeSection === 'maquis' && isLingerieItem)) {
        return;
      }

      if (!stats[itemId]) {
        stats[itemId] = { totalIn: 0, totalOut: 0, totalLoss: 0, lossValue: 0 };
      }

      const diff = mov.newQty - mov.previousQty;
      if (mov.type === 'in') {
        stats[itemId].totalIn += mov.quantity;
      } else if (mov.type === 'out') {
        stats[itemId].totalOut += mov.quantity;
      } else if (mov.type === 'loss') {
        stats[itemId].totalLoss += mov.quantity;
        stats[itemId].lossValue += mov.quantity * item.pricePurchase;
      } else if (mov.type === 'inventory') {
        if (diff > 0) {
          stats[itemId].totalIn += diff;
        } else if (diff < 0) {
          const absDiff = Math.abs(diff);
          stats[itemId].totalLoss += absDiff;
          stats[itemId].lossValue += absDiff * item.pricePurchase;
        }
      }
    });

    // Compute cumulative metrics
    let totalLossesCount = 0;
    let totalLossesValue = 0;
    let itemWithMaxLoss: StockItem | null = null;
    let maxLossQty = 0;

    items.forEach(item => {
      const itemStat = stats[item.id] || { totalIn: 0, totalOut: 0, totalLoss: 0, lossValue: 0 };
      totalLossesCount += itemStat.totalLoss;
      totalLossesValue += itemStat.lossValue;

      if (itemStat.totalLoss > maxLossQty) {
        maxLossQty = itemStat.totalLoss;
        itemWithMaxLoss = item;
      }
    });

    return {
      itemStats: stats,
      totalItemsAnalyzed: items.length,
      totalLossesCount,
      totalLossesValue,
      itemWithMaxLoss,
      maxLossQty
    };
  }, [stockItems, stockMovements, activeSection]);

  const itemSpecificMovements = useMemo(() => {
    if (!selectedJournalItem) return [];
    return stockMovements
      .filter(mov => mov.stockItemId === selectedJournalItem.id)
      .filter(mov => {
        if (journalHistoryFilter === 'all') return true;
        if (journalHistoryFilter === 'in') return mov.type === 'in' || (mov.type === 'inventory' && mov.newQty > mov.previousQty);
        if (journalHistoryFilter === 'out') return mov.type === 'out';
        if (journalHistoryFilter === 'loss') return mov.type === 'loss' || (mov.type === 'inventory' && mov.newQty < mov.previousQty);
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [selectedJournalItem, stockMovements, journalHistoryFilter]);

  // Auto-select first item for journal details
  React.useEffect(() => {
    const sectionItems = stockItems.filter(item => 
      activeSection === 'lingerie' ? item.category === 'lingerie' : item.category !== 'lingerie'
    );
    if (sectionItems.length > 0) {
      if (!selectedJournalItem || !sectionItems.some(s => s.id === selectedJournalItem.id)) {
        setSelectedJournalItem(sectionItems[0]);
      }
    } else {
      setSelectedJournalItem(null);
    }
  }, [activeSection, stockItems]);

  // --- HANDLERS ---

  const handleOpenCreateItem = () => {
    setEditingItem(null);
    setItemName('');
    setItemCategory(activeSection === 'lingerie' ? 'lingerie' : 'boisson');
    setItemQuantity('0');
    setItemUnit(activeSection === 'lingerie' ? 'unité' : 'bouteille');
    setItemMinQty('5');
    setItemPricePurchase('');
    setItemLocation(activeSection === 'lingerie' ? 'Lingerie Centrale' : 'Réserve Cave');
    setItemError('');
    setItemSuccess('');
    setIsItemModalOpen(true);
  };

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
      setItemError("Le seuil d'alerte doit être un nombre positif ou nul.");
      return;
    }
    if (isNaN(purchaseVal) || purchaseVal < 0) {
      setItemError("Le prix d'achat doit être un nombre positif ou nul.");
      return;
    }

    if (editingItem) {
      // Edit
      onUpdateStockItem(editingItem.id, {
        name: itemName.trim(),
        category: itemCategory,
        quantity: qtyVal,
        unit: itemUnit,
        minQuantity: minQtyVal,
        pricePurchase: purchaseVal,
        location: itemLocation.trim()
      });

      setItemSuccess("L'article a été mis à jour avec succès !");
      setTimeout(() => {
        setIsItemModalOpen(false);
      }, 800);
    } else {
      // Create
      const newId = 'st-' + Math.random().toString(36).substr(2, 9);
      const newItem: StockItem = {
        id: newId,
        name: itemName.trim(),
        category: itemCategory,
        quantity: qtyVal,
        unit: itemUnit,
        minQuantity: minQtyVal,
        pricePurchase: purchaseVal,
        location: itemLocation.trim(),
        lastRestocked: qtyVal > 0 ? new Date().toISOString() : undefined
      };
      onAddStockItem(newItem);

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
          operator: currentUser?.name || "Gouvernante"
        });
      }

      setItemSuccess("Nouvel article ajouté avec succès !");
      setTimeout(() => {
        setIsItemModalOpen(false);
      }, 800);
    }
  };

  const handleOpenMovementModal = (item: StockItem, defaultType: 'in' | 'out' | 'loss' | 'inventory') => {
    setSelectedStockItem(item);
    setMovementType(defaultType);
    setMovementQty('');
    setMovementReason('');
    setMovementError('');
    setMovementSuccess('');
    setIsMovementModalOpen(true);
  };

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
      setMovementError("Veuillez fournir un justificatif.");
      return;
    }

    const prevQty = selectedStockItem.quantity;
    let newQty = prevQty;

    if (movementType === 'in' || (movementType === 'inventory' && qtyVal > prevQty)) {
      if (movementType === 'in') {
        newQty = prevQty + qtyVal;
      } else {
        newQty = qtyVal;
      }
    } else {
      if (movementType === 'out' || movementType === 'loss') {
        if (qtyVal > prevQty) {
          setMovementError("Quantité demandée supérieure au stock disponible.");
          return;
        }
        newQty = prevQty - qtyVal;
      } else {
        newQty = qtyVal;
      }
    }

    const finalDelta = Math.abs(newQty - prevQty);

    onUpdateStockItem(selectedStockItem.id, {
      quantity: newQty,
      lastRestocked: movementType === 'in' ? new Date().toISOString() : selectedStockItem.lastRestocked
    });

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

    setMovementSuccess("Mouvement de stock enregistré !");
    setTimeout(() => {
      setIsMovementModalOpen(false);
      setSelectedStockItem(null);
    }, 800);
  };

  const handleDeleteItem = (id: string, name: string) => {
    if (confirm(`Voulez-vous supprimer "${name}" de l'inventaire ?`)) {
      onDeleteStockItem(id);
    }
  };

  // Submit global quick physical inventory
  const handleSaveAllQuickItems = () => {
    let updatedCount = 0;
    const operatorName = quickOperator.trim() || "Gouvernante";
    const globalReasonText = quickGlobalReason.trim() || "Ajustement Inventaire Physique";

    filteredStockItems.forEach((item, index) => {
      const enteredVal = quickQuantities[item.id];
      if (enteredVal === undefined) return;

      const qtyVal = parseFloat(enteredVal);
      if (isNaN(qtyVal) || qtyVal < 0) return;

      const prevQty = item.quantity;
      if (prevQty === qtyVal) return;

      const diff = qtyVal - prevQty;

      onUpdateStockItem(item.id, {
        quantity: qtyVal
      });

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

    setQuickSuccessMsg(`Inventaire physique validé ! ${updatedCount} article(s) mis à jour.`);
    setQuickReasons({});
    setTimeout(() => setQuickSuccessMsg(''), 4000);
  };

  const handleSaveSingleQuickItem = (item: StockItem) => {
    const enteredVal = quickQuantities[item.id];
    if (enteredVal === undefined) return;

    const qtyVal = parseFloat(enteredVal);
    if (isNaN(qtyVal) || qtyVal < 0) {
      setQuickErrorMsg("Quantité invalide.");
      return;
    }

    const prevQty = item.quantity;
    if (prevQty === qtyVal) {
      setQuickSuccessMsg(`Aucun écart pour "${item.name}".`);
      setTimeout(() => setQuickSuccessMsg(''), 2000);
      return;
    }

    const diff = qtyVal - prevQty;

    onUpdateStockItem(item.id, {
      quantity: qtyVal
    });

    onAddStockMovement({
      id: 'mov-' + Date.now(),
      stockItemId: item.id,
      itemName: item.name,
      type: 'inventory',
      quantity: Math.abs(diff),
      previousQty: prevQty,
      newQty: qtyVal,
      reason: quickReasons[item.id]?.trim() || "Ajustement unitaire rapide",
      date: new Date().toISOString(),
      operator: quickOperator
    });

    setQuickSuccessMsg(`Ajustement enregistré pour "${item.name}" (écart: ${diff > 0 ? '+' : ''}${diff}).`);
    setTimeout(() => setQuickSuccessMsg(''), 3000);
  };

  // --- ROOM AUDIT SUBMISSION ---
  const handleOpenRoomAudit = (room: Room) => {
    setSelectedAuditRoom(room);
    setAuditNotes('');
    setAuditSuccessMsg('');
    
    // Pre-populate with previous audit or with charter standard
    const previousAudit = roomAudits[room.id];
    const typeRequirements = roomMinimums[room.type] || {};
    
    const initialCounts: Record<string, string> = {};
    Object.keys(typeRequirements).forEach(itemName => {
      initialCounts[itemName] = previousAudit ? (previousAudit.items[itemName] ?? typeRequirements[itemName]).toString() : typeRequirements[itemName].toString();
    });
    
    setAuditCounts(initialCounts);
  };

  const handleSaveRoomAudit = () => {
    if (!selectedAuditRoom) return;

    const typeRequirements = roomMinimums[selectedAuditRoom.type] || {};
    const auditedItems: Record<string, number> = {};
    let hasLoss = false;

    Object.keys(typeRequirements).forEach(itemName => {
      const enteredValue = parseInt(auditCounts[itemName] || '0', 10);
      const actualCount = isNaN(enteredValue) ? 0 : Math.max(0, enteredValue);
      auditedItems[itemName] = actualCount;

      const standardRequired = typeRequirements[itemName] || 0;
      
      // If there are missing items in the room audit, we reduce from main stock
      if (actualCount < standardRequired) {
        const missingCount = standardRequired - actualCount;
        
        // Find matching StockItem and decrement quantity
        const matchingStockItem = stockItems.find(s => s.name.toLowerCase() === itemName.toLowerCase() && (s.category === 'lingerie' || s.category === 'autre'));
        if (matchingStockItem) {
          const prevQty = matchingStockItem.quantity;
          const newQty = Math.max(0, prevQty - missingCount);
          
          onUpdateStockItem(matchingStockItem.id, {
            quantity: newQty
          });

          // Log stock loss movement
          onAddStockMovement({
            id: 'mov-audit-loss-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
            stockItemId: matchingStockItem.id,
            itemName: matchingStockItem.name,
            type: 'loss',
            quantity: Math.min(prevQty, missingCount),
            previousQty: prevQty,
            newQty: newQty,
            reason: `Manquant constaté lors du contrôle de la Chambre ${selectedAuditRoom.name} (${selectedAuditRoom.id})`,
            date: new Date().toISOString(),
            operator: currentUser?.name || "Gouvernante"
          });
          hasLoss = true;
        }
      }
    });

    const newAudit = {
      date: new Date().toISOString(),
      operator: currentUser?.name || "Gouvernante",
      items: auditedItems,
      notes: auditNotes.trim()
    };

    const updatedAudits = {
      ...roomAudits,
      [selectedAuditRoom.id]: newAudit
    };

    setRoomAudits(updatedAudits);
    localStorage.setItem('bb_room_audits', JSON.stringify(updatedAudits));

    setAuditSuccessMsg(`Audit de la Chambre ${selectedAuditRoom.name} enregistré ! ${hasLoss ? "Les articles manquants ont été déduits des stocks centraux." : "Linge conforme !"}`);
    setTimeout(() => {
      setSelectedAuditRoom(null);
    }, 2500);
  };

  // --- LAUNDRY LOGISTICS HANDLERS ---
  const handleLaundrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLaundryError('');
    setLaundrySuccess('');

    const qtyVal = parseInt(laundryQtyInput, 10);
    if (isNaN(qtyVal) || qtyVal <= 0) {
      setLaundryError("Veuillez saisir une quantité supérieure à 0.");
      return;
    }

    // Find Central Stock Item
    const centralItem = stockItems.find(item => item.name.toLowerCase() === selectedLaundryItemName.toLowerCase() && item.category === 'lingerie');
    
    if (laundryAction === 'send') {
      if (!centralItem) {
        setLaundryError("Cet article n'existe pas dans le stock central.");
        return;
      }
      if (centralItem.quantity < qtyVal) {
        setLaundryError(`Stock insuffisant en réserve centrale (${centralItem.quantity} disponibles).`);
        return;
      }

      // Decrement central stock
      const prevQty = centralItem.quantity;
      const newQty = prevQty - qtyVal;
      onUpdateStockItem(centralItem.id, { quantity: newQty });

      // Increment laundry count
      const updatedLaundryStock = {
        ...laundryStock,
        [selectedLaundryItemName]: (laundryStock[selectedLaundryItemName] || 0) + qtyVal
      };
      setLaundryStock(updatedLaundryStock);
      localStorage.setItem('bb_laundry_stock', JSON.stringify(updatedLaundryStock));

      // Record out movement (sent to laundry)
      onAddStockMovement({
        id: 'mov-laundry-send-' + Date.now(),
        stockItemId: centralItem.id,
        itemName: centralItem.name,
        type: 'out',
        quantity: qtyVal,
        previousQty: prevQty,
        newQty: newQty,
        reason: `Envoi blanchisserie pour nettoyage (${qtyVal} unités)`,
        date: new Date().toISOString(),
        operator: currentUser?.name || "Gouvernante"
      });

      setLaundrySuccess(`Envoi de ${qtyVal} ${centralItem.unit}(s) à la blanchisserie validé !`);
    } else {
      // Return Clean
      const currentInLaundry = laundryStock[selectedLaundryItemName] || 0;
      if (currentInLaundry < qtyVal) {
        setLaundryError(`Quantité supérieure au nombre de pièces enregistrées en blanchisserie (${currentInLaundry} au lavage).`);
        return;
      }

      if (!centralItem) {
        setLaundryError("Article introuvable dans le stock central.");
        return;
      }

      // Decrement laundry count
      const updatedLaundryStock = {
        ...laundryStock,
        [selectedLaundryItemName]: Math.max(0, currentInLaundry - qtyVal)
      };
      setLaundryStock(updatedLaundryStock);
      localStorage.setItem('bb_laundry_stock', JSON.stringify(updatedLaundryStock));

      // Increment central stock
      const prevQty = centralItem.quantity;
      const newQty = prevQty + qtyVal;
      onUpdateStockItem(centralItem.id, { quantity: newQty });

      // Record in movement (returned from laundry)
      onAddStockMovement({
        id: 'mov-laundry-return-' + Date.now(),
        stockItemId: centralItem.id,
        itemName: centralItem.name,
        type: 'in',
        quantity: qtyVal,
        previousQty: prevQty,
        newQty: newQty,
        reason: `Retour blanchisserie - Linge propre (${qtyVal} unités)`,
        date: new Date().toISOString(),
        operator: currentUser?.name || "Gouvernante"
      });

      setLaundrySuccess(`Retour de ${qtyVal} ${centralItem.unit}(s) de blanchisserie enregistré !`);
    }

    setLaundryQtyInput('');
    setTimeout(() => {
      setIsLaundryModalOpen(false);
      setLaundrySuccess('');
    }, 1500);
  };

  // Seeding default lodging items
  const handleSeedLingerie = () => {
    const initialLinen: StockItem[] = [
      { id: 'st-linen-1', name: 'Draps de lit King Size (Blanc hôtelier)', category: 'lingerie', quantity: 45, unit: 'unité', minQuantity: 15, pricePurchase: 12500, location: 'Lingerie Centrale' },
      { id: 'st-linen-2', name: 'Couvre-lits Brodés (Brunch Signature)', category: 'lingerie', quantity: 12, unit: 'unité', minQuantity: 5, pricePurchase: 22000, location: 'Lingerie Centrale' },
      { id: 'st-linen-3', name: 'Oreillers Confort Soft & Taies', category: 'lingerie', quantity: 30, unit: 'unité', minQuantity: 10, pricePurchase: 6500, location: 'Lingerie Centrale' },
      { id: 'st-linen-4', name: 'Serviettes de bain Éponge (Coton)', category: 'lingerie', quantity: 50, unit: 'unité', minQuantity: 15, pricePurchase: 4500, location: 'Lingerie Centrale' },
      { id: 'st-linen-5', name: 'Savons de toilette d\'accueil (Brunch)', category: 'lingerie', quantity: 200, unit: 'unité', minQuantity: 50, pricePurchase: 150, location: 'Lingerie Centrale' },
      { id: 'st-linen-6', name: 'Drap simple', category: 'lingerie', quantity: 35, unit: 'unité', minQuantity: 10, pricePurchase: 8500, location: 'Lingerie Centrale' },
      { id: 'st-linen-7', name: 'Couvre-lit', category: 'lingerie', quantity: 15, unit: 'unité', minQuantity: 5, pricePurchase: 15000, location: 'Lingerie Centrale' },
      { id: 'st-linen-8', name: 'Serviette', category: 'lingerie', quantity: 60, unit: 'unité', minQuantity: 15, pricePurchase: 3500, location: 'Lingerie Centrale' }
    ];

    let count = 0;
    initialLinen.forEach(item => {
      if (!stockItems.some(s => s.name.toLowerCase() === item.name.toLowerCase())) {
        onAddStockItem(item);
        onAddStockMovement({
          id: 'mov-seed-linen-' + Math.random().toString(36).substr(2, 5),
          stockItemId: item.id,
          itemName: item.name,
          type: 'in',
          quantity: item.quantity,
          previousQty: 0,
          newQty: item.quantity,
          reason: "Alimentation initiale stock Lingerie & Chambres",
          date: new Date().toISOString(),
          operator: currentUser?.name || "Gouvernante"
        });
        count++;
      }
    });

    setQuickSuccessMsg(`Séchage initial effectué ! ${count} articles de lingerie hôtelière ajoutés.`);
    setTimeout(() => setQuickSuccessMsg(''), 3000);
  };

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

    let count = 0;
    defaultStocks.forEach(item => {
      if (!stockItems.some(s => s.name.toLowerCase() === item.name.toLowerCase())) {
        onAddStockItem(item);
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
        count++;
      }
    });

    setQuickSuccessMsg(`Peuplement initial effectué ! ${count} articles de bar & cuisine ajoutés.`);
    setTimeout(() => setQuickSuccessMsg(''), 3000);
  };

  // Filter movements based on selected section
  const sectionMovements = useMemo(() => {
    return stockMovements.filter(mov => {
      // Find item category
      const item = stockItems.find(s => s.id === mov.stockItemId || s.name === mov.itemName);
      if (activeSection === 'lingerie') {
        return item?.category === 'lingerie';
      } else {
        return !item || item.category !== 'lingerie';
      }
    }).sort((a, b) => b.id.localeCompare(a.id));
  }, [stockMovements, stockItems, activeSection]);

  const renderDetailedJournal = () => {
    return (
      <div className="space-y-6">
        {/* Header explanation banner */}
        <div className={`${activeSection === 'lingerie' ? 'bg-emerald-50 border-emerald-200/60 text-emerald-950' : 'bg-orange-50 border-orange-200/60 text-orange-950'} border rounded-3xl p-5 flex gap-4 text-xs leading-relaxed`}>
          <Info className={`w-5 h-5 shrink-0 mt-0.5 ${activeSection === 'lingerie' ? 'text-emerald-600' : 'text-orange-500'}`} />
          <div className="space-y-1">
            <p className="font-extrabold text-sm">📊 Analyse des Pertes & Journal de Traçabilité</p>
            <p className="text-slate-600 font-medium">
              Suivez précisément les entrées (livraisons), les sorties (consommation, blanchisserie) et les **pertes (vols, linge manquant d'audit, casse)**. 
              Ce journal permet d'identifier immédiatement quel équipement disparaît et son coût financier.
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 font-bold border ${activeSection === 'lingerie' ? 'bg-emerald-50 border-emerald-100' : 'bg-orange-50 border-orange-100'}`}>
              <Search className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Articles Analysés</span>
              <span className="text-lg font-black text-slate-900 font-mono">{journalStats.totalItemsAnalyzed}</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center text-rose-500 font-bold">
              <TrendingDown className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pertes / Écarts Cumulés</span>
              <span className="text-lg font-black text-rose-600 font-mono">
                {journalStats.totalLossesCount} <span className="text-[10px] text-slate-400 font-medium font-sans">unités</span>
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center text-amber-500 font-bold">
              <DollarSign className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Valeur Financière Perdue</span>
              <span className="text-lg font-black text-amber-700 font-mono">
                {journalStats.totalLossesValue.toLocaleString()} FCFA
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeSection === 'lingerie' ? 'bg-emerald-50 border-emerald-100' : 'bg-orange-50 border-orange-100'}`}>
              <AlertTriangle className="w-5 h-5 text-rose-500" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Plus Grosses Pertes</span>
              <span className="text-[11px] font-black text-slate-950 truncate block leading-tight">
                {journalStats.itemWithMaxLoss ? (journalStats.itemWithMaxLoss as StockItem).name : "Aucun"}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold block">
                {journalStats.maxLossQty > 0 ? `${journalStats.maxLossQty} disparus` : "Zéro perte"}
              </span>
            </div>
          </div>
        </div>

        {/* Split layout: table of items and item details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left table of items with counters */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xs flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider">État Général des Pertes par Article</span>
              <span className="text-[10px] px-2 py-0.5 bg-slate-200 text-slate-600 rounded font-mono font-bold">Détails par pièce</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                    <th className="py-2.5 px-4">Article</th>
                    <th className="py-2.5 px-3 text-center">Stock</th>
                    <th className="py-2.5 px-3 text-center text-emerald-600">Entrées</th>
                    <th className="py-2.5 px-3 text-center text-rose-600">Pertes</th>
                    <th className="py-2.5 px-3 text-right">Valeur Perdue</th>
                    <th className="py-2.5 px-4 text-center">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {stockItems
                    .filter(item => activeSection === 'lingerie' ? item.category === 'lingerie' : item.category !== 'lingerie')
                    .map(item => {
                      const stats = journalStats.itemStats[item.id] || { totalIn: 0, totalOut: 0, totalLoss: 0, lossValue: 0 };
                      const isSelected = selectedJournalItem?.id === item.id;
                      
                      // Status tag calculation
                      let statusTag = (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[9px] font-bold uppercase">Optimal</span>
                      );
                      if (stats.totalLoss >= 5) {
                        statusTag = (
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded text-[9px] font-black uppercase animate-pulse">Critique 🚨</span>
                        );
                      } else if (stats.totalLoss > 0) {
                        statusTag = (
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-[9px] font-bold uppercase">Alerte ⚠️</span>
                        );
                      }

                      return (
                        <tr 
                          key={item.id} 
                          onClick={() => setSelectedJournalItem(item)}
                          className={`cursor-pointer transition-colors ${isSelected ? 'bg-slate-100/80 font-semibold' : 'hover:bg-slate-50/40'}`}
                        >
                          <td className="py-3 px-4">
                            <div className="font-extrabold text-slate-800 text-[11px] leading-tight">{item.name}</div>
                            <div className="text-[9px] text-slate-400 font-semibold uppercase">{item.location || 'Réserve'}</div>
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-bold">{item.quantity}</td>
                          <td className="py-3 px-3 text-center font-mono text-emerald-600">+{stats.totalIn}</td>
                          <td className="py-3 px-3 text-center font-mono text-rose-600 font-bold">-{stats.totalLoss}</td>
                          <td className="py-3 px-3 text-right font-mono text-slate-500 font-semibold">{stats.lossValue.toLocaleString()} F</td>
                          <td className="py-3 px-4 text-center">{statusTag}</td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>

          {/* Right detailed article timeline & statistics */}
          <div className="lg:col-span-5 space-y-4">
            {selectedJournalItem ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-5">
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Fiche Traçabilité Article</span>
                    <h4 className="text-sm font-black text-slate-900 leading-tight">{selectedJournalItem.name}</h4>
                    <span className="text-[10px] text-slate-500 font-bold block">
                      En réserve: <span className="font-mono text-slate-800 font-black">{selectedJournalItem.quantity} {selectedJournalItem.unit}s</span>
                    </span>
                  </div>
                  <span className={`px-2.5 py-1 text-[10px] rounded-lg font-black uppercase ${activeSection === 'lingerie' ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-600'}`}>
                    {selectedJournalItem.unit}
                  </span>
                </div>

                {/* Micro stats for selected item */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Taux de Perte</span>
                    <span className="text-sm font-black text-rose-600 font-mono">
                      {(() => {
                        const stats = journalStats.itemStats[selectedJournalItem.id] || { totalIn: 0, totalOut: 0, totalLoss: 0, lossValue: 0 };
                        const totalCount = selectedJournalItem.quantity + stats.totalLoss;
                        if (totalCount === 0) return "0.0%";
                        return `${((stats.totalLoss / totalCount) * 100).toFixed(1)}%`;
                      })()}
                    </span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Coût Pertes</span>
                    <span className="text-sm font-black text-slate-800 font-mono">
                      {((journalStats.itemStats[selectedJournalItem.id]?.lossValue || 0)).toLocaleString()} FCFA
                    </span>
                  </div>
                </div>

                {/* Filterable Movement Timeline */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Chronologie</span>
                    <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg shrink-0">
                      {(['all', 'in', 'out', 'loss'] as const).map(f => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setJournalHistoryFilter(f)}
                          className={`px-2 py-1 text-[9px] font-extrabold rounded-md transition-all uppercase cursor-pointer ${
                            journalHistoryFilter === f 
                              ? 'bg-white text-slate-900 shadow-2xs' 
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {f === 'all' ? 'Tous' : f === 'in' ? 'Entrées' : f === 'out' ? 'Sorties' : 'Pertes'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* History Log specific to this selected item */}
                  <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                    {itemSpecificMovements.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic py-6 text-center">Aucun mouvement enregistré pour ce filtre.</p>
                    ) : (
                      itemSpecificMovements.map(mov => {
                        const isLoss = mov.type === 'loss' || (mov.type === 'inventory' && mov.newQty < mov.previousQty);
                        const isIn = mov.type === 'in' || (mov.type === 'inventory' && mov.newQty > mov.previousQty);
                        const isOut = mov.type === 'out';
                        
                        let typeBadge = (
                          <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[8px] font-bold uppercase shrink-0">Ajustement</span>
                        );
                        if (isLoss) {
                          typeBadge = (
                            <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 rounded text-[8px] font-bold uppercase shrink-0">Perte 📉</span>
                          );
                        } else if (isIn) {
                          typeBadge = (
                            <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[8px] font-bold uppercase shrink-0">Rentrée 📈</span>
                          );
                        } else if (isOut) {
                          typeBadge = (
                            <span className="px-1.5 py-0.5 bg-slate-50 text-slate-600 rounded text-[8px] font-bold uppercase shrink-0">Sortie 📦</span>
                          );
                        }

                        return (
                          <div key={mov.id} className="p-2.5 border border-slate-100 rounded-xl space-y-1.5 text-[11px] bg-slate-50/20 hover:bg-slate-50/60 transition-colors">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-[9px] text-slate-400">{new Date(mov.date).toLocaleString()}</span>
                              {typeBadge}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600 font-semibold italic">"{mov.reason}"</span>
                              <span className="font-mono font-black text-slate-800 text-xs">
                                {isIn ? '+' : '-'}{mov.quantity}
                              </span>
                            </div>
                            <div className="flex items-center justify-between border-t border-slate-100/60 pt-1 text-[9px] text-slate-400">
                              <span>Par: <span className="font-bold text-slate-500">{mov.operator}</span></span>
                              <span>Stock: {mov.previousQty} → {mov.newQty}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-2xs text-center text-slate-400 italic text-xs">
                Sélectionnez un article à gauche pour afficher sa fiche de traçabilité complète.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* SECTION SELECTOR (MAQUIS VS LINGERIE) */}
      <div className="bg-slate-100 p-1 rounded-2xl flex max-w-xl">
        <button
          onClick={() => {
            setActiveSection('maquis');
            setActiveSubTab('inventory');
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSection === 'maquis' 
              ? 'bg-white text-slate-900 shadow-sm' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4 text-orange-500" />
          <span>🍔 RESTAURATION & MAQUIS</span>
        </button>
        <button
          onClick={() => {
            setActiveSection('lingerie');
            setLingerieSubTab('inventory');
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSection === 'lingerie' 
              ? 'bg-white text-slate-900 shadow-sm' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BedDouble className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>🏨 LINGERIE & CHAMBRES</span>
        </button>
      </div>

      {/* HEADER SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`p-1.5 rounded-lg ${activeSection === 'lingerie' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
              {activeSection === 'lingerie' ? <BedDouble className="w-5 h-5" /> : <Package className="w-5 h-5" />}
            </span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {activeSection === 'lingerie' ? 'Stock Lingerie & Matériels de Chambre' : 'Gestion des Stocks & Épicerie Maquis'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            {activeSection === 'lingerie' 
              ? 'Gérez la lingerie (draps, serviettes, oreillers) et les consommables. Définissez l\'équipement minimum, auditez les chambres et gérez la blanchisserie.'
              : 'Supervisez les boissons (Beaufort, Ivoire), bananes plantains, alloco et ingrédients pour les plats du maquis.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeSection === 'lingerie' ? (
            <button
              onClick={handleSeedLingerie}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition-all flex items-center gap-2 border border-slate-200/60 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-500" />
              Alimenter la Lingerie
            </button>
          ) : (
            <button
              onClick={handleSeedStock}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition-all flex items-center gap-2 border border-slate-200/60 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-orange-500" />
              Remplir Stocks Fictifs
            </button>
          )}

          <button
            onClick={handleOpenCreateItem}
            className={`px-4 py-2.5 text-white font-extrabold rounded-2xl text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeSection === 'lingerie' 
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10 hover:shadow-emerald-600/25' 
                : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/10 hover:shadow-orange-500/25'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Nouvel Article</span>
          </button>
        </div>
      </div>

      {/* METRICS DASHBOARD - ADAPTED TO SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {activeSection === 'lingerie' ? (
          <>
            {/* Metric 1 - Total Pieces */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                <BedDouble className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Linge Propre Central</span>
                <span className="text-xl font-black text-slate-900 font-mono">
                  {stockItems.filter(s => s.category === 'lingerie').reduce((acc, current) => acc + current.quantity, 0)} <span className="text-xs text-slate-400 font-medium">unités</span>
                </span>
              </div>
            </div>

            {/* Metric 2 - In Laundry */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">En Blanchisserie</span>
                <span className="text-xl font-black text-blue-600 font-mono">
                  {metrics.totalInLaundry} <span className="text-xs text-slate-400 font-medium">pièces</span>
                </span>
              </div>
            </div>

            {/* Metric 3 - Room Compliance */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                metrics.nonCompliantRoomsCount > 0 
                  ? 'bg-rose-50 border-rose-100 text-rose-600' 
                  : 'bg-emerald-50 border-emerald-100 text-emerald-600'
              }`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Chambres Déficitaires</span>
                <span className={`text-xl font-black font-mono ${metrics.nonCompliantRoomsCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {metrics.nonCompliantRoomsCount} <span className="text-xs text-slate-400 font-medium">non conforme(s)</span>
                </span>
              </div>
            </div>

            {/* Metric 4 - Total items catalog */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-600">
                <Sliders className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Articles Référencés</span>
                <span className="text-xl font-black text-slate-900 font-mono">{metrics.totalItems}</span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Metric 1 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-600">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Articles Enregistrés</span>
                <span className="text-xl font-black text-slate-900 font-mono">{metrics.totalItems}</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
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
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
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
                  {metrics.outOfStockCount} <span className="text-[11px] text-slate-400 font-medium">ruptures</span>
                </span>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 border border-orange-200/50 rounded-xl flex items-center justify-center text-orange-600">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Valorisation Réserve</span>
                <span className="text-sm font-black text-slate-900 font-mono">
                  {metrics.totalValuation.toLocaleString()} <span className="text-[10px] text-slate-500 font-bold">FCFA</span>
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* SUB-TABS NAVIGATION CONTROLS */}
      <div className="border-b border-slate-200 flex flex-wrap gap-6">
        {activeSection === 'maquis' ? (
          <>
            <button
              onClick={() => setActiveSubTab('inventory')}
              className={`py-3 text-xs font-black tracking-wide uppercase border-b-2 transition-all cursor-pointer ${
                activeSubTab === 'inventory' 
                  ? 'border-orange-500 text-orange-600' 
                  : 'border-transparent text-slate-400 hover:text-slate-900'
              }`}
            >
              État Réel de l'Inventaire
            </button>
            <button
              onClick={() => setActiveSubTab('quick_update')}
              className={`py-3 text-xs font-black tracking-wide uppercase border-b-2 transition-all cursor-pointer ${
                activeSubTab === 'quick_update' 
                  ? 'border-orange-500 text-orange-600' 
                  : 'border-transparent text-slate-400 hover:text-slate-900'
              }`}
            >
              ⚡ Saisie Physique (Mise à jour rapide)
            </button>
            <button
              onClick={() => setActiveSubTab('history')}
              className={`py-3 text-xs font-black tracking-wide uppercase border-b-2 transition-all cursor-pointer ${
                activeSubTab === 'history' 
                  ? 'border-orange-500 text-orange-600' 
                  : 'border-transparent text-slate-400 hover:text-slate-900'
              }`}
            >
              Historique des Mouvements ({sectionMovements.length})
            </button>
            <button
              onClick={() => setActiveSubTab('journal')}
              className={`py-3 text-xs font-black tracking-wide uppercase border-b-2 transition-all cursor-pointer ${
                activeSubTab === 'journal' 
                  ? 'border-orange-500 text-orange-600' 
                  : 'border-transparent text-slate-400 hover:text-slate-900'
              }`}
            >
              📊 Journal des Pertes & Analyse
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setLingerieSubTab('inventory')}
              className={`py-3 text-xs font-black tracking-wide uppercase border-b-2 transition-all cursor-pointer ${
                lingerieSubTab === 'inventory' 
                  ? 'border-emerald-600 text-emerald-700' 
                  : 'border-transparent text-slate-400 hover:text-slate-900'
              }`}
            >
              📦 Réserve Lingerie Centrale
            </button>
            <button
              onClick={() => setLingerieSubTab('charter')}
              className={`py-3 text-xs font-black tracking-wide uppercase border-b-2 transition-all cursor-pointer ${
                lingerieSubTab === 'charter' 
                  ? 'border-emerald-600 text-emerald-700' 
                  : 'border-transparent text-slate-400 hover:text-slate-900'
              }`}
            >
              📋 Charte & Équipement Requis
            </button>
            <button
              onClick={() => setLingerieSubTab('audit')}
              className={`py-3 text-xs font-black tracking-wide uppercase border-b-2 transition-all cursor-pointer ${
                lingerieSubTab === 'audit' 
                  ? 'border-emerald-600 text-emerald-700' 
                  : 'border-transparent text-slate-400 hover:text-slate-900'
              }`}
            >
              🕵️ Audit Physique & Contrôle Chambres
            </button>
            <button
              onClick={() => setLingerieSubTab('laundry')}
              className={`py-3 text-xs font-black tracking-wide uppercase border-b-2 transition-all cursor-pointer ${
                lingerieSubTab === 'laundry' 
                  ? 'border-emerald-600 text-emerald-700' 
                  : 'border-transparent text-slate-400 hover:text-slate-900'
              }`}
            >
              🧺 Suivi Blanchisserie & Lavage ({metrics.totalInLaundry})
            </button>
            <button
              onClick={() => setLingerieSubTab('journal')}
              className={`py-3 text-xs font-black tracking-wide uppercase border-b-2 transition-all cursor-pointer ${
                lingerieSubTab === 'journal' 
                  ? 'border-emerald-600 text-emerald-700' 
                  : 'border-transparent text-slate-400 hover:text-slate-900'
              }`}
            >
              📊 Journal des Pertes & Analyse
            </button>
          </>
        )}
      </div>

      {/* --- MAQUIS SECTION CONTENTS --- */}
      {activeSection === 'maquis' && (
        <>
          {activeSubTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 min-w-[200px] md:flex-initial">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Rechercher par nom..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none text-xs font-medium text-slate-700"
                    />
                  </div>

                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-orange-500 text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    <option value="all">Toutes Catégories Maquis</option>
                    <option value="boisson">🥤 Boissons / Liquides</option>
                    <option value="nourriture">🥩 Nourriture / Viandes</option>
                    <option value="ingredient">🌶️ Ingrédients / Épices</option>
                    <option value="autre">📦 Autre matériel</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value as any)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-orange-500 text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    <option value="all">Tous Niveaux Stock</option>
                    <option value="low">Seuils Critiques</option>
                    <option value="out">En Rupture</option>
                  </select>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-4 px-5">Nom de l'Article</th>
                        <th className="py-4 px-4">Catégorie</th>
                        <th className="py-4 px-4">Emplacement</th>
                        <th className="py-4 px-4 text-right">Stock Théorique</th>
                        <th className="py-4 px-4 text-right">Alerte Minimum</th>
                        <th className="py-4 px-4 text-right">Coût Estimé</th>
                        <th className="py-4 px-4 text-center">Statut</th>
                        <th className="py-4 px-5 text-right">Actions de Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredStockItems.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-slate-400 font-bold">
                            Aucun article trouvé. Cliquez sur "Nouvel Article" pour en ajouter.
                          </td>
                        </tr>
                      ) : (
                        filteredStockItems.map(item => {
                          const isLow = item.quantity > 0 && item.quantity <= item.minQuantity;
                          const isOut = item.quantity <= 0;

                          return (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition-all">
                              <td className="py-3 px-5 font-black text-slate-900">{item.name}</td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] text-slate-600 font-bold">
                                  {item.category === 'boisson' ? '🥤 Boisson' : item.category === 'nourriture' ? '🥩 Nourriture' : item.category === 'ingredient' ? '🌶️ Ingrédient' : '📦 Autre'}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-500 text-[11px]">{item.location || 'Réserve'}</td>
                              <td className="py-3 px-4 text-right font-bold text-slate-900 font-mono">{item.quantity} {item.unit}</td>
                              <td className="py-3 px-4 text-right text-slate-400 font-mono">{item.minQuantity} {item.unit}</td>
                              <td className="py-3 px-4 text-right text-slate-600 font-mono font-semibold">{item.pricePurchase.toLocaleString()} FCFA</td>
                              <td className="py-3 px-4 text-center">
                                {isOut ? (
                                  <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded-full text-[9px] font-black uppercase tracking-wider">Rupture</span>
                                ) : isLow ? (
                                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-[9px] font-black uppercase tracking-wider">Alerte Seuil</span>
                                ) : (
                                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-wider">Optimal</span>
                                )}
                              </td>
                              <td className="py-3 px-5 text-right flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenMovementModal(item, 'in')}
                                  className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-black rounded-lg text-[9px] cursor-pointer"
                                >
                                  + Entrée
                                </button>
                                <button
                                  onClick={() => handleOpenMovementModal(item, 'out')}
                                  className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-black rounded-lg text-[9px] cursor-pointer"
                                >
                                  - Sortie
                                </button>
                                <button
                                  onClick={() => handleOpenMovementModal(item, 'loss')}
                                  className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-black rounded-lg text-[9px] cursor-pointer"
                                >
                                  Perte
                                </button>
                                <button
                                  onClick={() => handleOpenEditItem(item)}
                                  className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteItem(item.id, item.name)}
                                  className="p-1 bg-rose-100/50 hover:bg-rose-100 text-rose-600 rounded-lg cursor-pointer"
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

          {activeSubTab === 'quick_update' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-4 flex gap-3 text-slate-800 text-xs leading-relaxed">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-extrabold text-amber-900">Saisie Rapide de l'Inventaire Physique Quotidien (Maquis)</p>
                  <p className="text-slate-600">
                    Saisissez les quantités réellement constatées sur le terrain. Le système calculera automatiquement les écarts (surplus ou pertes) et générera les mouvements de stock appropriés.
                  </p>
                </div>
              </div>

              {quickSuccessMsg && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-600 animate-bounce" />
                  <span>{quickSuccessMsg}</span>
                </div>
              )}

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Opérateur de contrôle</label>
                  <input
                    type="text"
                    value={quickOperator}
                    onChange={e => setQuickOperator(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Motif général d'ajustement</label>
                  <input
                    type="text"
                    value={quickGlobalReason}
                    onChange={e => setQuickGlobalReason(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="flex items-end justify-end">
                  <button
                    onClick={handleSaveAllQuickItems}
                    className="w-full px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-xl text-xs shadow-md transition-all cursor-pointer"
                  >
                    Valider l'inventaire physique global
                  </button>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-4 px-5">Article</th>
                      <th className="py-4 px-4 text-right">Théorique</th>
                      <th className="py-4 px-4 text-center">Quantité Réelle Physique (Entrer count)</th>
                      <th className="py-4 px-4 text-center">Calcul Écart</th>
                      <th className="py-4 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredStockItems.map(item => {
                      const enteredVal = quickQuantities[item.id] || '';
                      const parsed = parseFloat(enteredVal);
                      const diff = isNaN(parsed) ? 0 : parsed - item.quantity;

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/30">
                          <td className="py-3.5 px-5 font-extrabold text-slate-900">{item.name}</td>
                          <td className="py-3.5 px-4 text-right font-bold text-slate-400 font-mono">{item.quantity} {item.unit}</td>
                          <td className="py-3.5 px-4 text-center">
                            <input
                              type="number"
                              min={0}
                              step="any"
                              value={enteredVal}
                              onChange={e => setQuickQuantities(prev => ({ ...prev, [item.id]: e.target.value }))}
                              className="w-32 px-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-orange-500 focus:outline-none rounded-lg text-center font-mono font-black"
                            />
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {diff === 0 ? (
                              <span className="text-slate-400 text-[11px] font-bold">Sans écart</span>
                            ) : diff > 0 ? (
                              <span className="text-emerald-600 text-[11px] font-bold">+{diff} {item.unit} (Surplus)</span>
                            ) : (
                              <span className="text-rose-600 text-[11px] font-bold">{diff} {item.unit} (Perte)</span>
                            )}
                          </td>
                          <td className="py-3.5 px-5 text-right">
                            <button
                              onClick={() => handleSaveSingleQuickItem(item)}
                              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-lg text-[10px] cursor-pointer"
                            >
                              Ajuster Cet Article
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSubTab === 'history' && (
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xs">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Logs des Mouvements (Maquis & Cuisine)</span>
                <span className="text-[10px] px-2.5 py-1 bg-slate-200 text-slate-600 rounded font-bold font-mono">{sectionMovements.length} logs</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                      <th className="py-3 px-5">Date</th>
                      <th className="py-3 px-4">Article</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4 text-right">Quantité</th>
                      <th className="py-3 px-4 text-right">Variation</th>
                      <th className="py-3 px-4">Justificatif</th>
                      <th className="py-3 px-5">Opérateur</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {sectionMovements.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-slate-400 font-bold">Aucun mouvement enregistré.</td>
                      </tr>
                    ) : (
                      sectionMovements.map(mov => (
                        <tr key={mov.id} className="hover:bg-slate-50/20">
                          <td className="py-3 px-5 text-slate-400 text-[10px] font-mono">{new Date(mov.date).toLocaleString()}</td>
                          <td className="py-3 px-4 font-extrabold text-slate-800">{mov.itemName}</td>
                          <td className="py-3 px-4">
                            {mov.type === 'in' ? (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[9px] font-bold uppercase">Entrée</span>
                            ) : mov.type === 'out' ? (
                              <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded text-[9px] font-bold uppercase">Sortie</span>
                            ) : mov.type === 'loss' ? (
                              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-[9px] font-bold uppercase">Perte</span>
                            ) : (
                              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[9px] font-bold uppercase">Ajustement</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right font-black font-mono text-slate-700">{mov.quantity}</td>
                          <td className="py-3 px-4 text-right font-mono text-[10px]">
                            {mov.previousQty} → <span className="font-bold text-slate-900">{mov.newQty}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 text-[11px] italic">{mov.reason}</td>
                          <td className="py-3 px-5 text-slate-500 font-mono text-[10px]">{mov.operator}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSubTab === 'journal' && renderDetailedJournal()}
        </>
      )}

      {/* --- LINGERIE & ROOMS SECTION CONTENTS --- */}
      {activeSection === 'lingerie' && (
        <>
          {/* LINGERIE INVENTORY TAB */}
          {lingerieSubTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 min-w-[200px] md:flex-initial">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Rechercher linge..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-xs font-medium text-slate-700 shadow-2xs"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value as any)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-xs font-bold text-slate-700 cursor-pointer shadow-2xs"
                  >
                    <option value="all">Tous Niveaux</option>
                    <option value="low">Seuils Alerte</option>
                    <option value="out">En Rupture</option>
                  </select>
                </div>
                
                <div className="text-xs text-slate-400 font-bold font-mono">
                  Affichage de {filteredStockItems.length} article(s) de lingerie hôtelière
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-4 px-5">Article Linge & Équipement</th>
                        <th className="py-4 px-4">Lieu de Stockage</th>
                        <th className="py-4 px-4 text-right">Linge Propre en Réserve</th>
                        <th className="py-4 px-4 text-right">Seuil d'Alerte Réserves</th>
                        <th className="py-4 px-4 text-right">Valeur d'Achat Unitaire</th>
                        <th className="py-4 px-4 text-center">État Stock Central</th>
                        <th className="py-4 px-5 text-right">Actions Centrales</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredStockItems.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400 font-bold leading-relaxed">
                            Aucun équipement de lingerie dans l'inventaire. <br />
                            <span className="text-[11px] text-slate-500">Cliquez sur "Alimenter la Lingerie" pour charger les draps de démonstration.</span>
                          </td>
                        </tr>
                      ) : (
                        filteredStockItems.map(item => {
                          const isLow = item.quantity > 0 && item.quantity <= item.minQuantity;
                          const isOut = item.quantity <= 0;

                          return (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition-all">
                              <td className="py-3 px-5 font-black text-slate-900 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                {item.name}
                              </td>
                              <td className="py-3 px-4 text-slate-500 text-[11px]">{item.location || 'Lingerie hôtelière'}</td>
                              <td className="py-3 px-4 text-right font-bold text-slate-900 font-mono text-sm">{item.quantity} {item.unit}s</td>
                              <td className="py-3 px-4 text-right text-slate-400 font-mono">{item.minQuantity} {item.unit}s</td>
                              <td className="py-3 px-4 text-right text-slate-600 font-mono font-semibold">{item.pricePurchase.toLocaleString()} FCFA</td>
                              <td className="py-3 px-4 text-center">
                                {isOut ? (
                                  <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded-full text-[9px] font-black uppercase tracking-wider">Alerte Rupture</span>
                                ) : isLow ? (
                                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-[9px] font-black uppercase tracking-wider">Stock Très Bas</span>
                                ) : (
                                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-wider">Optimal</span>
                                )}
                              </td>
                              <td className="py-3 px-5 text-right flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenMovementModal(item, 'in')}
                                  className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-black rounded-lg text-[9px] cursor-pointer"
                                >
                                  Entrée (Achat)
                                </button>
                                <button
                                  onClick={() => handleOpenMovementModal(item, 'loss')}
                                  className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-black rounded-lg text-[9px] cursor-pointer"
                                >
                                  Perte / Vol
                                </button>
                                <button
                                  onClick={() => handleOpenEditItem(item)}
                                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteItem(item.id, item.name)}
                                  className="p-1.5 bg-rose-100/50 hover:bg-rose-100 text-rose-600 rounded-lg cursor-pointer"
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

              {/* General Move History under Lingerie */}
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xs mt-6">
                <div className="p-4 border-b border-slate-100 bg-slate-50 font-black text-xs text-slate-700 uppercase tracking-wider">
                  Historique Récent des Mouvements de Lingerie ({sectionMovements.length})
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[9px] border-b border-slate-100">
                        <th className="py-3 px-5">Date</th>
                        <th className="py-3 px-4">Article</th>
                        <th className="py-3 px-4">Action</th>
                        <th className="py-3 px-4 text-right">Quantité</th>
                        <th className="py-3 px-4 text-right">Variation</th>
                        <th className="py-3 px-4">Commentaire / Justification</th>
                        <th className="py-3 px-5">Opérateur</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {sectionMovements.map(mov => (
                        <tr key={mov.id} className="hover:bg-slate-50/20">
                          <td className="py-2.5 px-5 text-slate-400 text-[10px] font-mono">{new Date(mov.date).toLocaleString()}</td>
                          <td className="py-2.5 px-4 font-black text-slate-800">{mov.itemName}</td>
                          <td className="py-2.5 px-4">
                            {mov.type === 'in' ? (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[9px] font-bold">ENTRÉE</span>
                            ) : mov.type === 'out' ? (
                              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[9px] font-bold">SORTIE</span>
                            ) : mov.type === 'loss' ? (
                              <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded text-[9px] font-bold">PERTE / VOL</span>
                            ) : (
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[9px] font-bold">AJUSTEMENT</span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold">{mov.quantity}</td>
                          <td className="py-2.5 px-4 text-right text-slate-400 text-[10px] font-mono">{mov.previousQty} → {mov.newQty}</td>
                          <td className="py-2.5 px-4 text-slate-600 text-[11px] italic">{mov.reason}</td>
                          <td className="py-2.5 px-5 text-slate-500 font-mono text-[10px]">{mov.operator}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* LINGERIE CHARTER TAB */}
          {lingerieSubTab === 'charter' && (
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200/60 rounded-3xl p-5 flex gap-4 text-emerald-900 text-xs leading-relaxed shadow-3xs">
                <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-extrabold text-emerald-950 text-sm">📋 Charte de l'Équipement Minimum des Chambres</p>
                  <p className="text-emerald-800">
                    Définissez ici l'équipement minimum standard requis pour chaque catégorie de chambre de Brunch Bouaké. Lors de chaque audit physique d'une chambre, la gouvernante comparera le linge réellement présent avec ce barème. Tout déficit sera automatiquement enregistré et retiré du stock central centralisé.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['studio', 'room', 'apartment'].map(roomType => {
                  const label = roomType === 'studio' ? 'Studio Chic' : roomType === 'room' ? 'Chambre Confort' : 'Appartement VIP';
                  const requirements = roomMinimums[roomType] || {};

                  return (
                    <div key={roomType} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{label}</span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-mono rounded uppercase">{roomType}</span>
                      </div>
                      
                      <div className="space-y-3 pt-2">
                        {Object.keys(requirements).map(itemName => {
                          const val = requirements[itemName];
                          return (
                            <div key={itemName} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0 group">
                              <span className="font-semibold text-slate-600 truncate mr-1.5" title={itemName}>{itemName}</span>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateMinimum(roomType, itemName, -1)}
                                  className="w-5 h-5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded flex items-center justify-center cursor-pointer text-xs transition-colors"
                                  title="Diminuer la dotation standard"
                                >
                                  -
                                </button>
                                <span className="w-5 text-center font-mono font-black text-slate-900 text-xs">{val}</span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateMinimum(roomType, itemName, 1)}
                                  className="w-5 h-5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded flex items-center justify-center cursor-pointer text-xs transition-colors"
                                  title="Augmenter la dotation standard"
                                >
                                  +
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFromMinimum(roomType, itemName)}
                                  className="w-5 h-5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded flex items-center justify-center cursor-pointer transition-colors ml-1"
                                  title="Retirer cet article de la dotation"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                        {Object.keys(requirements).length === 0 && (
                          <p className="text-[11px] text-slate-400 italic py-4 text-center">Aucun équipement associé à ce type de chambre.</p>
                        )}
                      </div>

                      {/* Add Item to Dotation Form */}
                      <div className="pt-3 border-t border-slate-100 space-y-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">🔌 Associer un équipement</span>
                        <div className="flex gap-1.5">
                          <select
                            value={associatedItemToAdd[roomType] || ''}
                            onChange={e => setAssociatedItemToAdd(prev => ({ ...prev, [roomType]: e.target.value }))}
                            className="flex-1 min-w-0 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 focus:outline-none"
                          >
                            <option value="">-- Choisir --</option>
                            {stockItems
                              .filter(s => (s.category === 'lingerie' || s.category === 'autre') && !Object.keys(requirements).includes(s.name))
                              .map(s => (
                                <option key={s.id} value={s.name}>{s.name}</option>
                              ))
                            }
                          </select>
                          
                          <input
                            type="number"
                            min={1}
                            placeholder="Qté"
                            value={associatedItemQty[roomType] || '2'}
                            onChange={e => setAssociatedItemQty(prev => ({ ...prev, [roomType]: e.target.value }))}
                            className="w-10 px-1 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-center font-mono font-bold text-[10px]"
                          />

                          <button
                            type="button"
                            onClick={() => {
                              const selectedName = associatedItemToAdd[roomType];
                              const qty = parseInt(associatedItemQty[roomType] || '2', 10);
                              if (selectedName && !isNaN(qty) && qty > 0) {
                                handleAddToMinimum(roomType, selectedName, qty);
                                // Reset inputs
                                setAssociatedItemToAdd(prev => ({ ...prev, [roomType]: '' }));
                                setAssociatedItemQty(prev => ({ ...prev, [roomType]: '2' }));
                              }
                            }}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer flex items-center justify-center shrink-0"
                            title="Associer à la dotation"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ROOM AUDIT TAB */}
          {lingerieSubTab === 'audit' && (
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-900 uppercase">🕵️ Audit & Contrôle des Chambres (Check Linge)</h4>
                  <p className="text-[11px] text-slate-500 font-semibold">Sélectionnez une chambre ci-dessous pour enregistrer le comptage du linge présent.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded font-bold uppercase">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Conforme (Linge OK)
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-rose-700 bg-rose-50 px-2.5 py-1 rounded font-bold uppercase animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    Déficitaire (Draps manquants)
                  </div>
                </div>
              </div>

              {/* Grid of physical Rooms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map(room => {
                  const typeLabel = room.type === 'studio' ? 'Studio Chic' : room.type === 'room' ? 'Chambre Confort' : 'Appartement VIP';
                  const lastAudit = roomAudits[room.id];
                  const charterReqs = roomMinimums[room.type] || {};

                  // Check compliance score of last audit
                  let missingItemsCount = 0;
                  if (lastAudit) {
                    Object.keys(charterReqs).forEach(key => {
                      const req = charterReqs[key] || 0;
                      const act = lastAudit.items[key] ?? req;
                      if (act < req) {
                        missingItemsCount += (req - act);
                      }
                    });
                  }

                  return (
                    <div 
                      key={room.id}
                      className={`border rounded-3xl p-5 bg-white shadow-3xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer relative overflow-hidden ${
                        selectedAuditRoom?.id === room.id ? 'ring-2 ring-emerald-500 border-emerald-500' : ''
                      }`}
                      onClick={() => handleOpenRoomAudit(room)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-400 font-mono">Chambre {room.id}</span>
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[9px] text-slate-500 uppercase font-bold">{room.type}</span>
                      </div>
                      
                      <h4 className="text-md font-black text-slate-900 mt-2">{room.name}</h4>
                      <p className="text-[11px] text-slate-500 font-semibold">{typeLabel} • Tarification: {room.pricePerNight.toLocaleString()} FCFA</p>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] text-slate-400 font-bold uppercase block">Dernier Contrôle</span>
                          {lastAudit ? (
                            <span className="text-[10px] text-slate-600 font-medium font-mono">
                              {new Date(lastAudit.date).toLocaleDateString()} par {lastAudit.operator}
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wide">Jamais audité ⚠️</span>
                          )}
                        </div>

                        {lastAudit ? (
                          missingItemsCount > 0 ? (
                            <span className="px-2.5 py-1 bg-rose-50 text-rose-700 text-[10px] font-black rounded-lg border border-rose-100 flex items-center gap-1 animate-pulse">
                              <AlertCircle className="w-3.5 h-3.5" />
                              -{missingItemsCount} Linge(s)
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-lg border border-emerald-100 flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Conforme
                            </span>
                          )
                        ) : (
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-lg border border-slate-200">
                            En attente
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AUDIT DRAWER / FORM IF SELECTED */}
              {selectedAuditRoom && (
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 animate-fade-in space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                        <Activity className="w-4 h-4" />
                      </span>
                      <div>
                        <h4 className="text-sm font-black text-slate-900">Enregistrement d'un Audit Physique de Chambre</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase font-mono">Contrôle Chambre {selectedAuditRoom.id} • {selectedAuditRoom.name}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedAuditRoom(null)}
                      className="text-slate-400 hover:text-slate-800 font-bold text-xs"
                    >
                      Fermer
                    </button>
                  </div>

                  {auditSuccessMsg && (
                    <div className="p-3 bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold animate-pulse">
                      {auditSuccessMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Item input checklist */}
                    <div className="space-y-3">
                      <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Checklist Équipement</h5>
                      
                      {Object.keys(roomMinimums[selectedAuditRoom.type] || {}).map(itemName => {
                        const required = roomMinimums[selectedAuditRoom.type][itemName];
                        const inputVal = auditCounts[itemName] || '0';
                        const realNum = parseInt(inputVal, 10) || 0;
                        const delta = realNum - required;

                        return (
                          <div key={itemName} className="bg-white border border-slate-200/60 rounded-2xl p-3 flex items-center justify-between gap-4 shadow-3xs">
                            <div className="space-y-0.5">
                              <span className="text-xs font-black text-slate-800 block truncate max-w-[200px]" title={itemName}>{itemName}</span>
                              <span className="text-[10px] text-slate-400 font-bold block">Requis Charte : {required} pièces</span>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-slate-400 font-bold">Réel en chambre:</span>
                                <input
                                  type="number"
                                  min={0}
                                  value={inputVal}
                                  onChange={e => setAuditCounts(prev => ({ ...prev, [itemName]: e.target.value }))}
                                  className="w-16 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-center font-mono font-black focus:outline-none focus:border-emerald-500"
                                />
                              </div>

                              <div className="w-24 text-right">
                                {delta === 0 ? (
                                  <span className="text-emerald-600 text-[10px] font-bold uppercase">Conforme ✓</span>
                                ) : delta > 0 ? (
                                  <span className="text-blue-600 text-[10px] font-bold font-mono">+{delta} Excès</span>
                                ) : (
                                  <span className="text-rose-600 text-[10px] font-black font-mono leading-relaxed animate-pulse">🔴 Manque {Math.abs(delta)}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Metadata & submit */}
                    <div className="space-y-4">
                      <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Informations Complémentaires</h5>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Gouvernante / Agent de contrôle</label>
                        <input
                          type="text"
                          value={quickOperator}
                          onChange={e => setQuickOperator(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Observations de l'audit (taches, détériorations, blanchisserie)</label>
                        <textarea
                          placeholder="Ex: Le drap de lit présent présente une tache d'huile. 1 oreiller a été envoyé à la blanchisserie..."
                          value={auditNotes}
                          onChange={e => setAuditNotes(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl text-[10px] text-slate-600 leading-relaxed font-semibold">
                        ⚠️ <strong>Note Importante :</strong> Si vous déclarez des articles manquants, le système considérera qu'ils sont perdus ou hors-service. Les stocks centraux correspondants seront automatiquement amputés de ces unités perdues avec logs de traçabilité.
                      </div>

                      <div className="pt-2 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedAuditRoom(null)}
                          className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500"
                        >
                          Annuler
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveRoomAudit}
                          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-md transition-colors"
                        >
                          Enregistrer l'Audit & Mettre à jour les Stocks
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LINGERIE LAUNDRY TRACKER TAB */}
          {lingerieSubTab === 'laundry' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200/60 rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-3xs">
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-900 uppercase">🧺 Suivi des Flux de Blanchisserie & Lavage Linge</h4>
                  <p className="text-[11px] text-slate-600 font-semibold">
                    Suivez précisément le nombre de pièces hôtelières envoyées au lavage et non encore restituées propre. Empêchez les disparitions de draps !
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => {
                      setLaundryAction('send');
                      setLaundryQtyInput('');
                      setLaundryError('');
                      setLaundrySuccess('');
                      setIsLaundryModalOpen(true);
                    }}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs shadow-lg shadow-blue-600/10 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
                    Mouvement Blanchisserie
                  </button>
                </div>
              </div>

              {/* Grid of Laundry item status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.keys(laundryStock).map(itemName => {
                  const qty = laundryStock[itemName] || 0;
                  
                  // Find Central Stock Item to show contrast
                  const matchingCentral = stockItems.find(s => s.name.toLowerCase() === itemName.toLowerCase() && s.category === 'lingerie');
                  const centralQty = matchingCentral?.quantity || 0;

                  return (
                    <div key={itemName} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-3xs flex flex-col justify-between space-y-4">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Linge au Lavage</span>
                        <h4 className="text-sm font-black text-slate-900 mt-1 truncate" title={itemName}>{itemName}</h4>
                      </div>

                      <div className="flex items-end justify-between">
                        <div>
                          <span className="text-[20px] font-black text-blue-600 font-mono leading-none">{qty}</span>
                          <span className="text-[10px] text-slate-400 font-bold block">En traitement</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xs font-black text-slate-700 block">{centralQty} pcs</span>
                          <span className="text-[9px] text-slate-400 font-bold block">Prêt en réserve</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Laundry Operations logs */}
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xs">
                <div className="p-4 bg-slate-50 border-b border-slate-100 font-black text-xs text-slate-700 uppercase tracking-wider">
                  Journal des Mouvements Blanchisserie (Récents)
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100/50 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                        <th className="py-3 px-5">Heure</th>
                        <th className="py-3 px-4">Linge de Lit / Bain</th>
                        <th className="py-3 px-4">Type de Transfert</th>
                        <th className="py-3 px-4 text-right">Quantité Transférée</th>
                        <th className="py-3 px-4">Motif descriptif</th>
                        <th className="py-3 px-5">Opérateur</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {stockMovements.filter(mov => mov.reason.toLowerCase().includes('blanchisserie')).map(mov => (
                        <tr key={mov.id} className="hover:bg-slate-50/20">
                          <td className="py-2.5 px-5 text-slate-400 font-mono text-[10px]">{new Date(mov.date).toLocaleString()}</td>
                          <td className="py-2.5 px-4 font-black text-slate-800">{mov.itemName}</td>
                          <td className="py-2.5 px-4">
                            {mov.type === 'out' ? (
                              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[9px] font-bold uppercase animate-pulse">🧺 Envoi au lavage</span>
                            ) : (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[9px] font-bold uppercase">✨ Retour propre</span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-right font-black font-mono text-slate-700">{mov.quantity} pcs</td>
                          <td className="py-2.5 px-4 text-slate-600 text-[11px] italic">{mov.reason}</td>
                          <td className="py-2.5 px-5 text-slate-500 font-mono text-[10px]">{mov.operator}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {lingerieSubTab === 'journal' && renderDetailedJournal()}
        </>
      )}

      {/* --- MODALS --- */}

      {/* Item Modal (Create/Edit) */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-md font-black text-slate-900">
                {editingItem ? "✏️ Modifier la fiche d'article" : "➕ Ajouter un nouvel article de stock"}
              </h3>
              <button onClick={() => setIsItemModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold text-xs">Fermer</button>
            </div>

            {itemError && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{itemError}</span>
              </div>
            )}

            {itemSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{itemSuccess}</span>
              </div>
            )}

            <form onSubmit={handleItemSubmit} className="space-y-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Désignation de l'Article *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Drap de lit King Size, Bière Beaufort..."
                  value={itemName}
                  onChange={e => setItemName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-orange-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Catégorie *</label>
                  <select
                    value={itemCategory}
                    onChange={e => setItemCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    <option value="boisson">🥤 Boisson / Liquide</option>
                    <option value="nourriture">🥩 Nourriture / Viande</option>
                    <option value="ingredient">🌶️ Ingrédient / Épice</option>
                    <option value="lingerie">🏨 Lingerie / Chambre</option>
                    <option value="autre">📦 Autre matériel</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Unité de mesure *</label>
                  <select
                    value={itemUnit}
                    onChange={e => setItemUnit(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    <option value="unité">Unité / Pièce</option>
                    <option value="casier">Casier</option>
                    <option value="bouteille">Bouteille</option>
                    <option value="kg">Kilogramme (kg)</option>
                    <option value="litre">Litre (L)</option>
                    <option value="portion">Portion</option>
                    <option value="sac">Sac</option>
                    <option value="paquet">Paquet</option>
                  </select>
                </div>
              </div>

              {!editingItem && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Quantité Initiale Physique *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step="any"
                    value={itemQuantity}
                    onChange={e => setItemQuantity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Seuil d'Alerte Minimum *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step="any"
                    value={itemMinQty}
                    onChange={e => setItemMinQty(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Prix d'Achat Estimé (FCFA) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    placeholder="Ex: 5000"
                    value={itemPricePurchase}
                    onChange={e => setItemPricePurchase(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Lieu de Stockage / Rayon</label>
                <input
                  type="text"
                  placeholder="Ex: Cave centrale, Cuisine, Lingerie..."
                  value={itemLocation}
                  onChange={e => setItemLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-xl text-xs shadow-md cursor-pointer"
                >
                  {editingItem ? "Enregistrer les modifications" : "Créer l'article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Movement Register Modal */}
      {isMovementModalOpen && selectedStockItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-md font-black text-slate-900">⚙️ Enregistrer un Mouvement : {selectedStockItem.name}</h3>
              <button onClick={() => { setIsMovementModalOpen(false); setSelectedStockItem(null); }} className="text-slate-400 hover:text-slate-700 font-bold text-xs">Fermer</button>
            </div>

            {movementError && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{movementError}</span>
              </div>
            )}

            {movementSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 animate-bounce" />
                <span>{movementSuccess}</span>
              </div>
            )}

            <form onSubmit={handleMovementSubmit} className="space-y-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Nature de l'opération de stock</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { type: 'in', label: '+ Entrée (Approvisionnement)', color: 'border-emerald-500 text-emerald-700 bg-emerald-50/55' },
                    { type: 'out', label: '- Sortie (Consommation)', color: 'border-rose-500 text-rose-700 bg-rose-50/55' },
                    { type: 'loss', label: '⚡ Perte / Vol / Casse', color: 'border-amber-500 text-amber-700 bg-amber-50/55' },
                    { type: 'inventory', label: '⚙️ Correction d\'Inventaire', color: 'border-blue-500 text-blue-700 bg-blue-50/55' }
                  ].map(op => (
                    <button
                      key={op.type}
                      type="button"
                      onClick={() => setMovementType(op.type as any)}
                      className={`py-2 px-3 border rounded-xl font-bold text-center transition-all cursor-pointer ${
                        movementType === op.type ? op.color : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {op.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                <span className="font-bold text-slate-400 text-[10px] uppercase">Réserve centrale actuelle :</span>
                <span className="font-black text-slate-900 font-mono text-sm">{selectedStockItem.quantity} {selectedStockItem.unit}s</span>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  {movementType === 'inventory' ? 'Nouvelle quantité physique réelle *' : 'Quantité du transfert *'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min={0.01}
                    step="any"
                    value={movementQty}
                    onChange={e => setMovementQty(e.target.value)}
                    className="w-full pl-4 pr-20 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-black"
                  />
                  <span className="absolute right-3.5 top-3 text-[10px] text-slate-400 font-bold uppercase">{selectedStockItem.unit}s</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Justificatif / Note explicative *</label>
                <input
                  type="text"
                  required
                  placeholder="Saisissez le motif..."
                  value={movementReason}
                  onChange={e => setMovementReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setIsMovementModalOpen(false); setSelectedStockItem(null); }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-xl text-xs shadow-md cursor-pointer"
                >
                  Enregistrer le mouvement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Laundry Transaction Dialog */}
      {isLaundryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-md font-black text-slate-900">🧺 Envoi ou Retour de Blanchisserie</h3>
              <button onClick={() => setIsLaundryModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold text-xs">Fermer</button>
            </div>

            {laundryError && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{laundryError}</span>
              </div>
            )}

            {laundrySuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2 animate-pulse">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{laundrySuccess}</span>
              </div>
            )}

            <form onSubmit={handleLaundrySubmit} className="space-y-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Sélectionner l'Action</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLaundryAction('send')}
                    className={`py-2 px-3 border rounded-xl font-bold text-center transition-all cursor-pointer ${
                      laundryAction === 'send'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    🧺 Envoi au Lavage
                  </button>
                  <button
                    type="button"
                    onClick={() => setLaundryAction('receive')}
                    className={`py-2 px-3 border rounded-xl font-bold text-center transition-all cursor-pointer ${
                      laundryAction === 'receive'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    ✨ Retour propre à la Réserve
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Sélectionner le Linge concerné</label>
                <select
                  value={selectedLaundryItemName}
                  onChange={e => setSelectedLaundryItemName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  <option value="Draps de lit King Size (Blanc hôtelier)">Draps de lit King Size (Blanc hôtelier)</option>
                  <option value="Couvre-lits Brodés (Brunch Signature)">Couvre-lits Brodés (Brunch Signature)</option>
                  <option value="Oreillers Confort Soft & Taies">Oreillers Confort Soft & Taies</option>
                  <option value="Serviettes de bain Éponge (Coton)">Serviettes de bain Éponge (Coton)</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">En cours au Lavage :</span>
                  <span className="font-mono font-black text-blue-600">{laundryStock[selectedLaundryItemName] || 0} pcs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Propre en Réserve :</span>
                  <span className="font-mono font-black text-slate-700">
                    {stockItems.find(s => s.name.toLowerCase() === selectedLaundryItemName.toLowerCase() && s.category === 'lingerie')?.quantity || 0} pcs
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Quantité de pièces à transférer *</label>
                <input
                  type="number"
                  required
                  min={1}
                  placeholder="Ex: 10"
                  value={laundryQtyInput}
                  onChange={e => setLaundryQtyInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-black text-sm text-slate-800"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsLaundryModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs shadow-md cursor-pointer"
                >
                  Enregistrer le transfert blanchisserie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
