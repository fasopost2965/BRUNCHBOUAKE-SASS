import { Room, Reservation, MenuItem, StaffMember, Task, Transaction, GuestRecord, PropertySettings } from './types';

export const INITIAL_ROOMS: Room[] = [
  {
    id: '101',
    name: 'Studio Bouaké Chic',
    type: 'studio',
    pricePerNight: 25000,
    status: 'occupied',
    maxGuests: 2,
    features: ['Climatisation', 'Wi-Fi Fibre', 'Kitchenette', 'SdB Privée', 'Mini-bar']
  },
  {
    id: '102',
    name: 'Chambre Standard Gbêkê',
    type: 'room',
    pricePerNight: 18000,
    status: 'available',
    maxGuests: 2,
    features: ['Climatisation', 'Wi-Fi Fibre', 'SdB Privée', 'Télévision Smart']
  },
  {
    id: '103',
    name: 'Appartement F2 VIP',
    type: 'apartment',
    pricePerNight: 45000,
    status: 'occupied',
    maxGuests: 4,
    features: ['Climatisation Salon & Chambre', 'Cuisine Équipée', 'Canapé Cuir', 'Machine à café', 'Netflix']
  },
  {
    id: '104',
    name: 'Studio L\'Harmattan',
    type: 'studio',
    pricePerNight: 25000,
    status: 'dirty',
    maxGuests: 2,
    features: ['Climatisation', 'Wi-Fi Fibre', 'Balcon', 'Kitchenette']
  },
  {
    id: '105',
    name: 'Chambre Confort Kénédougou',
    type: 'room',
    pricePerNight: 20000,
    status: 'available',
    maxGuests: 2,
    features: ['Climatisation', 'Wi-Fi Fibre', 'Espace Bureau', 'Bouilloire']
  },
  {
    id: '106',
    name: 'Appartement Suite Prestige',
    type: 'apartment',
    pricePerNight: 60000,
    status: 'maintenance',
    maxGuests: 6,
    features: ['3 Chambres', 'Salon d\'angle', 'Cuisine Américaine', 'Grande Terrasse', 'Lave-linge']
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
    name: 'Kedjenou de Poulet de Brousse (M)',
    category: 'plat',
    price: 6500,
    available: true
  },
  {
    id: 'm2',
    name: 'Poisson Carpe Braisé d\'Ayame',
    category: 'plat',
    price: 7000,
    available: true
  },
  {
    id: 'm3',
    name: 'Choukouya de Mouton Tendre',
    category: 'plat',
    price: 8000,
    available: true
  },
  {
    id: 'm4',
    name: 'Alloco Spécial Giga (Bananes mûres)',
    category: 'accompagnement',
    price: 2000,
    available: true
  },
  {
    id: 'm5',
    name: 'Attiéké de Qualité Supérieure',
    category: 'accompagnement',
    price: 1000,
    available: true
  },
  {
    id: 'm6',
    name: 'Bissap Glacé Maison (Hibiscus)',
    category: 'boisson',
    price: 1500,
    available: true
  },
  {
    id: 'm7',
    name: 'Gnamankoudji Intense (Gingembre)',
    category: 'boisson',
    price: 1500,
    available: true
  },
  {
    id: 'm8',
    name: 'Bière Ivoirienne Bock de 65cl',
    category: 'boisson',
    price: 1500,
    available: true
  },
  {
    id: 'm9',
    name: 'Brunch Signature Brunch Bouaké',
    category: 'plat',
    price: 12000,
    available: true
  },
  {
    id: 'm10',
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
    type: 'lodging_payment',
    amount: 50000,
    method: 'wave',
    description: 'Acompte réservation res-101 (Konan Koffi Serge)',
    date: '2026-06-28T10:15:00Z',
    referenceId: 'res-101'
  },
  {
    id: 'tr-002',
    type: 'lodging_payment',
    amount: 270000,
    method: 'orange_money',
    description: 'Paiement intégral chambre 103 (Marc-Antoine Dubois)',
    date: '2026-06-29T14:30:00Z',
    referenceId: 'res-103'
  },
  {
    id: 'tr-003',
    type: 'pos_sale',
    amount: 17500,
    method: 'cash',
    description: 'Addition maquis - Table 4 (Kedjenou x2, Alloco x1, Boissons x3)',
    date: '2026-06-30T13:10:00Z'
  },
  {
    id: 'tr-004',
    type: 'expense',
    amount: 35000,
    method: 'cash',
    description: 'Achat bouteilles de gaz pour les cuisines du maquis',
    date: '2026-06-30T09:00:00Z'
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
  }
};

