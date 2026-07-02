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
  Palette
} from 'lucide-react';

// Seed data
import { 
  INITIAL_ROOMS, 
  INITIAL_GUESTS, 
  INITIAL_RESERVATIONS, 
  INITIAL_MENU, 
  INITIAL_STAFF, 
  INITIAL_TASKS, 
  INITIAL_TRANSACTIONS 
} from './data';

// Custom components
import ArchitecturalBlueprints from './components/ArchitecturalBlueprints';
import DashboardOverview from './components/DashboardOverview';
import PMSManager from './components/PMSManager';
import POSManager from './components/POSManager';
import ERPBilling from './components/ERPBilling';
import StaffOperations from './components/StaffOperations';
import CRMGuests from './components/CRMGuests';
import PropertySettingsManager from './components/PropertySettingsManager';
import UserManager from './components/UserManager';
import LoginView from './components/LoginView';
import RestaurantManager from './components/RestaurantManager';
import StockManager from './components/StockManager';
import ReportsManager from './components/ReportsManager';
import HRManager from './components/HRManager';

import { Room, Reservation, MenuItem, StaffMember, Task, Transaction, GuestRecord, TableOrder, PaymentIntent, PaymentTransaction, WebhookEvent, ProcessedEvent, PropertySettings, UserAccount, UserRole, StockItem, StockMovement, OfflineSyncItem } from './types';

import { PaymentOrchestrator } from './services/paymentService';
import { DEFAULT_PROPERTY_SETTINGS } from './data';

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['dashboard', 'pms', 'pos', 'restaurant', 'stocks', 'erp', 'staff', 'crm', 'blueprints', 'settings', 'users', 'reports', 'hr'],
  manager: ['dashboard', 'pms', 'pos', 'restaurant', 'stocks', 'erp', 'staff', 'crm', 'blueprints', 'settings', 'users', 'reports', 'hr'],
  receptionist: ['dashboard', 'pms', 'pos', 'staff', 'crm', 'blueprints', 'settings'],
  waiter: ['dashboard', 'pos', 'restaurant', 'blueprints'],
  accountant: ['dashboard', 'erp', 'stocks', 'blueprints', 'reports'],
  housekeeper: ['dashboard', 'staff', 'blueprints']
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
  hr: "Gestion RH & Paie"
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

export default function App() {
  
  // 1. STATE WITH LOCAL STORAGE PERSISTENCE
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('bb_rooms');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [guests, setGuests] = useState<GuestRecord[]>(() => {
    const saved = localStorage.getItem('bb_guests');
    return saved ? JSON.parse(saved) : INITIAL_GUESTS;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('bb_reservations');
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });

  const [menu, setMenu] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('bb_menu');
    return saved ? JSON.parse(saved) : INITIAL_MENU;
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('bb_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('bb_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('bb_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [activeOrders, setActiveOrders] = useState<TableOrder[]>(() => {
    const saved = localStorage.getItem('bb_active_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Mobile Money Unified Payment States
  const [paymentIntents, setPaymentIntents] = useState<PaymentIntent[]>(() => {
    const saved = localStorage.getItem('bb_payment_intents');
    return saved ? JSON.parse(saved) : [];
  });

  const [paymentTransactions, setPaymentTransactions] = useState<PaymentTransaction[]>(() => {
    const saved = localStorage.getItem('bb_payment_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>(() => {
    const saved = localStorage.getItem('bb_webhook_events');
    return saved ? JSON.parse(saved) : [];
  });

  const [processedEvents, setProcessedEvents] = useState<ProcessedEvent[]>(() => {
    const saved = localStorage.getItem('bb_processed_events');
    return saved ? JSON.parse(saved) : [];
  });

  // Property Settings state with local storage persistence
  const [settings, setSettings] = useState<PropertySettings>(() => {
    const saved = localStorage.getItem('bb_settings');
    return saved ? JSON.parse(saved) : DEFAULT_PROPERTY_SETTINGS;
  });

  // Stock and Inventory state management
  const [stockItems, setStockItems] = useState<StockItem[]>(() => {
    const saved = localStorage.getItem('bb_stock_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem('bb_stock_movements');
    return saved ? JSON.parse(saved) : [];
  });

  // Offline / Synchronisation Queue state variables
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  const [isOfflineModeSimulated, setIsOfflineModeSimulated] = useState<boolean>(() => {
    const saved = localStorage.getItem('bb_offline_mode_simulated');
    return saved === 'true';
  });

  const [syncQueue, setSyncQueue] = useState<OfflineSyncItem[]>(() => {
    const saved = localStorage.getItem('bb_sync_queue');
    return saved ? JSON.parse(saved) : [];
  });

  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState<string>('');

  const effectiveOnlineStatus = isOnline && !isOfflineModeSimulated;

  useEffect(() => {
    localStorage.setItem('bb_offline_mode_simulated', String(isOfflineModeSimulated));
  }, [isOfflineModeSimulated]);

  useEffect(() => {
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
    if (syncQueue.length === 0) return;
    
    setSyncStatus('syncing');
    setSyncMessage(`Synchronisation de ${syncQueue.length} transaction(s) en attente...`);
    
    try {
      // Simulate real latency
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Successfully synced
      setSyncQueue([]);
      setSyncStatus('success');
      setSyncMessage("Synchronisation automatique réussie ! Les écritures locales ont été fusionnées.");
      
      setTimeout(() => {
        setSyncStatus('idle');
        setSyncMessage('');
      }, 4000);
    } catch (err) {
      setSyncStatus('error');
      setSyncMessage("Erreur réseau. Échec de la synchronisation.");
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
    const saved = localStorage.getItem('bb_users');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'usr-admin',
        name: 'Jean Dupont (Directeur)',
        username: 'admin@test',
        email: 'admin@brunchbouake.com',
        phone: '+225 07 48 29 10 11',
        role: 'admin',
        status: 'active',
        passwordHash: 'password',
        isTemporaryPassword: false,
        createdAt: new Date().toISOString(),
        branch: 'Quartier Kennedy'
      },
      {
        id: 'usr-reception',
        name: 'Mariam Diallo',
        username: 'reception@test',
        email: 'm.diallo@brunchbouake.com',
        phone: '+225 05 55 12 34 56',
        role: 'receptionist',
        status: 'active',
        passwordHash: 'password',
        isTemporaryPassword: false,
        createdAt: new Date().toISOString(),
        branch: 'Quartier Kennedy'
      },
      {
        id: 'usr-waiter',
        name: 'Kouassi Kouamé Jean',
        username: 'waiter@test',
        email: 'k.jean@brunchbouake.com',
        phone: '+225 05 99 88 77 66',
        role: 'waiter',
        status: 'active',
        passwordHash: 'password',
        isTemporaryPassword: false,
        createdAt: new Date().toISOString(),
        branch: 'Maquis Central'
      },
      {
        id: 'usr-housekeeper',
        name: 'Aka Florence (Gouvernante)',
        username: 'housekeeping@test',
        email: 'f.aka@brunchbouake.com',
        phone: '+225 01 22 33 44 55',
        role: 'housekeeper',
        status: 'active',
        passwordHash: 'password',
        isTemporaryPassword: false,
        createdAt: new Date().toISOString(),
        branch: 'Quartier Kennedy'
      },
      {
        id: 'usr-accountant',
        name: 'Yao Amenan Chantal (Comptable)',
        username: 'cashier@test',
        email: 'c.yao@brunchbouake.com',
        phone: '+225 07 11 22 33 44',
        role: 'accountant',
        status: 'active',
        passwordHash: 'password',
        isTemporaryPassword: false,
        createdAt: new Date().toISOString(),
        branch: 'Quartier Kennedy'
      },
      {
        id: 'usr-manager',
        name: 'Zadi Richard (Manager Général)',
        username: 'manager@test',
        email: 'r.zadi@brunchbouake.com',
        phone: '+225 07 44 55 66 77',
        role: 'manager',
        status: 'active',
        passwordHash: 'password',
        isTemporaryPassword: false,
        createdAt: new Date().toISOString(),
        branch: 'Quartier Kennedy'
      }
    ];
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('bb_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Active view state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pms' | 'pos' | 'erp' | 'staff' | 'crm' | 'blueprints' | 'settings' | 'users'>('dashboard');
  
  // Simulation role-based selector
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const savedUser = localStorage.getItem('bb_current_user');
    if (savedUser) {
      const u = JSON.parse(savedUser) as UserAccount;
      return u.role;
    }
    return 'admin';
  });

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
    if (confirm("Voulez-vous réinitialiser toutes les données de simulation de Brunch Bouaké aux données de démonstration initiales ?")) {
      localStorage.clear();
      setRooms(INITIAL_ROOMS);
      setGuests(INITIAL_GUESTS);
      setReservations(INITIAL_RESERVATIONS);
      setMenu(INITIAL_MENU);
      setStaff(INITIAL_STAFF);
      setTasks(INITIAL_TASKS);
      setTransactions(INITIAL_TRANSACTIONS);
      setActiveOrders([]);
      setSettings(DEFAULT_PROPERTY_SETTINGS);
      setActiveTab('dashboard');
    }
  };

  if (currentUser === null) {
    return (
      <LoginView 
        users={users} 
        onLoginSuccess={handleLoginSuccess} 
        onResetPasswordDirect={handleResetPasswordDirect} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden">
      
      {/* Dynamic Theme Style Injector */}
      <style>{`
        ${appTheme === 'lagoon' ? `
          /* BLEU LAGUNE - MIDNIGHT LAGOON DARK MODE OVERRIDES */
          body, .min-h-screen, .bg-slate-50 {
            background-color: #0b1120 !important;
            color: #e2e8f0 !important;
          }
          .bg-white {
            background-color: #121b2e !important;
            color: #f1f5f9 !important;
          }
          .border-slate-200, .border-slate-100, .border-slate-300, .border-slate-200\\/60, .divide-slate-100, .divide-slate-200, .divide-y > * {
            border-color: #1e293b !important;
          }
          .text-slate-900, .text-slate-800, .text-slate-700, .text-slate-600 {
            color: #f1f5f9 !important;
          }
          .text-slate-500, .text-slate-400 {
            color: #94a3b8 !important;
          }
          .hover\\:bg-slate-50:hover, .hover\\:bg-slate-50\\/50:hover, .hover\\:bg-slate-100:hover {
            background-color: #1e293b !important;
          }
          input, select, textarea {
            background-color: #0f172a !important;
            border-color: #334155 !important;
            color: #f1f5f9 !important;
          }
          input:focus, select:focus, textarea:focus {
            border-color: #06b6d4 !important;
          }
          .text-orange-500, .text-orange-600, .text-orange-700, .text-orange-800, .text-orange-950, .text-orange-900 {
            color: #22d3ee !important;
          }
          .bg-orange-50, .bg-orange-100, .bg-orange-50\\/50 {
            background-color: rgba(6, 182, 212, 0.15) !important;
            color: #22d3ee !important;
          }
          .bg-orange-500, .bg-orange-600 {
            background-color: #06b6d4 !important;
            color: #0b1120 !important;
          }
          .bg-orange-500:hover, .bg-orange-600:hover {
            background-color: #0891b2 !important;
          }
          .border-orange-500, .border-orange-200, .border-orange-100 {
            border-color: rgba(6, 182, 212, 0.3) !important;
          }
          aside.bg-slate-900 {
            background-color: #070b13 !important;
            border-color: #1e293b !important;
          }
          .bg-slate-950, .bg-slate-950\\/20 {
            background-color: #04060a !important;
          }
          .text-white {
            color: #f1f5f9 !important;
          }
          .recharts-default-tooltip {
            background-color: #121b2e !important;
            border-color: #334155 !important;
            color: #f1f5f9 !important;
          }
          .bg-slate-100 {
            background-color: #1e293b !important;
            color: #f1f5f9 !important;
          }
        ` : ''}

        ${appTheme === 'forest' ? `
          /* FORET SACREE - ECO LUXURY EMERALD & GOLD OVERRIDES */
          body, .min-h-screen, .bg-slate-50 {
            background-color: #f4f6f0 !important;
            color: #132a13 !important;
          }
          .bg-white {
            background-color: #ffffff !important;
            color: #132a13 !important;
          }
          .border-slate-200, .border-slate-100, .border-slate-300, .divide-slate-200 {
            border-color: #e3e8db !important;
          }
          .text-slate-900, .text-slate-800, .text-slate-700 {
            color: #132a13 !important;
          }
          .text-slate-600, .text-slate-500 {
            color: #3f5e4d !important;
          }
          input, select, textarea {
            background-color: #fcfdfa !important;
            border-color: #cad2c5 !important;
            color: #132a13 !important;
          }
          .text-orange-500, .text-orange-600, .text-orange-700, .text-orange-850, .text-orange-950, .text-orange-900 {
            color: #2d6a4f !important;
          }
          .bg-orange-50, .bg-orange-100 {
            background-color: #ecf3f0 !important;
            color: #2d6a4f !important;
          }
          .bg-orange-500, .bg-orange-600 {
            background-color: #2d6a4f !important;
            color: #ffffff !important;
          }
          .bg-orange-500:hover, .bg-orange-600:hover {
            background-color: #1b4332 !important;
          }
          aside.bg-slate-900 {
            background-color: #0f241a !important;
            border-color: #1b4332 !important;
          }
          .text-orange-400 {
            color: #ffb703 !important;
          }
        ` : ''}

        ${appTheme === 'swiss' ? `
          /* MINIMALISTE HELVETIQUE - HIGH-CONTRAST SWISS ART OVERRIDES */
          body, .min-h-screen, .bg-slate-50 {
            background-color: #f8f9fa !important;
            color: #000000 !important;
            font-family: 'JetBrains Mono', ui-monospace, monospace !important;
          }
          .bg-white {
            background-color: #ffffff !important;
            color: #000000 !important;
            border: 2px solid #000000 !important;
            border-radius: 0px !important;
            box-shadow: 4px 4px 0px 0px #000000 !important;
          }
          .rounded-3xl, .rounded-2xl, .rounded-xl, .rounded-[24px], .rounded-lg {
            border-radius: 0px !important;
          }
          .border-slate-200, .border-slate-100, .border-slate-300, .border-orange-200, .border-orange-100, .divide-slate-200, .divide-slate-100 {
            border-color: #000000 !important;
            border-width: 1.5px !important;
          }
          .text-slate-900, .text-slate-800, .text-slate-700, .text-slate-600, .text-slate-500, .text-slate-400 {
            color: #000000 !important;
          }
          .text-orange-500, .text-orange-600, .text-orange-700, .text-orange-900, .text-orange-950 {
            color: #da1212 !important;
            font-weight: 800 !important;
          }
          .bg-orange-50, .bg-orange-100 {
            background-color: #fde8e8 !important;
            color: #da1212 !important;
            border: 1px solid #da1212 !important;
            border-radius: 0px !important;
          }
          .bg-orange-500, .bg-orange-600 {
            background-color: #000000 !important;
            color: #ffffff !important;
            border: 2px solid #000000 !important;
            border-radius: 0px !important;
          }
          .bg-orange-500:hover, .bg-orange-600:hover {
            background-color: #da1212 !important;
            color: #ffffff !important;
          }
          aside.bg-slate-900 {
            background-color: #000000 !important;
            border-right: 3px solid #000000 !important;
          }
          input, select, textarea {
            background-color: #ffffff !important;
            border: 2px solid #000000 !important;
            border-radius: 0px !important;
            color: #000000 !important;
            font-family: monospace !important;
          }
        ` : ''}
      `}</style>

      {/* Left Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 flex flex-col border-b md:border-b-0 md:border-r border-slate-800 shrink-0">
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-extrabold text-md shadow-sm">
                B
              </div>
              <div>
                <h1 className="text-white font-bold text-base tracking-tight leading-none">Brunch Bouaké</h1>
                <p className="text-[9px] text-slate-500 font-bold tracking-wider uppercase mt-1 font-mono">PMS & POS Hybride</p>
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
              className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors w-full text-left ${
                activeTab === 'dashboard' 
                  ? 'bg-slate-800 text-white shadow-xs font-bold border-l-2 border-orange-500 rounded-l-none' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Home className="w-4 h-4 opacity-75" />
                <span>Vue d'ensemble</span>
              </div>
            </button>
          </div>

          {/* Section 2 */}
          <div className="space-y-1 w-full shrink-0">
            <span className="hidden md:block text-[9px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-1.5 font-mono">
              Hébergement & PMS
            </span>
            <button
              onClick={() => setActiveTab('pms')}
              className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors w-full text-left ${
                activeTab === 'pms' 
                  ? 'bg-slate-800 text-white shadow-xs font-bold border-l-2 border-orange-500 rounded-l-none' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              } ${!ROLE_PERMISSIONS[currentRole].includes('pms') ? 'opacity-65' : ''}`}
            >
              <div className="flex items-center gap-3">
                <BedDouble className="w-4 h-4 opacity-75" />
                <span>Gestion Chambres</span>
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
              className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors w-full text-left ${
                activeTab === 'pos' 
                  ? 'bg-slate-800 text-white shadow-xs font-bold border-l-2 border-orange-500 rounded-l-none' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <UtensilsCrossed className="w-4 h-4 opacity-75" />
                <span>Caisse Maquis POS</span>
              </div>
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
                className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors w-full text-left ${
                  activeTab === 'stocks' 
                    ? 'bg-slate-800 text-white shadow-xs font-bold border-l-2 border-orange-500 rounded-l-none' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Layers className="w-4 h-4 opacity-75 text-amber-500" />
                  <span>Gestion des Stocks</span>
                </div>
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
              className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors w-full text-left ${
                activeTab === 'staff' 
                  ? 'bg-slate-800 text-white shadow-xs font-bold border-l-2 border-orange-500 rounded-l-none' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              } ${!ROLE_PERMISSIONS[currentRole].includes('staff') ? 'opacity-65' : ''}`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 opacity-75" />
                <span>Équipe & Tâches</span>
              </div>
              {!ROLE_PERMISSIONS[currentRole].includes('staff') && (
                <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" title="Accès Restreint" />
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
                className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors w-full text-left ${
                  activeTab === 'settings' 
                    ? 'bg-slate-800 text-white shadow-xs font-bold border-l-2 border-orange-500 rounded-l-none' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4 opacity-75 text-orange-500" />
                  <span>Configuration Établissement</span>
                </div>
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

            {/* Simulation role-based switcher inside header */}
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

            {/* Local time */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 font-mono">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              <span>{currentTime.toLocaleDateString('fr-FR')} {currentTime.toLocaleTimeString('fr-FR')}</span>
            </div>

            <button
              onClick={handleResetData}
              className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg border border-slate-200 transition-colors"
              title="Réinitialiser la Démo"
            >
              <Settings className="w-4 h-4" />
            </button>
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
            <>
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
            </>
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
    </div>
  );
}
