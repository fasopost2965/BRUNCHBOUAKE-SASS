import { Room, Reservation, MenuItem, StaffMember, Task, Transaction, GuestRecord, PropertySettings, RoomHistoryLog, Invoice, CustomerAvoir, HREmployee, Payslip, HRContract } from './types';

export const INITIAL_ROOMS: Room[] = [
  {
    id: '101',
    tenantId: 'tenant-bouake-kennedy',
    name: 'Studio Bouaké Chic',
    type: 'studio',
    pricePerNight: 25000,
    status: 'occupied',
    maxGuests: 2,
    features: ['Climatisation', 'Wi-Fi Fibre', 'Kitchenette', 'SdB Privée', 'Mini-bar'],
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: '102',
    tenantId: 'tenant-bouake-kennedy',
    name: 'Chambre Standard Gbêkê',
    type: 'room',
    pricePerNight: 18000,
    status: 'available',
    maxGuests: 2,
    features: ['Climatisation', 'Wi-Fi Fibre', 'SdB Privée', 'Télévision Smart'],
    image: 'https://images.unsplash.com/photo-1611891405110-5a30d32b1200?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1611891405110-5a30d32b1200?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: '103',
    tenantId: 'tenant-bouake-kennedy',
    name: 'Appartement F2 VIP',
    type: 'apartment',
    pricePerNight: 45000,
    status: 'occupied',
    maxGuests: 4,
    features: ['Climatisation Salon & Chambre', 'Cuisine Équipée', 'Canapé Cuir', 'Machine à café', 'Netflix'],
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1502672011266-538602154887?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: '104',
    tenantId: 'tenant-bouake-kennedy',
    name: 'Studio L\'Harmattan',
    type: 'studio',
    pricePerNight: 25000,
    status: 'dirty',
    maxGuests: 2,
    features: ['Climatisation', 'Wi-Fi Fibre', 'Balcon', 'Kitchenette'],
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: '105',
    tenantId: 'tenant-bouake-kennedy',
    name: 'Chambre Confort Kénédougou',
    type: 'room',
    pricePerNight: 20000,
    status: 'available',
    maxGuests: 2,
    features: ['Climatisation', 'Wi-Fi Fibre', 'Espace Bureau', 'Bouilloire'],
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: '106',
    tenantId: 'tenant-bouake-kennedy',
    name: 'Appartement Suite Prestige',
    type: 'apartment',
    pricePerNight: 60000,
    status: 'maintenance',
    maxGuests: 6,
    features: ['3 Chambres', 'Salon d\'angle', 'Cuisine Américaine', 'Grande Terrasse', 'Lave-linge'],
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80'
    ]
  }
];

export const INITIAL_GUESTS: GuestRecord[] = [
  {
    id: 'g1',
    name: 'Konan Koffi Serge',
    phone: '+225 07 48 29 10 11',
    email: 'koffi.konan@example.com',
    nationality: 'Ivoirienne',
    idNumber: 'CI00928374',
    notes: 'Habitué, préfère le piment à part pour ses plats de maquis.',
    visitCount: 8,
    totalSpent: 420000
  },
  {
    id: 'g2',
    name: 'Mariam Coulibaly',
    phone: '+225 05 55 12 34 56',
    email: 'mariam.c@example.com',
    nationality: 'Ivoirienne',
    idNumber: 'CI11092834',
    notes: 'Exige une connexion internet irréprochable pour le travail.',
    visitCount: 3,
    totalSpent: 165000
  },
  {
    id: 'g3',
    name: 'Marc-Antoine Dubois',
    phone: '+33 6 12 34 56 78',
    email: 'ma.dubois@example.com',
    nationality: 'Française',
    idNumber: 'FR92837482',
    notes: 'Client d\'affaires, demande facture électronique par email systématiquement.',
    visitCount: 2,
    totalSpent: 280000
  }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-101',
    tenantId: 'tenant-bouake-kennedy',
    roomId: '101',
    guestName: 'Konan Koffi Serge',
    guestPhone: '+225 07 48 29 10 11',
    guestEmail: 'koffi.konan@example.com',
    checkInDate: '2026-06-28',
    checkOutDate: '2026-07-02',
    numberOfGuests: 2,
    status: 'checked-in',
    totalAmount: 100000,
    paidAmount: 50000,
    paymentStatus: 'partially-paid',
    specialRequests: 'Arrivée tardive, check-out tardif demandé.'
  },
  {
    id: 'res-103',
    tenantId: 'tenant-bouake-kennedy',
    roomId: '103',
    guestName: 'Marc-Antoine Dubois',
    guestPhone: '+33 6 12 34 56 78',
    guestEmail: 'ma.dubois@example.com',
    checkInDate: '2026-06-29',
    checkOutDate: '2026-07-05',
    numberOfGuests: 1,
    status: 'checked-in',
    totalAmount: 270000,
    paidAmount: 270000,
    paymentStatus: 'fully-paid',
    specialRequests: 'Facture au nom de la société Bouaké Agro.'
  },
  {
    id: 'res-102',
    tenantId: 'tenant-bouake-kennedy',
    roomId: '102',
    guestName: 'Awa Diop',
    guestPhone: '+221 77 123 45 67',
    guestEmail: 'awa.diop@example.sn',
    checkInDate: '2026-07-03',
    checkOutDate: '2026-07-06',
    numberOfGuests: 2,
    status: 'confirmed',
    totalAmount: 540000,
    paidAmount: 10000,
    paymentStatus: 'partially-paid',
    specialRequests: 'Souhaite une chambre calme.'
  }
];

export const INITIAL_MENU: MenuItem[] = [
  {
    id: 'm1',
    tenantId: 'tenant-bouake-kennedy',
    name: 'Kedjenou de Poulet de Brousse (M)',
    category: 'plat',
    price: 6500,
    available: true,
    ingredients: [
      { stockItemId: 'st-i-2', quantityRequired: 1 }, // 1 carton/unité de poulet découpé
      { stockItemId: 'st-i-3', quantityRequired: 0.5 } // 0.5 kg de piment d'Alépé
    ]
  },
  {
    id: 'm2',
    tenantId: 'tenant-bouake-kennedy',
    name: 'Poisson Carpe Braisé d\'Ayame',
    category: 'plat',
    price: 7000,
    available: true
  },
  {
    id: 'm3',
    tenantId: 'tenant-bouake-kennedy',
    name: 'Choukouya de Mouton Tendre',
    category: 'plat',
    price: 8000,
    available: true
  },
  {
    id: 'm4',
    tenantId: 'tenant-bouake-kennedy',
    name: 'Alloco Spécial Giga (Bananes mûres)',
    category: 'accompagnement',
    price: 2000,
    available: true,
    ingredients: [
      { stockItemId: 'st-f-2', quantityRequired: 2 }, // 2 régimes/unités de bananes plantains
      { stockItemId: 'st-i-1', quantityRequired: 0.25 } // 0.25 litre d'huile de palme
    ]
  },
  {
    id: 'm5',
    tenantId: 'tenant-bouake-kennedy',
    name: 'Attiéké de Qualité Supérieure',
    category: 'accompagnement',
    price: 1000,
    available: true
  },
  {
    id: 'm6',
    tenantId: 'tenant-bouake-kennedy',
    name: 'Bissap Glacé Maison (Hibiscus)',
    category: 'boisson',
    price: 1500,
    available: true
  },
  {
    id: 'm7',
    tenantId: 'tenant-bouake-kennedy',
    name: 'Gnamankoudji Intense (Gingembre)',
    category: 'boisson',
    price: 1500,
    available: true
  },
  {
    id: 'm8',
    tenantId: 'tenant-bouake-kennedy',
    name: 'Bière Ivoirienne Bock de 65cl',
    category: 'boisson',
    price: 1500,
    available: true
  },
  {
    id: 'm9',
    tenantId: 'tenant-bouake-kennedy',
    name: 'Brunch Signature Brunch Bouaké',
    category: 'plat',
    price: 12000,
    available: true
  },
  {
    id: 'm10',
    tenantId: 'tenant-bouake-kennedy',
    name: 'Salade de fruits tropicaux parfumée',
    category: 'dessert',
    price: 2500,
    available: true
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  { id: 's1', name: 'Yao Amenan Chantal', role: 'receptionist', phone: '+225 07 11 22 33 44', status: 'active' },
  { id: 's2', name: 'Kouassi Kouamé Jean', role: 'waiter', phone: '+225 05 99 88 77 66', status: 'active' },
  { id: 's3', name: 'Aka Florence', role: 'housekeeper', phone: '+225 01 22 33 44 55', status: 'active' },
  { id: 's4', name: 'Zadi Richard', role: 'manager', phone: '+225 07 44 55 66 77', status: 'active' }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Nettoyer la chambre 104',
    description: 'Le client a fait son check-out ce matin. Faire le lit, changer les draps et serviettes, nettoyer la douche.',
    assignedTo: 's3',
    assignedToName: 'Aka Florence',
    category: 'housekeeping',
    status: 'pending',
    dueDate: '2026-06-30',
    roomId: '104'
  },
  {
    id: 't2',
    title: 'Climatisation en panne - Suite 106',
    description: 'Le compresseur extérieur fait un bruit anormal et ne refroidit plus. Faire venir le technicien GBÊKÊ FROID.',
    assignedTo: 's4',
    assignedToName: 'Zadi Richard',
    category: 'maintenance',
    status: 'in-progress',
    dueDate: '2026-07-01',
    roomId: '106'
  },
  {
    id: 't3',
    title: 'Approvisionnement boissons maquis',
    description: 'Acheter 10 casiers de Bock, 5 de Beaufort, et 3 cartons de vin rouge.',
    assignedTo: 's2',
    assignedToName: 'Kouassi Kouamé Jean',
    category: 'restaurant',
    status: 'completed',
    dueDate: '2026-06-30'
  },
  {
    id: 't4',
    title: 'Enregistrement fiches de police',
    description: 'Saisir les fiches d\'enregistrement de police pour les arrivées de la semaine.',
    assignedTo: 's1',
    assignedToName: 'Yao Amenan Chantal',
    category: 'reception',
    status: 'pending',
    dueDate: '2026-06-30'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tr-001',
    tenantId: 'tenant-bouake-kennedy',
    type: 'lodging_payment',
    amount: 50000,
    method: 'wave',
    description: 'Acompte réservation res-101 (Konan Koffi Serge)',
    date: '2026-06-28T10:15:00Z',
    referenceId: 'res-101',
    idempotencyKey: 'idem-tr-001'
  },
  {
    id: 'tr-002',
    tenantId: 'tenant-bouake-kennedy',
    type: 'lodging_payment',
    amount: 270000,
    method: 'orange_money',
    description: 'Paiement intégral chambre 103 (Marc-Antoine Dubois)',
    date: '2026-06-29T14:30:00Z',
    referenceId: 'res-103',
    idempotencyKey: 'idem-tr-002'
  },
  {
    id: 'tr-003',
    tenantId: 'tenant-bouake-kennedy',
    type: 'pos_sale',
    amount: 17500,
    method: 'cash',
    description: 'Addition maquis - Table 4 (Kedjenou x2, Alloco x1, Boissons x3)',
    date: '2026-06-30T13:10:00Z',
    idempotencyKey: 'idem-tr-003'
  },
  {
    id: 'tr-004',
    tenantId: 'tenant-bouake-kennedy',
    type: 'expense',
    amount: 35000,
    method: 'cash',
    description: 'Achat bouteilles de gaz pour les cuisines du maquis',
    date: '2026-06-30T09:00:00Z',
    idempotencyKey: 'idem-tr-004'
  }
];

export const DEFAULT_PROPERTY_SETTINGS: PropertySettings = {
  establishmentName: "Brunch Bouaké Hospitality",
  brandLogoText: "Brunch Bouaké",
  address: "Quartier Kennedy, route de l'Université",
  city: "Bouaké",
  country: "Côte d'Ivoire",
  phoneNumbers: "+225 07 48 29 10 11, +225 05 55 12 34 56",
  email: "contact@brunchbouake.com",
  taxId: "CC N° 1293847 B / RCCM CI-BKE-2024-B-992",
  defaultCurrency: "FCFA",
  checkInTime: "14:00",
  checkOutTime: "12:00",
  vatRate: 18,
  touristTaxPerNight: 1000,
  paymentChannels: {
    wave: true,
    orange_money: true,
    mtn: true,
    cash: true,
    card: true
  },
  invoiceFooter: "Merci pour votre confiance. Brunch Bouaké, le confort à l'Ivoirienne !",
  receiptFooter: "Reçu de paiement Brunch Bouaké. Veuillez conserver pour contrôle.",
  housekeepingOnCheckout: true,
  folioNumberFormat: "BRB-{YYYY}-{SEQ}",
  workingHours: {
    start: "07:00",
    end: "23:00"
  },
  notificationPreferences: {
    smsOnCheckout: true,
    emailOnHighExpense: false
  },
  categoryImages: {
    studio: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
    room: 'https://images.unsplash.com/photo-1611891405110-5a30d32b1200?auto=format&fit=crop&w=600&q=80',
    apartment: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80'
  },
  pricingPolicy: {
    basePrices: {
      room: 15000,
      studio: 25000,
      apartment: 45000
    },
    weekendMultiplier: 1.10, // +10% on weekends
    applyWeekendOnFri: true,
    applyWeekendOnSat: true,
    applyWeekendOnSun: false,
    commissionRateBooking: 15, // 15% booking commission
    pricingModelType: 'dynamic',
    seasonalSurcharges: [
      { id: 's1', name: 'Saison Haute / Fêtes Fin d\'Année', startMonth: 12, endMonth: 1, percentage: 15, active: true },
      { id: 's2', name: 'Période Vacances Scolaires d\'Été', startMonth: 7, endMonth: 8, percentage: 10, active: false }
    ]
  }
};

export const INITIAL_ROOM_HISTORY_LOGS: RoomHistoryLog[] = [
  {
    id: 'h1',
    roomId: '101',
    date: '2026-06-25T10:00:00Z',
    type: 'cleaning',
    title: 'Désinfection et grand ménage',
    description: 'Désinfection complète, nettoyage en profondeur des rideaux et de la kitchenette. Literie neuve installée.',
    staffName: 'Aka Florence'
  },
  {
    id: 'h2',
    roomId: '101',
    date: '2026-06-28T14:15:00Z',
    type: 'reservation',
    title: 'Arrivée (Check-In) - Konan Koffi Serge',
    description: 'Enregistrement effectué pour un séjour de 4 nuits. Paiement partiel reçu.',
    staffName: 'Yao Amenan Chantal',
    amount: 100000
  },
  {
    id: 'h3',
    roomId: '103',
    date: '2026-06-29T15:30:00Z',
    type: 'reservation',
    title: 'Arrivée (Check-In) - Marc-Antoine Dubois',
    description: 'Arrivée client d\'affaires. Règlement intégral de 270 000 FCFA reçu.',
    staffName: 'Yao Amenan Chantal',
    amount: 270000
  },
  {
    id: 'h4',
    roomId: '104',
    date: '2026-06-30T11:45:00Z',
    type: 'cleaning',
    title: 'Ménage de départ requis',
    description: 'Chambre libérée par le client ce matin. Signalée comme sale dans le PMS.',
    staffName: 'Aka Florence'
  },
  {
    id: 'h5',
    roomId: '106',
    date: '2026-07-01T09:00:00Z',
    type: 'maintenance',
    title: 'Signalement climatisation HS',
    description: 'Le compresseur extérieur fait un bruit métallique et n\'émet plus d\'air froid. Transfert en maintenance.',
    staffName: 'Zadi Richard'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'FAC-2026-0001',
    tenantId: 'tenant-bouake-kennedy',
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
    tenantId: 'tenant-bouake-kennedy',
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
    tenantId: 'tenant-bouake-kennedy',
    clientName: 'Dr. Bakayoko Sylla',
    clientPhone: '+225 07 88 99 00 11',
    date: '2026-07-02',
    dueDate: '2026-07-02',
    items: [
      { description: 'Appartement F2 VIP - Séjour de 3 nuits', quantity: 3, unitPrice: 45000, total: 135000 }
    ],
    subtotal: 135000,
    taxRate: 0.18,
    taxAmount: 24300,
    totalAmount: 159300,
    status: 'paid',
    paymentMethod: 'wave',
    notes: 'Facture VIP soldée par Wave CI'
  }
];

export const INITIAL_CUSTOMER_AVOIRS: CustomerAvoir[] = [
  {
    id: 'AVO-001',
    tenantId: 'tenant-bouake-kennedy',
    clientName: 'Amadou Coulibaly (Client Fidèle)',
    clientPhone: '+225 07 47 48 49 50',
    balance: 45000,
    createdAt: '2026-07-01T10:00:00.000Z',
    updatedAt: '2026-07-02T12:30:00.000Z',
    movements: [
      {
        id: 'mov-1',
        type: 'credit',
        amount: 50000,
        reason: 'Dépôt de garantie prépayé Maquis (Recharge compte)',
        date: '2026-07-01T10:00:00.000Z',
        paymentMethod: 'wave'
      },
      {
        id: 'mov-2',
        type: 'debit',
        amount: 5000,
        reason: 'Déduction consommation table 4 - Braisé & Bock',
        date: '2026-07-02T12:30:00.000Z'
      }
    ]
  },
  {
    id: 'AVO-002',
    tenantId: 'tenant-bouake-kennedy',
    clientName: 'Sékou Sangaré',
    clientPhone: '+225 05 06 07 08 09',
    balance: 15000,
    createdAt: '2026-07-02T08:15:00.000Z',
    updatedAt: '2026-07-02T08:15:00.000Z',
    movements: [
      {
        id: 'mov-3',
        type: 'credit',
        amount: 15000,
        reason: 'Avoir émis pour remboursement bouteilles de gaz consignées',
        date: '2026-07-02T08:15:00.000Z',
        paymentMethod: 'cash'
      }
    ]
  }
];

export const INITIAL_HR_EMPLOYEES: HREmployee[] = [
  {
    id: 'emp-1',
    tenantId: 'tenant-bouake-kennedy',
    name: 'Zadi Richard',
    customStatus: 'Manager Général Établissement',
    phone: '+225 07 44 55 66 77',
    email: 'r.zadi@brunchbouake.com',
    hireDate: '2023-01-15',
    baseSalary: 450000,
    contractType: 'CDI',
    department: 'Administration',
    cnpsNumber: 'CNPS-9823748-A',
    status: 'active'
  },
  {
    id: 'emp-2',
    tenantId: 'tenant-bouake-kennedy',
    name: 'Yao Amenan Chantal',
    customStatus: 'Chef Comptable & Caissière Principal',
    phone: '+225 07 11 22 33 44',
    email: 'c.yao@brunchbouake.com',
    hireDate: '2024-03-10',
    baseSalary: 280000,
    contractType: 'CDI',
    department: 'Comptabilité',
    cnpsNumber: 'CNPS-1029384-B',
    status: 'active'
  },
  {
    id: 'emp-3',
    tenantId: 'tenant-bouake-kennedy',
    name: 'Kouassi Kouamé Jean',
    customStatus: 'Maître d\'Hôtel & Chef de Rang',
    phone: '+225 05 99 88 77 66',
    email: 'k.jean@brunchbouake.com',
    hireDate: '2024-05-20',
    baseSalary: 180000,
    contractType: 'CDI',
    department: 'Restauration',
    cnpsNumber: 'CNPS-2039482-C',
    status: 'active'
  },
  {
    id: 'emp-4',
    tenantId: 'tenant-bouake-kennedy',
    name: 'Aka Florence',
    customStatus: 'Gouvernante Principale des Appartements',
    phone: '+225 01 22 33 44 55',
    email: 'f.aka@brunchbouake.com',
    hireDate: '2025-02-01',
    baseSalary: 140000,
    contractType: 'CDD',
    contractDuration: '12 mois',
    department: 'Hébergement',
    cnpsNumber: 'CNPS-3049581-D',
    status: 'active'
  },
  {
    id: 'emp-5',
    tenantId: 'tenant-bouake-kennedy',
    name: 'Traoré Bakary',
    customStatus: 'Braiseur de Choukouya & Viandes',
    phone: '+225 07 88 12 34 56',
    email: 'b.traore@brunchbouake.com',
    hireDate: '2025-11-01',
    baseSalary: 220000,
    contractType: 'CDD',
    contractDuration: '6 mois',
    department: 'Restauration',
    cnpsNumber: 'CNPS-4059682-E',
    status: 'active'
  }
];

export const INITIAL_HR_PAYSLIPS: Payslip[] = [
  {
    id: 'slip-101',
    employeeId: 'emp-3',
    employeeName: 'Kouassi Kouamé Jean',
    period: 'Juin 2026',
    baseSalary: 180000,
    seniorityYears: 2,
    seniorityAmount: 7200,
    includeSeniority: true,
    bonusAmount: 15000,
    includeBonus: true,
    transportAllowance: 20000,
    includeTransport: true,
    socialSecurityDeduction: 11340,
    includeSocialSecurity: true,
    taxDeduction: 9000,
    includeTax: true,
    netSalary: 201860,
    dateGenerated: '2026-06-28',
    status: 'paid',
    notes: 'Paiement régulier de salaire du mois. Virement Wave effectué.'
  },
  {
    id: 'slip-102',
    employeeId: 'emp-4',
    employeeName: 'Aka Florence',
    period: 'Juin 2026',
    baseSalary: 140000,
    seniorityYears: 1,
    seniorityAmount: 2800,
    includeSeniority: true,
    bonusAmount: 0,
    includeBonus: false,
    transportAllowance: 20000,
    includeTransport: true,
    socialSecurityDeduction: 8820,
    includeSocialSecurity: true,
    taxDeduction: 7000,
    includeTax: true,
    netSalary: 146980,
    dateGenerated: '2026-06-29',
    status: 'paid',
    notes: 'Paiement régulier par chèque.'
  }
];

export const INITIAL_HR_CONTRACTS: HRContract[] = [
  {
    id: 'contr-201',
    employeeId: 'emp-1',
    employeeName: 'Zadi Richard',
    type: 'CDI',
    startDate: '2023-01-15',
    salary: 450000,
    status: 'active',
    terms: 'Le présent contrat régit les fonctions de Manager Général au sein de Brunch Bouaké Hospitality. Le titulaire s\'engage à gérer l\'ensemble des opérations d\'hébergement et de restauration maquis de l\'établissement de Kennedy.',
    dateGenerated: '2023-01-12'
  },
  {
    id: 'contr-202',
    employeeId: 'emp-5',
    employeeName: 'Traoré Bakary',
    type: 'CDD',
    startDate: '2025-11-01',
    endDate: '2026-05-01',
    salary: 220000,
    status: 'completed',
    terms: 'Contrat à durée déterminée de 6 mois renouvelable pour le poste de Chef Braiseur de Choukouya. Logement et restauration partielle sur place autorisés.',
    dateGenerated: '2025-10-28'
  }
];

