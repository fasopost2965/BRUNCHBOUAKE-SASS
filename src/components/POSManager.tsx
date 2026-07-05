import React, { useState, useMemo } from 'react';
import { 
  UtensilsCrossed, 
  ShoppingCart, 
  Search, 
  Bed, 
  Check, 
  Plus, 
  Minus, 
  Trash2, 
  Layers, 
  Printer, 
  CheckCircle,
  Clock,
  User,
  X,
  CreditCard,
  ChevronRight,
  Info,
  List,
  LayoutGrid,
  ChevronDown,
  ShoppingBag,
  Award,
  Settings,
  ArrowRight,
  Lock,
  UserCheck,
  History,
  FileText,
  Percent,
  ShieldAlert,
  Bell,
  RefreshCw,
  HelpCircle,
  Smartphone,
  Activity,
  QrCode,
  Camera,
  Video,
  VideoOff,
  Sparkles,
  Volume2,
  Move,
  Map
} from 'lucide-react';
import { MenuItem, OrderItem, TableOrder, Room, Transaction, Reservation, PaymentIntent, PaymentTransaction, WebhookEvent, ProcessedEvent, PaymentProvider, PropertySettings } from '../types';
import { PaymentOrchestrator, WaveAdapter, OrangeMoneyAdapter } from '../services/paymentService';

interface POSProps {
  menu: MenuItem[];
  rooms: Room[];
  reservations: Reservation[];
  activeOrders: TableOrder[];
  onAddOrder: (order: TableOrder) => void;
  onUpdateOrders: (updated: TableOrder[]) => void;
  onAddTransaction: (t: Transaction) => void;
  // Unified payment states
  paymentIntents: PaymentIntent[];
  paymentTransactions: PaymentTransaction[];
  webhookEvents: WebhookEvent[];
  processedEvents: ProcessedEvent[];
  onUpdatePaymentIntents: React.Dispatch<React.SetStateAction<PaymentIntent[]>>;
  onUpdatePaymentTransactions: React.Dispatch<React.SetStateAction<PaymentTransaction[]>>;
  onUpdateWebhookEvents: React.Dispatch<React.SetStateAction<WebhookEvent[]>>;
  onUpdateProcessedEvents: React.Dispatch<React.SetStateAction<ProcessedEvent[]>>;
  settings: PropertySettings;
}

// Interactive mockup menu items for extreme high-fidelity feel
const RICH_MOCK_MENU = [
  { id: 'item-1', name: 'Kedjenou de Poulet Local', category: 'plat', price: 6500, available: true, tags: ['specials', 'fast_moving'], description: 'Poulet mijoté à l\'étouffée avec légumes frais, servi chaud.' },
  { id: 'item-2', name: 'Poulet Braisé d\'Or + Alloco', category: 'plat', price: 5500, available: true, tags: ['fast_moving'], description: 'Poulet entier mariné et braisé au charbon de bois.' },
  { id: 'item-3', name: 'Garba National Premium', category: 'plat', price: 4000, available: true, tags: ['fast_moving'], description: 'Attiéké à l\'huile rouge avec thon frit croustillant, piment.' },
  { id: 'item-4', name: 'Poisson Carpe Braisé', category: 'plat', price: 7500, available: true, tags: ['specials'], description: 'Poisson carpe fraîchement grillé, servi avec oignons.' },
  { id: 'item-5', name: 'Foutou Banane Sauce Graine', category: 'plat', price: 6000, available: true, tags: ['specials'], description: 'Foutou traditionnel avec sauce graine onctueuse.' },
  
  { id: 'item-6', name: 'Salade d\'Avocat au Crabe', category: 'entrées', price: 4500, available: true, tags: ['non_alcoholic'], description: 'Entrée fraîche d\'avocat de pays et chair de crabe marinée.' },
  { id: 'item-7', name: 'Pastels de Viande Croustillants (x5)', category: 'entrées', price: 3000, available: true, tags: ['fast_moving'], description: 'Beignets croustillants farcis à la viande hachée épicée.' },
  { id: 'item-8', name: 'Brochettes de Boeuf Suya (x3)', category: 'entrées', price: 3500, available: true, tags: ['specials'], description: 'Brochettes de boeuf épicées à l\'arachide.' },

  { id: 'item-9', name: 'Bière Beaufort Lager (65cl)', category: 'boissons', price: 1500, available: true, tags: ['alcoholic', 'fast_moving'], description: 'Bière blonde fraîche brassée localement.' },
  { id: 'item-10', name: 'Bière Castel Beer (65cl)', category: 'boissons', price: 1500, available: true, tags: ['alcoholic'], description: 'Bière de caractère rafraîchissante.' },
  { id: 'item-11', name: 'Eau Minérale Awa (1.5L)', category: 'boissons', price: 1000, available: true, tags: ['non_alcoholic', 'fast_moving'], description: 'Eau de source purifiée.' },
  { id: 'item-12', name: 'Bissap Glacé Maison Rouge', category: 'boissons', price: 1200, available: true, tags: ['non_alcoholic', 'fast_moving'], description: 'Infusion de fleurs d\'hibiscus au sucre de canne.' },
  { id: 'item-13', name: 'Gnamankoudji Gingembre', category: 'boissons', price: 1200, available: true, tags: ['non_alcoholic', 'specials'], description: 'Jus de gingembre pressé épicé et énergisant.' },

  { id: 'item-14', name: 'Cocktail Mojito Tropical', category: 'cocktails', price: 4000, available: true, tags: ['alcoholic', 'specials'], description: 'Rhum, citron vert, menthe fraîche et sirop de passion.' },
  { id: 'item-15', name: 'Planteur Spécial Bouaké', category: 'cocktails', price: 4500, available: true, tags: ['alcoholic'], description: 'Mélange de jus exotiques, rhum blanc et ambré.' },
  { id: 'item-16', name: 'Punch Hibiscus Sans Alcool', category: 'cocktails', price: 3000, available: true, tags: ['non_alcoholic'], description: 'Cocktail de fruits frais pressés infusé au bissap.' },

  { id: 'item-17', name: 'Pain Beurre de Table + Café', category: 'petit-déjeuner', price: 2500, available: true, tags: ['non_alcoholic'], description: 'Baguette ivoirienne chaude, beurre de pays et café au choix.' },
  { id: 'item-18', name: 'Omelette Maquisienne Garnie', category: 'petit-déjeuner', price: 3000, available: true, tags: ['fast_moving'], description: 'Trois oeufs battus avec tomates, oignons et piments.' },
  { id: 'item-19', name: 'Brunch Complet Bouaké', category: 'petit-déjeuner', price: 7000, available: true, tags: ['specials', 'fast_moving'], description: 'Omelette, alloco, jus frais, boisson chaude, saucisses grillées.' },

  { id: 'item-20', name: 'Portion d\'Alloco Doré', category: 'extras', price: 1500, available: true, tags: ['fast_moving'], description: 'Bananes plantains frites dorées dans l\'huile pure.' },
  { id: 'item-21', name: 'Frites d\'Attiéké Supplément', category: 'extras', price: 1000, available: true, tags: ['fast_moving'], description: 'Couscous de manioc ivoirien traditionnel.' },
  { id: 'item-22', name: 'Piment Frais Érasé Maison', category: 'extras', price: 500, available: true, tags: [], description: 'Piment de table rouge écrasé très piquant.' },

  { id: 'item-23', name: 'Formule Room Service Express', category: 'room_service', price: 2000, available: true, tags: [], description: 'Frais fixes de livraison de plats directement en chambre.' }
];



export default function POSManager({
  menu,
  rooms,
  reservations,
  activeOrders,
  onAddOrder,
  onUpdateOrders,
  onAddTransaction,
  paymentIntents,
  paymentTransactions,
  webhookEvents,
  processedEvents,
  onUpdatePaymentIntents,
  onUpdatePaymentTransactions,
  onUpdateWebhookEvents,
  onUpdateProcessedEvents
}: POSProps) {
  
  // Basic POS states
  const [activeTable, setActiveTable] = useState<string>('Table 1');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [globalSearch, setGlobalSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Table Plan interactive states
  const [posMode, setPosMode] = useState<'billing' | 'table_plan'>('billing');
  const [dragOverTable, setDragOverTable] = useState<string | null>(null);
  const [tablePlanSearchQuery, setTablePlanSearchQuery] = useState('');
  
  // Dynamic Guest Folios built from real checked-in reservations (single source of truth)
  const guestFolios = useMemo(() => {
    const checkedIn = (reservations || []).filter(r => r.status === 'checked-in');
    return checkedIn.map(res => {
      // Get unpaid restaurant charges for this room
      const roomOrders = (activeOrders || []).filter(o => o.roomIdForCharge === res.roomId && o.status !== 'paid');
      const restaurantCharges = roomOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      
      const lodgingCharges = res.totalAmount;
      const paymentsMade = res.paidAmount;
      const extrasCharges = restaurantCharges;
      const outstandingBalance = (lodgingCharges - paymentsMade) + extrasCharges;
      
      return {
        roomId: res.roomId,
        guestName: res.guestName,
        checkIn: res.checkInDate,
        checkOut: res.checkOutDate,
        status: 'Enregistré',
        phone: res.guestPhone,
        email: res.guestEmail,
        lodgingCharges,
        restaurantCharges,
        extrasCharges,
        paymentsMade,
        outstandingBalance,
        reservationId: res.id
      };
    });
  }, [reservations, rooms, activeOrders]);

  // Guest Context State
  const [customerType, setCustomerType] = useState<'walk_in' | 'in_house'>('walk_in');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [selectedGuestName, setSelectedGuestName] = useState<string>('');
  const [selectedGuestFolio, setSelectedGuestFolio] = useState<any | null>(null);
  const [enteredRoomPin, setEnteredRoomPin] = useState<string>('');
  const [pinErrorMessage, setPinErrorMessage] = useState<string>('');

  // Configurable Tax (TVA) and Invoice settings
  const [taxRate, setTaxRate] = useState<number>(18); // Default 18% (TVA in Ivory Coast)
  const [includeTax, setIncludeTax] = useState<boolean>(true);

  // Mobile Money safe payment tracking
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState<string>('');
  const [paymentReference, setPaymentReference] = useState<string>('');

  // Payment Gateway simulation states
  const [activePaymentIntent, setActivePaymentIntent] = useState<PaymentIntent | null>(null);
  const [activeAdapterResponse, setActiveAdapterResponse] = useState<any | null>(null);
  const [showPaymentGatewayModal, setShowPaymentGatewayModal] = useState<boolean>(false);
  const [paymentGatewayLogs, setPaymentGatewayLogs] = useState<string[]>([]);
  const [reconciliationReason, setReconciliationReason] = useState<string>('');
  const [reconciledByRole, setReconciledByRole] = useState<string>('Comptable');

  // Live Inventory State for restaurant/maquis
  const [inventory, setInventory] = useState<Record<string, { name: string; stock: number; minStock: number }>>({
    'item-1': { name: 'Kedjenou de Poulet Local', stock: 12, minStock: 5 },
    'item-2': { name: 'Poulet Braisé d\'Or', stock: 4, minStock: 5 }, // understocked!
    'item-3': { name: 'Garba National Premium', stock: 18, minStock: 6 },
    'item-4': { name: 'Poisson Carpe Braisé', stock: 3, minStock: 5 }, // understocked!
    'item-9': { name: 'Bière Beaufort Lager (65cl)', stock: 45, minStock: 12 },
    'item-11': { name: 'Eau Minérale Awa (1.5L)', stock: 8, minStock: 10 }, // understocked!
    'item-20': { name: 'Portion d\'Alloco Doré', stock: 35, minStock: 8 }
  });

  // Cart / Active Order state
  const [cart, setCart] = useState<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    modifiers: string[]; // e.g. "sans piment", "extra sauce", "takeaway"
    notes: string;
  }[]>([]);

  // Billing & Payment options
  const [billingMode, setBillingMode] = useState<'pay_now' | 'charge_to_room' | 'split'>('pay_now');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cash' | 'wave' | 'orange_money' | 'momo' | 'card'>('cash');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [serviceChargePercent, setServiceChargePercent] = useState<number>(0);
  const [cashGiven, setCashGiven] = useState<number>(0);

  // Split payment allocations
  const [splits, setSplits] = useState<{ method: string; amount: number }[]>([
    { method: 'cash', amount: 0 },
    { method: 'wave', amount: 0 }
  ]);

  // Drawer / Modal states
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [showGuestFolioDetails, setShowGuestFolioDetails] = useState(false);
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);
  const [showRoomSelector, setShowRoomSelector] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [showMobileCartDrawer, setShowMobileCartDrawer] = useState(false);
  const [isCartBouncing, setIsCartBouncing] = useState(false);
  const [lastAddedItemName, setLastAddedItemName] = useState<string>('');
  const [showAddedToast, setShowAddedToast] = useState(false);

  // QR Code Scanner States
  const [showQRScanner, setShowQRScanner] = useState<boolean>(false);
  const [qrScannerMode, setQrScannerMode] = useState<'camera' | 'upload'>('camera');
  const [qrScanningActive, setQrScanningActive] = useState<boolean>(false);
  const [qrScanResult, setQrScanResult] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [qrScannerSuccessMessage, setQrScannerSuccessMessage] = useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  // Play success beep using standard Web Audio API
  const playSuccessSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5 Chime
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      osc.start();
      
      osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.1); // A5 Chime
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.45);
      osc.stop(ctx.currentTime + 0.45);
    } catch (e) {
      console.log('Audio feedback not supported in this environment:', e);
    }
  };

  const startCamera = async () => {
    try {
      setCameraError(null);
      setQrScanningActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Camera error:", err);
      setCameraError("Impossible d'accéder à la caméra. Veuillez accorder les permissions ou utiliser le simulateur interactif.");
      setQrScanningActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setQrScanningActive(false);
  };

  React.useEffect(() => {
    if (showQRScanner && qrScannerMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [showQRScanner, qrScannerMode]);

  const handleQRScanAction = (payload: string) => {
    playSuccessSound();
    setQrScanResult(payload);
    
    if (payload.startsWith('ticket:')) {
      const ticketId = payload.split(':')[1];
      setQrScannerSuccessMessage(`Ticket de commande #${ticketId} détecté ! Chargement du panier en cours...`);
      
      const itemsToLoad = [
        { id: 'item-1', name: 'Kedjenou de Poulet Local', price: 6500, quantity: 1, modifiers: ['sans piment'], notes: 'Scanné via QR Code' },
        { id: 'item-9', name: 'Bière Beaufort Lager (65cl)', price: 1500, quantity: 2, modifiers: [], notes: '' },
        { id: 'item-20', name: "Portion d'Alloco Doré", price: 1500, quantity: 1, modifiers: [], notes: '' }
      ];
      
      setCart(itemsToLoad);
      setActiveTable('Table 4');
      
      setTimeout(() => {
        setShowQRScanner(false);
        setQrScannerSuccessMessage(null);
        setQrScanResult(null);
        stopCamera();
      }, 2500);
      
    } else if (payload.startsWith('payment:wave:')) {
      const [_, brand, phone, amountStr] = payload.split(':');
      const amount = parseInt(amountStr) || totalToPay;
      setQrScannerSuccessMessage(`Paiement QR Wave détecté ! Montant client : ${amount.toLocaleString('fr-FR')} F CFA.`);
      
      setBillingMode('pay_now');
      setSelectedPaymentMethod('wave');
      setMobileMoneyNumber(phone);
      setPaymentReference(`QR-WAVE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
      
      setTimeout(() => {
        setShowQRScanner(false);
        setQrScannerSuccessMessage(null);
        setQrScanResult(null);
        stopCamera();
        
        if (cart.length > 0) {
          handleCheckoutOrder();
        } else {
          alert("Le panier est vide. Les informations de paiement ont été pré-remplies dans la fiche de règlement direct !");
        }
      }, 2500);
      
    } else if (payload.startsWith('payment:orange_money:')) {
      const [_, brand, phone, amountStr] = payload.split(':');
      const amount = parseInt(amountStr) || totalToPay;
      setQrScannerSuccessMessage(`Paiement QR Orange Money détecté ! Montant client : ${amount.toLocaleString('fr-FR')} F CFA.`);
      
      setBillingMode('pay_now');
      setSelectedPaymentMethod('orange_money');
      setMobileMoneyNumber(phone);
      setPaymentReference(`QR-OM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
      
      setTimeout(() => {
        setShowQRScanner(false);
        setQrScannerSuccessMessage(null);
        setQrScanResult(null);
        stopCamera();
        
        if (cart.length > 0) {
          handleCheckoutOrder();
        } else {
          alert("Le panier est vide. Les informations de paiement ont été pré-remplies dans la fiche de règlement direct !");
        }
      }, 2500);
      
    } else if (payload.startsWith('discount:')) {
      const code = payload.split(':')[1];
      const rate = parseInt(payload.split(':')[2]) || 20;
      setQrScannerSuccessMessage(`Remise VIP QR Code "${code}" détectée ! Réduction instantanée de ${rate}% appliquée.`);
      
      setDiscountPercent(rate);
      
      setTimeout(() => {
        setShowQRScanner(false);
        setQrScannerSuccessMessage(null);
        setQrScanResult(null);
        stopCamera();
      }, 2500);
    } else {
      setQrScannerSuccessMessage(`Contenu QR Code inconnu : "${payload}"`);
      setTimeout(() => {
        setQrScanResult(null);
        setQrScannerSuccessMessage(null);
      }, 3000);
    }
  };
  
  // simulated database states
  const [posHistory, setPosHistory] = useState<TableOrder[]>([
    {
      id: 'ord-8109',
      tableNumber: 'Table 4',
      items: [
        { menuItemId: 'item-1', name: 'Kedjenou de Poulet Local', price: 6500, quantity: 2 },
        { menuItemId: 'item-9', name: 'Bière Beaufort Lager (65cl)', price: 1500, quantity: 4 }
      ],
      status: 'paid',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      totalAmount: 19000
    },
    {
      id: 'ord-8110',
      tableNumber: 'Bar 2',
      items: [
        { menuItemId: 'item-2', name: 'Poulet Braisé d\'Or + Alloco', price: 5500, quantity: 1 },
        { menuItemId: 'item-12', name: 'Bissap Glacé Maison Rouge', price: 1200, quantity: 2 }
      ],
      status: 'paid',
      createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      totalAmount: 7900,
      roomIdForCharge: '104'
    }
  ]);

  // Shift & Cashier presets
  const SHIFT_INFO = {
    name: "Shift de Journée",
    time: "08:00 - 16:00",
    cashierName: "Sia Bakayoko",
    station: "Caisse Principale Maquis",
    cashInDrawer: 145000 // Initial cash fund
  };

  const TABLES = [
    'Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5',
    'Bar 1', 'Bar 2', 'Bar 3',
    'Terrasse A', 'Terrasse B', 'VIP Lounge', 'Room Service'
  ];

  // Map category IDs to French labels
  const CATEGORIES = [
    { id: 'all', label: 'Tout le menu' },
    { id: 'entrées', label: 'Entrées' },
    { id: 'plat', label: 'Plats Locals' },
    { id: 'boissons', label: 'Boissons' },
    { id: 'cocktails', label: 'Cocktails' },
    { id: 'petit-déjeuner', label: 'Petit-Déjeuner' },
    { id: 'extras', label: 'Extras' },
    { id: 'room_service', label: 'Room Service' }
  ];

  // Map filters
  const FILTERS = [
    { id: 'all', label: 'Tout' },
    { id: 'fast_moving', label: 'Très commandé' },
    { id: 'specials', label: 'Spécialités' },
    { id: 'alcoholic', label: 'Alcoolisés' },
    { id: 'non_alcoholic', label: 'Sans Alcool' }
  ];

  // Combined menu selection (props and rich mock database to offer broad choices)
  const availableMenuItems = useMemo(() => {
    // Merge actual menu from props and RICH_MOCK_MENU to avoid duplicate IDs
    const existingIds = new Set(menu.map(i => i.id));
    const merged = [...menu];
    RICH_MOCK_MENU.forEach(item => {
      if (!existingIds.has(item.id)) {
        merged.push({
          id: item.id,
          tenantId: 'tenant-bouake-kennedy',
          name: item.name,
          category: (item.category === 'entrées' || item.category === 'boissons' || item.category === 'cocktails' || item.category === 'petit-déjeuner' || item.category === 'extras' || item.category === 'room_service') ? 'plat' : item.category as any,
          price: item.price,
          available: item.available
        });
      }
    });

    // Match filtering
    return RICH_MOCK_MENU.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      
      const matchesFilter = activeFilter === 'all' || item.tags.includes(activeFilter);

      return matchesSearch && matchesCategory && matchesFilter;
    });
  }, [menu, searchQuery, activeCategory, activeFilter]);

  // Cart calculation getters
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    return Math.round((subtotal * discountPercent) / 100);
  }, [subtotal, discountPercent]);

  const serviceChargeAmount = useMemo(() => {
    return Math.round((subtotal * serviceChargePercent) / 100);
  }, [subtotal, serviceChargePercent]);

  const taxAmount = useMemo(() => {
    if (!includeTax) return 0;
    return Math.round(((subtotal - discountAmount) * taxRate) / 100);
  }, [subtotal, discountAmount, taxRate, includeTax]);

  const totalToPay = useMemo(() => {
    return subtotal - discountAmount + serviceChargeAmount + taxAmount;
  }, [subtotal, discountAmount, serviceChargeAmount, taxAmount]);

  const changeDue = useMemo(() => {
    if (cashGiven <= 0) return 0;
    return Math.max(0, cashGiven - totalToPay);
  }, [cashGiven, totalToPay]);

  // Cart state modifiers
  const handleAddToCart = (item: typeof RICH_MOCK_MENU[0]) => {
    // Check inventory stock if tracked
    const tracked = inventory[item.id];
    if (tracked && tracked.stock <= 0) {
      alert(`RUPTURE DE STOCK: Il n'y a plus de "${item.name}" disponible.`);
      return;
    }

    // Trigger bounce animation & toast message
    setIsCartBouncing(true);
    setLastAddedItemName(item.name);
    setShowAddedToast(true);
    setTimeout(() => {
      setIsCartBouncing(false);
    }, 600);
    setTimeout(() => {
      setShowAddedToast(false);
    }, 2500);

    const existingIdx = cart.findIndex(i => i.id === item.id);
    if (existingIdx > -1) {
      const currentQty = cart[existingIdx].quantity;
      if (tracked && tracked.stock <= currentQty) {
        alert(`STOCK INSUFFISANT: Seulement ${tracked.stock} portion(s) disponible(s).`);
        return;
      }
      const updated = [...cart];
      updated[existingIdx].quantity += 1;
      setCart(updated);
    } else {
      setCart([...cart, {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        modifiers: [],
        notes: ''
      }]);
    }
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    const tracked = inventory[id];
    const newQty = item.quantity + delta;

    if (newQty <= 0) {
      setCart(cart.filter(i => i.id !== id));
      return;
    }

    if (delta > 0 && tracked && tracked.stock < newQty) {
      alert(`STOCK INSUFFISANT: Stock maximal atteint (${tracked.stock} portions).`);
      return;
    }

    setCart(cart.map(i => i.id === id ? { ...i, quantity: newQty } : i));
  };

  const handleToggleModifier = (itemId: string, modifier: string) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const hasMod = item.modifiers.includes(modifier);
        const newMods = hasMod 
          ? item.modifiers.filter(m => m !== modifier) 
          : [...item.modifiers, modifier];
        return { ...item, modifiers: newMods };
      }
      return item;
    }));
  };

  const handleUpdateItemNotes = (itemId: string, note: string) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        return { ...item, notes: note };
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
    setDiscountPercent(0);
    setServiceChargePercent(0);
    setCashGiven(0);
    setBillingMode('pay_now');
    setPaymentReference('');
    setMobileMoneyNumber('');
    setEnteredRoomPin('');
    setPinErrorMessage('');
  };

  // Folio linking handlers
  const handleLinkRoom = (roomId: string) => {
    const folio = guestFolios.find(f => f.roomId === roomId);
    if (folio) {
      setSelectedRoomId(roomId);
      setSelectedGuestName(folio.guestName);
      setSelectedGuestFolio(folio);
      setCustomerType('in_house');
      setBillingMode('charge_to_room');
      setDiscountPercent(10); // Automatically apply 10% loyalty discount
      setShowRoomSelector(false);
    }
  };

  const handleUnlinkRoom = () => {
    setSelectedRoomId('');
    setSelectedGuestName('');
    setSelectedGuestFolio(null);
    setCustomerType('walk_in');
    setBillingMode('pay_now');
    setDiscountPercent(0);
    setEnteredRoomPin('');
    setPinErrorMessage('');
  };

  // Finalize POS checkout after verified PaymentIntent is succeeded
  const finalizeCheckoutAfterPayment = (intent: PaymentIntent) => {
    const orderId = intent.sourceId;
    const itemsFormatted = cart.map(item => ({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));

    const newOrder: TableOrder = {
      id: orderId,
      tenantId: 'tenant-bouake-kennedy',
      tableNumber: activeTable,
      items: itemsFormatted,
      status: 'paid',
      createdAt: new Date().toISOString(),
      totalAmount: intent.amount,
    };

    // Decrement inventory stock
    setInventory(prev => {
      const updated = { ...prev };
      cart.forEach(item => {
        if (updated[item.id]) {
          updated[item.id] = {
            ...updated[item.id],
            stock: Math.max(0, updated[item.id].stock - item.quantity)
          };
        }
      });
      return updated;
    });

    onAddOrder(newOrder);
    setPosHistory([newOrder, ...posHistory]);

    const extraDesc = ` [MM Tél: ${intent.phoneNumber}, Réf MM: ${intent.providerReference || 'N/A'}]`;
    const transaction: Transaction = {
      id: `TXN-${Date.now().toString().slice(-5)}`,
      tenantId: 'tenant-bouake-kennedy',
      type: 'pos_sale',
      amount: intent.amount,
      method: intent.provider,
      description: `Vente POS Maquis - ${activeTable} (${cart.length} articles)${extraDesc}`,
      date: new Date().toISOString(),
      referenceId: orderId,
      idempotencyKey: `idem-pos-gw-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    onAddTransaction(transaction);

    setShowPaymentGatewayModal(false);
    setShowPaymentSuccess(true);
  };

  // Place & process checkout order
  const handleCheckoutOrder = () => {
    if (cart.length === 0) return;

    const orderId = `ord-${Date.now().toString().slice(-4)}`;

    // Validate security pin and credit limit if charging to room
    if (billingMode === 'charge_to_room') {
      setPinErrorMessage('');
      const activeRes = (reservations || []).find(r => r.roomId === selectedRoomId && r.status === 'checked-in');
      if (!activeRes) {
        setPinErrorMessage("Erreur : Aucun voyageur n'est actuellement enregistré dans cette chambre.");
        return;
      }

      const expectedPin = activeRes.securityPin || '1234';
      if (enteredRoomPin !== expectedPin) {
        setPinErrorMessage(`ERREUR CODE PIN : Le code PIN saisi (${enteredRoomPin || 'vide'}) est incorrect pour la Chambre ${selectedRoomId}.`);
        return;
      }

      const limit = activeRes.creditLimit || 50000;
      const roomOrders = (activeOrders || []).filter(o => o.roomIdForCharge === selectedRoomId && o.status !== 'paid');
      const currentExtras = roomOrders.reduce((sum, o) => sum + o.totalAmount, 0);

      if (currentExtras + totalToPay > limit) {
        setPinErrorMessage(`CRÉDIT DÉPASSÉ : Limite autorisée de ${limit.toLocaleString('fr-FR')} F dépassée (Encours : ${currentExtras.toLocaleString('fr-FR')} F, Addition actuelle : ${totalToPay.toLocaleString('fr-FR')} F). Veuillez régler directement ou autoriser un dépassement de crédit auprès du Gérant.`);
        return;
      }
    }

    // Intercept Mobile Money payments (Wave / Orange Money) for walk-in immediate payment
    if (billingMode === 'pay_now' && (selectedPaymentMethod === 'wave' || selectedPaymentMethod === 'orange_money')) {
      if (!mobileMoneyNumber) {
        alert('VEUILLEZ RENSAIGNER : Un numéro de téléphone valide est requis pour le paiement Mobile Money.');
        return;
      }

      // 1. Create PaymentIntent via orchestrator
      const { intent, initialAdapterResponse } = PaymentOrchestrator.createIntent(
        totalToPay,
        selectedPaymentMethod as PaymentProvider,
        mobileMoneyNumber,
        'pos_order',
        orderId
      );

      // 2. Persist in state
      onUpdatePaymentIntents(prev => [intent, ...prev]);

      // 3. Mount simulation
      setActivePaymentIntent(intent);
      setActiveAdapterResponse(initialAdapterResponse);
      setPaymentGatewayLogs(intent.metadata?.history || []);
      setShowPaymentGatewayModal(true);
      return;
    }

    const itemsFormatted = cart.map(item => ({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));

    const newOrder: TableOrder = {
      id: orderId,
      tenantId: 'tenant-bouake-kennedy',
      tableNumber: activeTable,
      items: itemsFormatted,
      status: billingMode === 'charge_to_room' ? 'preparing' : 'paid',
      createdAt: new Date().toISOString(),
      totalAmount: totalToPay,
      roomIdForCharge: billingMode === 'charge_to_room' ? selectedRoomId : undefined
    };

    // Decrement inventory stock
    setInventory(prev => {
      const updated = { ...prev };
      cart.forEach(item => {
        if (updated[item.id]) {
          updated[item.id] = {
            ...updated[item.id],
            stock: Math.max(0, updated[item.id].stock - item.quantity)
          };
        }
      });
      return updated;
    });

    // Callback to main context
    onAddOrder(newOrder);

    // Save locally
    setPosHistory([newOrder, ...posHistory]);

    // Handle ERP Transaction logging if paid now
    if (billingMode !== 'charge_to_room') {
      let extraDesc = '';
      if (billingMode === 'split') {
        extraDesc = ` [Partagé - Espèces/Mobile Money]`;
      } else if (['wave', 'orange_money', 'momo'].includes(selectedPaymentMethod)) {
        extraDesc = ` [MM Tél: ${mobileMoneyNumber || 'N/A'}, Réf: ${paymentReference || 'N/A'}]`;
      }
      const transaction: Transaction = {
        id: `TXN-${Date.now().toString().slice(-5)}`,
        tenantId: 'tenant-bouake-kennedy',
        type: 'pos_sale',
        amount: totalToPay,
        method: selectedPaymentMethod,
        description: `Vente POS Maquis - ${activeTable} (${cart.length} articles)${extraDesc}`,
        date: new Date().toISOString(),
        referenceId: orderId,
        idempotencyKey: `idem-pos-dir-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
      };
      onAddTransaction(transaction);
    }

    // Show beautiful success dialog
    setShowPaymentSuccess(true);
  };

  // Simulation Webhook handling for the walk-in POS payment modal
  const handleSimulateWebhook = (outcome: 'success' | 'failure') => {
    if (!activePaymentIntent) return;

    // 1. Generate webhook event payload
    let mockPayload: any;
    const provider = activePaymentIntent.provider;
    if (provider === 'wave') {
      const sess = activePaymentIntent.metadata?.providerSessionId || 'wave_sess_123';
      mockPayload = WaveAdapter.generateWebhookPayload(sess, activePaymentIntent.amount, activePaymentIntent.reference, activePaymentIntent.phoneNumber, outcome);
    } else {
      const tok = activePaymentIntent.metadata?.paymentToken || 'om_tok_123';
      mockPayload = OrangeMoneyAdapter.generateWebhookPayload(tok, activePaymentIntent.amount, activePaymentIntent.reference, activePaymentIntent.phoneNumber, outcome);
    }

    // Save webhook event to history logs
    const newEvent: WebhookEvent = {
      id: `evt_${Math.random().toString(36).substring(2, 8)}`,
      provider,
      payload: mockPayload,
      receivedAt: new Date().toISOString(),
      status: 'pending'
    };
    onUpdateWebhookEvents(prev => [newEvent, ...prev]);

    // 2. Process webhook through Orchestrator
    const result = PaymentOrchestrator.processWebhook(
      provider,
      mockPayload,
      paymentIntents,
      processedEvents,
      paymentTransactions
    );

    if (result.success && result.affectedIntent) {
      // Update states
      onUpdatePaymentIntents(result.updatedIntents);
      onUpdateProcessedEvents(result.updatedProcessedEvents);
      onUpdatePaymentTransactions(result.updatedTransactions);

      setActivePaymentIntent(result.affectedIntent);
      setPaymentGatewayLogs(result.affectedIntent.metadata?.history || []);

      if (outcome === 'success') {
        finalizeCheckoutAfterPayment(result.affectedIntent);
      } else {
        alert("SIMULATION WEBHOOK : Paiement annulé ou rejeté.");
      }
    } else {
      alert(`ÉCHEC DE PROCESSUS WEBHOOK : ${result.error || 'Erreur indéterminée'}`);
    }
  };

  const handleManualReconcileInPOS = () => {
    if (!activePaymentIntent) return;
    if (!reconciliationReason) {
      alert("VEUILLEZ SAISIR : Un motif ou numéro de reçu physique est requis pour forcer le règlement.");
      return;
    }

    const result = PaymentOrchestrator.forceManualReconcile(
      activePaymentIntent.id,
      reconciliationReason,
      `POS Gérant [${reconciledByRole}]`,
      paymentIntents,
      paymentTransactions
    );

    if (result.success && result.affectedIntent) {
      onUpdatePaymentIntents(result.updatedIntents);
      onUpdatePaymentTransactions(result.updatedTransactions);

      setActivePaymentIntent(result.affectedIntent);
      setPaymentGatewayLogs(result.affectedIntent.metadata?.history || []);

      alert("RÉCONCILIATION MANUELLE : Rapprochement forcé avec succès. Audit consigné.");
      finalizeCheckoutAfterPayment(result.affectedIntent);
    } else {
      alert("Erreur lors de la réconciliation manuelle.");
    }
  };

  // Close payment modal and clear cart
  const handleFinishTransaction = () => {
    setShowPaymentSuccess(false);
    handleClearCart();
  };

  // ========================================================
  // TABLE PLAN INTERACTIVE HANDLERS (DRAG & DROP, AUDIO FEEDBACK)
  // ========================================================

  const handleDragStartOrder = (e: React.DragEvent, orderId: string) => {
    e.dataTransfer.setData('text/plain', orderId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOverTable = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnterTable = (e: React.DragEvent, tableName: string) => {
    e.preventDefault();
    setDragOverTable(tableName);
  };

  const handleDragLeaveTable = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverTable(null);
  };

  const handleDropOrderOnTable = (e: React.DragEvent, targetTable: string) => {
    e.preventDefault();
    setDragOverTable(null);
    const orderId = e.dataTransfer.getData('text/plain');
    if (!orderId) return;

    const orderToMove = (activeOrders || []).find(o => o.id === orderId);
    if (!orderToMove) return;
    if (orderToMove.tableNumber === targetTable) return;

    // Update the table association
    const updated = activeOrders.map(o => {
      if (o.id === orderId) {
        return { ...o, tableNumber: targetTable };
      }
      return o;
    });

    onUpdateOrders(updated);
    playSuccessSound();
  };

  const handleLoadTableToBilling = (tableName: string) => {
    // Find active unpaid orders on this table
    const tableOrder = (activeOrders || []).find(o => o.tableNumber === tableName && o.status !== 'paid');
    
    if (tableOrder) {
      // Load its items into the active POS cart
      const loadedCart = tableOrder.items.map(item => ({
        id: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        modifiers: [],
        notes: `Commandes de table (${tableOrder.id.slice(-4)})`
      }));
      setCart(loadedCart);
      setActiveTable(tableName);
      
      if (tableOrder.roomIdForCharge) {
        setCustomerType('in_house');
        setSelectedRoomId(tableOrder.roomIdForCharge);
        const res = (reservations || []).find(r => r.roomId === tableOrder.roomIdForCharge && r.status === 'checked-in');
        if (res) {
          setSelectedGuestName(res.guestName);
          const folio = guestFolios.find(f => f.roomId === tableOrder.roomIdForCharge);
          setSelectedGuestFolio(folio);
          setBillingMode('charge_to_room');
        }
      } else {
        setCustomerType('walk_in');
        setBillingMode('pay_now');
      }
    } else {
      // Free table - just activate the table number, reset context
      setActiveTable(tableName);
      setCart([]);
      setCustomerType('walk_in');
      setBillingMode('pay_now');
    }
    
    setPosMode('billing');
  };

  const handleFreeTableOrders = (tableName: string) => {
    if (window.confirm(`Voulez-vous libérer la table ${tableName} en marquant ses commandes comme payées ?`)) {
      const updated = activeOrders.map(o => {
        if (o.tableNumber === tableName && o.status !== 'paid') {
          return { ...o, status: 'paid' as const };
        }
        return o;
      });
      onUpdateOrders(updated);
      playSuccessSound();
    }
  };

  // Global counts for KPI widgets
  const kpis = useMemo(() => {
    const pendingOrders = activeOrders.filter(o => o.status !== 'paid').length;
    const chargedToRoomsToday = posHistory
      .filter(o => o.roomIdForCharge)
      .reduce((sum, o) => sum + o.totalAmount, 0) + 185000; // base historical seed

    const cashCollectedToday = posHistory
      .filter(o => !o.roomIdForCharge && o.status === 'paid')
      .reduce((sum, o) => sum + o.totalAmount, 0) + 340000;

    const pendingBalancesValue = activeOrders
      .filter(o => o.status !== 'paid')
      .reduce((sum, o) => sum + o.totalAmount, 0) + 42000;

    return {
      pendingOrders,
      chargedToRoomsToday,
      cashCollectedToday,
      pendingBalancesValue
    };
  }, [activeOrders, posHistory]);

  return (
    <div className="space-y-6">
      
      {/* 1. TOP STATS BAR WITH SEARCH & PROFILE */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-lg border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-orange-500 text-slate-900 rounded-lg">
              <UtensilsCrossed className="w-4 h-4" />
            </span>
            <h1 className="text-lg font-black tracking-tight uppercase">Caisse POS & Folio</h1>
          </div>
          <p className="text-xs text-slate-400">
            Brunch Bouaké • <span className="text-orange-400 font-bold">{SHIFT_INFO.name}</span> • {SHIFT_INFO.time}
          </p>
        </div>

        {/* Global Search & Link indicators */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64 max-w-xs">
            <span className="absolute left-3 top-2.5 text-slate-500">
              <Search className="w-4 h-4" />
            </span>
            <input 
              type="text" 
              placeholder="Rechercher folio, client..." 
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                // Open selector instantly if they type here
                if (e.target.value.length > 0) {
                  setShowRoomSelector(true);
                }
              }}
              className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-orange-500 transition-all placeholder:text-slate-500"
            />
          </div>

          <button 
            type="button"
            onClick={() => {
              setShowQRScanner(true);
              setQrScannerMode('camera');
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-500/10 cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Scanner QR Code</span>
          </button>

          <button 
            onClick={() => setShowOrderHistory(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300 transition-all"
          >
            <History className="w-4 h-4 text-orange-400" />
            <span>Historique ({posHistory.length})</span>
          </button>

          <div className="h-8 w-[1px] bg-slate-800 hidden sm:block" />

          {/* Cashier profile card */}
          <div className="flex items-center gap-2 bg-slate-800/40 p-1.5 rounded-xl border border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-400 font-bold text-xs flex items-center justify-center border border-orange-500/25">
              SB
            </div>
            <div className="hidden sm:block text-left pr-2">
              <div className="text-[10px] font-bold text-slate-200">{SHIFT_INFO.cashierName}</div>
              <span className="text-[8px] uppercase tracking-wider text-slate-500 font-mono">Caissière POS</span>
            </div>
          </div>

          <div className="relative p-2 bg-slate-800/80 rounded-xl text-slate-400 cursor-pointer hover:text-white">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
          </div>
        </div>
      </div>

      {/* 2. KPI METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center gap-3.5 hover:shadow-md transition-all">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Clock className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Commandes En Cours</span>
            <h3 className="text-xl font-extrabold text-slate-800 font-mono mt-0.5">{kpis.pendingOrders}</h3>
            <p className="text-[9px] text-slate-500 mt-0.5">Tables du jardin & maquis</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center gap-3.5 hover:shadow-md transition-all">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
            <Bed className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Débits Chambres</span>
            <h3 className="text-xl font-extrabold text-slate-800 font-mono mt-0.5">{kpis.chargedToRoomsToday.toLocaleString('fr-FR')} F</h3>
            <p className="text-[9px] text-orange-600 font-bold mt-0.5">Facturé sur folios aujourd'hui</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center gap-3.5 hover:shadow-md transition-all">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Encaissé Espèces / Mobile</span>
            <h3 className="text-xl font-extrabold text-slate-800 font-mono mt-0.5">{kpis.cashCollectedToday.toLocaleString('fr-FR')} F</h3>
            <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">Revenu de caisse direct</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center gap-3.5 hover:shadow-md transition-all">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">En attente règlement</span>
            <h3 className="text-xl font-extrabold text-slate-800 font-mono mt-0.5">{kpis.pendingBalancesValue.toLocaleString('fr-FR')} F</h3>
            <p className="text-[9px] text-slate-500 mt-0.5">Tickets de table ouverts</p>
          </div>
        </div>

      </div>

      {/* 2.5 TAB SWITCHER FOR CAISSE vs PLAN DES TABLES */}
      <div className="flex flex-wrap items-center justify-between bg-white border border-slate-200 p-2 rounded-2xl gap-3 shadow-xs mb-4">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setPosMode('billing')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              posMode === 'billing'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200 font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShoppingCart className="w-4 h-4 text-orange-500" />
            <span>Saisie Caisse</span>
          </button>
          <button
            type="button"
            onClick={() => setPosMode('table_plan')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              posMode === 'table_plan'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200 font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Map className="w-4 h-4 text-orange-500" />
            <span>Plan Interactif des Tables</span>
          </button>
        </div>
        <div className="text-right text-[11px] text-slate-400 font-medium pr-2">
          Mode: {posMode === 'billing' ? "Saisie des Commandes" : "Disposition du Maquis"}
        </div>
      </div>

      {/* 3. THREE-COLUMN POS DASHBOARD */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${posMode !== 'billing' ? 'hidden' : ''}`}>
        
        {/* ========================================================
            COLUMN 1: LEFT PANEL - CATEGORIES & QUICK ROOM LOOKUP (3 cols)
            ======================================================== */}
        <div className="lg:col-span-3 space-y-5">
          
          {/* Quick Context Switcher */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2.5">
              Type d'opération de caisse
            </span>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => handleUnlinkRoom()}
                className={`py-2 px-1 text-center font-bold text-[11px] rounded-lg transition-all ${
                  customerType === 'walk_in' 
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Passant (Walk-In)
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomerType('in_house');
                  setShowRoomSelector(true);
                }}
                className={`py-2 px-1 text-center font-bold text-[11px] rounded-lg transition-all ${
                  customerType === 'in_house' 
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Chambre (Folio)
              </button>
            </div>

            {/* Active Link Badge */}
            {selectedRoomId ? (
              <div className="mt-3.5 p-3 bg-orange-50 border border-orange-200 rounded-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-black uppercase text-orange-800 bg-orange-100 px-1.5 py-0.5 rounded">
                      Chambre {selectedRoomId}
                    </span>
                    <h5 className="font-extrabold text-slate-900 text-xs mt-1">{selectedGuestName}</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">VIP Platine • Remise auto 10%</p>
                  </div>
                  <button 
                    onClick={() => handleUnlinkRoom()}
                    className="p-1 hover:bg-orange-100 rounded-lg text-orange-600"
                    title="Détacher la chambre"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                {/* Folio brief balance */}
                <div className="mt-3.5 pt-2 border-t border-orange-200/50 flex justify-between items-center text-[11px]">
                  <span className="text-slate-600 font-medium">Solde actuel folio:</span>
                  <span className="font-bold font-mono text-slate-900">
                    {selectedGuestFolio?.outstandingBalance.toLocaleString('fr-FR')} F
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGuestFolioDetails(true)}
                  className="w-full mt-2 text-center text-[10px] text-orange-800 font-extrabold flex items-center justify-center gap-1 hover:underline"
                >
                  <FileText className="w-3 h-3" />
                  <span>Consulter le Folio Complet</span>
                </button>
              </div>
            ) : (
              <div className="mt-3.5 p-3 bg-slate-50 border border-slate-200 border-dashed rounded-xl text-center">
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Aucune chambre liée. Facturation standard comptant.
                </p>
                <button
                  type="button"
                  onClick={() => setShowRoomSelector(true)}
                  className="mt-2 text-xs text-orange-600 font-bold hover:text-orange-700 flex items-center justify-center gap-1 mx-auto"
                >
                  <Plus className="w-3.5 h-3.5" /> Lier à une chambre
                </button>
              </div>
            )}
          </div>

          {/* Vertical Categories Selection */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
              Menu Categories
            </span>
            <div className="flex flex-col gap-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left font-bold text-xs transition-all ${
                    activeCategory === cat.id 
                      ? 'bg-orange-500 text-white shadow-xs' 
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100/80'
                  }`}
                >
                  <span>{cat.label}</span>
                  {activeCategory === cat.id ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3 h-3 opacity-60" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Access Sidebar List of occupied rooms */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Résidents Actuels (Séjour)
              </span>
              <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full font-bold">
                {guestFolios.length}
              </span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {guestFolios.length === 0 ? (
                <div className="text-center py-4 text-slate-400 text-[10px]">
                  Aucun résident enregistré (PMS)
                </div>
              ) : (
                guestFolios.map((folio) => (
                  <div 
                    key={folio.roomId}
                    onClick={() => handleLinkRoom(folio.roomId)}
                    className={`p-2 border rounded-xl text-left cursor-pointer transition-all hover:bg-orange-50/20 hover:border-orange-200 ${
                      selectedRoomId === folio.roomId 
                        ? 'border-orange-500 bg-orange-50/10 shadow-3xs' 
                        : 'border-slate-100 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold text-slate-800">Ch. {folio.roomId}</span>
                      <span className="text-[9px] font-bold bg-slate-200 px-1 rounded-sm text-slate-700 font-mono">
                        {folio.outstandingBalance.toLocaleString('fr-FR')} F
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{folio.guestName}</div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* ========================================================
            COLUMN 2: CENTER PANEL - PRODUCT SELECTION & GRID (5 cols)
            ======================================================== */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Filters, View Switch, Table Selection */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-slate-900 bg-slate-100 px-2 py-1 rounded-lg">
                  {activeTable}
                </span>
                <span className="text-xs text-slate-400">Emplacement de service</span>
              </div>
              
              {/* Table Quick selector */}
              <select
                value={activeTable}
                onChange={(e) => setActiveTable(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-orange-500"
              >
                {TABLES.map(tab => (
                  <option key={tab} value={tab}>{tab}</option>
                ))}
              </select>
            </div>

            {/* Menu item Search bar inside workspace */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-slate-400">
                  <Search className="w-4 h-4" />
                </span>
                <input 
                  type="text" 
                  placeholder="Rechercher Alloco, Kedjenou, Bière..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white transition-all placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 p-0.5 hover:bg-slate-200 rounded-full text-slate-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowQRScanner(true);
                  setQrScannerMode('camera');
                }}
                className="p-2 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-xl text-slate-500 hover:text-orange-600 transition-all flex items-center justify-center shrink-0 cursor-pointer"
                title="Scanner un QR Code / Ticket"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Segmented Filter Chips */}
            <div className="flex flex-wrap gap-1.5">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                    activeFilter === f.id 
                      ? 'bg-slate-800 text-white' 
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Compact vs Grid Selector */}
            <div className="flex justify-between items-center text-xs text-slate-500 pt-1 border-t border-slate-100">
              <span>Menu disponible • {availableMenuItems.length} éléments</span>
              <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-lg">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-400 hover:text-slate-900'}`}
                  title="Grille d'images"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-400 hover:text-slate-900'}`}
                  title="Liste compacte"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Cards Container */}
          {availableMenuItems.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Aucun article ne correspond à votre recherche ou filtre.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                  setActiveFilter('all');
                }}
                className="text-xs text-orange-600 font-bold hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 gap-3.5' : 'grid-cols-1 gap-2'}`}>
              {availableMenuItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleAddToCart(item)}
                  className={`bg-white border border-slate-200 rounded-2xl p-3.5 transition-all cursor-pointer group hover:border-orange-400 relative overflow-hidden flex ${
                    viewMode === 'grid' ? 'flex-col justify-between min-h-[140px]' : 'flex-row items-center justify-between gap-4'
                  }`}
                >
                  {/* Photo / Vector placeholder */}
                  {viewMode === 'grid' && (
                    <div className="w-full h-18 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 flex items-center justify-center relative overflow-hidden group-hover:scale-102 transition-all">
                      <span className="text-[10px] font-black tracking-widest text-orange-600/35 uppercase">
                        {item.category}
                      </span>
                      {item.tags.includes('specials') && (
                        <span className="absolute top-1.5 left-1.5 bg-orange-500 text-slate-950 font-black text-[7px] uppercase tracking-wider px-1 py-0.5 rounded-sm shadow-sm">
                          CHEF
                        </span>
                      )}
                    </div>
                  )}

                  <div className={`flex-1 ${viewMode === 'grid' ? 'mt-2.5' : ''}`}>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-800 leading-tight group-hover:text-orange-950 transition-colors">
                        {item.name}
                      </h4>
                      {viewMode === 'list' && item.tags.includes('specials') && (
                        <span className="bg-orange-100 text-orange-800 font-bold text-[7px] uppercase tracking-wider px-1 py-0.5 rounded-sm">
                          CHEF
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] text-slate-400 line-clamp-1 mt-0.5">{item.description}</p>
                    {inventory[item.id] && (
                      <div className="mt-1">
                        <span className={`inline-block text-[8px] font-bold px-1 py-0.5 rounded-sm uppercase tracking-tight ${
                          inventory[item.id].stock <= inventory[item.id].minStock
                            ? 'bg-rose-100 text-rose-700 font-black animate-pulse'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {inventory[item.id].stock <= inventory[item.id].minStock ? '⚠️ ' : ''}Stock: {inventory[item.id].stock}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className={`flex justify-between items-center ${viewMode === 'grid' ? 'mt-3.5 pt-2 border-t border-slate-50' : 'shrink-0 gap-4'}`}>
                    <span className="font-mono text-xs font-black text-slate-900">
                      {item.price.toLocaleString('fr-FR')} F
                    </span>
                    <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-700 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 transition-all shadow-3xs">
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Fast Add Interface for small popular additions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2.5">
              Ajout Rapide - Extras Snacks & Boissons
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'Piment Sup.', price: 500, id: 'item-22' },
                { name: 'Eau Awa 1.5L', price: 1000, id: 'item-11' },
                { name: 'Alloco Sup.', price: 1500, id: 'item-20' }
              ].map(fast => (
                <button
                  type="button"
                  key={fast.id}
                  onClick={() => {
                    const found = RICH_MOCK_MENU.find(i => i.id === fast.id);
                    if (found) handleAddToCart(found);
                  }}
                  className="p-2 bg-slate-50 hover:bg-orange-50/40 border border-slate-150 rounded-xl text-left hover:border-orange-200 transition-all group flex flex-col justify-between"
                >
                  <span className="text-[10px] font-bold text-slate-700 truncate">{fast.name}</span>
                  <div className="flex justify-between items-center mt-1">
                    <span className="font-mono text-[10px] text-slate-500 font-extrabold">{fast.price} F</span>
                    <Plus className="w-2.5 h-2.5 text-slate-400 group-hover:text-orange-600 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* ========================================================
            COLUMN 3: RIGHT PANEL - ACTIVE TICKET / FOLIO & PAYMENTS (4 cols)
            ======================================================== */}
        <div className={`lg:col-span-4 space-y-4 ${showMobileCartDrawer ? 'fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-end p-4 animate-fade-in' : 'hidden lg:block'}`}>
          
          <div className="bg-white border-2 border-slate-900 rounded-[32px] p-5 shadow-lg space-y-4 relative overflow-hidden w-full max-w-md h-[90vh] lg:h-auto overflow-y-auto flex flex-col justify-between animate-scale-in">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-900" />
            
            {/* Header with Ticket summary */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-orange-500" />
                <h4 className="font-black text-slate-900 text-sm tracking-tight uppercase">Ticket Actif</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-slate-100 text-slate-800 font-extrabold font-mono text-xs px-2 py-0.5 rounded-lg">
                  {activeTable}
                </span>
                <button
                  type="button"
                  onClick={() => setShowMobileCartDrawer(false)}
                  className="lg:hidden p-1.5 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-850 transition-all active:scale-95"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* A. Customer / Stay Context in ticket */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Client de la table</span>
                {customerType === 'in_house' && selectedRoomId ? (
                  <span className="bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase">
                    CHAMBRE LIÉE
                  </span>
                ) : (
                  <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase">
                    PASSANT
                  </span>
                )}
              </div>
              
              {selectedRoomId ? (
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-extrabold text-slate-850">Chambre {selectedRoomId} • {selectedGuestName}</div>
                    <span className="text-[10px] text-slate-400 font-mono">Tél: {selectedGuestFolio?.phone}</span>
                  </div>
                  <button 
                    onClick={() => handleUnlinkRoom()}
                    className="text-[10px] text-rose-600 font-bold hover:underline"
                  >
                    Détacher
                  </button>
                </div>
              ) : (
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-600">Client Comptoir / Table</div>
                  <button
                    onClick={() => setShowRoomSelector(true)}
                    className="text-[10px] text-orange-600 font-bold hover:underline flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" /> Lier Chambre
                  </button>
                </div>
              )}
            </div>

            {/* B. Order Summary - List of items */}
            <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="py-10 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    Le panier est vide.<br />Sélectionnez des plats pour commencer.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {cart.map((item) => (
                    <div key={item.id} className="py-2.5 space-y-1.5">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <div className="text-xs font-bold text-slate-800 leading-tight">
                            {item.name}
                          </div>
                          <span className="font-mono text-[10px] text-slate-500 font-semibold">
                            {item.price.toLocaleString('fr-FR')} F/unité
                          </span>
                        </div>
                        
                        {/* Cost total for item */}
                        <div className="text-right shrink-0">
                          <span className="font-mono text-xs font-black text-slate-900">
                            {(item.price * item.quantity).toLocaleString('fr-FR')} F
                          </span>
                        </div>
                      </div>

                      {/* Modifier chip tags (sans piment, takeaway, etc.) */}
                      <div className="flex flex-wrap gap-1">
                        {['sans piment', 'extra sauce', 'à emporter'].map(mod => {
                          const active = item.modifiers.includes(mod);
                          return (
                            <button
                              key={mod}
                              onClick={() => handleToggleModifier(item.id, mod)}
                              className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase transition-all ${
                                active 
                                  ? 'bg-orange-500 text-slate-950 border border-orange-500' 
                                  : 'bg-slate-100 text-slate-400 border border-slate-200 hover:bg-slate-200'
                              }`}
                            >
                              {mod === 'sans piment' ? 'SANS PIMENT' : mod === 'extra sauce' ? 'SAUCE +' : 'EMPORTER'}
                            </button>
                          );
                        })}
                      </div>

                      {/* Notes input */}
                      <input 
                        type="text" 
                        placeholder="Note d'écriture (Ex: Bien cuit)..."
                        value={item.notes}
                        onChange={(e) => handleUpdateItemNotes(item.id, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-[10px] rounded px-2 py-1 text-slate-700 outline-none focus:border-slate-400"
                      />

                      {/* Stepper with remove button */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                            className="w-5 h-5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded flex items-center justify-center font-bold text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-xs font-bold text-slate-900 w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                            className="w-5 h-5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded flex items-center justify-center font-bold text-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Supprimer la ligne"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Calculations widget (Subtotal, Discount, service, net total) */}
            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Sous-total HT :</span>
                <span className="font-mono font-bold">{subtotal.toLocaleString('fr-FR')} F</span>
              </div>
              
              <div className="flex justify-between items-center text-slate-500">
                <div className="flex items-center gap-1">
                  <span>Remise VIP / Code :</span>
                  <select 
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(parseInt(e.target.value) || 0)}
                    className="bg-slate-100 border border-slate-200 rounded px-1 text-[10px] font-bold outline-none"
                  >
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="10">10% VIP</option>
                    <option value="15">15%</option>
                    <option value="20">20%</option>
                  </select>
                </div>
                <span className="font-mono font-bold text-orange-600">-{discountAmount.toLocaleString('fr-FR')} F</span>
              </div>

              <div className="flex justify-between items-center text-slate-500">
                <div className="flex items-center gap-1">
                  <span>Service de table / Taxe :</span>
                  <select 
                    value={serviceChargePercent}
                    onChange={(e) => setServiceChargePercent(parseInt(e.target.value) || 0)}
                    className="bg-slate-100 border border-slate-200 rounded px-1 text-[10px] font-bold outline-none"
                  >
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="10">10%</option>
                  </select>
                </div>
                <span className="font-mono font-bold text-slate-800">+{serviceChargeAmount.toLocaleString('fr-FR')} F</span>
              </div>

              <div className="flex justify-between items-center text-slate-500">
                <div className="flex items-center gap-1">
                  <span>TVA (Côte d'Ivoire) :</span>
                  <select 
                    value={taxRate}
                    onChange={(e) => {
                      const rate = parseInt(e.target.value) || 0;
                      setTaxRate(rate);
                      setIncludeTax(rate > 0);
                    }}
                    className="bg-slate-100 border border-slate-200 rounded px-1 text-[10px] font-bold outline-none"
                  >
                    <option value="0">0% (Exonéré)</option>
                    <option value="10">10% (Taux Réduit)</option>
                    <option value="18">18% (Taux Normal)</option>
                  </select>
                </div>
                <span className="font-mono font-bold text-slate-800">+{taxAmount.toLocaleString('fr-FR')} F</span>
              </div>

              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-dashed border-slate-200">
                <span>NET À PAYER :</span>
                <span className="font-mono text-lg text-slate-900">{totalToPay.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>

            {/* C. Billing Mode */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Mode de facturation
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setBillingMode('pay_now');
                  }}
                  className={`py-2 px-1 text-center font-bold text-[10px] rounded-xl border transition-all ${
                    billingMode === 'pay_now' 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Régler Direct
                </button>

                <button
                  type="button"
                  disabled={!selectedRoomId}
                  onClick={() => {
                    setBillingMode('charge_to_room');
                  }}
                  className={`py-2 px-1 text-center font-bold text-[10px] rounded-xl border transition-all ${
                    !selectedRoomId ? 'opacity-40 cursor-not-allowed' : ''
                  } ${
                    billingMode === 'charge_to_room' 
                      ? 'bg-orange-500 text-white border-orange-500 shadow-sm' 
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                  title={!selectedRoomId ? 'Liez une chambre pour activer ce mode' : 'Imputer sur le folio de la chambre'}
                >
                  Folio Chambre
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBillingMode('split');
                  }}
                  className={`py-2 px-1 text-center font-bold text-[10px] rounded-xl border transition-all ${
                    billingMode === 'split' 
                      ? 'bg-purple-600 text-white border-purple-600 shadow-sm' 
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Divisé (Split)
                </button>
              </div>

              {billingMode === 'charge_to_room' && selectedRoomId && (() => {
                const activeRes = (reservations || []).find(r => r.roomId === selectedRoomId && r.status === 'checked-in');
                const limit = activeRes?.creditLimit || 50000;
                const roomOrders = (activeOrders || []).filter(o => o.roomIdForCharge === selectedRoomId && o.status !== 'paid');
                const currentExtras = roomOrders.reduce((sum, o) => sum + o.totalAmount, 0);
                const totalWithNewOrder = currentExtras + totalToPay;
                const isOverLimit = totalWithNewOrder > limit;

                return (
                  <div className="space-y-3 mt-2">
                    <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 text-[11px] text-orange-950 font-medium flex items-start gap-1.5 animate-fade-in">
                      <Bed className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                      <div>
                        L'addition de <strong className="font-extrabold">{totalToPay.toLocaleString('fr-FR')} F</strong> sera imputée sur le folio de la <strong className="font-extrabold">Chambre {selectedRoomId}</strong> ({selectedGuestName}).
                      </div>
                    </div>

                    {/* Credit Limit Indicator */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1.5">
                      <div className="flex justify-between font-semibold text-[11px] text-slate-700">
                        <span>Encours & Limite Crédit :</span>
                        <span className={isOverLimit ? 'text-red-600 font-bold' : 'text-slate-600'}>
                          {totalWithNewOrder.toLocaleString('fr-FR')} F / {limit.toLocaleString('fr-FR')} F
                        </span>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${isOverLimit ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`}
                          style={{ width: `${Math.min(100, (totalWithNewOrder / limit) * 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Actuel: {currentExtras.toLocaleString('fr-FR')} F</span>
                        <span>Panier: +{totalToPay.toLocaleString('fr-FR')} F</span>
                      </div>
                    </div>

                    {/* PIN validation */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                        Saisir le PIN de la Chambre *
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="Ex: 1234"
                        value={enteredRoomPin}
                        onChange={(e) => {
                          setPinErrorMessage('');
                          setEnteredRoomPin(e.target.value.replace(/\D/g, ''));
                        }}
                        className="w-full px-3 py-1.5 text-center text-sm font-mono font-bold tracking-widest border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                      />
                      <span className="text-[9px] text-slate-400 text-center block">Saisie obligatoire pour imputer sur la chambre</span>
                    </div>

                    {pinErrorMessage && (
                      <div className="p-2.5 bg-red-50 border border-red-100 rounded-xl text-[10px] text-red-700 font-semibold flex items-start gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                        <span>{pinErrorMessage}</span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* D. Payment Section (If Pay Now is selected) */}
            {billingMode === 'pay_now' && (
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Méthode d'encaissement direct
                </span>
                
                {/* Method buttons */}
                <div className="grid grid-cols-5 gap-1">
                  {[
                    { id: 'cash', label: 'Cash' },
                    { id: 'wave', label: 'Wave' },
                    { id: 'orange_money', label: 'Orange' },
                    { id: 'momo', label: 'MTN' },
                    { id: 'card', label: 'Carte' }
                  ].map((pay) => (
                    <button
                      type="button"
                      key={pay.id}
                      onClick={() => setSelectedPaymentMethod(pay.id as any)}
                      className={`py-2 text-center font-bold rounded-lg border text-[10px] transition-all ${
                        selectedPaymentMethod === pay.id 
                          ? 'bg-orange-500 text-slate-950 border-orange-500 font-extrabold' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {pay.label}
                    </button>
                  ))}
                </div>

                {/* Cash quick amounts input */}
                {selectedPaymentMethod === 'cash' && (
                  <div className="space-y-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Espèces reçues</span>
                    <div className="grid grid-cols-4 gap-1">
                      {[2000, 5000, 10000, 20000].map(val => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setCashGiven(val)}
                          className="py-1 bg-white hover:bg-slate-100 border border-slate-200 text-[10px] font-bold font-mono rounded-md"
                        >
                          {val.toLocaleString('fr-FR')}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="number" 
                        placeholder="Montant saisi..."
                        value={cashGiven || ''}
                        onChange={(e) => setCashGiven(parseInt(e.target.value) || 0)}
                        className="w-1/2 px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-mono font-bold"
                      />
                      <div className="w-1/2 text-right">
                        <span className="text-[9px] text-slate-400 block uppercase font-bold">Rendu monnaie :</span>
                        <span className="text-xs font-mono font-black text-emerald-700">
                          {changeDue.toLocaleString('fr-FR')} F
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {['wave', 'orange_money', 'momo'].includes(selectedPaymentMethod) && (
                  <div className="space-y-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100 text-left">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        selectedPaymentMethod === 'wave' 
                          ? 'bg-sky-500' 
                          : selectedPaymentMethod === 'orange_money' 
                            ? 'bg-orange-500' 
                            : 'bg-amber-400'
                      }`} />
                      Saisie Mobile Money ({selectedPaymentMethod === 'wave' ? 'Wave' : selectedPaymentMethod === 'orange_money' ? 'Orange Money' : 'MTN MoMo'})
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <label className="text-[9px] text-slate-400 font-bold block uppercase mb-1">Numéro de téléphone du client</label>
                        <input 
                          type="text" 
                          placeholder="Ex: +225 07 08 09 10 11"
                          value={mobileMoneyNumber}
                          onChange={(e) => setMobileMoneyNumber(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-semibold outline-none focus:border-orange-400"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 font-bold block uppercase mb-1">Numéro de Référence Transaction</label>
                        <input 
                          type="text" 
                          placeholder="Ex: TX-9828-OM9"
                          value={paymentReference}
                          onChange={(e) => setPaymentReference(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-mono font-semibold uppercase outline-none focus:border-orange-400"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Split Payment Panel (If Split is selected) */}
            {billingMode === 'split' && (
              <div className="pt-3 border-t border-slate-100 space-y-3 bg-purple-50/50 p-3 rounded-2xl border border-purple-100">
                <span className="text-[10px] font-bold text-purple-900 uppercase tracking-widest block">
                  Répartition des paiements
                </span>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                    <span>Client A (Espèces) :</span>
                    <input 
                      type="number" 
                      placeholder="Montant..."
                      value={splits[0].amount || ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setSplits([
                          { ...splits[0], amount: val },
                          { ...splits[1], amount: totalToPay - val }
                        ]);
                      }}
                      className="w-24 px-2 py-1 bg-white border border-slate-200 rounded font-mono text-right"
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                    <span>Client B (Wave) :</span>
                    <input 
                      type="number" 
                      placeholder="Montant..."
                      value={splits[1].amount || ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setSplits([
                          { ...splits[0], amount: totalToPay - val },
                          { ...splits[1], amount: val }
                        ]);
                      }}
                      className="w-24 px-2 py-1 bg-white border border-slate-200 rounded font-mono text-right font-medium"
                    />
                  </div>
                </div>

                <div className="text-[10px] text-purple-800 font-medium">
                  Reste à allouer : <span className="font-mono font-bold">{(totalToPay - (splits[0].amount + splits[1].amount)).toLocaleString('fr-FR')} F</span>
                </div>
              </div>
            )}

            {/* Buttons: Checkout vs Reset */}
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => handleClearCart()}
                className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all"
              >
                Vider
              </button>

              <button
                type="button"
                disabled={cart.length === 0 || (billingMode === 'split' && (splits[0].amount + splits[1].amount) !== totalToPay)}
                onClick={() => handleCheckoutOrder()}
                className={`w-2/3 py-2.5 text-white font-extrabold rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-1.5 ${
                  cart.length === 0 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                    : billingMode === 'charge_to_room'
                    ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/10'
                    : billingMode === 'split'
                    ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/10'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/10'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>
                  {billingMode === 'charge_to_room' ? 'Imputer s/ Chambre' : 'Valider & Encaisser'}
                </span>
              </button>
            </div>

            {/* Receipt Preview Shortcut */}
            {cart.length > 0 && (
              <button
                type="button"
                onClick={() => setShowReceiptPreview(true)}
                className="w-full text-center text-xs text-slate-500 font-semibold flex items-center justify-center gap-1 hover:text-slate-800"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Visualiser l'Aperçu du Ticket de Caisse</span>
              </button>
            )}

          </div>

          {/* E. FOLIO SUMMARY FOR DETAILED GUEST */}
          {selectedRoomId && selectedGuestFolio && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Folio Chambre {selectedRoomId}
                </span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[8px] font-black uppercase">
                  Occupée
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Frais Hébergement / Lodging :</span>
                  <span className="font-mono font-bold text-slate-850">{selectedGuestFolio.lodgingCharges.toLocaleString('fr-FR')} F</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Restauration Maquis :</span>
                  <span className="font-mono font-bold text-slate-850">{selectedGuestFolio.restaurantCharges.toLocaleString('fr-FR')} F</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Autres extras / Blanchisserie :</span>
                  <span className="font-mono font-bold text-slate-850">{selectedGuestFolio.extrasCharges.toLocaleString('fr-FR')} F</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Acomptes / Paiements reçus :</span>
                  <span className="font-mono font-bold">-{selectedGuestFolio.paymentsMade.toLocaleString('fr-FR')} F</span>
                </div>
                <div className="flex justify-between font-black text-sm pt-2 border-t border-slate-100">
                  <span className="text-slate-850">Reste à régler :</span>
                  <span className="font-mono text-orange-600">{selectedGuestFolio.outstandingBalance.toLocaleString('fr-FR')} F</span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowGuestFolioDetails(true)}
                  className="flex-1 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-bold rounded-xl text-center"
                >
                  Détails du Folio
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Simulates printing the guest's global invoice
                    alert(`Impression du Folio de la Chambre ${selectedRoomId} lancée...`);
                  }}
                  className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold rounded-xl text-center"
                >
                  Imprimer Facture Globale
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ========================================================
          PLAN INTERACTIF DES TABLES (MAQUIS DÉCOR)
          ======================================================== */}
      {posMode === 'table_plan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in mt-4">
          
          {/* LEFT SIDEBAR: ACTIVE ORDERS LIST (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between h-[75vh] lg:h-auto overflow-hidden">
            <div className="space-y-4 flex-1 overflow-y-auto pr-1">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-orange-500" />
                  <h4 className="font-black text-slate-900 text-sm tracking-tight uppercase">Commandes Actives</h4>
                </div>
                <span className="text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full font-mono font-bold">
                  {(activeOrders || []).filter(o => o.status !== 'paid').length}
                </span>
              </div>

              {/* Instructions banner */}
              <div className="p-3.5 bg-orange-50 border border-orange-100 rounded-2xl flex gap-3">
                <Info className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-orange-850 leading-relaxed font-semibold">
                  <strong>Glisser-déposer :</strong> Prenez une commande ci-dessous et déposez-la sur n'importe quelle table du plan pour réassigner son emplacement.
                </p>
              </div>

              {/* Search Orders */}
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400">
                  <Search className="w-3.5 h-3.5" />
                </span>
                <input
                  type="text"
                  placeholder="Filtrer par table, plat, prix..."
                  value={tablePlanSearchQuery}
                  onChange={(e) => setTablePlanSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Orders List */}
              <div className="space-y-3">
                {(() => {
                  const unpaid = (activeOrders || []).filter(o => o.status !== 'paid');
                  const filtered = unpaid.filter(o => {
                    const search = tablePlanSearchQuery.toLowerCase();
                    if (!search) return true;
                    return (
                      o.id.toLowerCase().includes(search) ||
                      o.tableNumber.toLowerCase().includes(search) ||
                      o.totalAmount.toString().includes(search) ||
                      o.items.some(item => item.name.toLowerCase().includes(search))
                    );
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="py-12 text-center text-slate-400 space-y-2">
                        <ShoppingBag className="w-8 h-8 mx-auto opacity-40 text-slate-500" />
                        <p className="text-xs font-semibold">Aucune commande en cours</p>
                        <p className="text-[10px] text-slate-400">Glissez ou créez une commande</p>
                      </div>
                    );
                  }

                  return filtered.map((order) => (
                    <div
                      key={order.id}
                      draggable
                      onDragStart={(e) => handleDragStartOrder(e, order.id)}
                      className="group bg-slate-50 border border-slate-200 rounded-2xl p-4 transition-all cursor-grab active:cursor-grabbing hover:border-orange-300 hover:bg-white hover:shadow-2xs relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 bottom-0 w-1 bg-slate-300 group-hover:bg-orange-500 transition-colors" />
                      
                      <div className="flex justify-between items-start pl-1 gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] bg-slate-800 text-white font-black px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">
                              {order.tableNumber}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono font-bold">
                              #{order.id.slice(-5).toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="text-[11px] font-bold text-slate-700 mt-2 space-y-0.5">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex items-center gap-1">
                                <span className="text-orange-600 font-extrabold">{item.quantity}x</span>
                                <span className="truncate max-w-[140px]">{item.name}</span>
                              </div>
                            ))}
                          </div>
                          
                          <span className="text-[9px] text-slate-400 block mt-2 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className="text-right flex flex-col items-end justify-between h-full min-h-[70px]">
                          <span className="font-mono text-xs font-black text-slate-900 bg-slate-150 px-2 py-1 rounded-lg">
                            {order.totalAmount.toLocaleString('fr-FR')} F
                          </span>
                          
                          <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-orange-500 transition-colors mt-4">
                            <span className="text-[9px] font-bold uppercase tracking-wider">Déplacer</span>
                            <Move className="w-3.5 h-3.5 animate-pulse" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* QUICK ACTIONS FOOTER */}
            <div className="pt-4 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => {
                  setActiveTable('Table 1');
                  setCart([]);
                  setPosMode('billing');
                }}
                className="w-full py-3 bg-slate-950 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-orange-500" />
                <span>Nouvelle Vente Caisse</span>
              </button>
            </div>
          </div>

          {/* RIGHT CANVAS: FLOOR MAP GRID (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Zones layout wrapper */}
            {(() => {
              const ZONES = [
                {
                  id: 'salle',
                  name: 'SALLE DU JARDIN (Maquis Principal)',
                  description: 'Tables principales en plein air sous pergola',
                  tables: ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5'],
                  chairsCount: 4,
                  shape: 'circle' as const
                },
                {
                  id: 'bar',
                  name: 'COMPTOIR DU BAR (Stools)',
                  description: 'Consommation rapide au comptoir caisse',
                  tables: ['Bar 1', 'Bar 2', 'Bar 3'],
                  chairsCount: 2,
                  shape: 'comptoir' as const
                },
                {
                  id: 'terrasse',
                  name: 'TERRASSE PANORAMIQUE (Plein Air)',
                  description: 'Tables d\'angle avec canapés lounge',
                  tables: ['Terrasse A', 'Terrasse B'],
                  chairsCount: 6,
                  shape: 'rect' as const
                },
                {
                  id: 'salon_vip',
                  name: 'SALON PRIVÉ VIP & ROOM SERVICE',
                  description: 'Espaces haut de gamme & Suites de l\'hôtel',
                  tables: ['VIP Lounge', 'Room Service'],
                  chairsCount: 8,
                  shape: 'vip' as const
                }
              ];

              return ZONES.map(zone => (
                <div key={zone.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-3xs space-y-4">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider">{zone.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{zone.description}</p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                      {zone.tables.length} tables
                    </span>
                  </div>

                  {/* Tables grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 pt-1">
                    {zone.tables.map(tableName => {
                      const tableOrders = (activeOrders || []).filter(o => o.tableNumber === tableName && o.status !== 'paid');
                      const isOccupied = tableOrders.length > 0;
                      const totalSum = tableOrders.reduce((sum, o) => sum + o.totalAmount, 0);
                      const isDragOver = dragOverTable === tableName;

                      return (
                        <div
                          key={tableName}
                          onDragOver={handleDragOverTable}
                          onDragEnter={(e) => handleDragEnterTable(e, tableName)}
                          onDragLeave={handleDragLeaveTable}
                          onDrop={(e) => handleDropOrderOnTable(e, tableName)}
                          className={`relative flex flex-col justify-between p-4 rounded-3xl border-2 transition-all duration-300 min-h-[160px] ${
                            isDragOver
                              ? 'border-orange-500 ring-4 ring-orange-500/20 bg-orange-50 scale-102 shadow-md'
                              : isOccupied
                              ? 'border-orange-400 bg-orange-500/5 hover:border-orange-500 hover:shadow-xs'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          {/* Visual Seats/Chairs surrounding the table */}
                          <div className="absolute inset-0 pointer-events-none overflow-visible">
                            {/* Render small dot chairs around the boundary box */}
                            {Array.from({ length: zone.chairsCount }).map((_, idx) => {
                              const angle = (idx * 2 * Math.PI) / zone.chairsCount;
                              const x = 50 + 43 * Math.cos(angle);
                              const y = 50 + 43 * Math.sin(angle);
                              return (
                                <span
                                  key={idx}
                                  className={`absolute w-3.5 h-3.5 rounded-full border transition-colors duration-300 ${
                                    isOccupied 
                                      ? 'bg-orange-500 border-orange-600 shadow-[0_0_5px_rgba(249,115,22,0.3)]' 
                                      : 'bg-slate-100 border-slate-300'
                                  }`}
                                  style={{
                                    left: `${x}%`,
                                    top: `${y}%`,
                                    transform: 'translate(-50%, -50%)'
                                  }}
                                />
                              );
                            })}
                          </div>

                          {/* Table Header with status */}
                          <div className="flex justify-between items-start z-10">
                            <div>
                              <span className="font-black text-slate-900 text-xs tracking-tight block">
                                {tableName}
                              </span>
                              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wide mt-0.5">
                                {zone.shape === 'vip' ? 'VIP Lounge' : zone.shape === 'comptoir' ? 'Tabouret' : 'Table Standard'}
                              </span>
                            </div>
                            
                            {/* Glowing radar pulse dot */}
                            {isOccupied ? (
                              <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                              </span>
                            ) : (
                              <span className="relative flex h-2 w-2">
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                              </span>
                            )}
                          </div>

                          {/* Table Body Content */}
                          <div className="my-3 z-10">
                            {isOccupied ? (
                              <div className="space-y-1">
                                <span className="font-mono text-sm font-black text-slate-900 block">
                                  {totalSum.toLocaleString('fr-FR')} F
                                </span>
                                <div className="text-[9px] font-bold text-orange-800 bg-orange-100/70 px-1.5 py-0.5 rounded-sm w-fit uppercase tracking-wider font-mono">
                                  {tableOrders.length} ticket{tableOrders.length > 1 ? 's' : ''}
                                </div>
                                
                                <div className="text-[9px] text-slate-500 line-clamp-1 font-semibold mt-1">
                                  {tableOrders.flatMap(o => o.items).map(item => `${item.quantity}x ${item.name}`).join(', ')}
                                </div>
                              </div>
                            ) : (
                              <div className="text-[10px] text-slate-400 font-semibold leading-tight">
                                Libre • Prêt
                              </div>
                            )}
                          </div>

                          {/* Table Action Controls */}
                          <div className="flex items-center gap-1 z-10 pt-2 border-t border-slate-100/40">
                            <button
                              type="button"
                              onClick={() => handleLoadTableToBilling(tableName)}
                              className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider text-center transition-all cursor-pointer ${
                                isOccupied
                                  ? 'bg-orange-500 text-slate-950 hover:bg-orange-600 shadow-3xs'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              {isOccupied ? 'Gérer' : 'Commander'}
                            </button>
                            
                            {isOccupied && (
                              <button
                                type="button"
                                onClick={() => handleFreeTableOrders(tableName)}
                                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all cursor-pointer"
                                title="Libérer la table"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ));
            })()}
            
          </div>
        </div>
      )}

      {/* ========================================================
          MOBILE FLOATING ACTION BUTTON (FAB) FOR CART/TICKET
          ======================================================== */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {/* Dynamic slide-up mini-toast for item added feedback */}
        {showAddedToast && (
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl px-4 py-2.5 shadow-2xl flex items-center gap-2 animate-fade-in text-xs font-bold transition-all">
            <span className="p-1 bg-emerald-500 rounded-lg text-slate-950 font-black">
              <Check className="w-3.5 h-3.5" />
            </span>
            <span>Ajouté : {lastAddedItemName}</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowMobileCartDrawer(true)}
          className={`p-4 bg-slate-900 text-white rounded-full shadow-[0_12px_24px_-4px_rgba(0,0,0,0.6)] border border-slate-800 flex items-center gap-2.5 transition-all active:scale-95 hover:bg-slate-850 ${
            isCartBouncing ? 'animate-bounce' : ''
          }`}
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 text-orange-500" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-slate-950 font-extrabold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-slate-900">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </div>
          <span className="text-xs font-black uppercase tracking-wider pr-1">
            {cart.length === 0 ? 'Ticket Vide' : `${totalToPay.toLocaleString('fr-FR')} F`}
          </span>
        </button>
      </div>

      {/* ========================================================
          DRAWER 1: ORDER HISTORY DRAWER (Recent Sales)
          ======================================================== */}
      {showOrderHistory && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between animate-slide-in relative">
            
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-orange-500" />
                  <h3 className="font-extrabold text-slate-900 text-sm uppercase">Historique des Ventes</h3>
                </div>
                <button 
                  onClick={() => setShowOrderHistory(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-1">
                {posHistory.map((historyItem) => (
                  <div key={historyItem.id} className="p-3.5 border border-slate-100 rounded-2xl bg-slate-50 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-extrabold text-slate-800">{historyItem.tableNumber}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{historyItem.id} • {new Date(historyItem.createdAt).toLocaleTimeString('fr-FR')}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                        historyItem.roomIdForCharge 
                          ? 'bg-orange-100 text-orange-800 border border-orange-200' 
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {historyItem.roomIdForCharge ? `Imputé Ch. ${historyItem.roomIdForCharge}` : 'Payé Cash'}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 font-medium">
                      {historyItem.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                    </div>

                    <div className="pt-2 border-t border-slate-200/50 flex justify-between items-center text-xs">
                      <span className="text-slate-400">Total :</span>
                      <strong className="font-mono font-black text-slate-900">{historyItem.totalAmount.toLocaleString('fr-FR')} F</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowOrderHistory(false)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
            >
              Fermer le Panneau
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          DRAWER 2: GUEST FOLIO DRAWER (Complete lodging & food billing)
          ======================================================== */}
      {showGuestFolioDetails && selectedRoomId && selectedGuestFolio && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex justify-end">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl p-6 flex flex-col justify-between animate-slide-in">
            
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-500" />
                  <h3 className="font-extrabold text-slate-900 text-sm uppercase">Folio de Facturation Complet</h3>
                </div>
                <button 
                  onClick={() => setShowGuestFolioDetails(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Guest Profile summary */}
              <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-2xl">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[8px] font-black uppercase text-orange-800 bg-orange-100 px-1.5 py-0.5 rounded">
                      Chambre {selectedRoomId}
                    </span>
                    <h4 className="font-black text-slate-900 text-sm mt-1">{selectedGuestFolio.guestName}</h4>
                    <p className="text-xs text-slate-500">{selectedGuestFolio.phone} • {selectedGuestFolio.email}</p>
                  </div>
                  <Award className="w-5 h-5 text-orange-500" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4 text-[11px] border-t border-orange-200/50 pt-3">
                  <div>
                    <span className="text-slate-400 block font-bold uppercase text-[8px]">Séjour</span>
                    <span className="font-semibold text-slate-700">{selectedGuestFolio.checkIn} au {selectedGuestFolio.checkOut}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold uppercase text-[8px]">Loyauté</span>
                    <span className="font-semibold text-slate-700">Client VIP Fidèle Platine</span>
                  </div>
                </div>
              </div>

              {/* Itemized ledger entries */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Lignes d'Écritures du Folio
                </span>

                <div className="border border-slate-150 rounded-2xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase border-b border-slate-150">
                      <tr>
                        <th className="p-3">Détail du Service</th>
                        <th className="p-3 text-right">Débit</th>
                        <th className="p-3 text-right">Crédit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      <tr>
                        <td className="p-3">
                          Hébergement Studio {selectedRoomId} (5 Nuits)
                        </td>
                        <td className="p-3 text-right font-mono">{selectedGuestFolio.lodgingCharges.toLocaleString('fr-FR')} F</td>
                        <td className="p-3 text-right font-mono text-slate-300">-</td>
                      </tr>
                      <tr>
                        <td className="p-3">
                          Acompte payé à la réservation
                        </td>
                        <td className="p-3 text-right font-mono text-slate-300">-</td>
                        <td className="p-3 text-right font-mono text-emerald-700">({selectedGuestFolio.paymentsMade.toLocaleString('fr-FR')} F)</td>
                      </tr>
                      <tr>
                        <td className="p-3">
                          Frais Blanchisserie (Extras)
                        </td>
                        <td className="p-3 text-right font-mono">{selectedGuestFolio.extrasCharges.toLocaleString('fr-FR')} F</td>
                        <td className="p-3 text-right font-mono text-slate-300">-</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-orange-800 bg-orange-50/20">
                          Restauration Maquis (POS) - Historique
                        </td>
                        <td className="p-3 text-right font-mono text-orange-850 bg-orange-50/20">{selectedGuestFolio.restaurantCharges.toLocaleString('fr-FR')} F</td>
                        <td className="p-3 text-right font-mono text-slate-300 bg-orange-50/20">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total calculations */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Total Débits HT :</span>
                  <span className="font-mono">{(selectedGuestFolio.lodgingCharges + selectedGuestFolio.restaurantCharges + selectedGuestFolio.extrasCharges).toLocaleString('fr-FR')} F</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-400">
                  <span>Total Crédits Reçus :</span>
                  <span className="font-mono">-{selectedGuestFolio.paymentsMade.toLocaleString('fr-FR')} F</span>
                </div>
                <div className="flex justify-between font-black text-sm pt-2 border-t border-slate-800">
                  <span>Reste à payer final :</span>
                  <span className="font-mono text-orange-400">{selectedGuestFolio.outstandingBalance.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  alert("Impression du reçu PDF lancé...");
                }}
                className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl"
              >
                Exporter PDF
              </button>
              <button
                onClick={() => setShowGuestFolioDetails(false)}
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 1: RECEIPT PREVIEW (Simulated thermal ticket)
          ======================================================== */}
      {showReceiptPreview && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full space-y-4 animate-scale-in">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase">Aperçu du Ticket de Caisse</h4>
              <button 
                onClick={() => setShowReceiptPreview(false)}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thermal ticket container */}
            <div className="bg-amber-50/20 border border-slate-200 p-5 rounded-2xl space-y-4 font-mono text-[11px] text-slate-700 shadow-inner">
              <div className="text-center space-y-1">
                <h3 className="font-bold text-xs uppercase text-slate-900">BRUNCH BOUAKÉ RESIDENCE</h3>
                <p className="text-[9px] text-slate-500">Quartier Kennedy, Bouaké, Côte d'Ivoire</p>
                <p className="text-[9px] text-slate-500">Tél: +225 07 00 00 00 11</p>
                <p className="text-[9px] text-slate-400">RCCM: CI-BKE-01-2026-B12</p>
              </div>

              <div className="border-t border-dashed border-slate-300 pt-2 space-y-1 text-[9px] text-slate-500">
                <p>Date: {new Date().toLocaleDateString('fr-FR')} {new Date().toLocaleTimeString('fr-FR')}</p>
                <p>Caisse: {SHIFT_INFO.station}</p>
                <p>Caissier: {SHIFT_INFO.cashierName}</p>
                <p>Table: {activeTable}</p>
                {selectedRoomId && <p className="text-slate-800 font-bold">Client: Chambre {selectedRoomId} ({selectedGuestName})</p>}
              </div>

              {/* Items Table */}
              <div className="border-t border-dashed border-slate-300 pt-2 space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold text-slate-900">
                  <span>Désignation x Qté</span>
                  <span>Montant</span>
                </div>
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-start text-[10px]">
                    <div>
                      <span>{item.name}</span>
                      <span className="block text-[9px] text-slate-400">x{item.quantity} ({item.price.toLocaleString('fr-FR')} F)</span>
                    </div>
                    <span>{(item.price * item.quantity).toLocaleString('fr-FR')} F</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-dashed border-slate-300 pt-2 space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span>Sous-total HT :</span>
                  <span>{subtotal.toLocaleString('fr-FR')} F</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[10px] text-orange-600 font-bold">
                    <span>Remise ({discountPercent}%) :</span>
                    <span>-{discountAmount.toLocaleString('fr-FR')} F</span>
                  </div>
                )}
                {serviceChargeAmount > 0 && (
                  <div className="flex justify-between text-[10px]">
                    <span>Frais service ({serviceChargePercent}%) :</span>
                    <span>+{serviceChargeAmount.toLocaleString('fr-FR')} F</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-bold text-slate-900 pt-1.5 border-t border-dashed border-slate-300">
                  <span>NET À PAYER :</span>
                  <span>{totalToPay.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-300 pt-2 text-[10px] space-y-1">
                <div className="flex justify-between">
                  <span>Mode paiement :</span>
                  <span className="font-bold uppercase">
                    {billingMode === 'charge_to_room' ? 'Débit Chambre' : selectedPaymentMethod}
                  </span>
                </div>
                {billingMode === 'pay_now' && selectedPaymentMethod === 'cash' && (
                  <>
                    <div className="flex justify-between">
                      <span>Espèces reçues :</span>
                      <span>{cashGiven.toLocaleString('fr-FR')} F</span>
                    </div>
                    <div className="flex justify-between text-slate-900 font-bold">
                      <span>Rendu monnaie :</span>
                      <span>{changeDue.toLocaleString('fr-FR')} F</span>
                    </div>
                  </>
                )}
              </div>

              <div className="text-center text-[9px] text-slate-400 pt-3 border-t border-dashed border-slate-300">
                <p>Merci pour votre confiance !</p>
                <p>À très bientôt chez Brunch Bouaké.</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  alert("Impression lancée via l'imprimante thermique de caisse...");
                  setShowReceiptPreview(false);
                }}
                className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Lancer l'impression</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: ROOM SELECTOR MODAL (Linked guest check-in lookup)
          ======================================================== */}
      {showRoomSelector && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-4 animate-scale-in">
            
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <Bed className="w-5 h-5 text-orange-500" />
                <h4 className="font-extrabold text-slate-900 text-sm uppercase">Sélectionner une Chambre Folio</h4>
              </div>
              <button 
                onClick={() => setShowRoomSelector(false)}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Sélectionnez un résident actuellement enregistré à la réception de l'hôtel pour imputer cette commande sur son folio global.
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {guestFolios.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Aucun client n'est actuellement enregistré (checked-in) dans les chambres. Enregistrez des clients d'abord dans le module PMS.
                </div>
              ) : (
                guestFolios.map((folio) => {
                  const isSelected = selectedRoomId === folio.roomId;
                  return (
                    <div
                      key={folio.roomId}
                      onClick={() => handleLinkRoom(folio.roomId)}
                      className={`p-3 border rounded-2xl text-left cursor-pointer transition-all flex items-center justify-between ${
                        isSelected 
                          ? 'border-orange-500 bg-orange-50/20' 
                          : 'border-slate-150 bg-slate-50 hover:bg-slate-100/80'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 text-xs">Chambre {folio.roomId}</span>
                          <span className="text-[9px] bg-slate-200 text-slate-700 px-1 rounded uppercase font-bold">
                            {folio.status}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-slate-700 mt-1">{folio.guestName}</div>
                        <span className="text-[10px] text-slate-400 block font-mono">Arrivée le: {folio.checkIn}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 block uppercase font-bold">Solde Restant</span>
                        <strong className="font-mono text-xs text-slate-850 font-black">{folio.outstandingBalance.toLocaleString('fr-FR')} F</strong>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowRoomSelector(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: PAYMENT CONFIRMATION SUCCESS MODAL
          ======================================================== */}
      {showPaymentSuccess && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center space-y-6 animate-scale-in relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-500" />
            
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100 animate-pulse">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 uppercase">Paiement Réussi !</h3>
              <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest font-mono">Commande Validée</p>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed px-2">
              La commande a été enregistrée en comptabilité ERP. Les informations de préparation sont envoyées en cuisine.
            </p>

            {/* Simulated mini bill summary in dialog */}
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold text-slate-700 space-y-1 font-mono">
              <div className="flex justify-between">
                <span>Montant réglé :</span>
                <span className="text-slate-900">{totalToPay.toLocaleString('fr-FR')} F</span>
              </div>
              <div className="flex justify-between">
                <span>Mode :</span>
                <span className="uppercase text-slate-900">
                  {billingMode === 'charge_to_room' ? `Folio Chambre ${selectedRoomId}` : selectedPaymentMethod}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  alert("Impression du ticket de caisse thermique lancée...");
                  handleFinishTransaction();
                }}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer Ticket Thermique</span>
              </button>
              
              <button
                type="button"
                onClick={() => handleFinishTransaction()}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Nouvelle Vente / Revenir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 4: MOBILE MONEY UNIFIED PAYMENT INTENT SANDBOX
          ======================================================== */}
      {showPaymentGatewayModal && activePaymentIntent && (() => {
        const provider = activePaymentIntent.provider;
        const amount = activePaymentIntent.amount || 0;
        const phone = activePaymentIntent.phoneNumber || 'N/A';
        const reference = activePaymentIntent.reference || 'N/A';
        const status = activePaymentIntent.status;

        return (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 text-white rounded-[32px] p-6 shadow-2xl max-w-4xl w-full flex flex-col md:flex-row gap-6 animate-scale-in relative">
              
              <button 
                onClick={() => setShowPaymentGatewayModal(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-800 transition-all text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              {/* LEFT COLUMN: THE PREMIUM INTERACTIVE SMARTPHONE SIMULATOR */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-orange-500" /> Écran du Client (Téléphone)
                </span>

                {/* 3D-like physical smartphone container */}
                <div className="relative w-[280px] h-[520px] bg-slate-950 rounded-[42px] border-[8px] border-slate-800 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden ring-4 ring-slate-900 transition-all duration-300">
                  {/* Top camera pill & notch */}
                  <div className="absolute top-0 inset-x-0 h-5 bg-slate-950 rounded-b-2xl z-20 flex justify-center items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-800 mr-2" />
                    <div className="w-10 h-1 bg-slate-900 rounded-full" />
                  </div>

                  {/* Phone Screen Canvas */}
                  <div className="relative flex-1 bg-slate-950 flex flex-col justify-between text-white select-none">
                    
                    {/* Phone Status Bar */}
                    <div className="flex justify-between items-center px-5 pt-5 pb-1 text-[9px] font-bold font-mono tracking-wide text-slate-400 z-10">
                      <span>06:36</span>
                      <div className="flex items-center gap-1">
                        <span>📶 5G</span>
                        <span>🔋 99%</span>
                      </div>
                    </div>

                    {/* SCREEN BODY: Provider Brand Theme & Interactive States */}
                    <div className="flex-1 flex flex-col relative overflow-hidden">
                      {provider === 'wave' ? (
                        /* WAVE CI APP BRANDING (Sky Blue, Minimalistic) */
                        <div className="absolute inset-0 bg-[#4c34e0] flex flex-col justify-between p-4 text-white">
                          {/* Waves Background Design */}
                          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/5 blur-xl" />
                          <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-blue-400/10 blur-xl" />

                          {/* App Header */}
                          <div className="flex flex-col items-center text-center pt-2 relative z-10">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md animate-bounce">
                              {/* Wave Penguin / Letter logo */}
                              <span className="text-xl font-black text-[#4c34e0] font-sans">W</span>
                            </div>
                            <h4 className="text-xs font-black tracking-wider uppercase mt-1">Wave Côte d'Ivoire</h4>
                            <span className="text-[8px] opacity-75 font-mono">Paiement ultra-rapide</span>
                          </div>

                          {/* Dynamic transaction box */}
                          <div className="bg-white text-slate-900 rounded-2xl p-3.5 shadow-lg relative z-10 text-center space-y-1.5 border border-white/10 my-auto">
                            <span className="text-[9px] font-bold text-[#4c34e0] uppercase tracking-widest block font-mono">DÉBIT DU MARCHAND</span>
                            <div className="text-[10px] text-slate-500 font-semibold">Hôtel & Maquis de l'Or</div>
                            <div className="text-base font-black text-slate-900 tracking-tight font-mono">{amount.toLocaleString('fr-FR')} FCFA</div>
                            <div className="text-[8px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full inline-block font-mono">Ref: {reference.slice(-8)}</div>

                            {/* Inner state visualizers */}
                            {status === 'pending' && (
                              <div className="pt-2.5 border-t border-slate-100 space-y-2 animate-fade-in">
                                <div className="flex justify-center">
                                  <div className="w-6 h-6 border-2 border-t-transparent border-[#4c34e0] rounded-full animate-spin" />
                                </div>
                                <div className="text-[9px] text-slate-500 font-bold animate-pulse">Saisissez votre code secret sur votre mobile pour valider la notification Push.</div>
                              </div>
                            )}

                            {status === 'succeeded' && (
                              <div className="pt-2.5 border-t border-slate-100 space-y-2 text-center animate-scale-in">
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                                  <CheckCircle className="w-6 h-6" />
                                </div>
                                <div className="text-[10px] text-emerald-700 font-black uppercase tracking-wide">Paiement Réussi</div>
                                <p className="text-[8px] text-slate-400">Reçu Wave généré. Les fonds ont été crédités à la caisse de l'hôtel.</p>
                              </div>
                            )}

                            {status === 'failed' && (
                              <div className="pt-2.5 border-t border-slate-100 space-y-2 text-center animate-scale-in">
                                <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600">
                                  <X className="w-5 h-5" />
                                </div>
                                <div className="text-[10px] text-rose-700 font-black uppercase tracking-wide">Paiement Échoué</div>
                                <p className="text-[8px] text-slate-400">La transaction a été déclinée par le serveur de Wave CI.</p>
                              </div>
                            )}
                          </div>

                          {/* Small legal footer */}
                          <div className="text-[7px] text-center opacity-60 relative z-10">
                            Wave Côte d'Ivoire S.A. • Sécurité de niveau bancaire certifiée BCEAO.
                          </div>

                        </div>
                      ) : (
                        /* ORANGE MONEY CI APP BRANDING (Black & Orange, Circular motifs) */
                        <div className="absolute inset-0 bg-[#111111] flex flex-col justify-between p-4 text-white">
                          {/* Orange Circles Backdrop */}
                          <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-[#f16e00]/20 blur-xl animate-pulse" />
                          <div className="absolute bottom-5 left-5 w-20 h-20 rounded-full bg-[#ff6600]/10 blur-xl" />

                          {/* App Header */}
                          <div className="flex flex-col items-center text-center pt-2 relative z-10">
                            <div className="w-10 h-10 bg-[#f16e00] rounded-xl flex items-center justify-center shadow-lg shadow-orange-950/40">
                              <span className="text-white font-mono font-black text-sm">OM</span>
                            </div>
                            <h4 className="text-xs font-black tracking-wider uppercase mt-1 text-[#f16e00]">Orange Money</h4>
                            <span className="text-[8px] text-slate-400 font-mono">Service Financier Mobile</span>
                          </div>

                          {/* Transaction Card */}
                          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl p-3.5 shadow-2xl relative z-10 text-center space-y-1.5 my-auto">
                            <span className="text-[8px] font-black text-[#f16e00] uppercase tracking-widest block font-mono">RÉGULATION DE CAISSE</span>
                            <div className="text-[10px] text-slate-400 font-medium">Hôtel & Maquis de l'Or</div>
                            <div className="text-base font-black text-[#f16e00] tracking-tight font-mono">{amount.toLocaleString('fr-FR')} F CFA</div>
                            <div className="text-[8px] text-slate-400 font-mono">Portefeuille: {phone}</div>

                            {/* Inner state visualizers */}
                            {status === 'pending' && (
                              <div className="pt-2.5 border-t border-slate-800 space-y-2 animate-fade-in">
                                <div className="flex justify-center">
                                  <div className="w-6 h-6 border-2 border-t-transparent border-[#f16e00] rounded-full animate-spin" />
                                </div>
                                <div className="text-[9px] text-orange-200 font-bold animate-pulse">Tapez *144*82# sur votre mobile Orange pour autoriser le retrait ou validez la boîte de dialogue Orange.</div>
                              </div>
                            )}

                            {status === 'succeeded' && (
                              <div className="pt-2.5 border-t border-slate-800 space-y-2 text-center animate-scale-in">
                                <div className="w-10 h-10 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
                                  <CheckCircle className="w-5 h-5" />
                                </div>
                                <div className="text-[10px] text-emerald-400 font-black uppercase tracking-wide">Règlement validé</div>
                                <p className="text-[8px] text-slate-400">Orange Money API : Notification de retrait de fonds asynchrone reçue avec succès.</p>
                              </div>
                            )}

                            {status === 'failed' && (
                              <div className="pt-2.5 border-t border-slate-800 space-y-2 text-center animate-scale-in">
                                <div className="w-10 h-10 bg-rose-950 border border-rose-800 text-rose-400 rounded-full flex items-center justify-center mx-auto">
                                  <X className="w-5 h-5" />
                                </div>
                                <div className="text-[10px] text-rose-400 font-black uppercase tracking-wide">Paiement Échoué</div>
                                <p className="text-[8px] text-slate-400">Le client a annulé ou le solde du portefeuille Orange Money est insuffisant.</p>
                              </div>
                            )}
                          </div>

                          {/* Footer */}
                          <div className="text-[7px] text-center text-slate-500 relative z-10">
                            Agrément de l'émetteur de monnaie électronique Orange CI.
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Virtual Home Bar Indicator */}
                    <div className="h-1 w-20 bg-slate-800 rounded-full mx-auto my-1.5" />

                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: SIMULATOR CONTROL CONSOLE & AUDIT TRAIL LOGS */}
              <div className="flex-1 space-y-4 flex flex-col justify-between text-left">
                
                <div>
                  {/* Console Header */}
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <div className="bg-slate-800 p-1.5 rounded-xl text-orange-500">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-tight text-white">Console Gérant & Simulateur Webhooks</h3>
                      <p className="text-[9px] text-slate-400">Maquette technique de raccordement aux passerelles Wave & Orange Money</p>
                    </div>
                  </div>

                  {/* Transaction metadata */}
                  <div className="grid grid-cols-2 gap-2 mt-3 text-[11px]">
                    <div className="bg-slate-950/60 p-2.5 rounded-2xl border border-slate-850">
                      <span className="text-[8px] text-slate-500 uppercase block font-black">Référence Interne</span>
                      <span className="font-mono font-bold text-slate-200">{reference}</span>
                    </div>
                    <div className="bg-slate-950/60 p-2.5 rounded-2xl border border-slate-850">
                      <span className="text-[8px] text-slate-500 uppercase block font-black">Numéro Portefeuille</span>
                      <span className="font-mono font-bold text-slate-200">{phone}</span>
                    </div>
                  </div>

                  {/* Sandbox controllers */}
                  <div className="mt-4 bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4 space-y-3">
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block flex items-center gap-1">
                      <ShieldAlert className="w-4 h-4 text-orange-500" /> Actions de Simulation d'API
                    </span>
                    <p className="text-[9px] text-slate-400 leading-relaxed">
                      Simulez l'envoi de la notification instantanée de confirmation (webhook sécurisé) par le serveur de {provider === 'wave' ? 'Wave' : 'Orange Money'} Côte d'Ivoire.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleSimulateWebhook('success')}
                        className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-950/10 active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Simuler Webhook Succès</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSimulateWebhook('failure')}
                        className="py-2 px-3 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-100 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Simuler Webhook Échec</span>
                      </button>
                    </div>
                  </div>

                  {/* Manual Reconciliation block */}
                  <div className="mt-4 bg-slate-950/20 border border-slate-850 rounded-2xl p-3.5 space-y-2 text-xs">
                    <span className="text-[9px] text-slate-500 uppercase font-black block">Rattrapage & Rapprochement Comptable</span>
                    <p className="text-[9px] text-slate-400 leading-relaxed">
                      En cas de retard réseau ou de problème API, forcez manuellement le règlement en saisissant le numéro de reçu Orange Money / Wave reçu sur le SMS de caisse.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        placeholder="N° de reçu (Ex: CI-OM-910283)"
                        value={reconciliationReason}
                        onChange={(e) => setReconciliationReason(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 text-white rounded-lg font-mono text-xs placeholder:text-slate-600 focus:outline-none focus:border-orange-500/50"
                      />
                      <button
                        type="button"
                        onClick={() => handleManualReconcileInPOS()}
                        className="py-1.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xs rounded-lg transition-all"
                      >
                        Forcer Vente
                      </button>
                    </div>
                  </div>

                  {/* Audit Logs Trail */}
                  <div className="mt-4 space-y-1.5">
                    <span className="text-[9px] text-slate-500 uppercase font-black tracking-wider block">
                      Logs de Transaction & Événements Internes
                    </span>
                    <div className="bg-slate-950 border border-slate-850 rounded-2xl p-3 h-24 overflow-y-auto font-mono text-[9px] space-y-1 text-slate-400">
                      {(paymentGatewayLogs || []).map((log, idx) => (
                        <div key={idx} className="flex gap-1">
                          <span className="text-slate-600 font-bold shrink-0">&gt;</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-slate-800 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowPaymentGatewayModal(false)}
                    className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl active:scale-95 transition-all"
                  >
                    Fermer l'interface
                  </button>
                </div>

              </div>

            </div>
          </div>
        );
      })()}

      {/* ========================================================
          MODAL 5: INTEGRATED QR CODE & BARCODE SCANNER
          ======================================================== */}
      {showQRScanner && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-[32px] p-6 shadow-2xl max-w-2xl w-full flex flex-col gap-6 animate-scale-in relative">
            
            <button 
              onClick={() => {
                setShowQRScanner(false);
                stopCamera();
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-800 transition-all text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <div className="bg-orange-500/10 p-2 rounded-xl text-orange-500 border border-orange-500/20">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-white flex items-center gap-2">
                  <span>Scanner de Caisse QR / Code-barres</span>
                  <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 px-1.5 py-0.5 rounded uppercase font-black tracking-widest">LIVE</span>
                </h3>
                <p className="text-[10px] text-slate-400">Scannez des tickets de commande maquis ou des codes de paiement client Wave/Orange</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Camera Feed / Radar Scan Viewport */}
              <div className="md:col-span-7 flex flex-col items-center">
                <div className="relative w-full aspect-video bg-slate-950 rounded-2xl border-2 border-slate-800 overflow-hidden shadow-inner flex flex-col items-center justify-center group">
                  
                  {qrScannerMode === 'camera' ? (
                    <>
                      {/* Active video element */}
                      <video 
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Pulsing scanning frame overlay */}
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="w-40 h-40 border-2 border-dashed border-orange-500/40 rounded-3xl relative flex items-center justify-center">
                          {/* Corner markers */}
                          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-orange-500 rounded-tl-xl -mt-1 -ml-1" />
                          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-orange-500 rounded-tr-xl -mt-1 -mr-1" />
                          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-orange-500 rounded-bl-xl -mb-1 -ml-1" />
                          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-orange-500 rounded-br-xl -mb-1 -mr-1" />
                          
                          {/* Green scanning laser sweep */}
                          <div className="absolute inset-x-2 top-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-[0_0_8px_#f97316] animate-bounce rounded-full" />
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Mock file picker upload */
                    <div className="p-6 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                        <Camera className="w-6 h-6" />
                      </div>
                      <p className="text-xs text-slate-300">Glissez-déposez une photo du QR code ou importez un fichier</p>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          // Simulate successful upload of a discount code
                          handleQRScanAction('discount:VIP20:20');
                        }}
                        className="hidden" 
                        id="qr-file-input" 
                      />
                      <label 
                        htmlFor="qr-file-input"
                        className="inline-block px-4 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-755 text-xs font-semibold rounded-xl cursor-pointer text-slate-200 transition-all"
                      >
                        Sélectionner un fichier
                      </label>
                    </div>
                  )}

                  {/* Top floating controls */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
                    <span className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-xs text-[9px] font-bold text-orange-400 border border-orange-500/20 px-2 py-1 rounded-lg">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />
                      {qrScanningActive ? "CAMÉRA ACTIVE" : "VEUILLEZ ACTIVER"}
                    </span>
                    
                    <button
                      onClick={() => {
                        if (qrScanningActive) {
                          stopCamera();
                        } else {
                          startCamera();
                        }
                      }}
                      className="p-1.5 bg-slate-900/80 backdrop-blur-xs hover:bg-slate-850 border border-slate-800 rounded-lg text-slate-300 hover:text-white cursor-pointer"
                      title={qrScanningActive ? "Arrêter la caméra" : "Démarrer la caméra"}
                    >
                      {qrScanningActive ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Camera Error overlay */}
                  {cameraError && (
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs p-4 flex flex-col items-center justify-center text-center space-y-3 z-10">
                      <div className="p-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl">
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-amber-500">Accès matériel restreint</h4>
                        <p className="text-[10px] text-slate-400 mt-1 max-w-[240px] leading-relaxed">
                          {cameraError}
                        </p>
                      </div>
                      <button
                        onClick={() => startCamera()}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                      >
                        Réessayer l'autorisation
                      </button>
                    </div>
                  )}

                  {/* Success decode overlay */}
                  {qrScanResult && (
                    <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-5 space-y-3 z-20 animate-fade-in animate-scale-in">
                      <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center">
                        <Check className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded uppercase font-extrabold tracking-wider font-mono">DÉCODÉ AVEC SUCCÈS</span>
                        <h4 className="text-xs font-extrabold text-slate-100 mt-1">Données du Code QR :</h4>
                        <p className="text-[11px] font-mono text-slate-300 bg-slate-900 border border-slate-850 px-3 py-1.5 rounded-lg select-all">
                          {qrScanResult}
                        </p>
                      </div>
                      
                      {qrScannerSuccessMessage && (
                        <p className="text-[10px] font-semibold text-emerald-400">
                          {qrScannerSuccessMessage}
                        </p>
                      )}
                    </div>
                  )}

                </div>

                {/* Switch scanner mode tab */}
                <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-1 rounded-xl border border-slate-850 w-full mt-3">
                  <button
                    onClick={() => setQrScannerMode('camera')}
                    className={`py-1.5 text-center font-bold text-[10px] rounded-lg transition-all ${
                      qrScannerMode === 'camera' 
                        ? 'bg-slate-800 text-white shadow-3xs' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Caméra en direct
                  </button>
                  <button
                    onClick={() => setQrScannerMode('upload')}
                    className={`py-1.5 text-center font-bold text-[10px] rounded-lg transition-all ${
                      qrScannerMode === 'upload' 
                        ? 'bg-slate-800 text-white shadow-3xs' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Importer une photo
                  </button>
                </div>
              </div>

              {/* SIMULATION CONSOLE & TEST QR CODES */}
              <div className="md:col-span-5 space-y-4 text-left flex flex-col justify-between">
                <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between h-full">
                  
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-orange-500" /> Simulateur de QR de Test
                    </span>
                    <p className="text-[9px] text-slate-400 leading-relaxed">
                      Cliquez sur l'un des codes QR physiques ci-dessous pour simuler sa présentation instantanée devant la caméra :
                    </p>
                  </div>

                  <div className="space-y-2">
                    {/* Trigger 1: Cuisine Ticket */}
                    <button
                      type="button"
                      onClick={() => handleQRScanAction('ticket:ord-8109')}
                      className="w-full p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl transition-all text-left flex items-center justify-between group active:scale-98 cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <span className="text-[8px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.2 rounded font-black uppercase">TICKET CUISINE</span>
                        <h5 className="text-[11px] font-bold text-slate-200 mt-1">Ticket de Table 4</h5>
                        <p className="text-[9px] text-slate-400">Charge Kedjenou x1, Beaufort x2, Alloco x1</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                    </button>

                    {/* Trigger 2: Wave Client Payment */}
                    <button
                      type="button"
                      onClick={() => handleQRScanAction(`payment:wave:0707011223:${totalToPay}`)}
                      className="w-full p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl transition-all text-left flex items-center justify-between group active:scale-98 cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <span className="text-[8px] bg-sky-500/10 text-sky-400 border border-sky-500/20 px-1.5 py-0.2 rounded font-black uppercase">PAIEMENT WAVE QR</span>
                        <h5 className="text-[11px] font-bold text-slate-200 mt-1">Règlement Wave Client</h5>
                        <p className="text-[9px] text-slate-400">Payer le montant du ticket ({totalToPay.toLocaleString('fr-FR')} F CFA)</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                    </button>

                    {/* Trigger 3: OM Client Payment */}
                    <button
                      type="button"
                      onClick={() => handleQRScanAction(`payment:orange_money:0707998877:${totalToPay}`)}
                      className="w-full p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl transition-all text-left flex items-center justify-between group active:scale-98 cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <span className="text-[8px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-1.5 py-0.2 rounded font-black uppercase">PAIEMENT ORANGE QR</span>
                        <h5 className="text-[11px] font-bold text-slate-200 mt-1">Règlement Orange Money</h5>
                        <p className="text-[9px] text-slate-400">Payer le montant du ticket ({totalToPay.toLocaleString('fr-FR')} F CFA)</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                    </button>

                    {/* Trigger 4: VIP Discount Code */}
                    <button
                      type="button"
                      onClick={() => handleQRScanAction('discount:PROMO_BOUAKE:20')}
                      className="w-full p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl transition-all text-left flex items-center justify-between group active:scale-98 cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded font-black uppercase">REMISE FIDÉLITÉ VIP</span>
                        <h5 className="text-[11px] font-bold text-slate-200 mt-1">Code Promo 20%</h5>
                        <p className="text-[9px] text-slate-400">Applique instantanément une réduction de 20%</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                    </button>
                  </div>

                  <div className="flex gap-2 items-center text-[9px] text-slate-500 font-medium">
                    <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Retour audio synthétisé actif sur détection.</span>
                  </div>

                </div>
              </div>

            </div>

            {/* Footer buttons */}
            <div className="border-t border-slate-800 pt-3.5 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowQRScanner(false);
                  stopCamera();
                }}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Fermer le Scanner
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
