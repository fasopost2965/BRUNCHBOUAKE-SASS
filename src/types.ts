export type RoomType = 'studio' | 'room' | 'apartment';
export type RoomStatus = 'available' | 'occupied' | 'dirty' | 'maintenance';

export interface Room {
  id: string;
  tenantId: string;
  name: string; // e.g., "Studio Bouaké Chic", "Chambre Standard Gbêkê"
  type: RoomType;
  pricePerNight: number; // in XOF (FCFA)
  status: RoomStatus;
  maxGuests: number;
  features: string[];
  image?: string;
  images?: string[]; // Multiple photos (3 to 5) for visual recognition
}

export interface RoomHistoryLog {
  id: string;
  roomId: string;
  date: string;
  type: 'reservation' | 'cleaning' | 'maintenance' | 'custom';
  title: string;
  description: string;
  staffName?: string;
  amount?: number;
}

export interface Reservation {
  id: string;
  tenantId: string;
  roomId: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  totalAmount: number;
  paidAmount: number;
  paymentStatus: 'unpaid' | 'partially-paid' | 'fully-paid';
  specialRequests?: string;
  securityPin?: string; // 4-digit code for POS transfers verification
  creditLimit?: number; // Credit limit for restaurant/bar charges (FCFA)
  // Identity and operational audit fields
  nationality?: string;
  idNumber?: string;
  address?: string;
  sourceOfStay?: string; // e.g. "Walk-in", "Booking.com", "Airbnb", "Direct"
  staffMember?: string; // e.g. "Jean Dupont"
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  sourceModule?: string;
}

export interface MenuItemIngredient {
  stockItemId: string;
  quantityRequired: number;
}

export interface MenuItem {
  id: string;
  tenantId: string;
  name: string;
  category: 'plat' | 'boisson' | 'accompagnement' | 'dessert';
  price: number; // in XOF (FCFA)
  available: boolean;
  image?: string;
  description?: string;
  isMaquisOnly?: boolean;
  isRestaurantOnly?: boolean;
  ingredients?: MenuItemIngredient[];
}

export interface StockItem {
  id: string;
  tenantId: string;
  name: string;
  category: 'boisson' | 'nourriture' | 'ingredient' | 'lingerie' | 'autre';
  quantity: number;
  unit: 'bouteille' | 'casier' | 'kg' | 'portion' | 'litre' | 'unité' | 'sac' | 'paquet';
  minQuantity: number;
  pricePurchase: number; // Cost price in XOF
  lastRestocked?: string;
  location?: string; // e.g., "Réserve Kennedy", "Cuisine", "Bar Caisse"
}

export interface StockMovement {
  id: string;
  stockItemId: string;
  itemName: string;
  type: 'in' | 'out' | 'loss' | 'inventory'; // in: approvisionnement, out: vente/consommation, loss: perte/casse, inventory: correction
  quantity: number; // positive delta
  previousQty: number;
  newQty: number;
  reason: string;
  date: string;
  operator: string; // User who registered this
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface TableOrder {
  id: string;
  tenantId: string;
  tableNumber: string; // e.g., "Table 1", "Bar 3", "Terrasse A"
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'served' | 'paid';
  createdAt: string;
  totalAmount: number;
  roomIdForCharge?: string; // If charged to room
  waiterId?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'admin' | 'receptionist' | 'waiter' | 'manager' | 'housekeeper';
  phone: string;
  status: 'active' | 'off-duty' | 'leave';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo?: string; // Staff member ID
  assignedToName?: string;
  category: 'housekeeping' | 'maintenance' | 'restaurant' | 'reception' | 'general';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  roomId?: string; // Associated room if any
}

export interface Transaction {
  id: string;
  tenantId: string;
  type: 'lodging_payment' | 'pos_sale' | 'expense';
  amount: number;
  method: 'wave' | 'orange_money' | 'mtn' | 'cash' | 'card';
  description: string;
  date: string;
  referenceId?: string; // Reservation ID or Order ID
  idempotencyKey: string;
}

export interface GuestRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  nationality?: string;
  idNumber?: string;
  address?: string;
  notes?: string;
  visitCount: number;
  totalSpent: number;
}

// Mobile Money Unified Payment Layer models
export type PaymentProvider = 'wave' | 'orange_money';

export type PaymentIntentStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled';

export interface PaymentIntent {
  id: string; // pi_xxx
  amount: number;
  currency: 'XOF';
  provider: PaymentProvider;
  phoneNumber: string;
  status: PaymentIntentStatus;
  reference: string; // Unique internal payment reference
  providerReference?: string; // Reference returned by external provider
  sourceEntity: 'pos_order' | 'folio_charge' | 'reservation_deposit';
  sourceId: string; // ID of the linked order, room folio, or reservation
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTransaction {
  id: string; // txn_xxx
  paymentIntentId: string;
  provider: PaymentProvider;
  providerReference: string;
  amount: number;
  status: 'succeeded' | 'failed';
  payerPhone: string;
  auditTrail: string[]; // Timeline of operations
  processedAt: string;
}

export interface WebhookEvent {
  id: string; // evt_xxx
  provider: PaymentProvider;
  payload: any;
  receivedAt: string;
  status: 'pending' | 'processed' | 'failed';
  error?: string;
}

export interface ProcessedEvent {
  eventId: string; // Idempotency key from provider callback
  processedAt: string;
  paymentIntentId: string;
}

export interface PricingPolicy {
  basePrices: {
    room: number;
    studio: number;
    apartment: number;
  };
  weekendMultiplier: number; // e.g. 1.10 for +10%
  applyWeekendOnFri: boolean;
  applyWeekendOnSat: boolean;
  applyWeekendOnSun: boolean;
  commissionRateBooking: number; // e.g. 15 for 15%
  pricingModelType: 'fixed' | 'dynamic' | 'occupancy_based';
  seasonalSurcharges: {
    id: string;
    name: string;
    startMonth: number; // 1-12 (January to December)
    endMonth: number; // 1-12
    percentage: number; // e.g. 15 for +15%
    active: boolean;
  }[];
}

export interface PropertySettings {
  establishmentName: string;
  brandLogoText: string;
  address: string;
  city: string;
  country: string;
  phoneNumbers: string;
  email: string;
  taxId: string;
  defaultCurrency: string;
  checkInTime: string;
  checkOutTime: string;
  vatRate: number;
  touristTaxPerNight: number;
  paymentChannels: {
    wave: boolean;
    orange_money: boolean;
    mtn: boolean;
    cash: boolean;
    card: boolean;
  };
  invoiceFooter: string;
  receiptFooter: string;
  housekeepingOnCheckout: boolean;
  folioNumberFormat: string;
  workingHours: {
    start: string;
    end: string;
  };
  notificationPreferences: {
    smsOnCheckout: boolean;
    emailOnHighExpense: boolean;
  };
  categoryImages?: {
    studio?: string;
    room?: string;
    apartment?: string;
  };
  pricingPolicy?: PricingPolicy;
}

export type UserRole = 'admin' | 'receptionist' | 'waiter' | 'manager' | 'housekeeper' | 'accountant';

export interface UserAccount {
  id: string;
  tenantId: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'blocked';
  // EXCLUSION DE SÉCURITÉ : Ne pas stocker en clair en production, exclure de la sérialisation locale non sécurisée
  passwordHash: string; // Plain text or hash for mock persistence
  isTemporaryPassword?: boolean;
  lastLoginAt?: string;
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  branch?: string;
}

// ==========================================
// HUMAN RESOURCES AND PAYROLL MODELS
// ==========================================

export interface HREmployee {
  id: string;
  tenantId: string;
  name: string;
  customStatus: string; // e.g., "Gérant", "Serveur de nuit", "Chef de Cuisine" (Not fixed)
  phone: string;
  email: string;
  hireDate: string;
  baseSalary: number; // in FCFA
  contractType: 'CDI' | 'CDD' | 'stage' | 'interim';
  contractDuration?: string; // e.g., "6 mois", "3 mois", "Indéterminée"
  department: string; // e.g., "Restauration", "Hébergement", "Administration", "Sécurité"
  cnpsNumber?: string; // Numéro CNPS (Social Security)
  status: 'active' | 'suspended' | 'terminated';
}

export interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string; // e.g., "Juillet 2026"
  baseSalary: number;
  seniorityYears: number;
  seniorityAmount: number;
  includeSeniority: boolean;
  bonusAmount: number;
  includeBonus: boolean;
  transportAllowance: number;
  includeTransport: boolean;
  socialSecurityDeduction: number; // e.g., CNPS (6.3% of raw base)
  includeSocialSecurity: boolean;
  taxDeduction: number; // e.g., ITS/IGR (e.g., 5% or customizable)
  includeTax: boolean;
  netSalary: number;
  dateGenerated: string;
  status: 'draft' | 'paid';
  notes?: string;
}

export interface HRContract {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'CDI' | 'CDD' | 'stage' | 'interim';
  startDate: string;
  endDate?: string;
  salary: number;
  status: 'active' | 'completed' | 'terminated';
  terms: string;
  dateGenerated: string;
}

// ==========================================
// OFFLINE SYNCHRONIZATION MODELS
// ==========================================

export interface OfflineSyncItem {
  id: string;
  idempotencyKey: string;
  transaction: Transaction;
  status: 'pending' | 'syncing' | 'failed';
  attempts: number;
  lastAttempt?: string;
  error?: string;
  errorDetail?: string;
}

// ==========================================
// FACTURATIION (INVOICES) & AVOIRS MODELS
// ==========================================

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string; // e.g. FAC-XXXX
  tenantId: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number; // e.g., 0.18 for 18% VAT
  taxAmount: number;
  totalAmount: number;
  status: 'draft' | 'unpaid' | 'paid' | 'cancelled';
  paymentMethod?: 'cash' | 'wave' | 'orange_money' | 'mtn' | 'card' | 'avoir';
  notes?: string;
  sourceEntity?: 'reservation' | 'pos_order' | 'manual';
  sourceId?: string;
}

export interface AvoirMovement {
  id: string;
  type: 'credit' | 'debit'; // credit: recharge/refund (adds to wallet), debit: payment (reduces wallet)
  amount: number;
  reason: string; // e.g. "Remboursement chambre", "Recharge prépayée", "Paiement Facture #FAC-01"
  date: string;
  paymentMethod?: 'cash' | 'wave' | 'orange_money' | 'mtn' | 'card';
}

export interface CustomerAvoir {
  id: string; // e.g. AVO-XXXX or CustPhone
  tenantId: string;
  clientName: string;
  clientPhone: string;
  balance: number; // Active unused balance (FCFA)
  movements: AvoirMovement[];
  createdAt: string;
  updatedAt: string;
}





