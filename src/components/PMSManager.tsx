import React, { useState } from 'react';
import { 
  BedDouble, 
  Calendar, 
  UserPlus, 
  Search, 
  Plus, 
  Check, 
  AlertTriangle, 
  Clock, 
  CreditCard,
  User,
  Phone,
  Mail,
  Receipt,
  FileText,
  Smartphone,
  Activity,
  ShieldAlert,
  CheckCircle,
  X,
  Printer,
  Tv,
  Wind,
  Coffee,
  Wifi,
  Trash2,
  Edit3
} from 'lucide-react';
import { Room, Reservation, GuestRecord, MenuItem, TableOrder, Transaction, PaymentIntent, PaymentTransaction, WebhookEvent, ProcessedEvent, PaymentProvider, PropertySettings } from '../types';
import { PaymentOrchestrator, WaveAdapter, OrangeMoneyAdapter } from '../services/paymentService';

interface PMSProps {
  rooms: Room[];
  reservations: Reservation[];
  onUpdateRooms: (updated: Room[]) => void;
  onUpdateReservations: (updated: Reservation[]) => void;
  onAddTransaction: (t: Transaction) => void;
  onAddTask: (title: string, desc: string, cat: 'housekeeping' | 'maintenance', rId?: string) => void;
  activeOrders: TableOrder[]; // Used to calculate restaurant charges to rooms
  onUpdateOrders?: (updated: TableOrder[]) => void;
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

export default function PMSManager({
  rooms,
  reservations,
  onUpdateRooms,
  onUpdateReservations,
  onAddTransaction,
  onAddTask,
  activeOrders,
  onUpdateOrders,
  paymentIntents,
  paymentTransactions,
  webhookEvents,
  processedEvents,
  onUpdatePaymentIntents,
  onUpdatePaymentTransactions,
  onUpdateWebhookEvents,
  onUpdateProcessedEvents,
  settings
}: PMSProps) {
  
  const [filterType, setFilterType] = useState<'all' | 'studio' | 'room' | 'apartment'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'occupied' | 'dirty' | 'maintenance'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals / Selection States
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);

  // Form states for Check-In
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [checkInDate, setCheckInDate] = useState('2026-06-30');
  const [checkOutDate, setCheckOutDate] = useState('2026-07-03');
  const [numGuests, setNumGuests] = useState(1);
  const [prepaidAmount, setPrepaidAmount] = useState(0);
  const [specialRequests, setSpecialRequests] = useState('');
  const [securityPin, setSecurityPin] = useState('1234');
  const [creditLimit, setCreditLimit] = useState(50000);

  // Additional Identity, Stay Source, and Audit states
  const [guestNationality, setGuestNationality] = useState('Ivoirienne');
  const [guestIdNumber, setGuestIdNumber] = useState('');
  const [guestAddress, setGuestAddress] = useState('');
  const [sourceOfStay, setSourceOfStay] = useState('Walk-in');
  const [checkInType, setCheckInType] = useState<'walk-in' | 'reservation'>('walk-in');
  const [selectedReservationId, setSelectedReservationId] = useState('');
  const [staffMemberName, setStaffMemberName] = useState('Jean Dupont');

  // Saved guests for lookup
  const [savedGuestsList, setSavedGuestsList] = useState<GuestRecord[]>(() => {
    const saved = localStorage.getItem('bb_guests');
    return saved ? JSON.parse(saved) : [];
  });

  // Debtor / Manager checkout authorization fields
  const [authorizeDebtorCheckout, setAuthorizeDebtorCheckout] = useState(false);
  const [managerPasscode, setManagerPasscode] = useState('');
  const [debtorBillingNotes, setDebtorBillingNotes] = useState('');
  const [checkoutStaffName, setCheckoutStaffName] = useState('Koffi Kouassi');

  // Selected payment method for checkout
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<'wave' | 'orange_money' | 'mtn' | 'cash' | 'card'>('wave');

  // Mobile Money Payment Tracking for PMS Check-out
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState('');
  const [activePaymentIntent, setActivePaymentIntent] = useState<PaymentIntent | null>(null);
  const [activeAdapterResponse, setActiveAdapterResponse] = useState<any | null>(null);
  const [showPaymentGatewayModal, setShowPaymentGatewayModal] = useState<boolean>(false);
  const [paymentGatewayLogs, setPaymentGatewayLogs] = useState<string[]>([]);
  const [reconciliationReason, setReconciliationReason] = useState<string>('');
  const [reconciledByRole, setReconciledByRole] = useState<string>('Comptable');
  const [showFolioInvoiceModal, setShowFolioInvoiceModal] = useState(false);
  const [invoiceReservation, setInvoiceReservation] = useState<Reservation | null>(null);

  // Sub-tab state for Room Cards vs. Reservation Calendar
  const [activeSubTab, setActiveSubTab] = useState<'rooms' | 'calendar'>('rooms');
  const [calendarStartDate, setCalendarStartDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 2); // Show 2 days ago as context!
    return d;
  });

  // Room Configuration & Capacity Expansion states
  const [showRoomInventoryModal, setShowRoomInventoryModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  
  // Room form states
  const [roomFormId, setRoomFormId] = useState('');
  const [roomFormName, setRoomFormName] = useState('');
  const [roomFormType, setRoomFormType] = useState<'room' | 'studio' | 'apartment'>('room');
  const [roomFormPrice, setRoomFormPrice] = useState(15000);
  const [roomFormMaxGuests, setRoomFormMaxGuests] = useState(2);
  const [roomFormFeatures, setRoomFormFeatures] = useState<string[]>([]);

  // Filtered rooms
  const filteredRooms = rooms.filter(room => {
    const matchesType = filterType === 'all' || room.type === filterType;
    const matchesStatus = filterStatus === 'all' || room.status === filterStatus;
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) || room.id.includes(searchQuery);
    return matchesType && matchesStatus && matchesSearch;
  });

  // Calculate nights between two dates
  const calculateNights = (inDate: string, outDate: string) => {
    const start = new Date(inDate);
    const end = new Date(outDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return isNaN(diffDays) ? 1 : diffDays;
  };

  // Handle lodging check-in form submission
  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    // A room cannot be checked in if it is dirty, maintenance, or occupied
    if (selectedRoom.status === 'dirty' || selectedRoom.status === 'maintenance' || selectedRoom.status === 'occupied') {
      alert(`ERREUR VALIDATION: La chambre ${selectedRoom.name} est actuellement en statut "${selectedRoom.status}". Enregistrement impossible.`);
      return;
    }

    const nights = calculateNights(checkInDate, checkOutDate);
    const totalLodgingPrice = selectedRoom.pricePerNight * nights;

    let targetReservationId = `res-${Date.now().toString().slice(-4)}`;
    let updatedReservationsList = [...reservations];
    let finalGuestName = guestName;
    let finalGuestPhone = guestPhone;
    let finalGuestEmail = guestEmail;

    if (checkInType === 'reservation' && selectedReservationId) {
      // Find and update existing reservation
      targetReservationId = selectedReservationId;
      const matchedRes = reservations.find(r => r.id === selectedReservationId);
      if (matchedRes) {
        finalGuestName = matchedRes.guestName;
        finalGuestPhone = matchedRes.guestPhone;
        finalGuestEmail = matchedRes.guestEmail;
      }

      updatedReservationsList = reservations.map(r => {
        if (r.id === selectedReservationId) {
          return {
            ...r,
            status: 'checked-in' as const,
            checkInDate,
            checkOutDate,
            numberOfGuests: numGuests,
            paidAmount: r.paidAmount + prepaidAmount,
            totalAmount: totalLodgingPrice,
            paymentStatus: (r.paidAmount + prepaidAmount) === 0 ? 'unpaid' : (r.paidAmount + prepaidAmount) >= totalLodgingPrice ? 'fully-paid' : 'partially-paid',
            specialRequests,
            securityPin: securityPin.trim() || '1234',
            creditLimit: creditLimit || 50000,
            // Capture identity and operational audit trail
            nationality: guestNationality,
            idNumber: guestIdNumber,
            address: guestAddress,
            sourceOfStay,
            staffMember: staffMemberName,
            updatedAt: new Date().toISOString(),
            updatedBy: staffMemberName,
            sourceModule: 'PMS'
          };
        }
        return r;
      });
    } else {
      // Walk-In check-in: create new reservation stay
      const newReservation: Reservation = {
        id: targetReservationId,
        roomId: selectedRoom.id,
        guestName,
        guestPhone,
        guestEmail,
        checkInDate,
        checkOutDate,
        numberOfGuests: numGuests,
        status: 'checked-in',
        totalAmount: totalLodgingPrice,
        paidAmount: prepaidAmount,
        paymentStatus: prepaidAmount === 0 ? 'unpaid' : prepaidAmount >= totalLodgingPrice ? 'fully-paid' : 'partially-paid',
        specialRequests,
        securityPin: securityPin.trim() || '1234',
        creditLimit: creditLimit || 50000,
        // Capture identity and operational audit trail
        nationality: guestNationality,
        idNumber: guestIdNumber,
        address: guestAddress,
        sourceOfStay,
        staffMember: staffMemberName,
        createdAt: new Date().toISOString(),
        createdBy: staffMemberName,
        sourceModule: 'PMS'
      };
      updatedReservationsList.push(newReservation);
    }

    // Add transaction if prepaidAmount > 0
    if (prepaidAmount > 0) {
      onAddTransaction({
        id: `tr-${Date.now().toString().slice(-4)}`,
        type: 'lodging_payment',
        amount: prepaidAmount,
        method: 'cash',
        description: `Acompte check-in ${selectedRoom.name} - ${finalGuestName} [Encaissé par: ${staffMemberName}]`,
        date: new Date().toISOString(),
        referenceId: targetReservationId
      });
    }

    // Capture and Save/Sync Guest profile to CRM
    const savedGuests = localStorage.getItem('bb_guests');
    const currentGuestsList: GuestRecord[] = savedGuests ? JSON.parse(savedGuests) : [];
    const normalizedPhone = (finalGuestPhone || '').trim();
    const guestExists = currentGuestsList.find(g => g.phone === normalizedPhone);

    if (finalGuestName) {
      if (!guestExists) {
        const newGuestRecord: GuestRecord = {
          id: `g-${Date.now().toString().slice(-4)}`,
          name: finalGuestName,
          phone: finalGuestPhone,
          email: finalGuestEmail,
          nationality: guestNationality,
          idNumber: guestIdNumber,
          address: guestAddress,
          notes: specialRequests,
          visitCount: 1,
          totalSpent: prepaidAmount
        };
        const updatedGList = [...currentGuestsList, newGuestRecord];
        localStorage.setItem('bb_guests', JSON.stringify(updatedGList));
        setSavedGuestsList(updatedGList);
      } else {
        const updatedGList = currentGuestsList.map(g => {
          if (g.phone === normalizedPhone) {
            return {
              ...g,
              name: finalGuestName || g.name,
              email: finalGuestEmail || g.email,
              nationality: guestNationality || g.nationality,
              idNumber: guestIdNumber || g.idNumber,
              address: guestAddress || g.address,
              visitCount: g.visitCount + 1,
              totalSpent: g.totalSpent + prepaidAmount
            };
          }
          return g;
        });
        localStorage.setItem('bb_guests', JSON.stringify(updatedGList));
        setSavedGuestsList(updatedGList);
      }
      window.dispatchEvent(new Event('storage'));
    }

    // Update room status to occupied
    const updatedRooms = rooms.map(r => r.id === selectedRoom.id ? { ...r, status: 'occupied' as const } : r);
    onUpdateRooms(updatedRooms);

    // Save reservations
    onUpdateReservations(updatedReservationsList);

    // Reset and close
    setShowCheckInModal(false);
    setSelectedRoom(null);
    resetForm();
  };

  const resetForm = () => {
    setGuestName('');
    setGuestPhone('');
    setGuestEmail('');
    setCheckInDate('2026-06-30');
    setCheckOutDate('2026-07-03');
    setNumGuests(1);
    setPrepaidAmount(0);
    setSpecialRequests('');
    setGuestNationality('Ivoirienne');
    setGuestIdNumber('');
    setGuestAddress('');
    setSourceOfStay('Walk-in');
    setCheckInType('walk-in');
    setSelectedReservationId('');
  };

  // Find active reservation for selected room
  const getActiveReservation = (roomId: string) => {
    return reservations.find(r => r.roomId === roomId && r.status === 'checked-in');
  };

  // Calculate restaurant POS extras charged to the room
  const getRestaurantCharges = (roomId: string) => {
    const roomOrders = activeOrders.filter(o => o.roomIdForCharge === roomId && o.status !== 'paid');
    const totalExtras = roomOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    return {
      orders: roomOrders,
      total: totalExtras
    };
  };

  // Finalize lodging check-out after confirmed payment intent is succeeded
  const finalizeCheckOutAfterPayment = (intent: PaymentIntent) => {
    if (!selectedRoom) return;
    const activeRes = getActiveReservation(selectedRoom.id);
    if (!activeRes) return;

    const extras = getRestaurantCharges(selectedRoom.id);

    // 1. Log lodging payment transaction
    onAddTransaction({
      id: `tr-${Date.now().toString().slice(-4)}`,
      type: 'lodging_payment',
      amount: intent.amount,
      method: intent.provider,
      description: `Solde séjour + extras - ${selectedRoom.name} (${activeRes.guestName}) [MM Tél: ${intent.phoneNumber}, Réf MM: ${intent.providerReference || 'N/A'}]`,
      date: new Date().toISOString(),
      referenceId: activeRes.id
    });

    // 1.1 Mark active restaurant orders charged to this room as paid
    if (onUpdateOrders && extras.orders.length > 0) {
      const updatedOrders = activeOrders.map(o => 
        o.roomIdForCharge === selectedRoom.id ? { ...o, status: 'paid' as const } : o
      );
      onUpdateOrders(updatedOrders);
    }

    // 2. Mark reservation as checked-out and fully-paid
    const updatedReservations = reservations.map(r => 
      r.id === activeRes.id 
        ? { ...r, status: 'checked-out' as const, paidAmount: r.totalAmount, paymentStatus: 'fully-paid' as const } 
        : r
    );
    onUpdateReservations(updatedReservations);

    // 3. Mark room as DIRTY (needs cleaning!)
    const updatedRooms = rooms.map(r => 
      r.id === selectedRoom.id 
        ? { ...r, status: 'dirty' as const } 
        : r
    );
    onUpdateRooms(updatedRooms);

    // 4. Generate cleaning task automatically for housekeeper
    onAddTask(
      `Nettoyage requis - ${selectedRoom.name}`,
      `Chambre libérée par ${activeRes.guestName}. Nettoyer, désinfecter et dresser les lits.`,
      'housekeeping',
      selectedRoom.id
    );

    // Close and reset
    setShowPaymentGatewayModal(false);
    setShowCheckOutModal(false);
    setSelectedRoom(null);
  };

  // Handle Checkout submission
  const handleCheckOutSubmit = () => {
    if (!selectedRoom) return;
    const activeRes = getActiveReservation(selectedRoom.id);
    if (!activeRes) return;

    const extras = getRestaurantCharges(selectedRoom.id);
    const totalLodgingDue = activeRes.totalAmount - activeRes.paidAmount;
    const finalBillAmount = totalLodgingDue + extras.total;

    if (authorizeDebtorCheckout) {
      if (!managerPasscode) {
        alert("ERREUR VALIDATION: Le code secret d'autorisation Manager est obligatoire pour effectuer un départ débiteur.");
        return;
      }
      if (managerPasscode !== "1234") {
        alert("ERREUR VALIDATION: Code d'autorisation Manager incorrect. Seuls les gérants ou administrateurs peuvent approuver un départ débiteur.");
        return;
      }
      if (!checkoutStaffName.trim()) {
        alert("ERREUR VALIDATION: Veuillez spécifier le nom de l'agent effectuant ce check-out débiteur.");
        return;
      }
      if (!debtorBillingNotes.trim()) {
        alert("ERREUR VALIDATION: Veuillez saisir un motif ou des notes de facturation différée pour documenter ce crédit.");
        return;
      }
    } else {
      // Intercept Mobile Money payments (Wave / Orange Money) if final amount is > 0
      if ((checkoutPaymentMethod === 'wave' || checkoutPaymentMethod === 'orange_money') && finalBillAmount > 0) {
        if (!mobileMoneyNumber) {
          alert('VEUILLEZ RENSAIGNER : Un numéro de téléphone valide est requis pour le paiement Mobile Money.');
          return;
        }

        // 1. Create payment intent via Orchestrator
        const { intent, initialAdapterResponse } = PaymentOrchestrator.createIntent(
          finalBillAmount,
          checkoutPaymentMethod as PaymentProvider,
          mobileMoneyNumber,
          'folio_charge',
          activeRes.id
        );

        // 2. Persist state
        onUpdatePaymentIntents(prev => [intent, ...prev]);

        // 3. Mount simulation
        setActivePaymentIntent(intent);
        setActiveAdapterResponse(initialAdapterResponse);
        setPaymentGatewayLogs(intent.metadata?.history || []);
        setShowPaymentGatewayModal(true);
        return;
      }
    }

    // Direct Cash / Card / Free checkout flow or Authorized Debt Checkout
    if (finalBillAmount > 0 && !authorizeDebtorCheckout) {
      onAddTransaction({
        id: `tr-${Date.now().toString().slice(-4)}`,
        type: 'lodging_payment',
        amount: finalBillAmount,
        method: checkoutPaymentMethod,
        description: `Solde séjour + extras resto - ${selectedRoom.name} (${activeRes.guestName})`,
        date: new Date().toISOString(),
        referenceId: activeRes.id
      });
    }

    // 1.1 Mark active restaurant orders charged to this room as paid
    if (onUpdateOrders && extras.orders.length > 0) {
      const updatedOrders = activeOrders.map(o => 
        o.roomIdForCharge === selectedRoom.id ? { ...o, status: 'paid' as const } : o
      );
      onUpdateOrders(updatedOrders);
    }

    // 2. Mark reservation as checked-out and update paidAmount/paymentStatus
    const updatedReservations = reservations.map(r => {
      if (r.id === activeRes.id) {
        return {
          ...r,
          status: 'checked-out' as const,
          paidAmount: authorizeDebtorCheckout ? r.paidAmount : r.totalAmount,
          paymentStatus: authorizeDebtorCheckout 
            ? (r.paidAmount === 0 ? 'unpaid' as const : 'partially-paid' as const) 
            : 'fully-paid' as const,
          specialRequests: authorizeDebtorCheckout 
            ? `${r.specialRequests || ''}\n[DÉPART DÉBITEUR autorisé par: ${checkoutStaffName}. Motif: ${debtorBillingNotes}]`
            : r.specialRequests,
          updatedAt: new Date().toISOString(),
          updatedBy: checkoutStaffName || 'Système',
          sourceModule: 'PMS'
        };
      }
      return r;
    });
    onUpdateReservations(updatedReservations);

    // 3. Mark room as DIRTY (needs cleaning before next check-in!)
    const updatedRooms = rooms.map(r => 
      r.id === selectedRoom.id 
        ? { ...r, status: 'dirty' as const } 
        : r
    );
    onUpdateRooms(updatedRooms);

    // 4. Generate a cleaning task automatically for housekeeper!
    onAddTask(
      `Nettoyage requis - ${selectedRoom.name}`,
      `Chambre libérée par ${activeRes.guestName}. Nettoyer, désinfecter et dresser les lits. ${
        authorizeDebtorCheckout ? `⚠️ Note: Départ débiteur enregistré.` : ''
      }`,
      'housekeeping',
      selectedRoom.id
    );

    // Close and reset debtor states
    setShowCheckOutModal(false);
    setSelectedRoom(null);
    setAuthorizeDebtorCheckout(false);
    setManagerPasscode('');
    setDebtorBillingNotes('');
    setCheckoutStaffName('');
  };

  // Simulators for checkout Mobile Money webhook / override
  const handleSimulateWebhookPMS = (outcome: 'success' | 'failure') => {
    if (!activePaymentIntent) return;

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

    // Process webhook
    const result = PaymentOrchestrator.processWebhook(
      provider,
      mockPayload,
      paymentIntents,
      processedEvents,
      paymentTransactions
    );

    if (result.success && result.affectedIntent) {
      onUpdatePaymentIntents(result.updatedIntents);
      onUpdateProcessedEvents(result.updatedProcessedEvents);
      onUpdatePaymentTransactions(result.updatedTransactions);

      setActivePaymentIntent(result.affectedIntent);
      setPaymentGatewayLogs(result.affectedIntent.metadata?.history || []);

      if (outcome === 'success') {
        alert("SIMULATION WEBHOOK : Signature validée. Solde libéré !");
        finalizeCheckOutAfterPayment(result.affectedIntent);
      } else {
        alert("SIMULATION WEBHOOK : Paiement décliné.");
      }
    } else {
      alert(`ÉCHEC DE PROCESSUS WEBHOOK : ${result.error || 'Erreur indéterminée'}`);
    }
  };

  const handleManualReconcileInPMS = () => {
    if (!activePaymentIntent) return;
    if (!reconciliationReason) {
      alert("VEUILLEZ SAISIR : Un motif ou reçu de transfert physique est obligatoire.");
      return;
    }

    const result = PaymentOrchestrator.forceManualReconcile(
      activePaymentIntent.id,
      reconciliationReason,
      `PMS Reception [${reconciledByRole}]`,
      paymentIntents,
      paymentTransactions
    );

    if (result.success && result.affectedIntent) {
      onUpdatePaymentIntents(result.updatedIntents);
      onUpdatePaymentTransactions(result.updatedTransactions);

      setActivePaymentIntent(result.affectedIntent);
      setPaymentGatewayLogs(result.affectedIntent.metadata?.history || []);

      alert("RÉCONCILIATION MANUELLE : Approbation comptable forcée.");
      finalizeCheckOutAfterPayment(result.affectedIntent);
    } else {
      alert("Erreur lors de la réconciliation manuelle.");
    }
  };

  const handleRoomStatusChange = (roomId: string, newStatus: any) => {
    const updated = rooms.map(r => r.id === roomId ? { ...r, status: newStatus } : r);
    onUpdateRooms(updated);
    
    // If we mark a dirty room as available, we create no logs, but it frees it up.
    if (newStatus === 'available') {
      setSelectedRoom(null);
    }
  };

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomFormName.trim()) {
      alert("Veuillez saisir un nom ou numéro de chambre.");
      return;
    }
    if (roomFormPrice <= 0) {
      alert("Le tarif par nuit doit être un nombre positif.");
      return;
    }

    if (editingRoom) {
      // Editing existing room
      const updatedRooms = rooms.map(r => r.id === editingRoom.id ? {
        ...r,
        name: roomFormName.trim(),
        type: roomFormType,
        pricePerNight: roomFormPrice,
        maxGuests: roomFormMaxGuests,
        features: roomFormFeatures
      } : r);
      
      onUpdateRooms(updatedRooms);
      alert(`La chambre ${roomFormName} a été mise à jour avec succès.`);
    } else {
      // Creating new room
      const generatedId = roomFormId.trim() || `rm-${Date.now().toString().slice(-4)}`;
      
      if (rooms.some(r => r.id === generatedId)) {
        alert(`Erreur : L'identifiant ou numéro de chambre "${generatedId}" existe déjà. Veuillez en choisir un autre.`);
        return;
      }

      const newRoom: Room = {
        id: generatedId,
        name: roomFormName.trim(),
        type: roomFormType,
        pricePerNight: roomFormPrice,
        status: 'available',
        maxGuests: roomFormMaxGuests,
        features: roomFormFeatures
      };

      onUpdateRooms([...rooms, newRoom]);
      alert(`La chambre hôtelière / studio "${roomFormName}" a été créée et ajoutée à l'inventaire actif.`);
    }

    // Reset and close modal
    setShowRoomInventoryModal(false);
    setEditingRoom(null);
    setRoomFormId('');
    setRoomFormName('');
    setRoomFormType('room');
    setRoomFormPrice(15000);
    setRoomFormMaxGuests(2);
    setRoomFormFeatures([]);
  };

  const handleDeleteRoom = (roomId: string) => {
    const matchedRoom = rooms.find(r => r.id === roomId);
    if (!matchedRoom) return;
    
    // Check if room is currently occupied
    if (matchedRoom.status === 'occupied') {
      alert("Impossible de supprimer une chambre occupée par des clients en cours de séjour.");
      return;
    }

    // Check if there is an active reservation
    const hasActiveRes = reservations.some(r => r.roomId === roomId && (r.status === 'confirmed' || r.status === 'checked-in'));
    if (hasActiveRes) {
      if (!window.confirm("Alerte : Cette chambre possède des réservations actives ou futures enregistrées. Êtes-vous sûr de vouloir la supprimer de l'inventaire ?")) {
        return;
      }
    } else {
      if (!window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement la chambre "${matchedRoom.name}" de l'inventaire de l'établissement ?`)) {
        return;
      }
    }

    const updatedRooms = rooms.filter(r => r.id !== roomId);
    onUpdateRooms(updatedRooms);
    alert(`La chambre "${matchedRoom.name}" a été retirée de l'inventaire.`);
    
    if (selectedRoom?.id === roomId) {
      setSelectedRoom(null);
    }
  };

  const handleOpenCreateRoom = () => {
    setEditingRoom(null);
    setRoomFormId('');
    setRoomFormName('');
    setRoomFormType('room');
    setRoomFormPrice(15000);
    setRoomFormMaxGuests(2);
    setRoomFormFeatures(['Climatisation', 'Wi-Fi Fibre', 'Télévision Smart']);
    setShowRoomInventoryModal(true);
  };

  const handleOpenEditRoom = (room: Room) => {
    setEditingRoom(room);
    setRoomFormId(room.id);
    setRoomFormName(room.name);
    setRoomFormType(room.type);
    setRoomFormPrice(room.pricePerNight);
    setRoomFormMaxGuests(room.maxGuests);
    setRoomFormFeatures(room.features);
    setShowRoomInventoryModal(true);
  };

  // French date formatting helpers for sliding calendar
  const formatDayNameFr = (date: Date) => {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    return days[date.getDay()];
  };

  const formatMonthNameFr = (date: Date) => {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return months[date.getMonth()];
  };

  const getReservationForDate = (roomId: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return reservations.find(r => 
      r.roomId === roomId && 
      r.status !== 'cancelled' &&
      r.checkInDate <= dateStr && 
      dateStr < r.checkOutDate
    );
  };

  const isSameDayStr = (date: Date, dateStr: string) => {
    const dStr = date.toISOString().split('T')[0];
    return dStr === dateStr;
  };

  return (
    <div className="space-y-6">
      
      {/* 🌟 MANAGER CAPACITY EXPANSION & KPIS PANEL */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 border border-slate-800/80 shadow-xl relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row gap-6 justify-between lg:items-center relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 bg-orange-500 text-white font-mono text-[9px] font-black rounded-md uppercase tracking-wider animate-pulse">
                TRAVAUX EN COURS
              </span>
              <span className="text-slate-400 text-xs font-semibold">• Extension de capacité active</span>
            </div>
            <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <BedDouble className="w-5 h-5 text-orange-500" />
              Pilotage de l'Inventaire & Capacité d'Accueil
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Ajoutez vos nouvelles chambres et studios au fur et à mesure de la livraison des travaux. Ajustez les tarifs, renommez les pièces et cochez les équipements (Climatisation, Smart TV, Wi-Fi, etc.) en un clic.
            </p>
          </div>

          <button
            onClick={handleOpenCreateRoom}
            className="px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-500/20 active:scale-95 transition-all self-start lg:self-center"
          >
            <Plus className="w-4 h-4 text-white" />
            + Ajouter une Chambre ou Studio
          </button>
        </div>

        {/* Mini Real-Time Capacity KPI grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-850 text-left">
          <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800/40">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Hébergements</span>
            <span className="text-lg font-black text-white font-mono">{rooms.length}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              {rooms.filter(r => r.type === 'studio').length} Studios, {rooms.filter(r => r.type === 'room').length} Chambres
            </span>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800/40">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Taux d'Occupation</span>
            <span className="text-lg font-black text-orange-400 font-mono">
              {rooms.length > 0 ? Math.round((rooms.filter(r => r.status === 'occupied').length / rooms.length) * 100) : 0}%
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              {rooms.filter(r => r.status === 'occupied').length} pièces occupées en ce moment
            </span>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800/40">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Ménages Requis</span>
            <span className="text-lg font-black text-amber-500 font-mono">
              {rooms.filter(r => r.status === 'dirty').length}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Chambres libérées à nettoyer
            </span>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800/40">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Maintenance en cours</span>
            <span className="text-lg font-black text-rose-400 font-mono">
              {rooms.filter(r => r.status === 'maintenance').length}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Hors-service (Travaux/Pannes)
            </span>
          </div>
        </div>
      </div>

      {/* 📅 SECTION SUB-TABS: ROOM CARDS VS. RESERVATIONS CALENDAR */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => {
            setActiveSubTab('rooms');
            setSelectedRoom(null);
          }}
          className={`px-6 py-3.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'rooms'
              ? 'border-orange-500 text-orange-600 font-black'
              : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'
          }`}
        >
          <BedDouble className="w-4 h-4" />
          <span>Grille des Chambres (PMS)</span>
        </button>
        <button
          onClick={() => {
            setActiveSubTab('calendar');
            setSelectedRoom(null);
          }}
          className={`px-6 py-3.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'calendar'
              ? 'border-orange-500 text-orange-600 font-black'
              : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4 text-orange-500" />
          <span>Calendrier des Réservations (Visualisation Planning)</span>
        </button>
      </div>

      {activeSubTab === 'rooms' && (
        <>
          {/* Search and Filters Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher studio, chambre, client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-orange-500 transition-all text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Type selector */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-all ${filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilterType('studio')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-all ${filterType === 'studio' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Studios
            </button>
            <button
              onClick={() => setFilterType('room')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-all ${filterType === 'room' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Chambres
            </button>
            <button
              onClick={() => setFilterType('apartment')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-all ${filterType === 'apartment' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Apparts
            </button>
          </div>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e: any) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-orange-500"
          >
            <option value="all">Tous statuts</option>
            <option value="available">Libres uniquement</option>
            <option value="occupied">Occupés uniquement</option>
            <option value="dirty">À nettoyer</option>
            <option value="maintenance">Hors-service (Panne)</option>
          </select>
        </div>
      </div>

      {/* Grid of rooms (PMS Interactive Matrix) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRooms.map((room) => {
          const activeRes = getActiveReservation(room.id);
          const restaurantCharges = getRestaurantCharges(room.id);
          
          return (
            <div 
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className={`border rounded-2xl p-5 text-left transition-all hover:shadow-md cursor-pointer relative overflow-hidden ${
                selectedRoom?.id === room.id 
                  ? 'ring-2 ring-orange-500 bg-orange-50/10' 
                  : 'bg-white'
              } ${
                room.status === 'available' ? 'border-emerald-100 border-l-4 border-l-emerald-500' :
                room.status === 'occupied' ? 'border-blue-100 border-l-4 border-l-blue-500' :
                room.status === 'dirty' ? 'border-orange-100 border-l-4 border-l-orange-500' :
                'border-slate-100 border-l-4 border-l-slate-400'
              }`}
            >
              {/* Top Bar inside card */}
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <BedDouble className="w-4 h-4 text-slate-400" />
                    {room.name}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{room.type}</span>
                </div>
                
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                  room.status === 'available' ? 'bg-emerald-100 text-emerald-800' :
                  room.status === 'occupied' ? 'bg-blue-100 text-blue-800' :
                  room.status === 'dirty' ? 'bg-orange-100 text-orange-800' :
                  'bg-slate-100 text-slate-800'
                }`}>
                  {room.status === 'available' ? 'Disponible' :
                   room.status === 'occupied' ? 'En séjour' :
                   room.status === 'dirty' ? 'Ménage' : 'Panne/SAV'}
                </span>
              </div>

              {/* Middle Section (Dynamic based on state) */}
              <div className="my-4 py-3 border-t border-b border-dashed border-slate-100 text-xs">
                {room.status === 'occupied' && activeRes ? (
                  <div className="space-y-1.5 text-slate-600">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" /> {activeRes.guestName}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Téléphone:</span>
                      <span>{activeRes.guestPhone}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Séjour:</span>
                      <span className="font-semibold">{activeRes.checkInDate} au {activeRes.checkOutDate}</span>
                    </div>
                    
                    {restaurantCharges.total > 0 && (
                      <div className="mt-2 p-1.5 bg-rose-50 text-rose-800 text-[10px] font-semibold rounded flex justify-between">
                        <span>Frais Maquis Resto chargés :</span>
                        <span>{restaurantCharges.total.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                    )}
                  </div>
                ) : room.status === 'dirty' ? (
                  <div className="text-orange-800 flex items-center gap-1.5 font-medium py-2">
                    <Clock className="w-4 h-4 text-orange-600 animate-pulse" />
                    <span>Nettoyage nécessaire avant attribution</span>
                  </div>
                ) : room.status === 'maintenance' ? (
                  <div className="text-slate-700 flex items-center gap-1.5 font-medium py-2">
                    <AlertTriangle className="w-4 h-4 text-slate-500" />
                    <span>Climatisation en panne - SAV en cours</span>
                  </div>
                ) : (
                  <div className="text-emerald-800 flex items-center gap-1.5 font-medium py-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Prêt à accueillir de nouveaux voyageurs</span>
                  </div>
                )}
              </div>

              {/* Bottom features / Price tag */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-slate-900">{room.pricePerNight.toLocaleString('fr-FR')}</span> 
                  <span className="text-slate-400 text-[10px]"> / nuit</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  Max: {room.maxGuests} pers.
                </div>
              </div>
            </div>
          );
        })}
      </div>
        </>
      )}

      {/* ==========================================
          SUB-TAB: CALENDRIER DES RÉSERVATIONS (Visualisation Planning)
          ========================================== */}
      {activeSubTab === 'calendar' && (
        <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-xs space-y-6 animate-fade-in text-slate-800">
          
          {/* Calendar Controls & Navigation */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center pb-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="p-3 bg-orange-100 text-orange-600 rounded-2xl inline-block shadow-sm">
                <Calendar className="w-5 h-5 text-orange-600 animate-pulse" />
              </span>
              <div>
                <h4 className="text-sm font-black uppercase text-slate-900 tracking-tight flex items-center gap-2">
                  Planning Interactif & Calendrier Glissant
                </h4>
                <p className="text-[10px] text-slate-500 font-medium">Vue chronologique d'occupation par hébergement • Cliquez pour gérer.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2 border border-slate-200/80 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  const prev = new Date(calendarStartDate);
                  prev.setDate(prev.getDate() - 7);
                  setCalendarStartDate(prev);
                }}
                className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black transition-all cursor-pointer shadow-2xs"
                title="Reculer de 7 jours"
              >
                &larr; 7 Jours
              </button>
              <button
                type="button"
                onClick={() => {
                  const prev = new Date(calendarStartDate);
                  prev.setDate(prev.getDate() - 1);
                  setCalendarStartDate(prev);
                }}
                className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black transition-all cursor-pointer shadow-2xs"
                title="Reculer de 1 jour"
              >
                &larr; 1 Jr
              </button>
              
              <button
                type="button"
                onClick={() => {
                  const d = new Date();
                  d.setDate(d.getDate() - 2); // default context view
                  setCalendarStartDate(d);
                }}
                className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-[10px] rounded-xl transition-all cursor-pointer uppercase shadow-sm"
              >
                Aujourd'hui
              </button>

              <button
                type="button"
                onClick={() => {
                  const next = new Date(calendarStartDate);
                  next.setDate(next.getDate() + 1);
                  setCalendarStartDate(next);
                }}
                className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black transition-all cursor-pointer shadow-2xs"
                title="Avancer de 1 jour"
              >
                1 Jr &rarr;
              </button>
              <button
                type="button"
                onClick={() => {
                  const next = new Date(calendarStartDate);
                  next.setDate(next.getDate() + 7);
                  setCalendarStartDate(next);
                }}
                className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black transition-all cursor-pointer shadow-2xs"
                title="Avancer de 7 jours"
              >
                7 Jours &rarr;
              </button>

              <input
                type="date"
                value={calendarStartDate.toISOString().split('T')[0]}
                onChange={(e) => {
                  if (e.target.value) {
                    setCalendarStartDate(new Date(e.target.value));
                  }
                }}
                className="bg-white border border-slate-200 rounded-xl px-2 py-1 text-[10px] text-slate-800 outline-none focus:border-orange-500 font-mono font-bold shadow-2xs cursor-pointer ml-1"
              />
            </div>
          </div>

          {/* Color Legend for booking states */}
          <div className="flex flex-wrap gap-4 text-[9px] font-black text-slate-500 uppercase tracking-wider justify-center md:justify-start bg-slate-50/80 p-3 rounded-2xl border border-slate-200/50">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block shadow-sm" />
              <span>Client en séjour (En séjour)</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-sm" />
              <span>Réservation confirmée</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm" />
              <span>Séjour terminé (Checked-Out)</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border border-dashed border-slate-300 bg-white inline-block shadow-2xs" />
              <span>Disponible / Libre (Cliquez pour Check-In)</span>
            </span>
          </div>

          {/* Graph Timeline table representation */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-xs">
            <table className="w-full min-w-[950px] border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest w-64 sticky left-0 bg-slate-50 z-20 border-r border-slate-200 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                    Hébergement / Studio
                  </th>
                  {(() => {
                    const datesArray: Date[] = [];
                    for (let i = 0; i < 15; i++) {
                      const nextDate = new Date(calendarStartDate);
                      nextDate.setDate(calendarStartDate.getDate() + i);
                      datesArray.push(nextDate);
                    }
                    return datesArray.map((date, idx) => {
                      const isToday = new Date().toLocaleDateString() === date.toLocaleDateString();
                      return (
                        <th
                          key={idx}
                          className={`p-2.5 text-center border-r border-slate-200 min-w-[75px] ${
                            isToday ? 'bg-orange-500/10' : ''
                          }`}
                        >
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            {formatDayNameFr(date)}
                          </div>
                          <div className={`text-sm font-black font-mono leading-none my-0.5 ${isToday ? 'text-orange-600 scale-110 block' : 'text-slate-800'}`}>
                            {date.getDate().toString().padStart(2, '0')}
                          </div>
                          <div className="text-[8px] font-extrabold text-slate-400 uppercase">
                            {formatMonthNameFr(date).substring(0, 3)}
                          </div>
                        </th>
                      );
                    });
                  })()}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 bg-white">
                {rooms.map((room) => {
                  const datesArray: Date[] = [];
                  for (let i = 0; i < 15; i++) {
                    const nextDate = new Date(calendarStartDate);
                    nextDate.setDate(calendarStartDate.getDate() + i);
                    datesArray.push(nextDate);
                  }

                  return (
                    <tr key={room.id} className="hover:bg-slate-50/40">
                      {/* Sticky left room detail column */}
                      <td className="p-4 font-semibold text-slate-800 text-xs sticky left-0 bg-white z-10 border-r border-slate-200 shadow-[3px_0_6px_-2px_rgba(0,0,0,0.04)] hover:bg-slate-50">
                        <div className="flex items-center gap-2.5">
                          <BedDouble className="w-4 h-4 text-slate-400 shrink-0" />
                          <div className="min-w-0">
                            <div className="font-extrabold text-slate-900 text-xs truncate">{room.name}</div>
                            <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest truncate">
                              {room.type} • {room.pricePerNight.toLocaleString('fr-FR')} F
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Calendar days mapping */}
                      {datesArray.map((date, dateIdx) => {
                        const reservation = getReservationForDate(room.id, date);
                        const isToday = new Date().toLocaleDateString() === date.toLocaleDateString();

                        if (reservation) {
                          const isStart = isSameDayStr(date, reservation.checkInDate);
                          const tomorrow = new Date(date);
                          tomorrow.setDate(date.getDate() + 1);
                          const isEnd = isSameDayStr(tomorrow, reservation.checkOutDate);

                          // Style theme based on reservation status
                          const themeClass =
                            reservation.status === 'checked-in'
                              ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm border border-blue-600/20'
                              : reservation.status === 'checked-out'
                              ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm border border-emerald-600/20'
                              : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm border border-amber-600/20';

                          return (
                            <td
                              key={dateIdx}
                              onClick={() => {
                                setSelectedRoom(room);
                              }}
                              className={`p-1.5 text-center border-r border-slate-200 cursor-pointer ${
                                isToday ? 'bg-orange-500/5' : ''
                              }`}
                              title={`Réservation : ${reservation.guestName} (${reservation.guestPhone})\nDu ${reservation.checkInDate} au ${reservation.checkOutDate}\nStatut : ${reservation.status.toUpperCase()}`}
                            >
                              <div
                                className={`h-11 flex flex-col justify-center items-center px-1 text-[9px] transition-all relative ${themeClass} ${
                                  isStart && isEnd
                                    ? 'rounded-2xl mx-1'
                                    : isStart
                                    ? 'rounded-l-2xl ml-1 border-r-0'
                                    : isEnd
                                    ? 'rounded-r-2xl mr-1 border-l-0'
                                    : 'border-l-0 border-r-0'
                                }`}
                              >
                                {/* Only show name and details if start cell or at grid left margin */}
                                {(isStart || dateIdx === 0) && (
                                  <span className="font-extrabold truncate max-w-[85px] block">
                                    {reservation.guestName.split(' ')[0]}
                                  </span>
                                )}
                                {(isStart || dateIdx === 0) && (
                                  <span className="text-[8px] opacity-90 block truncate font-mono font-bold mt-0.5">
                                    {reservation.id}
                                  </span>
                                )}
                              </div>
                            </td>
                          );
                        }

                        // Otherwise empty cell: Click to start a new Check-In
                        return (
                          <td
                            key={dateIdx}
                            onClick={() => {
                              setSelectedRoom(room);
                              setCheckInDate(date.toISOString().split('T')[0]);
                              const checkout = new Date(date);
                              checkout.setDate(date.getDate() + 2);
                              setCheckOutDate(checkout.toISOString().split('T')[0]);
                              setCheckInType('walk-in');
                              setShowCheckInModal(true);
                            }}
                            className={`p-2 border-r border-slate-200 text-center cursor-pointer transition-all hover:bg-orange-100/20 group relative h-14 ${
                              isToday ? 'bg-orange-500/5' : ''
                            }`}
                            title={`Chambre ${room.name} libre le ${date.toLocaleDateString('fr-FR')}. Cliquez pour enregistrer un Check-In.`
                            }
                          >
                            <div className="opacity-0 group-hover:opacity-100 flex justify-center items-center transition-all">
                              <Plus className="w-4 h-4 text-orange-500 bg-orange-100 p-0.5 rounded-full shadow-2xs" />
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Selected Room Action Panel */}
      {selectedRoom && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 transition-all">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-400">Salle Sélectionnée</span>
              <h3 className="text-lg font-bold text-slate-900">{selectedRoom.name}</h3>
              <p className="text-xs text-slate-500 mt-1">
                Gérez les arrivées, départs, ménages et modifications pour ce studio.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {/* Actions based on room status */}
              {selectedRoom.status === 'available' && (
                <button
                  onClick={() => setShowCheckInModal(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs rounded-xl shadow-xs transition-all w-full md:w-auto"
                >
                  <UserPlus className="w-4 h-4" />
                  Enregistrer un Check-In
                </button>
              )}

              {selectedRoom.status === 'occupied' && (
                <>
                  <button
                    onClick={() => setShowCheckOutModal(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all w-full md:w-auto"
                  >
                    <Receipt className="w-4 h-4" />
                    Procéder au Check-Out (Facturation)
                  </button>
                  <button
                    onClick={() => {
                      const activeRes = reservations.find(r => r.roomId === selectedRoom.id && r.status === 'checked-in');
                      if (activeRes) {
                        setInvoiceReservation(activeRes);
                        setShowFolioInvoiceModal(true);
                      }
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-xl transition-all w-full md:w-auto"
                    title="Voir l'état intermédiaire de la facture (Folio)"
                  >
                    <FileText className="w-4 h-4 text-slate-600" />
                    Visualiser Facture Folio
                  </button>
                </>
              )}

              {selectedRoom.status === 'dirty' && (
                <button
                  onClick={() => handleRoomStatusChange(selectedRoom.id, 'available')}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold text-xs rounded-xl transition-all w-full md:w-auto"
                >
                  <Check className="w-4 h-4" />
                  Marquer comme Nettoyé & Disponible
                </button>
              )}

              {/* Status togglers always available */}
              <div className="flex border border-slate-200 rounded-xl overflow-hidden bg-white text-xs w-full md:w-auto">
                <button
                  onClick={() => handleRoomStatusChange(selectedRoom.id, 'available')}
                  className={`px-3 py-2 font-medium ${selectedRoom.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  Libre
                </button>
                <button
                  onClick={() => handleRoomStatusChange(selectedRoom.id, 'dirty')}
                  className={`px-3 py-2 font-medium ${selectedRoom.status === 'dirty' ? 'bg-orange-100 text-orange-800' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  Ménage
                </button>
                <button
                  onClick={() => handleRoomStatusChange(selectedRoom.id, 'maintenance')}
                  className={`px-3 py-2 font-medium ${selectedRoom.status === 'maintenance' ? 'bg-rose-100 text-rose-800' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  Panne
                </button>
              </div>

              {/* Administrative actions for managing room properties */}
              <div className="flex border border-slate-200 rounded-xl overflow-hidden bg-white text-xs w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => handleOpenEditRoom(selectedRoom)}
                  className="px-3 py-2 font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-900 flex items-center gap-1 border-r border-slate-100 transition-all"
                  title="Renommer la chambre, ajuster le tarif ou configurer ses équipements minimums"
                >
                  <Edit3 className="w-3.5 h-3.5 text-orange-600" />
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteRoom(selectedRoom.id)}
                  disabled={selectedRoom.status === 'occupied'}
                  className="px-3 py-2 font-semibold text-slate-600 disabled:opacity-40 disabled:hover:bg-white disabled:text-slate-300 hover:bg-rose-50 hover:text-rose-900 flex items-center gap-1 transition-all"
                  title="Supprimer définitivement de l'inventaire"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  Supprimer
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: CHECK-IN REGISTRATION */}
      {showCheckInModal && selectedRoom && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[95vh] overflow-y-auto p-6 shadow-xl space-y-5">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Enregistrement d'Arrivée (Check-In)</h3>
                <p className="text-xs text-slate-500 mt-0.5">Studio : <strong className="text-orange-600 font-extrabold">{selectedRoom.name}</strong> • Max: {selectedRoom.maxGuests} pers.</p>
              </div>
              <button 
                onClick={() => setShowCheckInModal(false)}
                className="text-slate-400 hover:text-slate-600 font-semibold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCheckInSubmit} className="space-y-4 text-xs">
              {/* Check-In Type Selector */}
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Type d'Arrivée</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setCheckInType('walk-in');
                      setSelectedReservationId('');
                    }}
                    className={`py-1.5 px-3 text-center rounded-lg font-bold transition-all ${
                      checkInType === 'walk-in'
                        ? 'bg-white text-orange-600 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Walk-In (Arrivée Directe)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckInType('reservation')}
                    className={`py-1.5 px-3 text-center rounded-lg font-bold transition-all ${
                      checkInType === 'reservation'
                        ? 'bg-white text-orange-600 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Depuis Réservation
                  </button>
                </div>
              </div>

              {/* If type is reservation, show pending reservations dropdown */}
              {checkInType === 'reservation' && (
                <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-100/50 space-y-2">
                  <label className="block text-amber-900 font-bold">Sélectionner la Réservation Confirmée :</label>
                  <select
                    value={selectedReservationId}
                    onChange={(e) => {
                      const resId = e.target.value;
                      setSelectedReservationId(resId);
                      const matched = reservations.find(r => r.id === resId);
                      if (matched) {
                        setGuestName(matched.guestName);
                        setGuestPhone(matched.guestPhone);
                        setGuestEmail(matched.guestEmail);
                        setCheckInDate(matched.checkInDate);
                        setCheckOutDate(matched.checkOutDate);
                        setNumGuests(matched.numberOfGuests);
                        setPrepaidAmount(matched.paidAmount);
                        if (matched.nationality) setGuestNationality(matched.nationality);
                        if (matched.idNumber) setGuestIdNumber(matched.idNumber);
                        if (matched.address) setGuestAddress(matched.address);
                        if (matched.sourceOfStay) setSourceOfStay(matched.sourceOfStay);
                      }
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none"
                  >
                    <option value="">-- Choisir une réservation --</option>
                    {reservations
                      .filter(r => r.status === 'confirmed' && (r.roomId === selectedRoom.id || !r.roomId))
                      .map(r => (
                        <option key={r.id} value={r.id}>
                          {r.guestName} ({r.guestPhone}) - Du {r.checkInDate} au {r.checkOutDate} [Acompte: {r.paidAmount.toLocaleString('fr-FR')} F]
                        </option>
                      ))}
                  </select>
                  {reservations.filter(r => r.status === 'confirmed' && (r.roomId === selectedRoom.id || !r.roomId)).length === 0 && (
                    <span className="text-[10px] text-amber-700 block italic">Aucune réservation confirmée en attente pour cette chambre.</span>
                  )}
                </div>
              )}

              {/* CRM Guest Profile Lookup (Available for both walk-in and reservation to update profile) */}
              {checkInType === 'walk-in' && (
                <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-slate-700 font-bold">Client Existant (Recherche CRM) :</label>
                    <span className="text-[9px] font-mono text-slate-400 font-bold">Base Clients : {savedGuestsList.length}</span>
                  </div>
                  <select
                    onChange={(e) => {
                      const guestId = e.target.value;
                      if (!guestId) {
                        resetForm();
                      } else {
                        const matched = savedGuestsList.find(g => g.id === guestId);
                        if (matched) {
                          setGuestName(matched.name);
                          setGuestPhone(matched.phone);
                          setGuestEmail(matched.email || '');
                          if (matched.nationality) setGuestNationality(matched.nationality);
                          if (matched.idNumber) setGuestIdNumber(matched.idNumber);
                          if (matched.address) setGuestAddress(matched.address);
                          if (matched.notes) setSpecialRequests(matched.notes);
                        }
                      }
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none"
                  >
                    <option value="">-- Saisie libre (Nouveau client) --</option>
                    {savedGuestsList.map(g => (
                      <option key={g.id} value={g.id}>
                        {g.name} ({g.phone}) - {g.visitCount} séjour(s)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Core Guest Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Nom Complet du Client *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      disabled={checkInType === 'reservation' && !!selectedReservationId}
                      placeholder="Konan Koffi Serge"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Téléphone de contact *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      disabled={checkInType === 'reservation' && !!selectedReservationId}
                      placeholder="+225 07 48 29 10 11"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="koffi.konan@example.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Nationalité du voyageur *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ivoirienne, Sénégalaise, Française"
                    value={guestNationality}
                    onChange={(e) => setGuestNationality(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Guest Identity Card & Location Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">N° de Pièce d'Identité (CNI/Passeport) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: C01482910, ID-225-449"
                    value={guestIdNumber}
                    onChange={(e) => setGuestIdNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Adresse de Résidence Habituelle</label>
                  <input
                    type="text"
                    placeholder="Ex: Abidjan Cocody, Bouaké N'Gattakro"
                    value={guestAddress}
                    onChange={(e) => setGuestAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Booking Channel and Staff Auditor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Canal de Réservation / Source *</label>
                  <select
                    value={sourceOfStay}
                    onChange={(e) => setSourceOfStay(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none"
                  >
                    <option value="Walk-in">Walk-in (Arrivée imprévue)</option>
                    <option value="Booking.com">Booking.com</option>
                    <option value="Airbnb">Airbnb</option>
                    <option value="Direct-Email">Direct-Email / Site web</option>
                    <option value="Téléphone">Téléphone / WhatsApp</option>
                    <option value="Agence">Agence de voyage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Agent Réceptionniste (Saisie) *</label>
                  <select
                    value={staffMemberName}
                    onChange={(e) => setStaffMemberName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none"
                  >
                    <option value="Jean Dupont">Jean Dupont (Réception)</option>
                    <option value="Mariam Diallo">Mariam Diallo (Chef d'équipe)</option>
                    <option value="Koffi Kouassi">Koffi Kouassi (Gérant)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Date d'Arrivée *</label>
                  <input
                    type="date"
                    required
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Date de Départ *</label>
                  <input
                    type="date"
                    required
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Nombre d'adultes *</label>
                  <input
                    type="number"
                    min={1}
                    max={selectedRoom.maxGuests}
                    value={numGuests}
                    onChange={(e) => setNumGuests(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Acompte à encaisser (FCFA)</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="Encaisser un montant d'avance"
                    value={prepaidAmount}
                    onChange={(e) => setPrepaidAmount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none font-mono font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Demandes Spéciales / Notes</label>
                <textarea
                  placeholder="Ex: Lit de bébé requis, allergies, Check-out tardif..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none h-16"
                />
              </div>

              {/* Security PIN and Credit Limit configuration for POS integration */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                <h4 className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-orange-500" />
                  Contrôle & Sécurité (Transferts Maquis/Resto)
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Code PIN de Validation POS</label>
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="Ex: 1234"
                      value={securityPin}
                      onChange={(e) => setSecurityPin(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none font-mono font-bold tracking-widest text-slate-800 bg-white"
                    />
                    <span className="text-[10px] text-slate-400 block mt-0.5">Code à 4 chiffres requis en caisse</span>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Limite de Crédit Extras (FCFA)</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="Ex: 50000"
                      value={creditLimit}
                      onChange={(e) => setCreditLimit(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none font-mono font-bold text-slate-800 bg-white"
                    />
                    <span className="text-[10px] text-slate-400 block mt-0.5">Blocage automatique si dépassée</span>
                  </div>
                </div>
              </div>

              {/* Dynamic pricing and tax calculations based on Property Settings */}
              {(() => {
                const nights = calculateNights(checkInDate, checkOutDate);
                const rawPrice = selectedRoom.pricePerNight * nights;
                
                // Exclude VAT first to show HT
                const priceHT = Math.round(rawPrice / (1 + (settings.vatRate / 100)));
                const vatAmount = Math.round(priceHT * (settings.vatRate / 100));
                
                // Tourist Tax
                const touristTax = settings.touristTaxPerNight * nights;
                const grandTotal = rawPrice + touristTax;

                return (
                  <div className="p-4 bg-orange-50/70 rounded-2xl border border-orange-100 font-medium space-y-1.5">
                    <div className="flex justify-between text-slate-600 font-mono text-[10px]">
                      <span>Séjour hôtelier (HT) :</span>
                      <span>{priceHT.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                    <div className="flex justify-between text-slate-600 font-mono text-[10px]">
                      <span>TVA ({settings.vatRate}%) :</span>
                      <span>{vatAmount.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                    <div className="flex justify-between text-slate-600 font-mono text-[10px]">
                      <span>Taxe de Séjour ({settings.touristTaxPerNight.toLocaleString('fr-FR')} F/nuit) :</span>
                      <span>{touristTax.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                    <div className="flex justify-between text-orange-950 font-bold border-t border-orange-200/50 pt-2 mt-1.5 text-xs">
                      <span>Montant global dû ({nights} nuits) :</span>
                      <span className="font-mono">{grandTotal.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  </div>
                );
              })()}

              <div className="flex gap-2 pt-1.5">
                <button
                  type="button"
                  onClick={() => setShowCheckInModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-xs"
                >
                  Valider l'Arrivée (Check-In)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CHECK-OUT & BILL GENERATION */}
      {showCheckOutModal && selectedRoom && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[95vh] overflow-y-auto p-6 shadow-xl space-y-6">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Génération de Facture & Check-Out</h3>
                <p className="text-xs text-slate-500 mt-1">Solde et extras pour le {selectedRoom.name}</p>
              </div>
              <button 
                onClick={() => setShowCheckOutModal(false)}
                className="text-slate-400 hover:text-slate-600 font-semibold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Invoice Breakdown calculation */}
            {(() => {
              const activeRes = getActiveReservation(selectedRoom.id);
              if (!activeRes) return <div className="text-xs text-rose-600">Aucun enregistrement trouvé.</div>;
              
              const extras = getRestaurantCharges(selectedRoom.id);
              const lodgingTotal = activeRes.totalAmount;
              const lodgingPaid = activeRes.paidAmount;
              const lodgingOutstanding = lodgingTotal - lodgingPaid;
              const totalOutstandingBill = lodgingOutstanding + extras.total;

              return (
                <div className="space-y-4 text-xs">
                  {/* Guest Meta info */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5 mb-2">
                      <User className="w-4 h-4 text-slate-400" />
                      {activeRes.guestName}
                    </div>
                    <div className="grid grid-cols-2 gap-y-1.5 text-slate-500">
                      <span>Téléphone :</span>
                      <span className="font-medium text-slate-800">{activeRes.guestPhone}</span>
                      <span>Arrivée / Départ :</span>
                      <span className="font-medium text-slate-800">{activeRes.checkInDate} &rarr; {activeRes.checkOutDate}</span>
                      <span>ID Enregistrement :</span>
                      <span className="font-mono text-[10px] text-orange-800 font-bold">{activeRes.id}</span>
                    </div>
                  </div>

                  {/* Pricing lines breakdown */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="p-3">Détail du Service</th>
                          <th className="p-3 text-right">Tarif</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {/* Lodging */}
                        <tr>
                          <td className="p-3">
                            <span className="font-semibold text-slate-800">Frais de séjour hôtelier</span>
                            <span className="block text-[10px] text-slate-400">
                              {calculateNights(activeRes.checkInDate, activeRes.checkOutDate)} nuit(s) à {selectedRoom.pricePerNight.toLocaleString('fr-FR')} F
                            </span>
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-slate-900">
                            {lodgingTotal.toLocaleString('fr-FR')} F
                          </td>
                        </tr>

                        {/* Lodging deposit already paid */}
                        {lodgingPaid > 0 && (
                          <tr className="bg-emerald-50/20 text-emerald-800">
                            <td className="p-3">
                              <span>Acompte d'arrivée déduit</span>
                              <span className="block text-[10px] text-slate-400">Encaissé le jour du check-in</span>
                            </td>
                            <td className="p-3 text-right font-mono font-bold">
                              -{lodgingPaid.toLocaleString('fr-FR')} F
                            </td>
                          </tr>
                        )}

                        {/* Restaurant Extras (POS bills charged to this room ID) */}
                        {extras.total > 0 ? (
                          <>
                            <tr className="bg-orange-50/20">
                              <td className="p-3 text-orange-900" colSpan={2}>
                                <div className="font-bold flex items-center gap-1">
                                  <span>Extras de Restauration Maquis</span>
                                </div>
                              </td>
                            </tr>
                            {extras.orders.map((ord, idx) => (
                              <tr key={ord.id} className="text-slate-600 bg-orange-50/10">
                                <td className="p-3 pl-6">
                                  <span>{ord.tableNumber} - Commande du {new Date(ord.createdAt).toLocaleDateString('fr-FR')}</span>
                                  <span className="block text-[10px] text-slate-400">
                                    {ord.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                                  </span>
                                </td>
                                <td className="p-3 text-right font-mono font-semibold">
                                  {ord.totalAmount.toLocaleString('fr-FR')} F
                                </td>
                              </tr>
                            ))}
                          </>
                        ) : (
                          <tr>
                            <td className="p-3 text-slate-400 italic" colSpan={2}>
                              Aucun extra resto chargé sur cette chambre.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Outlay summaries */}
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 font-medium">
                    <div className="flex justify-between text-emerald-950 font-bold text-base">
                      <span>Reste à Payer (Solde global) :</span>
                      <span>{totalOutstandingBill.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  </div>

                  {/* Payment method selector */}
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1.5">Méthode d'encaissement du solde :</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'wave', label: 'Wave (CI)' },
                        { id: 'orange_money', label: 'Orange Money' },
                        { id: 'mtn', label: 'MTN MoMo' },
                        { id: 'cash', label: 'Espèces' },
                        { id: 'card', label: 'Carte Bancaire' }
                      ].map((pay) => (
                        <button
                          key={pay.id}
                          type="button"
                          onClick={() => setCheckoutPaymentMethod(pay.id as any)}
                          className={`py-2 px-1 text-center font-semibold rounded-lg border text-[10px] ${
                            checkoutPaymentMethod === pay.id 
                              ? 'bg-orange-500 text-white border-orange-500 shadow-xs' 
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {pay.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Money number input */}
                  {['wave', 'orange_money', 'mtn'].includes(checkoutPaymentMethod) && (
                    <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-100/50 space-y-2">
                      <label className="block text-slate-700 font-bold text-xs">
                        Numéro de téléphone Mobile Money (CI) :
                      </label>
                      <input
                        type="tel"
                        placeholder="Ex: 0707070707"
                        value={mobileMoneyNumber}
                        onChange={(e) => setMobileMoneyNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                      />
                      <span className="text-[9px] text-slate-400 block leading-tight">
                        Un SMS / une invite USSD de confirmation sera envoyé à ce numéro de téléphone.
                      </span>
                    </div>
                  )}

                  {/* Folio Payment History log list */}
                  <div className="border-t border-slate-100 pt-3 space-y-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                      Historique des Tentatives de Règlement (Folio)
                    </span>
                    {paymentIntents.filter(pi => pi.sourceId === activeRes.id && pi.sourceEntity === 'folio_charge').length === 0 ? (
                      <span className="text-[10px] text-slate-400 italic block">Aucune transaction Mobile Money enregistrée pour ce séjour.</span>
                    ) : (
                      <div className="max-h-28 overflow-y-auto space-y-1.5">
                        {paymentIntents.filter(pi => pi.sourceId === activeRes.id && pi.sourceEntity === 'folio_charge').map(pi => (
                          <div key={pi.id} className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-[10px] flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold uppercase font-mono text-slate-800">{pi.provider}</span>
                                <span className="text-[8px] font-mono text-slate-400">({pi.id})</span>
                              </div>
                              <span className="text-slate-500 block font-mono">Tél: {pi.phoneNumber} • {pi.amount.toLocaleString('fr-FR')} F</span>
                            </div>
                            <div className="text-right">
                              <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                                pi.status === 'succeeded' ? 'bg-emerald-50 text-emerald-700' :
                                pi.status === 'failed' ? 'bg-rose-50 text-rose-700' :
                                'bg-amber-50 text-amber-700'
                              }`}>
                                {pi.status}
                              </span>
                              {pi.status === 'pending' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActivePaymentIntent(pi);
                                    setPaymentGatewayLogs(pi.metadata?.history || []);
                                    setShowPaymentGatewayModal(true);
                                  }}
                                  className="block text-[8px] text-orange-600 hover:underline font-bold mt-0.5"
                                >
                                  Ouvrir Simulation
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Debtor / Bypass authorization section */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2 text-xs text-left">
                    <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={authorizeDebtorCheckout}
                        onChange={(e) => setAuthorizeDebtorCheckout(e.target.checked)}
                        className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 w-4 h-4"
                      />
                      <span>Autoriser Départ Débiteur (Bypass de caisse)</span>
                    </label>

                    {authorizeDebtorCheckout && (
                      <div className="space-y-2.5 border-t border-slate-200 pt-2 text-left">
                        <div>
                          <label className="block text-[10px] text-slate-500 font-semibold mb-1">Code Secret Manager d'Autorisation (Passcode) *</label>
                          <input
                            type="password"
                            required
                            placeholder="Code secret requis (Ex: 1234)"
                            value={managerPasscode}
                            onChange={(e) => setManagerPasscode(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 font-semibold mb-1">Nom de l'Agent de Réception Responsable *</label>
                          <input
                            type="text"
                            required
                            placeholder="Ex: Jean Dupont"
                            value={checkoutStaffName}
                            onChange={(e) => setCheckoutStaffName(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 font-semibold mb-1">Motif de Crédit / Notes de Facturation Différée *</label>
                          <textarea
                            required
                            placeholder="Justifier le départ débiteur du client..."
                            value={debtorBillingNotes}
                            onChange={(e) => setDebtorBillingNotes(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs h-12"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Disclaimer / Notes */}
                  <p className="text-[10px] text-slate-400 leading-relaxed text-center">
                    En validant ce départ, le statut de la chambre passera automatiquement à <strong className="text-orange-800">"Ménage requis"</strong> et la facture sera enregistrée en comptabilité ERP.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setInvoiceReservation(activeRes);
                      setShowFolioInvoiceModal(true);
                    }}
                    className="w-full py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs"
                  >
                    <FileText className="w-4 h-4 text-orange-700" />
                    Visualiser & Imprimer la Facture Folio
                  </button>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowCheckOutModal(false)}
                      className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={handleCheckOutSubmit}
                      className={`w-1/2 py-2.5 font-semibold rounded-xl shadow-xs transition-colors ${
                        authorizeDebtorCheckout 
                          ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {authorizeDebtorCheckout ? "Autoriser & Libérer Débiteur" : "Encaisser & Libérer"}
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: PMS MOBILE MONEY UNIFIED PAYMENT INTENT SANDBOX
          ======================================================== */}
      {showPaymentGatewayModal && activePaymentIntent && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-2xl max-w-4xl w-full flex flex-col md:flex-row gap-6">
            
            {/* Left: Intent Info & Audit Trail */}
            <div className="flex-1 space-y-4 text-left">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <span className={`p-1.5 rounded-lg text-slate-900 ${activePaymentIntent.provider === 'wave' ? 'bg-[#4c34e0]' : 'bg-[#f16e00]'}`}>
                  <Smartphone className="w-5 h-5 text-white" />
                </span>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight text-white">Terminal PMS Mobile Money</h3>
                  <p className="text-[10px] text-slate-400 font-mono font-bold uppercase">{activePaymentIntent.provider} Côte d'Ivoire</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-[9px] text-slate-500 uppercase font-black block">ID de l'Intention</span>
                  <span className="font-mono font-extrabold text-slate-200">{activePaymentIntent.id}</span>
                </div>
                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-[9px] text-slate-500 uppercase font-black block">Référence Interne</span>
                  <span className="font-mono font-extrabold text-slate-200">{activePaymentIntent.reference}</span>
                </div>
                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-[9px] text-slate-500 uppercase font-black block">Numéro Client</span>
                  <span className="font-mono font-extrabold text-slate-200">{activePaymentIntent.phoneNumber}</span>
                </div>
                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-[9px] text-slate-500 uppercase font-black block">Montant Facturé</span>
                  <span className="font-mono font-extrabold text-emerald-400 text-sm font-black">{(activePaymentIntent.amount || 0).toLocaleString('fr-FR')} F CFA</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">Statut Actuel du Provider</span>
                <div className="flex items-center gap-2 p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <span className={`w-2 h-2 rounded-full animate-ping ${
                    activePaymentIntent.status === 'succeeded' ? 'bg-emerald-500' :
                    activePaymentIntent.status === 'failed' ? 'bg-rose-500' :
                    'bg-amber-500'
                  }`} />
                  <span className={`text-[11px] font-mono uppercase font-black ${
                    activePaymentIntent.status === 'succeeded' ? 'text-emerald-400' :
                    activePaymentIntent.status === 'failed' ? 'text-rose-400' :
                    'text-amber-400'
                  }`}>
                    {activePaymentIntent.status}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-auto">Validé via Webhook</span>
                </div>
              </div>

              {/* State History / Audit Trail */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-slate-400" /> Trace d'Audit de la Transaction
                </span>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 h-32 overflow-y-auto font-mono text-[10px] space-y-1.5 text-slate-300">
                  {(paymentGatewayLogs || []).map((log, idx) => (
                    <div key={idx} className="flex gap-1">
                      <span className="text-slate-600 font-bold shrink-0">&gt;</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Simulation Controller */}
            <div className="w-full md:w-80 bg-slate-950/50 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between text-left">
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-400 border-b border-slate-800 pb-2">
                  CONSOLE DE SIMULATION PROVIDER
                </div>

                <div className="bg-amber-950/20 border border-amber-900/40 p-3 rounded-xl text-[10px] text-amber-300 leading-relaxed">
                  <strong>Source de Vérité</strong> : Un retour de navigateur n'est pas suffisant pour valider une vente. Seul le webhook asynchrone sécurisé du provider confirme le paiement.
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block">Simuler l'Événement Webhook</span>
                  <button
                    type="button"
                    onClick={() => handleSimulateWebhookPMS('success')}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/20"
                  >
                    <Check className="w-4 h-4" />
                    <span>Simuler Webhook Succès</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSimulateWebhookPMS('failure')}
                    className="w-full py-2.5 bg-rose-900/80 hover:bg-rose-900 text-rose-100 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <X className="w-4 h-4" />
                    <span>Simuler Webhook Échec</span>
                  </button>
                </div>

                <div className="border-t border-slate-800 my-4 pt-3 space-y-2">
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-orange-500" /> Rapprochement Manuel
                  </span>
                  <p className="text-[9px] text-slate-400 leading-relaxed">
                    Si l'API du provider ou le webhook est en panne, forcez le règlement après vérification du reçu SMS.
                  </p>

                  <div className="space-y-1.5">
                    <input
                      type="text"
                      placeholder="N° reçu Wave/OM ou motif..."
                      value={reconciliationReason}
                      onChange={(e) => setReconciliationReason(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 text-white rounded font-mono text-xs placeholder:text-slate-600 focus:outline-none focus:border-orange-500/50"
                    />
                    <select
                      value={reconciledByRole}
                      onChange={(e) => setReconciledByRole(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 text-white rounded font-bold text-xs focus:outline-none"
                    >
                      <option value="Comptable">Comptable (Valide)</option>
                      <option value="Gérant d'Équipe">Gérant d'Équipe</option>
                      <option value="Auditeur Senior">Auditeur Senior</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleManualReconcileInPMS()}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs rounded-xl transition-all"
                    >
                      Forcer le Règlement Manuel
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentGatewayModal(false);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
                >
                  Fermer
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: UNIFIED INVOICE (FACTURE FOLIO CLIENT) WITH QR
          ======================================================== */}
      {showFolioInvoiceModal && invoiceReservation && (() => {
        const matchedRoom = rooms.find(r => r.id === invoiceReservation.roomId);
        const nights = calculateNights(invoiceReservation.checkInDate, invoiceReservation.checkOutDate);
        const lodgingTotal = matchedRoom ? matchedRoom.pricePerNight * nights : 0;
        const lodgingPaid = invoiceReservation.paidAmount || 0;

        // Calculate Maquis extras loaded to this room
        const roomOrders = (activeOrders || []).filter(o => o.roomIdForCharge === invoiceReservation.roomId && o.status !== 'paid');
        const extrasTotal = roomOrders.reduce((sum, o) => sum + o.totalAmount, 0);
        
        const grandTotal = lodgingTotal + extrasTotal;
        const totalOutstanding = grandTotal - lodgingPaid;

        // Formatted tax information
        const vatRate = settings.vatRate || 18;
        const totalHT = Math.round(grandTotal / (1 + (vatRate / 100)));
        const vatAmount = grandTotal - totalHT;

        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-55 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-slate-200 text-slate-800 rounded-3xl p-6 shadow-2xl max-w-2xl w-full space-y-6 max-h-[90vh] overflow-y-auto animate-fade-in relative">
              <button 
                onClick={() => setShowFolioInvoiceModal(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 transition-all text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Invoice Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-slate-100 gap-4">
                <div>
                  <div className="text-xs uppercase font-mono tracking-widest font-black text-orange-600 mb-1">
                    Établissement Agréé
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Hôtel & Maquis de l'Or</h3>
                  <p className="text-xs text-slate-500">Quartier Kennedy, Bouaké, Côte d'Ivoire</p>
                  <p className="text-[10px] text-slate-400 font-mono">Tél: +225 07 08 09 10 11 | RCCM: CI-ABJ-03-2026-B12</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-right self-stretch md:self-auto flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block">Numéro de Facture</span>
                  <span className="text-sm font-black text-slate-900 font-mono">FAC-{invoiceReservation.id}</span>
                  <span className="text-[9px] text-slate-500 block mt-1 font-mono">Émise le: {new Date().toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              {/* Status Header */}
              <div className="bg-orange-50/50 border border-orange-100/80 p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-orange-800 uppercase tracking-widest block font-mono">Type de Facture</span>
                  <span className="text-xs font-extrabold text-slate-800">Folio Centralisé & Facturation Unifiée</span>
                </div>
                <span className="px-2.5 py-1 bg-orange-600 text-white font-mono text-[9px] font-bold rounded-full uppercase tracking-wider animate-pulse">
                  Facture Intermédiaire
                </span>
              </div>

              {/* Guest metadata */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Client (Voyageur)</span>
                  <div className="font-bold text-slate-900">{invoiceReservation.guestName}</div>
                  <div className="text-slate-500">{invoiceReservation.guestPhone}</div>
                  <div className="text-slate-500">{invoiceReservation.guestEmail || 'Aucun e-mail'}</div>
                </div>
                <div className="space-y-1 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 font-mono">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Séjour Hôtelier</span>
                  <div className="text-slate-800 text-xs font-semibold">Chambre {matchedRoom?.name || 'N/A'} ({matchedRoom?.type === 'studio' ? 'Studio Climatisé' : matchedRoom?.type === 'apartment' ? 'Appartement' : 'Chambre Classique'})</div>
                  <div className="text-slate-500 text-[11px]">Du {invoiceReservation.checkInDate} au {invoiceReservation.checkOutDate}</div>
                  <div className="text-slate-500 text-[11px]">{nights} nuit(s) à {matchedRoom?.pricePerNight.toLocaleString('fr-FR')} F</div>
                </div>
              </div>

              {/* Billing table details */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Désignation de la prestation</th>
                      <th className="p-3 text-center">Quantité / Nuits</th>
                      <th className="p-3 text-right">Montant TTC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {/* Hébergement */}
                    <tr>
                      <td className="p-3 font-semibold text-slate-800">
                        Séjour en Chambre {matchedRoom?.name}
                        <span className="block text-[10px] text-slate-400 font-normal">Base nuitée hôtelière</span>
                      </td>
                      <td className="p-3 text-center font-mono">{nights} nuit(s)</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">{lodgingTotal.toLocaleString('fr-FR')} F</td>
                    </tr>

                    {/* Extras */}
                    {roomOrders.length > 0 ? (
                      roomOrders.map((ord, idx) => (
                        <tr key={ord.id} className="bg-orange-50/5">
                          <td className="p-3">
                            <span className="font-semibold text-orange-950">Extras Restaurant {ord.tableNumber}</span>
                            <span className="block text-[10px] text-slate-400">
                              {ord.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                            </span>
                            <span className="block text-[9px] text-slate-400 italic">Code commande: {ord.id} | Imputée le {new Date(ord.createdAt).toLocaleDateString('fr-FR')}</span>
                          </td>
                          <td className="p-3 text-center font-mono">{ord.items.reduce((sum, i) => sum + i.quantity, 0)} plats/boiss.</td>
                          <td className="p-3 text-right font-mono font-semibold text-slate-900">{ord.totalAmount.toLocaleString('fr-FR')} F</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="p-3 text-slate-400 italic" colSpan={3}>
                          Aucun extra de restauration imputé sur cette chambre pour le moment.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Split section: Invoice Summary & QR code payment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                
                {/* Financial Totals block */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-500">
                    <span>Total HT :</span>
                    <span>{totalHT.toLocaleString('fr-FR')} F</span>
                  </div>
                  <div className="flex justify-between text-slate-500 border-b border-slate-200 pb-2">
                    <span>TVA ({vatRate}%) :</span>
                    <span>{vatAmount.toLocaleString('fr-FR')} F</span>
                  </div>
                  
                  <div className="flex justify-between text-slate-800 font-bold pt-1">
                    <span>TOTAL TTC :</span>
                    <span>{grandTotal.toLocaleString('fr-FR')} F</span>
                  </div>
                  
                  {lodgingPaid > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Acompte d'entrée (-) :</span>
                      <span>{lodgingPaid.toLocaleString('fr-FR')} F</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-dashed border-slate-300">
                    <span>SOLDE DU CLIENT :</span>
                    <span className="text-orange-700">{totalOutstanding.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                </div>

                {/* QR Code section */}
                <div className="bg-orange-50/40 border border-orange-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-2.5">
                  <span className="text-[10px] font-bold text-orange-900 uppercase tracking-widest font-mono">
                    Scan & Pay - Mobile Money
                  </span>
                  
                  {/* High fidelity simulated QR Code SVG */}
                  <div className="w-24 h-24 bg-white p-2 rounded-xl border border-orange-100 flex items-center justify-center relative shadow-xs">
                    <svg className="w-full h-full text-slate-800" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2 2h6v6H2V2zm1 1v4h4V3H3zm11-1h6v6h-6V2zm1 1v4h4V3h-4zM2 14h6v6H2v-6zm1 1v4h4v-4H3zm13 1h2v2h-2v-2zm3-3h2v2h-2v-2zm-3-3h2v2h-2v-2zm3-3h2v2h-2V7zm-9 7h2v2h-2v-2zm3 3h2v2h-2v-2zm-3 3h2v2h-2v-2zm9-3h2v5h-2v-5zm-3-3h2v2h-2v-2zm3-3h2v2h-2v-2zm-6 6h2v2h-2v-2zm3 3h2v2h-2v-2zm3-9h2v2h-2V5z" />
                    </svg>
                    {/* Centered Wave/OM style orange point */}
                    <div className="absolute inset-0 m-auto w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center shadow-xs">
                      <span className="text-[8px] font-black text-white">XOF</span>
                    </div>
                  </div>
                  
                  <div className="text-[10px] leading-relaxed text-slate-600">
                    <strong className="text-slate-800 font-bold block">Paiement Instantané Sans Contact</strong>
                    Scannez pour régler <strong className="text-orange-800">{totalOutstanding.toLocaleString('fr-FR')} F</strong> via Wave, Orange ou MTN
                  </div>
                </div>

              </div>

              {/* Disclaimer */}
              <div className="text-[10px] text-slate-400 leading-relaxed italic text-center pt-2 border-t border-dashed border-slate-100">
                "Hôtel & Maquis de l'Or vous remercie pour votre confiance. Facture certifiée conforme aux règles de la DGI."
              </div>

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    alert(`IMPRESSION DE FACTURE :\nUne commande d'impression a été transmise à l'imprimante réseau de la Réception (Epson Caisse Thermique).\nFacture FAC-${invoiceReservation.id} imprimée avec succès.`);
                  }}
                  className="w-full sm:w-1/2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Printer className="w-4 h-4" />
                  Imprimer Ticket & Facture (DGI)
                </button>
                <button
                  type="button"
                  onClick={() => setShowFolioInvoiceModal(false)}
                  className="w-full sm:w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                >
                  Fermer l'aperçu
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ========================================================
          MODAL: AJOUT ET CONFIGURATION DE CHAMBRE / STUDIO
          ======================================================== */}
      {showRoomInventoryModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 text-slate-800 rounded-3xl p-6 shadow-2xl max-w-xl w-full space-y-5 max-h-[90vh] overflow-y-auto animate-fade-in relative">
            <button 
              onClick={() => setShowRoomInventoryModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 transition-all text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-orange-600" />
                {editingRoom ? `Modifier la Chambre : ${editingRoom.name}` : 'Créer une Nouvelle Chambre / Studio'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {editingRoom ? "Ajustez les caractéristiques techniques et tarifs de la pièce existante." : "Déclarez une nouvelle capacité d'hébergement suite aux travaux d'extension."}
              </p>
            </div>

            <form onSubmit={handleSaveRoom} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* ID / Numero de chambre */}
                <div>
                  <label className="block text-slate-500 font-bold mb-1 uppercase tracking-wide text-[10px]">
                    N° d'identification unique (ID) *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingRoom}
                    placeholder="Ex: 104, STUDIO-12, VIP-A"
                    value={roomFormId}
                    onChange={(e) => setRoomFormId(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                    className="w-full px-3 py-2 bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-orange-500 text-slate-800"
                  />
                  <span className="text-[9px] text-slate-400 block mt-1">Identifiant technique interne (non modifiable ultérieurement).</span>
                </div>

                {/* Nom d'affichage */}
                <div>
                  <label className="block text-slate-500 font-bold mb-1 uppercase tracking-wide text-[10px]">
                    Nom / Numéro d'affichage *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Chambre 4 (SB) ou Studio 12"
                    value={roomFormName}
                    onChange={(e) => setRoomFormName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-orange-500 text-slate-800"
                  />
                  <span className="text-[9px] text-slate-400 block mt-1">Nom public visible par la réception et sur la facture.</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Type de piece */}
                <div>
                  <label className="block text-slate-500 font-bold mb-1 uppercase tracking-wide text-[10px]">
                    Catégorie de Pièce *
                  </label>
                  <select
                    value={roomFormType}
                    onChange={(e: any) => {
                      setRoomFormType(e.target.value);
                      // Suggest generic values based on type
                      if (e.target.value === 'studio') {
                        setRoomFormMaxGuests(2);
                        setRoomFormPrice(25000);
                      } else if (e.target.value === 'apartment') {
                        setRoomFormMaxGuests(4);
                        setRoomFormPrice(45000);
                      } else {
                        setRoomFormMaxGuests(2);
                        setRoomFormPrice(15000);
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-orange-500 text-slate-800"
                  >
                    <option value="room">Chambre Classique</option>
                    <option value="studio">Studio (ch + salon)</option>
                    <option value="apartment">Appartement F2/F3</option>
                  </select>
                </div>

                {/* Tarif par nuit */}
                <div>
                  <label className="block text-slate-500 font-bold mb-1 uppercase tracking-wide text-[10px]">
                    Tarif Journalier (FCFA) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={roomFormPrice}
                    onChange={(e) => setRoomFormPrice(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-orange-500 text-slate-800"
                  />
                </div>

                {/* Max Voyageurs */}
                <div>
                  <label className="block text-slate-500 font-bold mb-1 uppercase tracking-wide text-[10px]">
                    Capacité Maximale *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={10}
                    value={roomFormMaxGuests}
                    onChange={(e) => setRoomFormMaxGuests(parseInt(e.target.value) || 2)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-orange-500 text-slate-800"
                  />
                </div>
              </div>

              {/* Equipements Minimum (Amenities list) */}
              <div className="space-y-2">
                <label className="block text-slate-500 font-bold uppercase tracking-wide text-[10px]">
                  Équipements Minimum & Confort
                </label>
                <p className="text-[10px] text-slate-400">Sélectionnez les équipements fournis dans cette pièce pour faciliter la distinction.</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-4 border border-slate-200 rounded-2xl">
                  {[
                    { label: 'Climatisation', icon: Wind },
                    { label: 'Télévision Smart', icon: Tv },
                    { label: 'Machine à café', icon: Coffee },
                    { label: 'Wi-Fi Fibre', icon: Wifi },
                    { label: 'SdB Privée', icon: CheckCircle },
                    { label: 'Mini-bar', icon: CheckCircle },
                    { label: 'Eau Chaude', icon: CheckCircle },
                    { label: 'Espace Bureau', icon: CheckCircle },
                    { label: 'Bouilloire Élec.', icon: CheckCircle },
                    { label: 'Kitchenette', icon: CheckCircle },
                    { label: 'Terrasse/Balcon', icon: CheckCircle }
                  ].map((amenity) => {
                    const isChecked = roomFormFeatures.includes(amenity.label);
                    const IconComp = amenity.icon;

                    return (
                      <button
                        key={amenity.label}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setRoomFormFeatures(roomFormFeatures.filter(f => f !== amenity.label));
                          } else {
                            setRoomFormFeatures([...roomFormFeatures, amenity.label]);
                          }
                        }}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                          isChecked 
                            ? 'bg-orange-50 border-orange-200 text-orange-900 font-bold' 
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        <IconComp className={`w-3.5 h-3.5 shrink-0 ${isChecked ? 'text-orange-600' : 'text-slate-400'}`} />
                        <span className="text-[10px] truncate">{amenity.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRoomInventoryModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold rounded-xl shadow-md shadow-orange-600/10 transition-all"
                >
                  {editingRoom ? 'Sauvegarder les modifications' : 'Créer & Ajouter'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
