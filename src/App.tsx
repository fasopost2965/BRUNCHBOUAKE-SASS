import React, { useState, useEffect } from 'react';
import { 
  Home, 
  BedDouble, 
  UtensilsCrossed, 
  Receipt, 
  Users, 
  Settings, 
  Layers, 
  Clock, 
  UserCheck, 
  LogOut,
  Sparkles,
  Info,
  Lock,
  BarChart2,
  Briefcase,
  Wifi,
  WifiOff,
  RefreshCw,
  Cloud,
  CloudOff,
  AlertTriangle,
  CheckCircle,
  Palette,
  Activity,
  Calendar,
  Trash2,
  AlertCircle
} from 'lucide-react';

// Seed data
import { 
  INITIAL_ROOMS, 
  INITIAL_GUESTS, 
  INITIAL_RESERVATIONS, 
  INITIAL_MENU, 
  INITIAL_STAFF, 
  INITIAL_TASKS, 
  INITIAL_TRANSACTIONS,
  INITIAL_ROOM_HISTORY_LOGS,
  INITIAL_INVOICES,
  INITIAL_CUSTOMER_AVOIRS,
  INITIAL_HR_EMPLOYEES,
  INITIAL_HR_PAYSLIPS,
  INITIAL_HR_CONTRACTS
} from './data';

import { lazy, Suspense } from 'react';

// Custom components
import DashboardOverview from './components/DashboardOverview';
import LoginView from './components/LoginView';
import OnboardingTour, { ONBOARDING_STEPS } from './components/OnboardingTour';

const ArchitecturalBlueprints = lazy(() => import('./components/ArchitecturalBlueprints'));
const PMSManager = lazy(() => import('./components/PMSManager'));
const POSManager = lazy(() => import('./components/POSManager'));
const ERPBilling = lazy(() => import('./components/ERPBilling'));
const StaffOperations = lazy(() => import('./components/StaffOperations'));
const CRMGuests = lazy(() => import('./components/CRMGuests'));
const PropertySettingsManager = lazy(() => import('./components/PropertySettingsManager'));
const UserManager = lazy(() => import('./components/UserManager'));
const RestaurantManager = lazy(() => import('./components/RestaurantManager'));
const StockManager = lazy(() => import('./components/StockManager'));
const ReportsManager = lazy(() => import('./components/ReportsManager'));
const HRManager = lazy(() => import('./components/HRManager'));
const GuidedTourPage = lazy(() => import('./components/GuidedTourPage'));

import { Room, Reservation, MenuItem, StaffMember, Task, Transaction, GuestRecord, TableOrder, PaymentIntent, PaymentTransaction, WebhookEvent, ProcessedEvent, PropertySettings, UserAccount, UserRole, StockItem, StockMovement, OfflineSyncItem, Invoice, CustomerAvoir, RoomHistoryLog, HREmployee, Payslip, HRContract } from './types';

import { PaymentOrchestrator } from './services/paymentService';
import { DEFAULT_PROPERTY_SETTINGS } from './data';
import { getSyncQueueDB, saveSyncQueueItemDB, deleteSyncQueueItemDB, clearSyncQueueDB, processSyncQueue } from './utils/indexedDB';

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['dashboard', 'pms', 'pos', 'restaurant', 'stocks', 'erp', 'staff', 'crm', 'blueprints', 'settings', 'users', 'reports', 'hr', 'tour'],
  manager: ['dashboard', 'pms', 'pos', 'restaurant', 'stocks', 'erp', 'staff', 'crm', 'blueprints', 'settings', 'users', 'reports', 'hr', 'tour'],
  receptionist: ['dashboard', 'pms', 'pos', 'staff', 'crm', 'blueprints', 'settings', 'tour'],
  waiter: ['dashboard', 'pos', 'restaurant', 'blueprints', 'tour'],
  accountant: ['dashboard', 'erp', 'stocks', 'blueprints', 'reports', 'tour'],
  housekeeper: ['dashboard', 'staff', 'blueprints', 'tour']
};

const TAB_NAMES: Record<string, string> = {
  dashboard: "Tableau de Bord Vue d'Ensemble",
  pms: "Gestion Chambres (PMS)",
  pos: "Caisse Restaurant (POS)",
  restaurant: "Menus Resto & Maquis",
  stocks: "Gestion de Stocks",
  erp: "Trésorerie & Factures (ERP)",
  staff: "Équipe & Tâches",
  crm: "Fichier Clients (CRM)",
  blueprints: "Plans Conceptuels",
  settings: "Configuration Établissement",
  users: "Utilisateurs & Droits Demo",
  reports: "Rapports & Statistiques",
  hr: "Gestion RH & Paie",
  tour: "Visite Guidée Interactive"
};

function AccessDenied({ currentRole, activeTab, onBackToDashboard }: { currentRole: string; activeTab: string; onBackToDashboard: () => void }) {
  const allowedRoles = Object.entries(ROLE_PERMISSIONS)
    .filter(([_, allowedTabs]) => allowedTabs.includes(activeTab))
    .map(([role]) => role);

  const getRoleLabel = (r: string) => {
    if (r === 'admin') return 'Directeur / Admin';
    if (r === 'manager') return 'Manager Général';
    if (r === 'receptionist') return 'Réceptionniste';
    if (r === 'waiter') return 'Serveur Resto';
    if (r === 'accountant') return 'Comptable (Caissier)';
    if (r === 'housekeeper') return 'Gouvernante (Ménage)';
    return r;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
      <div className="bg-white border border-rose-200 rounded-3xl p-8 max-w-md w-full shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-rose-500" />
        
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-rose-100">
          <Lock className="w-8 h-8" />
        </div>
        
        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Accès Non Autorisé</h3>
        <p className="text-xs text-rose-500 font-bold uppercase tracking-widest mt-1 font-mono">Module Restreint</p>
        
        <p className="text-xs text-slate-500 leading-relaxed mt-4">
          Votre rôle actuel <span className="font-bold text-slate-800 uppercase px-1.5 py-0.5 bg-slate-100 rounded">"{getRoleLabel(currentRole)}"</span> n'a pas les privilèges requis pour accéder au module :
        </p>
        
        <div className="text-sm font-extrabold text-slate-850 mt-2 p-2 bg-slate-50 border border-slate-100 rounded-xl">
          {TAB_NAMES[activeTab] || activeTab}
        </div>

        <div className="mt-6 pt-5 border-t border-slate-100 text-left space-y-3">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Rôles de service autorisés :
          </div>
          <div className="flex flex-wrap gap-1.5">
            {allowedRoles.map((r) => (
              <span key={r} className="px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg text-[10px] font-bold uppercase">
                {getRoleLabel(r)}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={onBackToDashboard}
            className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Retour à l'Accueil
          </button>
          
          <div className="flex-1 text-[11px] text-slate-400 self-center">
            Changez le rôle dans l'en-tête pour tester.
          </div>
        </div>
      </div>
    </div>
  );
}

function safeJSONParse<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) as T : fallback;
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error);
    return fallback;
  }
}

export default function App() {
  
  // 1. STATE WITH LOCAL STORAGE PERSISTENCE
  const [rooms, setRooms] = useState<Room[]>(() => {
    return safeJSONParse('bb_rooms', INITIAL_ROOMS);
  });

  const [guests, setGuests] = useState<GuestRecord[]>(() => {
    return safeJSONParse('bb_guests', INITIAL_GUESTS);
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    return safeJSONParse('bb_reservations', INITIAL_RESERVATIONS);
  });

  const [menu, setMenu] = useState<MenuItem[]>(() => {
    return safeJSONParse('bb_menu', INITIAL_MENU);
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    return safeJSONParse('bb_staff', INITIAL_STAFF);
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    return safeJSONParse('bb_tasks', INITIAL_TASKS);
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const rawTx = safeJSONParse('bb_transactions', INITIAL_TRANSACTIONS);
    const seenIds = new Set<string>();
    return rawTx.map(tx => {
      let uniqueId = tx.id;
      let counter = 1;
      while (!uniqueId || seenIds.has(uniqueId)) {
        uniqueId = `${tx.id || 'tr'}_dup${counter++}`;
      }
      seenIds.add(uniqueId);
      return { ...tx, id: uniqueId };
    });
  });

  const [activeOrders, setActiveOrders] = useState<TableOrder[]>(() => {
    return safeJSONParse('bb_active_orders', []);
  });

  // Mobile Money Unified Payment States
  const [paymentIntents, setPaymentIntents] = useState<PaymentIntent[]>(() => {
    return safeJSONParse('bb_payment_intents', []);
  });

  const [paymentTransactions, setPaymentTransactions] = useState<PaymentTransaction[]>(() => {
    return safeJSONParse('bb_payment_transactions', []);
  });

  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>(() => {
    return safeJSONParse('bb_webhook_events', []);
  });

  const [processedEvents, setProcessedEvents] = useState<ProcessedEvent[]>(() => {
    return safeJSONParse('bb_processed_events', []);
  });

  // Property Settings state with local storage persistence
  const [settings, setSettings] = useState<PropertySettings>(() => {
    return safeJSONParse('bb_settings', DEFAULT_PROPERTY_SETTINGS);
  });

  // Stock and Inventory state management
  const [stockItems, setStockItems] = useState<StockItem[]>(() => {
    return safeJSONParse('bb_stock_items', []);
  });

  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    return safeJSONParse('bb_stock_movements', []);
  });

  // Offline / Synchronisation Queue state variables
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  const [isOfflineModeSimulated, setIsOfflineModeSimulated] = useState<boolean>(() => {
    const saved = localStorage.getItem('bb_offline_mode_simulated');
    return saved === 'true';
  });

  const [syncQueue, setSyncQueue] = useState<OfflineSyncItem[]>([]);

  // ERP Invoices & Customer Avoirs States
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    return safeJSONParse('bb_invoices', INITIAL_INVOICES);
  });

  const [customerAvoirs, setCustomerAvoirs] = useState<CustomerAvoir[]>(() => {
    return safeJSONParse('bb_customer_avoirs', INITIAL_CUSTOMER_AVOIRS);
  });

  const [hrEmployees, setHrEmployees] = useState<HREmployee[]>(() => {
    return safeJSONParse('bb_hr_employees', INITIAL_HR_EMPLOYEES);
  });

  const [hrPayslips, setHrPayslips] = useState<Payslip[]>(() => {
    return safeJSONParse('bb_hr_payslips', INITIAL_HR_PAYSLIPS);
  });

  const [hrContracts, setHrContracts] = useState<HRContract[]>(() => {
    return safeJSONParse('bb_hr_contracts', INITIAL_HR_CONTRACTS);
  });

  const [roomHistoryLogs, setRoomHistoryLogs] = useState<RoomHistoryLog[]>(() => {
    return safeJSONParse('bb_room_history_logs', INITIAL_ROOM_HISTORY_LOGS);
  });

  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState<string>('');

  // Production transition / data wipe states
  const [isProductionModalOpen, setIsProductionModalOpen] = useState(false);
  const [productionConfirmInput, setProductionConfirmInput] = useState('');
  const [generatedConfirmCode, setGeneratedConfirmCode] = useState('');
  const [productionError, setProductionError] = useState('');
  const [productionSuccess, setProductionSuccess] = useState(false);

  // Admin Reset states
  const [isAdminResetModalOpen, setIsAdminResetModalOpen] = useState(false);
  const [adminResetConfirmInput, setAdminResetConfirmInput] = useState('');
  const [adminResetGeneratedCode, setAdminResetGeneratedCode] = useState('');
  const [adminResetError, setAdminResetError] = useState('');

  // Custom stylish Notifications & Modals (avoid iframe-breaking window.alert/window.confirm)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => {
    setDialog({
      isOpen: true,
      title,
      message,
      confirmText: 'Confirmer',
      cancelText: 'Annuler',
      onConfirm: () => {
        onConfirm();
        setDialog(null);
      },
      onCancel: () => {
        if (onCancel) onCancel();
        setDialog(null);
      }
    });
  };

  const showAlert = (title: string, message: string, onConfirm?: () => void) => {
    setDialog({
      isOpen: true,
      title,
      message,
      confirmText: "D'accord",
      onConfirm: () => {
        if (onConfirm) onConfirm();
        setDialog(null);
      }
    });
  };

  const effectiveOnlineStatus = isOnline && !isOfflineModeSimulated;

  useEffect(() => {
    localStorage.setItem('bb_offline_mode_simulated', String(isOfflineModeSimulated));
  }, [isOfflineModeSimulated]);

  useEffect(() => {
    getSyncQueueDB().then(items => {
      setSyncQueue(items);
    }).catch(err => {
      console.error("Failed to load offline sync queue from IndexedDB:", err);
    });
  }, []);

  useEffect(() => {
    const syncWithIDB = async () => {
      try {
        await clearSyncQueueDB();
        for (const item of syncQueue) {
          await saveSyncQueueItemDB(item);
        }
      } catch (err) {
        console.error("Failed to update IndexedDB sync queue:", err);
      }
    };
    syncWithIDB();
    localStorage.setItem('bb_sync_queue', JSON.stringify(syncQueue));
  }, [syncQueue]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const triggerSync = async () => {
    // Filter out items that are already permanently failed so we don't try them again
    const activeItems = syncQueue.filter(item => !(item.status === 'failed' && item.attempts >= 3));
    if (activeItems.length === 0) {
      if (syncQueue.some(item => item.status === 'failed')) {
        setSyncStatus('error');
        setSyncMessage("Échec : Certaines transactions ont échoué définitivement après 3 tentatives.");
      }
      return;
    }
    
    setSyncStatus('syncing');
    setSyncMessage(`Synchronisation sécurisée de ${activeItems.length} transaction(s) en cours...`);
    
    try {
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Keep track of processed idempotency keys on mock server
      const serverProcessedKeys = new Set<string>();
      
      const { remainingQueue, syncedCount, failedCount } = await processSyncQueue(
        syncQueue,
        async (idempotencyKey, transaction) => {
          // 1. Check idempotency on the server
          if (serverProcessedKeys.has(idempotencyKey)) {
            console.warn(`[Mock Server] Idempotency match found! Already processed transaction ${transaction.id}.`);
            return; // No-op idempotent success
          }

          // 2. Simulate occasional network failure (25% chance)
          // This allows testing the attempts count going up and errorDetail being updated!
          const isNetworkFlaky = Math.random() < 0.25;
          if (isNetworkFlaky) {
            throw new Error("Délai d'attente dépassé (Gateway Timeout 504) ou instabilité de la connexion mobile.");
          }

          // Successful process
          serverProcessedKeys.add(idempotencyKey);
          console.log(`[Mock Server] Transaction ${transaction.id} registered. IdempotencyKey: ${idempotencyKey}`);
        }
      );

      setSyncQueue(remainingQueue);

      if (failedCount > 0) {
        setSyncStatus('error');
        setSyncMessage(`Synchro terminée. ${syncedCount} réussie(s), ${failedCount} en échec définitif.`);
      } else if (remainingQueue.length > 0) {
        setSyncStatus('idle');
        setSyncMessage(`Synchro partielle : ${syncedCount} réussie(s), ${remainingQueue.length} repoussée(s) pour instabilité.`);
      } else {
        setSyncStatus('success');
        setSyncMessage(`Félicitations ! ${syncedCount} transaction(s) synchronisées avec contrôle d'idempotence.`);
      }

      setTimeout(() => {
        setSyncStatus('idle');
        if (failedCount === 0 && remainingQueue.length === 0) {
          setSyncMessage('');
        }
      }, 5000);
    } catch (err) {
      setSyncStatus('error');
      setSyncMessage("Échec de la synchronisation en raison d'un problème réseau majeur.");
    }
  };

  useEffect(() => {
    if (effectiveOnlineStatus && syncQueue.length > 0 && syncStatus !== 'syncing') {
      triggerSync();
    }
  }, [effectiveOnlineStatus, syncQueue.length]);

  // Design Theme Selection (Savannah / Lagoon / Forest / Swiss)
  const [appTheme, setAppTheme] = useState<'savannah' | 'lagoon' | 'forest' | 'swiss'>(() => {
    const saved = localStorage.getItem('bb_app_theme');
    return (saved as 'savannah' | 'lagoon' | 'forest' | 'swiss') || 'savannah';
  });

  useEffect(() => {
    localStorage.setItem('bb_app_theme', appTheme);
  }, [appTheme]);


  // 2. USER AUTHENTICATION AND PERSISTENCE STATES
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const defaultUsers = [
      {
        id: 'usr-admin',
        tenantId: 'tenant-bouake-kennedy',
        name: 'Jean Dupont (Directeur)',
        username: 'admin@test',
        email: 'admin@brunchbouake.com',
        phone: '+225 07 48 29 10 11',
        role: 'admin',
        status: 'active',
        passwordHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
        isTemporaryPassword: false,
        createdAt: new Date().toISOString(),
        branch: 'Quartier Kennedy'
      },
      {
        id: 'usr-reception',
        tenantId: 'tenant-bouake-kennedy',
        name: 'Mariam Diallo',
        username: 'reception@test',
        email: 'm.diallo@brunchbouake.com',
        phone: '+225 05 55 12 34 56',
        role: 'receptionist',
        status: 'active',
        passwordHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
        isTemporaryPassword: false,
        createdAt: new Date().toISOString(),
        branch: 'Quartier Kennedy'
      },
      {
        id: 'usr-waiter',
        tenantId: 'tenant-bouake-kennedy',
        name: 'Kouassi Kouamé Jean',
        username: 'waiter@test',
        email: 'k.jean@brunchbouake.com',
        phone: '+225 05 99 88 77 66',
        role: 'waiter',
        status: 'active',
        passwordHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
        isTemporaryPassword: false,
        createdAt: new Date().toISOString(),
        branch: 'Maquis Central'
      },
      {
        id: 'usr-housekeeper',
        tenantId: 'tenant-bouake-kennedy',
        name: 'Aka Florence (Gouvernante)',
        username: 'housekeeping@test',
        email: 'f.aka@brunchbouake.com',
        phone: '+225 01 22 33 44 55',
        role: 'housekeeper',
        status: 'active',
        passwordHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
        isTemporaryPassword: false,
        createdAt: new Date().toISOString(),
        branch: 'Quartier Kennedy'
      },
      {
        id: 'usr-accountant',
        tenantId: 'tenant-bouake-kennedy',
        name: 'Yao Amenan Chantal (Comptable)',
        username: 'cashier@test',
        email: 'c.yao@brunchbouake.com',
        phone: '+225 07 11 22 33 44',
        role: 'accountant',
        status: 'active',
        passwordHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
        isTemporaryPassword: false,
        createdAt: new Date().toISOString(),
        branch: 'Quartier Kennedy'
      },
      {
        id: 'usr-manager',
        tenantId: 'tenant-bouake-kennedy',
        name: 'Zadi Richard (Manager Général)',
        username: 'manager@test',
        email: 'r.zadi@brunchbouake.com',
        phone: '+225 07 44 55 66 77',
        role: 'manager',
        status: 'active',
        passwordHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
        isTemporaryPassword: false,
        createdAt: new Date().toISOString(),
        branch: 'Quartier Kennedy'
      }
    ];
    return safeJSONParse('bb_users', defaultUsers);
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    return safeJSONParse<UserAccount | null>('bb_current_user', null);
  });

  const [isProductionMode, setIsProductionMode] = useState<boolean>(() => {
    const isProdHost = typeof window !== 'undefined' && 
      window.location.hostname !== 'localhost' && 
      window.location.hostname !== '127.0.0.1' &&
      !window.location.hostname.includes('ais-dev') && 
      !window.location.hostname.includes('ais-pre') &&
      !window.location.hostname.includes('run.app');
    
    const isViteProd = typeof import.meta !== 'undefined' && 
      (import.meta as any).env && 
      (import.meta as any).env.PROD;
    
    return localStorage.getItem('bb_is_production') === 'true' || isViteProd || isProdHost;
  });

  // Active view state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pms' | 'pos' | 'erp' | 'staff' | 'crm' | 'blueprints' | 'settings' | 'users' | 'tour'>('dashboard');
  const [pmsActiveSubTab, setPmsActiveSubTab] = useState<'kpis' | 'rooms' | 'calendar' | 'monthly'>('rooms');
  
  // Simulation role-based selector
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const savedUser = safeJSONParse<UserAccount | null>('bb_current_user', null);
    if (savedUser) {
      return savedUser.role;
    }
    return 'admin';
  });

  // Onboarding (Interactive Tour) States
  const [isOnboarding, setIsOnboarding] = useState<boolean>(() => {
    const completed = localStorage.getItem('bb_onboarding_completed');
    return completed !== 'true'; // First load defaults to true
  });
  const [onboardingStepIndex, setOnboardingStepIndex] = useState<number>(-1); // -1 = Welcome, 0-5 = steps, 6 = Complete
  const [previousRoleBeforeOnboarding, setPreviousRoleBeforeOnboarding] = useState<UserRole>(currentRole);

  const handleStartOnboarding = () => {
    setPreviousRoleBeforeOnboarding(currentRole);
    setOnboardingStepIndex(-1); // Welcome screen
    setIsOnboarding(true);
  };

  const handleCloseOnboarding = () => {
    setIsOnboarding(false);
    setOnboardingStepIndex(-1);
    setCurrentRole(previousRoleBeforeOnboarding);
    localStorage.setItem('bb_onboarding_completed', 'true');
  };

  // Real-time local clock
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('bb_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('bb_guests', JSON.stringify(guests));
  }, [guests]);

  useEffect(() => {
    localStorage.setItem('bb_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('bb_menu', JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem('bb_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('bb_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('bb_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('bb_active_orders', JSON.stringify(activeOrders));
  }, [activeOrders]);

  useEffect(() => {
    localStorage.setItem('bb_payment_intents', JSON.stringify(paymentIntents));
  }, [paymentIntents]);

  useEffect(() => {
    localStorage.setItem('bb_payment_transactions', JSON.stringify(paymentTransactions));
  }, [paymentTransactions]);

  useEffect(() => {
    localStorage.setItem('bb_webhook_events', JSON.stringify(webhookEvents));
  }, [webhookEvents]);

  useEffect(() => {
    localStorage.setItem('bb_processed_events', JSON.stringify(processedEvents));
  }, [processedEvents]);

  useEffect(() => {
    localStorage.setItem('bb_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('bb_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('bb_stock_items', JSON.stringify(stockItems));
  }, [stockItems]);

  useEffect(() => {
    localStorage.setItem('bb_stock_movements', JSON.stringify(stockMovements));
  }, [stockMovements]);

  useEffect(() => {
    localStorage.setItem('bb_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('bb_customer_avoirs', JSON.stringify(customerAvoirs));
  }, [customerAvoirs]);

  useEffect(() => {
    localStorage.setItem('bb_hr_employees', JSON.stringify(hrEmployees));
  }, [hrEmployees]);

  useEffect(() => {
    localStorage.setItem('bb_hr_payslips', JSON.stringify(hrPayslips));
  }, [hrPayslips]);

  useEffect(() => {
    localStorage.setItem('bb_hr_contracts', JSON.stringify(hrContracts));
  }, [hrContracts]);

  useEffect(() => {
    localStorage.setItem('bb_room_history_logs', JSON.stringify(roomHistoryLogs));
  }, [roomHistoryLogs]);

  // Global modifiers passed down to components
  const handleAddTransaction = (newT: Transaction) => {
    // 1. Instantly update local state (Offline-First)
    setTransactions(prev => [...prev, newT]);
    
    // Also, if it's a lodging payment, let's update CRM statistics!
    if (newT.type === 'lodging_payment') {
      const reservationId = newT.referenceId;
      const res = reservations.find(r => r.id === reservationId);
      if (res) {
        setGuests(prevGuests => prevGuests.map(g => {
          if (g.name.toLowerCase() === res.guestName.toLowerCase()) {
            return {
              ...g,
              visitCount: g.visitCount + 1,
              totalSpent: g.totalSpent + newT.amount
            };
          }
          return g;
        }));
      }
    }

    // 2. Intercept for Sync Queue if offline
    if (!effectiveOnlineStatus) {
      const syncItem: OfflineSyncItem = {
        id: `sync-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        idempotencyKey: newT.idempotencyKey,
        transaction: newT,
        status: 'pending',
        attempts: 0
      };
      setSyncQueue(prev => [...prev, syncItem]);
      
      // Briefly alert the user about local caching
      setSyncStatus('idle');
    } else {
      // Online mode: briefly display a live sync success notice
      setSyncStatus('success');
      setSyncMessage(`Transaction "${newT.description}" enregistrée et synchronisée.`);
      setTimeout(() => {
        setSyncStatus('idle');
        setSyncMessage('');
      }, 3000);
    }
  };


  const handleAddTask = (title: string, desc: string, cat: 'housekeeping' | 'maintenance', rId?: string) => {
    const defaultAssignee = staff.find(s => {
      if (cat === 'housekeeping' && s.role === 'housekeeper' && s.status === 'active') return true;
      if (cat === 'maintenance' && s.role === 'manager' && s.status === 'active') return true;
      return false;
    });

    const newTask: Task = {
      id: `task-${Date.now().toString().slice(-4)}`,
      title,
      description: desc,
      category: cat,
      assignedTo: defaultAssignee?.id,
      assignedToName: defaultAssignee?.name,
      status: 'pending',
      dueDate: new Date().toISOString().split('T')[0],
      roomId: rId
    };

    setTasks(prev => [...prev, newTask]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('bb_current_user');
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    localStorage.setItem('bb_current_user', JSON.stringify(user));
    
    // Set current role
    setCurrentRole(user.role);

    // Update lastLoginAt
    setUsers(prevUsers => prevUsers.map(u => {
      if (u.id === user.id) {
        return {
          ...u,
          lastLoginAt: new Date().toISOString()
        };
      }
      return u;
    }));

    // Redirect based on role
    if (user.role === 'admin' || user.role === 'manager') {
      setActiveTab('dashboard');
    } else if (user.role === 'receptionist') {
      setActiveTab('pms');
    } else if (user.role === 'waiter') {
      setActiveTab('pos');
    } else if (user.role === 'accountant') {
      setActiveTab('erp');
    } else if (user.role === 'housekeeper') {
      setActiveTab('staff');
    }
  };

  const handleResetPasswordDirect = (username: string, newPassword: string) => {
    setUsers(prevUsers => prevUsers.map(u => {
      if (u.username.toLowerCase() === username.toLowerCase()) {
        return {
          ...u,
          passwordHash: newPassword,
          isTemporaryPassword: false,
          updatedAt: new Date().toISOString(),
          updatedBy: 'Self Reset'
        };
      }
      return u;
    }));
  };

  const handleResetData = () => {
    if (currentRole !== 'admin') {
      showAlert("Non autorisé", "Seul l'administrateur système (Directeur) peut réinitialiser l'application.");
      return;
    }

    if (isProductionMode) {
      const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
      setAdminResetGeneratedCode(randomCode);
      setAdminResetConfirmInput('');
      setAdminResetError('');
      setIsAdminResetModalOpen(true);
      return;
    }

    showConfirm(
      "Réinitialiser la Démo",
      "Voulez-vous réinitialiser toutes les données de simulation de Brunch Bouaké aux données de démonstration initiales ?",
      () => {
        const savedUsers = localStorage.getItem('bb_users');
        const savedCurrentUser = localStorage.getItem('bb_current_user');
        const savedTheme = localStorage.getItem('bb_app_theme');
        const savedPin = localStorage.getItem('bb_security_pin');

        localStorage.clear();

        if (savedUsers) localStorage.setItem('bb_users', savedUsers);
        if (savedCurrentUser) localStorage.setItem('bb_current_user', savedCurrentUser);
        if (savedTheme) localStorage.setItem('bb_app_theme', savedTheme);
        if (savedPin) localStorage.setItem('bb_security_pin', savedPin);
        localStorage.setItem('bb_is_production', 'false');

        setRooms(INITIAL_ROOMS);
        setGuests(INITIAL_GUESTS);
        setReservations(INITIAL_RESERVATIONS);
        setMenu(INITIAL_MENU);
        setStaff(INITIAL_STAFF);
        setTasks(INITIAL_TASKS);
        setTransactions(INITIAL_TRANSACTIONS);
        setActiveOrders([]);
        setSettings(DEFAULT_PROPERTY_SETTINGS);

        // Reset HR demo data
        setHrEmployees(INITIAL_HR_EMPLOYEES);
        setHrPayslips(INITIAL_HR_PAYSLIPS);
        setHrContracts(INITIAL_HR_CONTRACTS);
        localStorage.setItem('bb_hr_employees', JSON.stringify(INITIAL_HR_EMPLOYEES));
        localStorage.setItem('bb_hr_payslips', JSON.stringify(INITIAL_HR_PAYSLIPS));
        localStorage.setItem('bb_hr_contracts', JSON.stringify(INITIAL_HR_CONTRACTS));

        setActiveTab('dashboard');
        showToast("L'application a été réinitialisée aux données de démonstration.", "success");
      }
    );
  };

  const handleAdminResetSubmit = () => {
    if (adminResetConfirmInput.trim() !== adminResetGeneratedCode) {
      setAdminResetError("Le code de sécurité est incorrect.");
      return;
    }

    // Wipe everything
    setReservations([]);
    setTransactions([]);
    setGuests([]);
    setInvoices([]);
    setCustomerAvoirs([]);
    setActiveOrders([]);
    setPaymentIntents([]);
    setPaymentTransactions([]);
    setWebhookEvents([]);
    setProcessedEvents([]);
    setTasks([]);
    setSyncQueue([]);
    setStockMovements([]);
    setStockItems([]);
    setMenu([]);
    setRooms(prev => prev.map(r => ({
      ...r,
      status: 'available',
      currentGuestId: undefined,
      currentReservationId: undefined
    })));

    // Reset HR to clean slate
    setHrEmployees([]);
    setHrPayslips([]);
    setHrContracts([]);

    const savedUsers = localStorage.getItem('bb_users');
    const savedCurrentUser = localStorage.getItem('bb_current_user');
    const savedTheme = localStorage.getItem('bb_app_theme');
    const savedPin = localStorage.getItem('bb_security_pin');

    localStorage.clear();
    // Re-save production flag
    localStorage.setItem('bb_is_production', 'true');
    setIsProductionMode(true);
    // Re-save critical keys
    if (savedUsers) {
      localStorage.setItem('bb_users', savedUsers);
    } else {
      localStorage.setItem('bb_users', JSON.stringify(users));
    }
    if (savedCurrentUser) {
      localStorage.setItem('bb_current_user', savedCurrentUser);
    } else if (currentUser) {
      localStorage.setItem('bb_current_user', JSON.stringify(currentUser));
    }
    if (savedTheme) localStorage.setItem('bb_app_theme', savedTheme);
    if (savedPin) localStorage.setItem('bb_security_pin', savedPin);

    // Explicitly write clean HR states
    localStorage.setItem('bb_hr_employees', JSON.stringify([]));
    localStorage.setItem('bb_hr_payslips', JSON.stringify([]));
    localStorage.setItem('bb_hr_contracts', JSON.stringify([]));
    
    setIsAdminResetModalOpen(false);
    setActiveTab('dashboard');
    showToast("Réinitialisation usine effectuée avec succès (mode production maintenu).", "success");
  };

  const handleResetToDemo = () => {
    const savedUsers = localStorage.getItem('bb_users');
    const savedCurrentUser = localStorage.getItem('bb_current_user');
    const savedTheme = localStorage.getItem('bb_app_theme');
    const savedPin = localStorage.getItem('bb_security_pin');

    localStorage.clear();

    if (savedUsers) localStorage.setItem('bb_users', savedUsers);
    if (savedCurrentUser) localStorage.setItem('bb_current_user', savedCurrentUser);
    if (savedTheme) localStorage.setItem('bb_app_theme', savedTheme);
    if (savedPin) localStorage.setItem('bb_security_pin', savedPin);
    localStorage.setItem('bb_is_production', 'false');

    setRooms(INITIAL_ROOMS);
    setGuests(INITIAL_GUESTS);
    setReservations(INITIAL_RESERVATIONS);
    setMenu(INITIAL_MENU);
    setStaff(INITIAL_STAFF);
    setTasks(INITIAL_TASKS);
    setTransactions(INITIAL_TRANSACTIONS);
    setActiveOrders([]);
    setSettings(DEFAULT_PROPERTY_SETTINGS);
    setInvoices([
      {
        id: 'FAC-2026-0001',
        clientName: 'Koffi Anderson',
        clientPhone: '+225 07 01 02 03 04',
        date: '2026-06-30',
        dueDate: '2026-07-15',
        items: [
          { description: 'Chambre Standard Gbêkê - Séjour de 2 nuits', quantity: 2, unitPrice: 18000, total: 36000 },
          { description: 'Boisson - Bière Bock Grande Maquis', quantity: 4, unitPrice: 1000, total: 4000 }
        ],
        subtotal: 40000,
        taxRate: 0.18,
        taxAmount: 7200,
        totalAmount: 47200,
        status: 'paid',
        paymentMethod: 'cash',
        notes: 'Payé à l\'accueil lors du check-out'
      },
      {
        id: 'FAC-2026-0002',
        clientName: 'Amina Doukouré',
        clientPhone: '+225 05 11 22 33 44',
        date: '2026-07-01',
        dueDate: '2026-07-10',
        items: [
          { description: 'Studio Bouaké Chic - Séjour de 1 nuit', quantity: 1, unitPrice: 25000, total: 25000 },
          { description: 'Restauration - Kedjenou de Poulet & Attiéké', quantity: 2, unitPrice: 6000, total: 12000 }
        ],
        subtotal: 37000,
        taxRate: 0.18,
        taxAmount: 6660,
        totalAmount: 43660,
        status: 'unpaid',
        notes: 'En attente de virement Wave ou Orange Money'
      },
      {
        id: 'FAC-2026-0003',
        clientName: 'Dr. Bakayoko Sylla',
        clientPhone: '+225 07 88 99 00 11',
        date: '2026-07-02',
        dueDate: '2026-07-02',
        items: [
          { description: 'Appartement Prestige Kénédou - Séjour de 3 nuits', quantity: 3, unitPrice: 45000, total: 135000 }
        ],
        subtotal: 135000,
        taxRate: 0.18,
        taxAmount: 24300,
        totalAmount: 159300,
        status: 'paid',
        paymentMethod: 'wave',
        notes: 'Payé via Wave avec confirmation'
      }
    ]);
    setCustomerAvoirs([]);
    setPaymentIntents([]);
    setPaymentTransactions([]);
    setWebhookEvents([]);
    setProcessedEvents([]);
    setSyncQueue([]);
    setStockMovements([]);

    // Restore HR demo data
    setHrEmployees(INITIAL_HR_EMPLOYEES);
    setHrPayslips(INITIAL_HR_PAYSLIPS);
    setHrContracts(INITIAL_HR_CONTRACTS);
    localStorage.setItem('bb_hr_employees', JSON.stringify(INITIAL_HR_EMPLOYEES));
    localStorage.setItem('bb_hr_payslips', JSON.stringify(INITIAL_HR_PAYSLIPS));
    localStorage.setItem('bb_hr_contracts', JSON.stringify(INITIAL_HR_CONTRACTS));

    setIsProductionMode(false);
    setActiveTab('dashboard');
  };

  const handleResetToProductionWipe = () => {
    // Programmatic switch to production wipes everything cleanly
    setReservations([]);
    setTransactions([]);
    setGuests([]);
    setInvoices([]);
    setCustomerAvoirs([]);
    setActiveOrders([]);
    setPaymentIntents([]);
    setPaymentTransactions([]);
    setWebhookEvents([]);
    setProcessedEvents([]);
    setTasks([]);
    setSyncQueue([]);
    setStockMovements([]);
    setStockItems([]);
    setMenu([]);
    setRooms(prev => prev.map(r => ({
      ...r,
      status: 'available',
      currentGuestId: undefined,
      currentReservationId: undefined
    })));

    // Clean HR data for a clean production slate
    setHrEmployees([]);
    setHrPayslips([]);
    setHrContracts([]);

    localStorage.removeItem('bb_reservations');
    localStorage.removeItem('bb_transactions');
    localStorage.removeItem('bb_guests');
    localStorage.removeItem('bb_invoices');
    localStorage.removeItem('bb_customer_avoirs');
    localStorage.removeItem('bb_active_orders');
    localStorage.removeItem('bb_payment_intents');
    localStorage.removeItem('bb_payment_transactions');
    localStorage.removeItem('bb_webhook_events');
    localStorage.removeItem('bb_processed_events');
    localStorage.removeItem('bb_tasks');
    localStorage.removeItem('bb_sync_queue');
    localStorage.removeItem('bb_stock_items');
    localStorage.removeItem('bb_stock_movements');
    localStorage.removeItem('bb_menu');

    // Clean HR keys
    localStorage.removeItem('bb_hr_employees');
    localStorage.removeItem('bb_hr_payslips');
    localStorage.removeItem('bb_hr_contracts');

    localStorage.setItem('bb_rooms', JSON.stringify(rooms.map(r => ({ ...r, status: 'available', currentGuestId: undefined, currentReservationId: undefined }))));
    localStorage.setItem('bb_users', JSON.stringify(users));
    localStorage.setItem('bb_is_production', 'true');
    setIsProductionMode(true);
    setActiveTab('dashboard');
  };

  const handleSwitchToProduction = () => {
    // 1. Wipe all transactional/customer data
    setReservations([]);
    setTransactions([]);
    setGuests([]);
    setInvoices([]);
    setCustomerAvoirs([]);
    setActiveOrders([]);
    setPaymentIntents([]);
    setPaymentTransactions([]);
    setWebhookEvents([]);
    setProcessedEvents([]);
    setTasks([]);
    setSyncQueue([]);
    setStockMovements([]);
    setStockItems([]); // Empty raw stock to let them create their own clean items

    // 2. Clear menu or allow them to keep a clean slate? Let's clear menu, except they can keep the template if they want, but let's clear it so they can register their actual menu items. Wait, let's empty the menu so it's a real clean state!
    setMenu([]);

    // 3. Reset room states to clean/available, keep physical room assets
    setRooms(prev => prev.map(r => ({
      ...r,
      status: 'available',
      currentGuestId: undefined,
      currentReservationId: undefined
    })));

    // Clean HR data for a clean production slate
    setHrEmployees([]);
    setHrPayslips([]);
    setHrContracts([]);

    // 4. Clean up localStorage
    localStorage.removeItem('bb_reservations');
    localStorage.removeItem('bb_transactions');
    localStorage.removeItem('bb_guests');
    localStorage.removeItem('bb_invoices');
    localStorage.removeItem('bb_customer_avoirs');
    localStorage.removeItem('bb_active_orders');
    localStorage.removeItem('bb_payment_intents');
    localStorage.removeItem('bb_payment_transactions');
    localStorage.removeItem('bb_webhook_events');
    localStorage.removeItem('bb_processed_events');
    localStorage.removeItem('bb_tasks');
    localStorage.removeItem('bb_sync_queue');
    localStorage.removeItem('bb_stock_items');
    localStorage.removeItem('bb_stock_movements');
    localStorage.removeItem('bb_menu');

    // Clean HR keys
    localStorage.removeItem('bb_hr_employees');
    localStorage.removeItem('bb_hr_payslips');
    localStorage.removeItem('bb_hr_contracts');

    // Save cleaned collections (rooms and active users)
    localStorage.setItem('bb_rooms', JSON.stringify(rooms.map(r => ({ ...r, status: 'available', currentGuestId: undefined, currentReservationId: undefined }))));
    localStorage.setItem('bb_users', JSON.stringify(users));
    localStorage.setItem('bb_is_production', 'true');
    setIsProductionMode(true);

    setProductionSuccess(true);
    setActiveTab('dashboard');
  };

  if (currentUser === null) {
    return (
      <LoginView 
        users={users} 
        onLoginSuccess={handleLoginSuccess} 
        onResetPasswordDirect={handleResetPasswordDirect} 
        isProductionMode={isProductionMode}
      />
    );
  }

  // Find which step is active for highlights
  const isDashboardHighlighted = isOnboarding && onboardingStepIndex === 0;
  const isPMSHighlighted = isOnboarding && onboardingStepIndex === 1;
  const isPOSHighlighted = isOnboarding && onboardingStepIndex === 2;
  const isStocksHighlighted = isOnboarding && onboardingStepIndex === 3;
  const isStaffHighlighted = isOnboarding && onboardingStepIndex === 4;
  const isSettingsHighlighted = isOnboarding && onboardingStepIndex === 5;

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden theme-${appTheme}`}>

      {/* Left Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 flex flex-col border-b md:border-b-0 md:border-r border-slate-800 shrink-0">
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 rounded-xl flex items-center justify-center text-white shadow-md shadow-orange-500/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <UtensilsCrossed className="w-4.5 h-4.5 text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.15)]" />
              </div>
              <div>
                <h1 className="text-white font-black text-sm tracking-tight leading-none uppercase">Brunch Bouaké</h1>
                <p className="text-[8px] text-orange-400 font-extrabold tracking-widest uppercase mt-1 font-mono">Hôtel & Resto</p>
              </div>
            </div>
            
            {/* Quick reset/settings button on mobile */}
            <button
              onClick={handleResetData}
              className="md:hidden p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg border border-slate-700 transition-colors"
              title="Réinitialiser"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Navigation Area */}
        <nav className="flex-1 p-4 space-y-5 overflow-y-auto flex md:flex-col gap-0 overflow-x-auto md:overflow-x-visible">
          {/* Section 1 */}
          <div className="space-y-1 w-full shrink-0">
            <span className="hidden md:block text-[9px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1.5 font-mono">
              Tableau de bord
            </span>
            <button
              onClick={() => setActiveTab('dashboard')}
              id="nav-dashboard"
              className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all w-full text-left relative ${
                activeTab === 'dashboard' 
                  ? 'bg-slate-800 text-white shadow-xs font-bold border-l-2 border-orange-500 rounded-l-none' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              } ${isDashboardHighlighted ? 'ring-2 ring-orange-500 bg-slate-800 text-white font-extrabold shadow-lg shadow-orange-500/30 z-40 scale-[1.03]' : ''}`}
            >
              <div className="flex items-center gap-3">
                <Home className="w-4 h-4 opacity-75" />
                <span>Vue d'ensemble</span>
              </div>
              {isDashboardHighlighted && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
              )}
            </button>
          </div>

          {/* Section 2 */}
          <div className="space-y-1 w-full shrink-0">
            <span className="hidden md:block text-[9px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1.5 font-mono">
              Hébergement & PMS
            </span>
            
            {/* 1. Aperçu & Inventaire */}
            <button
              onClick={() => {
                setActiveTab('pms');
                setPmsActiveSubTab('kpis');
              }}
              className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all w-full text-left relative ${
                activeTab === 'pms' && pmsActiveSubTab === 'kpis'
                  ? 'bg-slate-800 text-white shadow-xs font-bold border-l-2 border-orange-500 rounded-l-none' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              } ${!ROLE_PERMISSIONS[currentRole].includes('pms') ? 'opacity-65' : ''}`}
            >
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 opacity-75 text-orange-500" />
                <span>Aperçu & Inventaire</span>
              </div>
              {!ROLE_PERMISSIONS[currentRole].includes('pms') && (
                <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" title="Accès Restreint" />
              )}
            </button>

            {/* 2. Grille des Chambres (PMS) */}
            <button
              onClick={() => {
                setActiveTab('pms');
                setPmsActiveSubTab('rooms');
              }}
              id="nav-pms"
              className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all w-full text-left relative ${
                activeTab === 'pms' && pmsActiveSubTab === 'rooms'
                  ? 'bg-slate-800 text-white shadow-xs font-bold border-l-2 border-orange-500 rounded-l-none' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              } ${!ROLE_PERMISSIONS[currentRole].includes('pms') ? 'opacity-65' : ''} ${isPMSHighlighted ? 'ring-2 ring-orange-500 bg-slate-800 text-white font-extrabold shadow-lg shadow-orange-500/30 z-40 scale-[1.03]' : ''}`}
            >
              <div className="flex items-center gap-3">
                <BedDouble className="w-4 h-4 opacity-75 text-emerald-500" />
                <span>Grille des Chambres</span>
              </div>
              {isPMSHighlighted ? (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
              ) : (
                !ROLE_PERMISSIONS[currentRole].includes('pms') && (
                  <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" title="Accès Restreint" />
                )
              )}
            </button>

            {/* 3. Planning Hebdomadaire */}
            <button
              onClick={() => {
                setActiveTab('pms');
                setPmsActiveSubTab('calendar');
              }}
              className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all w-full text-left relative ${
                activeTab === 'pms' && pmsActiveSubTab === 'calendar'
                  ? 'bg-slate-800 text-white shadow-xs font-bold border-l-2 border-orange-500 rounded-l-none' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              } ${!ROLE_PERMISSIONS[currentRole].includes('pms') ? 'opacity-65' : ''}`}
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 opacity-75 text-blue-500" />
                <span>Planning Hebdo (15j)</span>
              </div>
              {!ROLE_PERMISSIONS[currentRole].includes('pms') && (
                <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" title="Accès Restreint" />
              )}
            </button>

            {/* 4. Calendrier Mensuel */}
            <button
              onClick={() => {
                setActiveTab('pms');
                setPmsActiveSubTab('monthly');
              }}
              className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all w-full text-left relative ${
                activeTab === 'pms' && pmsActiveSubTab === 'monthly'
                  ? 'bg-slate-800 text-white shadow-xs font-bold border-l-2 border-orange-500 rounded-l-none' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              } ${!ROLE_PERMISSIONS[currentRole].includes('pms') ? 'opacity-65' : ''}`}
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 opacity-75 text-rose-500 animate-pulse" />
                <span>Calendrier Mensuel</span>
              </div>
              {!ROLE_PERMISSIONS[currentRole].includes('pms') && (
                <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" title="Accès Restreint" />
              )}
            </button>
          </div>

          {/* Section 3 */}
          <div className="space-y-1 w-full shrink-0">
            <span className="hidden md:block text-[9px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1.5 font-mono">
              Restauration & POS
            </span>
            <button
              onClick={() => setActiveTab('pos')}
              id="nav-pos"
              className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all w-full text-left relative ${
                activeTab === 'pos' 
                  ? 'bg-slate-800 text-white shadow-xs font-bold border-l-2 border-orange-500 rounded-l-none' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              } ${isPOSHighlighted ? 'ring-2 ring-orange-500 bg-slate-800 text-white font-extrabold shadow-lg shadow-orange-500/30 z-40 scale-[1.03]' : ''}`}
            >
              <div className="flex items-center gap-3">
                <UtensilsCrossed className="w-4 h-4 opacity-75" />
                <span>Caisse Maquis POS</span>
              </div>
              {isPOSHighlighted && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
              )}
            </button>

            {ROLE_PERMISSIONS[currentRole].includes('restaurant') && (
              <button
                onClick={() => setActiveTab('restaurant')}
                className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors w-full text-left ${
                  activeTab === 'restaurant' 
                    ? 'bg-slate-800 text-white shadow-xs font-bold border-l-2 border-orange-500 rounded-l-none' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <UtensilsCrossed className="w-4 h-4 opacity-75 text-orange-500" />
                  <span>Menus Resto & Maquis</span>
                </div>
              </button>
            )}

            {ROLE_PERMISSIONS[currentRole].includes('stocks') && (
              <button
                onClick={() => setActiveTab('stocks')}
                id="nav-stocks"
                className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all w-full text-left relative ${
                  activeTab === 'stocks' 
                    ? 'bg-slate-800 text-white shadow-xs font-bold border-l-2 border-orange-500 rounded-l-none' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                } ${isStocksHighlighted ? 'ring-2 ring-orange-500 bg-slate-800 text-white font-extrabold shadow-lg shadow-orange-500/30 z-40 scale-[1.03]' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <Layers className="w-4 h-4 opacity-75 text-amber-500" />
                  <span>Gestion des Stocks</span>
                </div>
                {isStocksHighlighted && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Section 4 */}
          <div className="space-y-1 w-full shrink-0">
            <span className="hidden md:block text-[9px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1.5 font-mono">
              Comptabilité & Back-Office
            </span>
            <button
              onClick={() => setActiveTab('erp')}
              className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors w-full text-left ${
                activeTab === 'erp' 
                  ? 'bg-slate-800 text-white shadow-xs font-bold border-l-2 border-orange-500 rounded-l-none' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              } ${!ROLE_PERMISSIONS[currentRole].includes('erp') ? 'opacity-65' : ''}`}
            >
              <div className="flex items-center gap-3">
                <Receipt className="w-4 h-4 opacity-75" />
                <span>Trésorerie & Factures</span>
              </div>
              {!ROLE_PERMISSIONS[currentRole].includes('erp') && (
                <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" title="Accès Restreint" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('staff')}
              id="nav-staff"
              className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all w-full text-left relative ${
                activeTab === 'staff' 
                  ? 'bg-slate-800 text-white shadow-xs font-bold border-l-2 border-orange-500 rounded-l-none' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              } ${!ROLE_PERMISSIONS[currentRole].includes('staff') ? 'opacity-65' : ''} ${isStaffHighlighted ? 'ring-2 ring-orange-500 bg-slate-800 text-white font-extrabold shadow-lg shadow-orange-500/30 z-40 scale-[1.03]' : ''}`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 opacity-75" />
                <span>Équipe & Tâches</span>
              </div>
              {isStaffHighlighted ? (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
              ) : (
                !ROLE_PERMISSIONS[currentRole].includes('staff') && (
                  <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" title="Accès Restreint" />
                )
              )}
            </button>

            <button
              onClick={() => setActiveTab('crm')}
              className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors w-full text-left ${
                activeTab === 'crm' 
                  ? 'bg-slate-800 text-white shadow-xs font-bold border-l-2 border-orange-500 rounded-l-none' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              } ${!ROLE_PERMISSIONS[currentRole].includes('crm') ? 'opacity-65' : ''}`}
            >
              <div className="flex items-center gap-3">
                <UserCheck className="w-4 h-4 opacity-75" />
                <span>Fichier Clients</span>
              </div>
              {!ROLE_PERMISSIONS[currentRole].includes('crm') && (
                <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" title="Accès Restreint" />
              )}
            </button>

            {ROLE_PERMISSIONS[currentRole].includes('reports') && (
              <button
                onClick={() => setActiveTab('reports')}
                className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors w-full text-left ${
                  activeTab === 'reports' 
                    ? 'bg-slate-800 text-white shadow-xs font-bold border-l-2 border-orange-500 rounded-l-none' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BarChart2 className="w-4 h-4 opacity-75 text-orange-500" />
                  <span>Rapports & Stats</span>
                </div>
              </button>
            )}

            {ROLE_PERMISSIONS[currentRole].includes('hr') && (
              <button
                onClick={() => setActiveTab('hr')}
                className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors w-full text-left ${
                  activeTab === 'hr' 
                    ? 'bg-slate-800 text-white shadow-xs font-bold border-l-2 border-orange-500 rounded-l-none' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 opacity-75 text-amber-500" />
                  <span>Gestion RH & Paie</span>
                </div>
              </button>
            )}
          </div>

          {/* Section 5 */}
          <div className="space-y-1 w-full shrink-0">
            <span className="hidden md:block text-[9px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1.5 font-mono">
              Spécifications
            </span>
            <button
              onClick={() => setActiveTab('blueprints')}
              className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors w-full text-left border border-dashed border-slate-700/60 ${
                activeTab === 'blueprints' 
                  ? 'bg-orange-500/10 text-orange-400 border-solid border-orange-500/30 font-bold' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 opacity-75 text-orange-500" />
                <span>Plans Conceptuels</span>
              </div>
            </button>

            {ROLE_PERMISSIONS[currentRole].includes('settings') && (
              <button
                onClick={() => setActiveTab('settings')}
                id="nav-settings"
                className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all w-full text-left relative ${
                  activeTab === 'settings' 
                    ? 'bg-slate-800 text-white shadow-xs font-bold border-l-2 border-orange-500 rounded-l-none' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                } ${isSettingsHighlighted ? 'ring-2 ring-orange-500 bg-slate-800 text-white font-extrabold shadow-lg shadow-orange-500/30 z-40 scale-[1.03]' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4 opacity-75 text-orange-500" />
                  <span>Configuration Établissement</span>
                </div>
                {isSettingsHighlighted && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                  </span>
                )}
              </button>
            )}

            {ROLE_PERMISSIONS[currentRole].includes('users') && (
              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors w-full text-left ${
                  activeTab === 'users' 
                    ? 'bg-slate-800 text-white shadow-xs font-bold border-l-2 border-amber-500 rounded-l-none' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 opacity-75 text-amber-500" />
                  <span>Utilisateurs & Droits Démo</span>
                </div>
              </button>
            )}
          </div>
        </nav>

        {/* Onboarding Restart Button */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/10 space-y-2">
          <button
            onClick={() => setActiveTab('tour')}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer shadow-xs ${
              activeTab === 'tour'
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border-orange-500/25'
            }`}
          >
            <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
            <span>Guide d'Intégration</span>
          </button>

          {isProductionMode ? (
            <div className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-extrabold shadow-xs select-none">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Production Active</span>
            </div>
          ) : (
            <button
              onClick={() => {
                const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
                setGeneratedConfirmCode(randomCode);
                setProductionConfirmInput('');
                setProductionError('');
                setProductionSuccess(false);
                setIsProductionModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 text-xs font-extrabold transition-all cursor-pointer shadow-xs"
            >
              <Trash2 className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Démarrage Production</span>
            </button>
          )}
        </div>

        {/* User profile / role badge at bottom of sidebar with logout action */}
        <div className="hidden md:block p-4 border-t border-slate-800 bg-slate-950/20">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-orange-500 shrink-0 flex items-center justify-center text-xs font-bold text-white uppercase">
                {currentUser?.name ? currentUser.name.slice(0, 2) : 'US'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs text-white font-bold truncate">
                  {currentUser?.name || 'Inconnu'}
                </p>
                <p className="text-[9px] text-slate-500 font-mono uppercase truncate mt-0.5">
                  {currentUser?.role === 'admin' ? 'Administrateur' : currentUser?.role === 'receptionist' ? 'Réceptionniste' : currentUser?.role === 'waiter' ? 'Serveur' : currentUser?.role === 'manager' ? 'Manager Général' : currentUser?.role === 'accountant' ? 'Comptable' : 'Gouvernante'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700/50 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Se déconnecter"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Row */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-md font-bold text-slate-800 tracking-tight">
              {activeTab === 'dashboard' && settings.establishmentName}
              {activeTab === 'pms' && 'Hébergement & PMS'}
              {activeTab === 'pos' && 'Caisse Maquis POS'}
              {activeTab === 'restaurant' && 'Menus Resto & Maquis'}
              {activeTab === 'stocks' && 'Gestion de Stocks'}
              {activeTab === 'erp' && 'Trésorerie & Facturation'}
              {activeTab === 'staff' && 'Équipe & Opérations'}
              {activeTab === 'crm' && 'Fichier Clients'}
              {activeTab === 'blueprints' && 'Plans Conceptuels'}
              {activeTab === 'settings' && 'Configuration Établissement'}
            </h2>
            {effectiveOnlineStatus ? (
              <span className="hidden sm:flex px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase tracking-wider items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Système Actif
              </span>
            ) : (
              <span className="hidden sm:flex px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase tracking-wider items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Mode Hors-Ligne
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Sync Queue & Offline Mode Toggle Indicator */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsOfflineModeSimulated(prev => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                  effectiveOnlineStatus 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                    : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 animate-pulse'
                }`}
                title={effectiveOnlineStatus ? "Passer en mode Déconnecté (Simulation)" : "Rétablir la connexion internet (Simulation)"}
              >
                {effectiveOnlineStatus ? (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">En Ligne</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                    <span className="hidden sm:inline">Hors-Ligne</span>
                  </>
                )}
              </button>

              {syncQueue.length > 0 && (
                <button
                  onClick={() => {
                    if (effectiveOnlineStatus) {
                      triggerSync();
                    } else {
                      alert(`Vous avez ${syncQueue.length} transaction(s) en attente de synchronisation. Repassez "En Ligne" pour synchroniser.`);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold font-mono transition-all cursor-pointer ${
                    syncStatus === 'syncing'
                      ? 'bg-blue-50 text-blue-700 border-blue-200 cursor-wait'
                      : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
                  }`}
                  title={`${syncQueue.length} transaction(s) stockée(s) localement en attente de synchronisation.`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === 'syncing' ? 'animate-spin text-blue-600' : 'text-orange-600'}`} />
                  <span>{syncQueue.length}</span>
                </button>
              )}
            </div>

            {/* Design / Theme Switcher in Header */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
              <Palette className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-slate-400 text-[9px] uppercase font-mono font-bold hidden sm:inline">Design :</span>
              <select
                value={appTheme}
                onChange={(e) => setAppTheme(e.target.value as any)}
                className="bg-transparent text-orange-600 font-bold border-none outline-none cursor-pointer text-xs focus:ring-0 focus:outline-hidden"
              >
                <option value="savannah">🍊 Savane (Chaud)</option>
                <option value="lagoon">💎 Lagune (Sombre)</option>
                <option value="forest">🌿 Forêt (Nature)</option>
                <option value="swiss">🇨🇭 Stark (Retro)</option>
              </select>
            </div>

            {/* Simulation role-based switcher inside header (Hidden in production mode) */}
            {!isProductionMode && (
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 text-[9px] uppercase font-mono font-bold">Rôle :</span>
                <select
                  value={currentRole}
                  onChange={(e: any) => {
                    const newRole = e.target.value as UserRole;
                    setCurrentRole(newRole);
                    // Also update currentUser's role for demo coherence if logged in
                    if (currentUser) {
                      const matchedDemo = users.find(u => u.role === newRole);
                      if (matchedDemo) {
                        setCurrentUser(matchedDemo);
                        localStorage.setItem('bb_current_user', JSON.stringify(matchedDemo));
                      } else {
                        const updatedUser = { ...currentUser, role: newRole };
                        setCurrentUser(updatedUser);
                        localStorage.setItem('bb_current_user', JSON.stringify(updatedUser));
                      }
                    }
                  }}
                  className="bg-transparent text-orange-600 font-bold border-none outline-none cursor-pointer text-xs focus:ring-0 focus:outline-hidden"
                >
                  <option value="admin">Directeur / Admin</option>
                  <option value="manager">Manager Général</option>
                  <option value="receptionist">Réceptionniste</option>
                  <option value="waiter">Serveur Resto</option>
                  <option value="accountant">Comptable</option>
                  <option value="housekeeper">Gouvernante</option>
                </select>
              </div>
            )}

            {/* Local time */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 font-mono">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              <span>{currentTime.toLocaleDateString('fr-FR')} {currentTime.toLocaleTimeString('fr-FR')}</span>
            </div>

            {/* Settings/Reset Cog shown ONLY for the Admin role to allow secure factory reset. */}
            {currentRole === 'admin' && (
              <button
                onClick={handleResetData}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg border border-slate-200 transition-colors"
                title={isProductionMode ? "Réinitialisation usine (Admin)" : "Réinitialiser la Démo"}
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* Primary Page Stage */}
        <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
          
          {/* Global Notification Banner for Sync Status */}
          {syncMessage && (
            <div className={`mb-6 p-4 rounded-2xl border text-xs font-bold flex items-center justify-between shadow-xs transition-all ${
              syncStatus === 'syncing' ? 'bg-blue-50 text-blue-800 border-blue-200 animate-pulse' :
              syncStatus === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
              syncStatus === 'error' ? 'bg-rose-50 text-rose-800 border-rose-200' :
              'bg-slate-50 text-slate-800 border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                {syncStatus === 'syncing' && <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />}
                {syncStatus === 'success' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                {syncStatus === 'error' && <AlertTriangle className="w-4 h-4 text-rose-600" />}
                <span>{syncMessage}</span>
              </div>
              {syncQueue.length > 0 && effectiveOnlineStatus && syncStatus !== 'syncing' && (
                <button
                  onClick={triggerSync}
                  className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold uppercase rounded-lg transition-colors cursor-pointer"
                >
                  Synchroniser
                </button>
              )}
            </div>
          )}
          
          {/* Active View Router with Role Guard */}
          {!ROLE_PERMISSIONS[currentRole].includes(activeTab) ? (
            <AccessDenied 
              currentRole={currentRole} 
              activeTab={activeTab} 
              onBackToDashboard={() => setActiveTab('dashboard')} 
            />
          ) : (
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center p-12 min-h-[400px] text-center space-y-4">
                <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
                <p className="text-slate-500 text-xs font-bold font-mono uppercase tracking-widest">Chargement du module {TAB_NAMES[activeTab] || 'en cours'}...</p>
              </div>
            }>
              {activeTab === 'dashboard' && (
                <DashboardOverview 
                  rooms={rooms}
                  reservations={reservations}
                  transactions={transactions}
                  tasks={tasks}
                  onNavigate={(tab) => setActiveTab(tab)}
                  onQuickCheckIn={() => setActiveTab('pms')}
                  onQuickPOSOrder={() => setActiveTab('pos')}
                  onQuickAddTask={() => setActiveTab('staff')}
                  currentRole={currentRole}
                />
              )}

              {activeTab === 'pms' && (
                <PMSManager 
                  rooms={rooms}
                  reservations={reservations}
                  onUpdateRooms={setRooms}
                  onUpdateReservations={setReservations}
                  onAddTransaction={handleAddTransaction}
                  onAddTask={handleAddTask}
                  activeOrders={activeOrders}
                  onUpdateOrders={setActiveOrders}
                  paymentIntents={paymentIntents}
                  paymentTransactions={paymentTransactions}
                  webhookEvents={webhookEvents}
                  processedEvents={processedEvents}
                  onUpdatePaymentIntents={setPaymentIntents}
                  onUpdatePaymentTransactions={setPaymentTransactions}
                  onUpdateWebhookEvents={setWebhookEvents}
                  onUpdateProcessedEvents={setProcessedEvents}
                  settings={settings}
                  activeSubTab={pmsActiveSubTab}
                  onActiveSubTabChange={setPmsActiveSubTab}
                  roomHistoryLogs={roomHistoryLogs}
                  onUpdateRoomHistoryLogs={setRoomHistoryLogs}
                />
              )}

              {activeTab === 'pos' && (
                <POSManager 
                  menu={menu}
                  rooms={rooms}
                  reservations={reservations}
                  activeOrders={activeOrders}
                  onAddOrder={(ord) => setActiveOrders(prev => [...prev, ord])}
                  onUpdateOrders={setActiveOrders}
                  onAddTransaction={handleAddTransaction}
                  paymentIntents={paymentIntents}
                  paymentTransactions={paymentTransactions}
                  webhookEvents={webhookEvents}
                  processedEvents={processedEvents}
                  onUpdatePaymentIntents={setPaymentIntents}
                  onUpdatePaymentTransactions={setPaymentTransactions}
                  onUpdateWebhookEvents={setWebhookEvents}
                  onUpdateProcessedEvents={setProcessedEvents}
                  settings={settings}
                  stockItems={stockItems}
                  onUpdateStockItem={(itemId, updated) => setStockItems(prev => prev.map(item => item.id === itemId ? { ...item, ...updated } : item))}
                />
              )}

              {activeTab === 'restaurant' && (
                <RestaurantManager 
                  menu={menu}
                  onAddMenuItem={(item) => setMenu(prev => [...prev, item])}
                  onUpdateMenuItem={(itemId, updated) => setMenu(prev => prev.map(item => item.id === itemId ? { ...item, ...updated } : item))}
                  onDeleteMenuItem={(itemId) => setMenu(prev => prev.filter(item => item.id !== itemId))}
                  stockItems={stockItems}
                  currentUser={currentUser}
                />
              )}

              {activeTab === 'stocks' && (
                <StockManager 
                  stockItems={stockItems}
                  onAddStockItem={(item) => setStockItems(prev => [...prev, item])}
                  onUpdateStockItem={(itemId, updated) => setStockItems(prev => prev.map(item => item.id === itemId ? { ...item, ...updated } : item))}
                  onDeleteStockItem={(itemId) => setStockItems(prev => prev.filter(item => item.id !== itemId))}
                  stockMovements={stockMovements}
                  onAddStockMovement={(mov) => setStockMovements(prev => [...prev, mov])}
                  currentUser={currentUser}
                  rooms={rooms}
                />
              )}

              {activeTab === 'erp' && (
                <ERPBilling 
                  transactions={transactions}
                  onAddTransaction={handleAddTransaction}
                  settings={settings}
                  syncQueue={syncQueue}
                  isOnline={effectiveOnlineStatus}
                  onTriggerSync={triggerSync}
                  invoices={invoices}
                  onUpdateInvoices={setInvoices}
                  customerAvoirs={customerAvoirs}
                  onUpdateCustomerAvoirs={setCustomerAvoirs}
                  reservations={reservations}
                  rooms={rooms}
                />
              )}

              {activeTab === 'staff' && (
                <StaffOperations 
                  staff={staff}
                  tasks={tasks}
                  rooms={rooms}
                  onUpdateStaff={setStaff}
                  onUpdateTasks={setTasks}
                  onUpdateRooms={setRooms}
                />
              )}

              {activeTab === 'crm' && (
                <CRMGuests 
                  guests={guests}
                  onUpdateGuests={setGuests}
                />
              )}

              {activeTab === 'reports' && (
                <ReportsManager 
                  currentUser={currentUser}
                />
              )}

              {activeTab === 'hr' && (
                <HRManager 
                  currentUser={currentUser}
                  employees={hrEmployees}
                  setEmployees={setHrEmployees}
                  payslips={hrPayslips}
                  setPayslips={setHrPayslips}
                  contracts={hrContracts}
                  setContracts={setHrContracts}
                  onAddTransaction={handleAddTransaction}
                />
              )}

              {activeTab === 'blueprints' && (
                <ArchitecturalBlueprints />
              )}

              {activeTab === 'settings' && (
                <PropertySettingsManager 
                  settings={settings}
                  onUpdateSettings={setSettings}
                  appTheme={appTheme}
                  onUpdateTheme={setAppTheme}
                  isProductionMode={isProductionMode}
                  currentUser={currentUser}
                  onResetToDemo={handleResetToDemo}
                  onResetToProductionWipe={handleResetToProductionWipe}
                />
              )}

              {activeTab === 'users' && (
                <UserManager 
                  users={users}
                  currentUser={currentUser}
                  onAddUser={(newUser) => setUsers(prev => [...prev, newUser])}
                  onUpdateUser={(userId, updated) => setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updated } : u))}
                  onDeleteUser={(userId) => setUsers(prev => prev.filter(u => u.id !== userId))}
                  onImpersonate={(user) => {
                    setCurrentUser(user);
                    setCurrentRole(user.role);
                    localStorage.setItem('bb_current_user', JSON.stringify(user));
                    
                    // Auto-redirect depending on role
                    if (user.role === 'admin' || user.role === 'manager') {
                      setActiveTab('dashboard');
                    } else if (user.role === 'receptionist') {
                      setActiveTab('pms');
                    } else if (user.role === 'waiter') {
                      setActiveTab('pos');
                    } else if (user.role === 'accountant') {
                      setActiveTab('erp');
                    } else if (user.role === 'housekeeper') {
                      setActiveTab('staff');
                    }
                  }}
                />
              )}

              {activeTab === 'tour' && (
                <GuidedTourPage 
                  settings={settings}
                  onUpdateSettings={setSettings}
                  onStartOnboarding={handleStartOnboarding}
                />
              )}
            </Suspense>
          )}

        </div>

        {/* Footer Status Bar */}
        <footer className="h-10 bg-slate-100 border-t border-slate-200 px-6 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0 mt-auto">
          <div className="flex gap-4">
            <span>Kennedy, Bouaké</span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline">PMS-POS v1.0.0</span>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              <span className="text-slate-500">Tous les services sont opérationnels</span>
            </div>
            <span className="hidden md:inline text-slate-500">GMT+0 (Abidjan)</span>
          </div>
        </footer>
      </main>

      {/* Onboarding (Interactive Tour) overlay wizard */}
      {isOnboarding && (
        <OnboardingTour
          currentStepIndex={onboardingStepIndex}
          onSetStepIndex={setOnboardingStepIndex}
          onCloseTour={handleCloseOnboarding}
          currentRole={currentRole}
          onSetRole={setCurrentRole}
          activeTab={activeTab}
          onSetTab={setActiveTab}
          establishmentName={settings.establishmentName}
        />
      )}

      {/* Switch to Production Modal */}
      {isProductionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl max-w-lg w-full space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <span className="p-2.5 bg-rose-100 text-rose-600 rounded-2xl">
                <Trash2 className="w-6 h-6 animate-pulse" />
              </span>
              <div>
                <h3 className="text-lg font-black text-slate-900">🧹 Passage en Mode Production</h3>
                <p className="text-xs text-slate-400 font-medium">Préparez Brunch Bouaké pour vos données réelles.</p>
              </div>
            </div>

            {!productionSuccess ? (
              <div className="space-y-4">
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl space-y-2">
                  <div className="flex gap-2 text-rose-800 font-black text-xs uppercase items-center">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Avertissement Critique</span>
                  </div>
                  <p className="text-xs text-rose-700 leading-relaxed font-semibold">
                    Cette action est irréversible et va vider l'ensemble des données fictives et de démonstration du système :
                  </p>
                  <ul className="text-[11px] text-rose-600 space-y-1 list-disc pl-5 font-bold">
                    <li>Toutes les réservations et historiques de séjour</li>
                    <li>Toutes les fiches clients (CRM)</li>
                    <li>Toutes les transactions financières, dépenses et recettes</li>
                    <li>Toutes les ventes en cours et tickets de caisse (POS)</li>
                    <li>Toutes les factures et avoirs enregistrés</li>
                    <li>Tous les stocks de nourriture, boissons et matériels</li>
                  </ul>
                  <p className="text-[11px] text-slate-500 font-medium pt-1">
                    <strong className="text-slate-700">Seront conservés :</strong> Les configurations de base des chambres, vos profils d'utilisateurs/administrateurs pour éviter tout verrouillage d'accès, et les paramètres généraux.
                  </p>
                </div>

                {productionError && (
                  <div className="p-3 bg-rose-100 text-rose-800 rounded-xl text-xs font-black flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{productionError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-slate-600 text-xs font-black uppercase">
                    Saisissez le code de sécurité <span className="px-2 py-0.5 bg-slate-900 text-white font-mono rounded select-all font-black text-sm tracking-wider">{generatedConfirmCode}</span> pour valider :
                  </label>
                  <input
                    type="text"
                    placeholder="Entrez le code ici..."
                    value={productionConfirmInput}
                    onChange={(e) => setProductionConfirmInput(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-rose-500 focus:outline-none text-center font-mono font-black text-md text-slate-800 placeholder-slate-400 tracking-widest uppercase"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setIsProductionModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      if (productionConfirmInput.trim() !== generatedConfirmCode) {
                        setProductionError("Le code de confirmation est incorrect.");
                        return;
                      }
                      handleSwitchToProduction();
                    }}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs shadow-lg shadow-rose-600/10 transition-all cursor-pointer"
                  >
                    Confirmer et Tout Vider
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center py-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-md font-black text-slate-900">🎉 Passage en production réussi !</h4>
                <p className="text-xs text-slate-500 leading-relaxed px-4">
                  Le système a été réinitialisé à blanc avec succès. Toutes les données de démonstration ont été purgées. Vous pouvez maintenant commencer à saisir vos clients, réservations réelles et approvisionnements en toute sécurité.
                </p>
                <button
                  onClick={() => setIsProductionModalOpen(false)}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all cursor-pointer inline-block"
                >
                  Accéder au Tableau de Bord
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admin Reset Modal */}
      {isAdminResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl max-w-lg w-full space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <span className="p-2.5 bg-rose-100 text-rose-600 rounded-2xl">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </span>
              <div>
                <h3 className="text-lg font-black text-slate-900">⚠️ Réinitialisation Complète Usine (Données Réelles)</h3>
                <p className="text-xs text-slate-400 font-medium">Option d'administration réservée uniquement au Directeur.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl space-y-2">
                <div className="flex gap-2 text-rose-800 font-black text-xs uppercase items-center">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Avertissement Destructif</span>
                </div>
                <p className="text-xs text-rose-700 leading-relaxed font-semibold">
                  Cette action supprimera définitivement TOUTES vos données réelles d'activité (réservations, fiches clients, factures, transactions de caisse, ventes, stocks).
                  Cette action est absolument irréversible !
                </p>
                <p className="text-[11px] text-slate-500 font-medium pt-1">
                  <strong className="text-slate-700">Seront conservés :</strong> Les configurations de base des chambres, vos profils d'utilisateurs et administrateurs ainsi que vos thèmes de personnalisation.
                </p>
              </div>

              {adminResetError && (
                <div className="p-3 bg-rose-100 text-rose-800 rounded-xl text-xs font-black flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{adminResetError}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-slate-600 text-xs font-black uppercase">
                  Saisissez le code de contrôle <span className="px-2 py-0.5 bg-slate-900 text-white font-mono rounded select-all font-black text-sm tracking-wider">{adminResetGeneratedCode}</span> pour confirmer :
                </label>
                <input
                  type="text"
                  placeholder="Entrez le code ici..."
                  value={adminResetConfirmInput}
                  onChange={(e) => setAdminResetConfirmInput(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-rose-500 focus:outline-none text-center font-mono font-black text-md text-slate-800 placeholder-slate-400 tracking-widest uppercase"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsAdminResetModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition-all cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAdminResetSubmit}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs shadow-lg shadow-rose-600/10 transition-all cursor-pointer"
                >
                  Confirmer et Réinitialiser Usine
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Dialog overlay (Alert/Confirm) */}
      {dialog && dialog.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-4">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">{dialog.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">{dialog.message}</p>
            <div className="flex justify-end gap-2.5 pt-2">
              {dialog.cancelText && (
                <button
                  onClick={dialog.onCancel}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition-all cursor-pointer"
                >
                  {dialog.cancelText}
                </button>
              )}
              <button
                onClick={dialog.onConfirm}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                {dialog.confirmText || "D'accord"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Toast Notification banner */}
      {toast && (
        <div className="fixed bottom-12 right-6 z-[100] p-4 rounded-2xl shadow-xl flex items-center gap-3 border animate-slide-in bg-white border-slate-200 max-w-sm">
          <span className={`p-1.5 rounded-xl ${
            toast.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
            toast.type === 'error' ? 'bg-rose-50 text-rose-600' :
            'bg-blue-50 text-blue-600'
          }`}>
            <Info className="w-4 h-4" />
          </span>
          <p className="text-xs font-semibold text-slate-700">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
