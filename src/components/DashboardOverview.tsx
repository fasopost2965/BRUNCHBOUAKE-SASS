import React from 'react';
import { 
  DollarSign, 
  Users, 
  BedDouble, 
  CheckSquare, 
  TrendingUp, 
  UtensilsCrossed, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus, 
  Calendar,
  Layers,
  Server,
  Terminal,
  CheckCircle2,
  XCircle,
  Info,
  ShieldAlert,
  RefreshCw,
  Play,
  Send
} from 'lucide-react';
import { Room, Reservation, Transaction, Task, GuestRecord } from '../types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface DashboardProps {
  rooms: Room[];
  reservations: Reservation[];
  transactions: Transaction[];
  tasks: Task[];
  onNavigate: (tab: 'pms' | 'pos' | 'erp' | 'staff' | 'crm') => void;
  onQuickCheckIn: () => void;
  onQuickPOSOrder: () => void;
  onQuickAddTask: () => void;
  currentRole?: string;
  onAddReservation?: (res: Reservation) => void;
  onAddGuest?: (guest: GuestRecord) => void;
}

export default function DashboardOverview({
  rooms,
  reservations,
  transactions,
  tasks,
  onNavigate,
  onQuickCheckIn,
  onQuickPOSOrder,
  onQuickAddTask,
  currentRole,
  onAddReservation,
  onAddGuest
}: DashboardProps) {
  
  // Laravel 11 API Gateway live monitor state
  const [apiLogs, setApiLogs] = React.useState<any[]>([
    {
      id: 1,
      timestamp: new Date(Date.now() - 5000).toISOString(),
      method: 'POST',
      path: '/api/v1/channel-manager/ingest',
      status: 201,
      statusText: 'Created',
      clientIp: '185.230.124.5',
      tenantId: 'tenant-bouake-kennedy',
      source: 'Booking.com',
      payload: {
        booking_id: 'B-8739201',
        room_type: 'studio',
        guest_name: 'Amadou Diallo',
        guest_phone: '+225 07 45 89 12 34',
        check_in_date: '2026-07-10',
        check_out_date: '2026-07-15',
        number_of_guests: 2,
        total_amount: 125000,
        source: 'Booking.com'
      },
      response: {
        success: true,
        message: 'Booking successfully ingested',
        data: {
          id: 'res-9483',
          tenant_id: 'tenant-bouake-kennedy',
          room_id: 'rm-102',
          guest_name: 'Amadou Diallo',
          status: 'confirmed',
          total_amount: 125000,
          security_pin: '3941',
          access_code: '483921',
          source_of_stay: 'Booking.com'
        },
        idempotency_status: 'CREATED'
      },
      whatsAppTriggered: true,
      whatsAppPhone: '+225 07 45 89 12 34'
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 35000).toISOString(),
      method: 'POST',
      path: '/api/v1/channel-manager/ingest',
      status: 422,
      statusText: 'Unprocessable Entity',
      clientIp: '185.230.124.5',
      tenantId: 'tenant-bouake-kennedy',
      source: 'Airbnb',
      payload: {
        booking_id: 'A-2049581',
        room_type: 'apartment',
        guest_name: 'Clarisse Kouamé',
        guest_phone: '+225 05 66 12 99 88',
        check_in_date: '2026-07-06',
        check_out_date: '2026-07-12',
        number_of_guests: 4,
        total_amount: 350000,
        source: 'Airbnb'
      },
      response: {
        error: "Aucune chambre de type apartment n'est libre pour les dates sélectionnées.",
        code: 'OVERBOOKING_PREVENTION'
      },
      whatsAppTriggered: false
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 120000).toISOString(),
      method: 'POST',
      path: '/api/v1/channel-manager/ingest',
      status: 401,
      statusText: 'Unauthorized',
      clientIp: '82.102.45.18',
      tenantId: 'tenant-bouake-kennedy',
      source: 'Unknown',
      payload: {
        booking_id: 'B-9920194'
      },
      response: {
        error: 'Unauthorized integration token',
        code: 'UNAUTHORIZED'
      },
      whatsAppTriggered: false
    }
  ]);

  const [expandedLogId, setExpandedLogId] = React.useState<number | null>(null);

  const handleSimulateApiCall = (type: 'success' | 'overbooking' | 'unauthorized' | 'bad_request') => {
    const randomBookingId = Math.floor(1000000 + Math.random() * 9000000);
    const guestNames = ['Koffi Yao', 'Mariam Koné', 'Zana Soro', 'Adjoua Kouassi', 'Fatou Sylla', 'Test WhatsApp Pro'];
    const selectedGuestName = guestNames[Math.floor(Math.random() * guestNames.length)];
    
    // Default to the user's specific test WhatsApp Business number if they select "Test WhatsApp Pro"
    const randomPhone = selectedGuestName === 'Test WhatsApp Pro' 
      ? '+212777346787' 
      : `+225 07 ${Math.floor(10 + Math.random() * 89)} ${Math.floor(10 + Math.random() * 89)} ${Math.floor(10 + Math.random() * 89)} ${Math.floor(10 + Math.random() * 89)}`;
      
    const randomSecPin = Math.floor(1000 + Math.random() * 9000).toString();
    const randomAccessCode = Math.floor(100000 + Math.random() * 900000).toString();

    let newLog: any = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      method: 'POST',
      path: '/api/v1/channel-manager/ingest',
      clientIp: '185.230.124.' + Math.floor(1 + Math.random() * 254),
    };

    if (type === 'success') {
      const reservationId = `res-${Math.floor(1000 + Math.random() * 9000)}`;
      newLog = {
        ...newLog,
        status: 201,
        statusText: 'Created',
        tenantId: 'tenant-bouake-kennedy',
        source: 'Booking.com',
        payload: {
          booking_id: `B-${randomBookingId}`,
          room_type: 'studio',
          guest_name: selectedGuestName,
          guest_phone: randomPhone,
          check_in_date: '2026-07-15',
          check_out_date: '2026-07-18',
          number_of_guests: 2,
          total_amount: 75000,
          source: 'Booking.com'
        },
        response: {
          success: true,
          message: 'Booking successfully ingested',
          data: {
            id: reservationId,
            tenant_id: 'tenant-bouake-kennedy',
            room_id: 'rm-101',
            guest_name: selectedGuestName,
            status: 'confirmed',
            total_amount: 75000,
            security_pin: randomSecPin,
            access_code: randomAccessCode,
            source_of_stay: 'Booking.com'
          },
          idempotency_status: 'CREATED'
        },
        whatsAppTriggered: true,
        whatsAppPhone: randomPhone
      };

      if (onAddReservation) {
        onAddReservation({
          id: reservationId,
          tenantId: 'tenant-bouake-kennedy',
          roomId: 'rm-101',
          guestName: selectedGuestName,
          guestPhone: randomPhone,
          guestEmail: `${selectedGuestName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
          checkInDate: '2026-07-15',
          checkOutDate: '2026-07-18',
          numberOfGuests: 2,
          status: 'confirmed',
          totalAmount: 75000,
          paidAmount: 0,
          paymentStatus: 'unpaid',
          specialRequests: 'Réservation de test simulée via l\'API REST Gateway Laravel.',
          securityPin: randomSecPin,
          accessCode: randomAccessCode,
          createdAt: new Date().toISOString(),
          createdBy: 'API Laravel 11 Gateway',
          sourceModule: 'Laravel API Gateway'
        });
      }

      if (onAddGuest) {
        onAddGuest({
          id: `g-${Date.now().toString().slice(-4)}`,
          name: selectedGuestName,
          phone: randomPhone,
          email: `${selectedGuestName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
          nationality: 'Ivoirienne',
          idNumber: '',
          address: 'Bouaké, Kennedy',
          notes: 'Client importé automatiquement de Booking.com via l\'API REST Laravel 11.',
          visitCount: 1,
          totalSpent: 0
        });
      }
    } else if (type === 'overbooking') {
      newLog = {
        ...newLog,
        status: 422,
        statusText: 'Unprocessable Entity',
        tenantId: 'tenant-bouake-kennedy',
        source: 'Airbnb',
        payload: {
          booking_id: `A-${randomBookingId}`,
          room_type: 'room',
          guest_name: selectedGuestName,
          guest_phone: randomPhone,
          check_in_date: '2026-07-06',
          check_out_date: '2026-07-08',
          number_of_guests: 1,
          total_amount: 30000,
          source: 'Airbnb'
        },
        response: {
          error: "Aucune chambre de type room n'est libre pour les dates sélectionnées.",
          code: 'OVERBOOKING_PREVENTION'
        },
        whatsAppTriggered: false
      };
    } else if (type === 'unauthorized') {
      newLog = {
        ...newLog,
        status: 401,
        statusText: 'Unauthorized',
        tenantId: 'tenant-bouake-kennedy',
        source: 'Unknown',
        payload: {
          booking_id: `X-${randomBookingId}`,
          room_type: 'studio'
        },
        response: {
          error: 'Unauthorized integration token',
          code: 'UNAUTHORIZED'
        },
        whatsAppTriggered: false
      };
    } else if (type === 'bad_request') {
      newLog = {
        ...newLog,
        status: 400,
        statusText: 'Bad Request',
        tenantId: '',
        source: 'Expedia',
        payload: {
          booking_id: `E-${randomBookingId}`,
          room_type: 'apartment'
        },
        response: {
          error: 'Missing Tenant Isolation Header',
          code: 'MISSING_TENANT_ID'
        },
        whatsAppTriggered: false
      };
    }

    setApiLogs(prev => [newLog, ...prev.slice(0, 9)]);
    setExpandedLogId(newLog.id);
  };

  // Calculations
  const occupiedRoomsCount = rooms.filter(r => r.status === 'occupied').length;
  const occupancyRate = Math.round((occupiedRoomsCount / rooms.length) * 100) || 0;
  
  const activeCheckIns = reservations.filter(r => r.status === 'checked-in').length;
  
  const totalRevenue = transactions
    .filter(t => t.type !== 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const lodgingRevenue = transactions
    .filter(t => t.type === 'lodging_payment')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const posRevenue = transactions
    .filter(t => t.type === 'pos_sale')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingTasks = tasks.filter(t => t.status !== 'completed').length;

  // Generate last 7 days for the charts based on actual transaction and reservation data
  const getLast7DaysData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0]; // "YYYY-MM-DD"
      
      // Calculate Occupancy for this day:
      // A room is occupied if a reservation is active (checkInDate <= dateStr and dateStr < checkOutDate)
      let occupiedCount = 0;
      rooms.forEach(room => {
        const isOccupied = reservations.some(r => 
          r.roomId === room.id &&
          r.status !== 'cancelled' &&
          r.checkInDate <= dateStr &&
          dateStr < r.checkOutDate
        );
        if (isOccupied) occupiedCount++;
      });
      const dayOccupancyRate = rooms.length > 0 ? Math.round((occupiedCount / rooms.length) * 100) : 0;

      // Calculate Revenue / Expenses for this day
      let lodgingRev = 0;
      let restaurantRev = 0;
      let expenses = 0;

      transactions.forEach(tx => {
        const txDateStr = tx.date.substring(0, 10);
        if (txDateStr === dateStr) {
          if (tx.type === 'lodging_payment') {
            lodgingRev += tx.amount;
          } else if (tx.type === 'pos_sale') {
            restaurantRev += tx.amount;
          } else if (tx.type === 'expense') {
            expenses += tx.amount;
          }
        }
      });

      // Format date for visual (e.g., "01 Juil")
      const dayLabel = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });

      data.push({
        date: dateStr,
        label: dayLabel,
        occupancy: dayOccupancyRate,
        occupiedRooms: occupiedCount,
        lodging: lodgingRev,
        restaurant: restaurantRev,
        revenue: lodgingRev + restaurantRev,
        expenses: expenses,
        profit: (lodgingRev + restaurantRev) - expenses
      });
    }
    return data;
  };

  const chartData = getLast7DaysData();

  return (
    <div className="space-y-6">
      {/* 1. KEY PERFORMANCE METRICS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Revenue or Operational Focus */}
        {(currentRole === 'admin' || currentRole === 'manager' || currentRole === 'accountant') ? (
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Chiffre d'Affaires</p>
                <h3 className="text-2xl font-bold text-slate-900 font-mono mt-1">
                  {(totalRevenue).toLocaleString('fr-FR')} <span className="text-xs font-sans text-slate-500 font-normal">FCFA</span>
                </h3>
              </div>
              <div className="p-2.5 bg-orange-50 text-orange-700 rounded-xl">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-xs text-emerald-600 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Hôtel: {lodgingRevenue.toLocaleString('fr-FR')} FCFA</span>
              <span className="text-slate-300">|</span>
              <span>Maquis: {posRevenue.toLocaleString('fr-FR')} FCFA</span>
            </div>
          </div>
        ) : currentRole === 'housekeeper' ? (
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Studios à Nettoyer</p>
                <h3 className="text-2xl font-bold text-slate-900 font-mono mt-1">
                  {rooms.filter(r => r.status === 'dirty').length} <span className="text-xs font-sans text-slate-500 font-normal">chambres sales</span>
                </h3>
              </div>
              <div className="p-2.5 bg-orange-50 text-orange-700 rounded-xl">
                <BedDouble className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-xs text-orange-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse mr-1"></span>
              <span>Ménage requis d'urgence pour remise en vente</span>
            </div>
          </div>
        ) : currentRole === 'receptionist' ? (
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Arrivées Prévues</p>
                <h3 className="text-2xl font-bold text-slate-900 font-mono mt-1">
                  {reservations.filter(r => r.status === 'confirmed').length} <span className="text-xs font-sans text-slate-500 font-normal">chambres à attribuer</span>
                </h3>
              </div>
              <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse mr-1"></span>
              En attente de check-in physique
            </p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Service Maquis POS</p>
                <h3 className="text-2xl font-bold text-slate-900 font-mono mt-1">
                  Actif <span className="text-xs font-sans text-slate-500 font-normal">Caisse Resto</span>
                </h3>
              </div>
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-xs text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1"></span>
              <span>Prise de commande rapide de tables</span>
            </div>
          </div>
        )}

        {/* Metric 2: Occupancy */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Taux d'Occupation</p>
              <h3 className="text-2xl font-bold text-slate-900 font-mono mt-1">
                {occupancyRate}%
              </h3>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
              <BedDouble className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-emerald-600 h-1.5 rounded-full" 
                style={{ width: `${occupancyRate}%` }}
              ></div>
            </div>
            <span className="shrink-0">{occupiedRoomsCount}/{rooms.length} Studios</span>
          </div>
        </div>

        {/* Metric 3: Active Guests */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Clients Résidents</p>
              <h3 className="text-2xl font-bold text-slate-900 font-mono mt-1">
                {activeCheckIns} <span className="text-sm font-sans text-slate-500 font-normal">chambres actives</span>
              </h3>
            </div>
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Enregistrés via fiches de police
          </p>
        </div>

        {/* Metric 4: Tasks */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tâches Opérationnelles</p>
              <h3 className="text-2xl font-bold text-slate-900 font-mono mt-1">
                {pendingTasks} <span className="text-sm font-sans text-slate-500 font-normal">en attente</span>
              </h3>
            </div>
            <div className="p-2.5 bg-purple-50 text-purple-700 rounded-xl">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 flex items-center justify-between">
            <span>Ménage, maintenance & resto</span>
            <span className="font-semibold text-purple-700">{tasks.filter(t => t.status === 'in-progress').length} en cours</span>
          </p>
        </div>
      </div>

      {/* 📊 VISUAL ANALYTICS: OCCUPANCY & REVENUE CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(currentRole === 'admin' || currentRole === 'manager' || currentRole === 'accountant') ? (
          <>
            {/* Chart 1: Revenue & Expenses Trend */}
            <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-xs hover:shadow-md transition-all">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-orange-500 animate-pulse" />
                    <span>Flux Financiers (7 derniers jours)</span>
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">Évolution quotidienne des recettes (Hôtel & Restaurant) vs. dépenses</p>
                </div>
                <div className="text-[10px] bg-slate-100 font-bold px-2.5 py-1 rounded-lg text-slate-600 font-mono">
                  En FCFA (XOF)
                </div>
              </div>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="label" 
                      stroke="#94a3b8" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(val) => `${val >= 1000 ? (val / 1000) + 'k' : val}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        borderRadius: '12px', 
                        border: '1px solid #e2e8f0',
                        fontSize: '11px',
                        fontFamily: 'sans-serif'
                      }}
                      formatter={(value: any, name: string) => [
                        `${Number(value).toLocaleString('fr-FR')} FCFA`,
                        name === 'revenue' ? 'Revenus Globaux' : 
                        name === 'lodging' ? 'Hébergement' : 
                        name === 'restaurant' ? 'Restauration' : 'Dépenses'
                      ]}
                    />
                    <Legend 
                      verticalAlign="top" 
                      height={36} 
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="revenue" name="Revenus Globaux" stroke="#f97316" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                    <Area type="monotone" dataKey="expenses" name="Dépenses" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Occupancy Rate Trend */}
            <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-xs hover:shadow-md transition-all">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                    <BedDouble className="w-4 h-4 text-emerald-500" />
                    <span>Taux d'Occupation Hôtelier (7 derniers jours)</span>
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">Pourcentage de studios occupés par nuitée</p>
                </div>
                <div className="text-[10px] bg-emerald-50 font-extrabold px-2.5 py-1 rounded-lg text-emerald-700 uppercase">
                  Taux Moyen: {Math.round(chartData.reduce((sum, item) => sum + item.occupancy, 0) / 7)}%
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="label" 
                      stroke="#94a3b8" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                      domain={[0, 100]}
                      tickFormatter={(val) => `${val}%`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        borderRadius: '12px', 
                        border: '1px solid #e2e8f0',
                        fontSize: '11px',
                        fontFamily: 'sans-serif'
                      }}
                      formatter={(value: any) => [
                        `${value}% (${chartData.find(item => item.occupancy === value)?.occupiedRooms || 0} chambres occupées)`,
                        'Taux d\'Occupation'
                      ]}
                    />
                    <Bar 
                      dataKey="occupancy" 
                      name="Taux d'Occupation" 
                      fill="#059669" 
                      radius={[8, 8, 0, 0]} 
                      maxBarSize={45} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        ) : (
          /* Expand Occupancy Rate Trend when financials are hidden */
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-xs hover:shadow-md transition-all lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                  <BedDouble className="w-4 h-4 text-emerald-500" />
                  <span>Taux d'Occupation Hôtelier (7 derniers jours)</span>
                </h4>
                <p className="text-[10px] text-slate-500 font-medium">Pourcentage de studios occupés par nuitée</p>
              </div>
              <div className="text-[10px] bg-emerald-50 font-extrabold px-2.5 py-1 rounded-lg text-emerald-700 uppercase">
                Taux Moyen: {Math.round(chartData.reduce((sum, item) => sum + item.occupancy, 0) / 7)}%
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="label" 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    domain={[0, 100]}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      borderRadius: '12px', 
                      border: '1px solid #e2e8f0',
                      fontSize: '11px',
                      fontFamily: 'sans-serif'
                    }}
                    formatter={(value: any) => [
                      `${value}% (${chartData.find(item => item.occupancy === value)?.occupiedRooms || 0} chambres occupées)`,
                      'Taux d\'Occupation'
                    ]}
                  />
                  <Bar 
                    dataKey="occupancy" 
                    name="Taux d'Occupation" 
                    fill="#059669" 
                    radius={[8, 8, 0, 0]} 
                    maxBarSize={45} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* 2. DYNAMIC QUICK ACTIONS & MODULES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Actions & Financial Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Action Bento */}
          <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-orange-900 uppercase tracking-wide">Actions de Service Directes</h4>
            <p className="text-xs text-orange-700 mt-1">Accédez en un clic aux tâches courantes de la réception et du service maquis.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <button
                onClick={onQuickCheckIn}
                className="flex items-center gap-3 p-4 bg-white border border-orange-200 rounded-xl text-left hover:border-orange-400 hover:shadow-xs transition-all group"
              >
                <div className="p-2 bg-orange-100 text-orange-800 rounded-lg group-hover:scale-105 transition-all">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">Nouveau Check-In</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Attribuer une chambre</div>
                </div>
              </button>

              <button
                onClick={onQuickPOSOrder}
                className="flex items-center gap-3 p-4 bg-white border border-orange-200 rounded-xl text-left hover:border-orange-400 hover:shadow-xs transition-all group"
              >
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg group-hover:scale-105 transition-all">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">Caisse Maquis POS</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Commande de table / bar</div>
                </div>
              </button>

              <button
                onClick={onQuickAddTask}
                className="flex items-center gap-3 p-4 bg-white border border-orange-200 rounded-xl text-left hover:border-orange-400 hover:shadow-xs transition-all group"
              >
                <div className="p-2 bg-purple-100 text-purple-800 rounded-lg group-hover:scale-105 transition-all">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">Attribuer Tâche</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Ménage ou maintenance</div>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Financial Transactions or Housekeeping/Task Panel */}
          {(currentRole === 'admin' || currentRole === 'manager' || currentRole === 'accountant') ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Trésorerie Récente</h4>
                  <p className="text-xs text-slate-500">Flux d'argent combinés de la journée</p>
                </div>
                <button 
                  onClick={() => onNavigate('erp')}
                  className="text-xs font-semibold text-orange-600 hover:text-orange-800 flex items-center gap-1"
                >
                  Tout voir
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-slate-100 mt-2">
                {transactions.slice().reverse().map((t) => (
                  <div key={t.id} className="py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${
                        t.type === 'lodging_payment' 
                          ? 'bg-blue-50 text-blue-700' 
                          : t.type === 'pos_sale' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        {t.type === 'lodging_payment' && <BedDouble className="w-4 h-4" />}
                        {t.type === 'pos_sale' && <UtensilsCrossed className="w-4 h-4" />}
                        {t.type === 'expense' && <ArrowDownRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-800">{t.description}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="uppercase font-semibold tracking-wider text-orange-800 bg-orange-50 px-1.5 rounded">{t.method}</span>
                          <span>{new Date(t.date).toLocaleDateString('fr-FR')} {new Date(t.date).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`text-sm font-mono font-bold ${t.type === 'expense' ? 'text-rose-600' : 'text-slate-900'}`}>
                      {t.type === 'expense' ? '-' : '+'}{t.amount.toLocaleString('fr-FR')} F
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {currentRole === 'housekeeper' ? "Planning de Ménage Actif" : "Opérations Assignées"}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {currentRole === 'housekeeper' 
                      ? "Suivi des chambres demandant un ménage d'urgence" 
                      : "Liste des tâches d'équipe de la journée"}
                  </p>
                </div>
                <button 
                  onClick={() => onNavigate('staff')}
                  className="text-xs font-semibold text-orange-600 hover:text-orange-800 flex items-center gap-1"
                >
                  Gérer Tâches
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-slate-100 mt-2">
                {currentRole === 'housekeeper' ? (
                  rooms.filter(r => r.status === 'dirty').length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      ✨ Toutes les chambres sont propres ! Bon travail !
                    </div>
                  ) : (
                    rooms.filter(r => r.status === 'dirty').map((room) => (
                      <div key={room.id} className="py-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-orange-50 text-orange-700 rounded-xl">
                            <BedDouble className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-800">Ménage requis - {room.name}</div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                              <span className="uppercase font-semibold tracking-wider text-orange-800 bg-orange-50 px-1.5 rounded">{room.type}</span>
                              <span>Statut actuel: Sale (Ménage urgent)</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-bold uppercase">
                          À faire
                        </span>
                      </div>
                    ))
                  )
                ) : (
                  tasks.filter(t => t.status !== 'completed').slice(0, 5).length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      🎉 Aucune tâche urgente assignée pour le moment !
                    </div>
                  ) : (
                    tasks.filter(t => t.status !== 'completed').slice(0, 5).map((task) => (
                      <div key={task.id} className="py-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl ${
                            task.category === 'housekeeping' ? 'bg-orange-50 text-orange-700' : 'bg-purple-50 text-purple-700'
                          }`}>
                            <CheckSquare className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-800">{task.title}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">{task.description}</div>
                          </div>
                        </div>
                        <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold uppercase">
                          {task.status === 'in-progress' ? 'En cours' : 'À faire'}
                        </span>
                      </div>
                    ))
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Mini room matrix & live active tasks */}
        <div className="space-y-6">
          {/* Room Matrix Status Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Statut Chambres</h4>
                <p className="text-xs text-slate-500"> PMS en temps réel</p>
              </div>
              <button 
                onClick={() => onNavigate('pms')}
                className="text-xs font-semibold text-orange-600 hover:text-orange-800 flex items-center gap-1"
              >
                Ouvrir PMS
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              {rooms.map((room) => (
                <div 
                  key={room.id}
                  className={`p-3 rounded-xl border text-left ${
                    room.status === 'available'
                      ? 'bg-emerald-50/50 border-emerald-100'
                      : room.status === 'occupied'
                      ? 'bg-blue-50/50 border-blue-100'
                      : room.status === 'dirty'
                      ? 'bg-orange-50/50 border-orange-100'
                      : 'bg-slate-50/50 border-slate-100'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-800">{room.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {room.id}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase font-sans">
                      {room.type}
                    </span>
                    <span className={`text-[9px] font-semibold uppercase ${
                      room.status === 'available' ? 'text-emerald-700' :
                      room.status === 'occupied' ? 'text-blue-700' :
                      room.status === 'dirty' ? 'text-orange-700' : 'text-slate-600'
                    }`}>
                      {room.status === 'available' ? 'Libre' :
                       room.status === 'occupied' ? 'Occupé' :
                       room.status === 'dirty' ? 'Ménage' : 'Panne'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tasks widget */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Opérations d'Aujourd'hui</h4>
                <p className="text-xs text-slate-500">Tâches urgentes</p>
              </div>
              <button 
                onClick={() => onNavigate('staff')}
                className="text-xs font-semibold text-orange-600 hover:text-orange-800 flex items-center gap-1"
              >
                Gérer
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 mt-4">
              {tasks.filter(t => t.status !== 'completed').slice(0, 4).map((task) => (
                <div key={task.id} className="p-3 border border-slate-100 rounded-xl bg-slate-50 text-xs">
                  <div className="flex justify-between items-start">
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                      task.category === 'housekeeping' ? 'bg-orange-100 text-orange-800' :
                      task.category === 'maintenance' ? 'bg-rose-100 text-rose-800' :
                      'bg-slate-200 text-slate-800'
                    }`}>
                      {task.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{task.dueDate}</span>
                  </div>
                  <div className="font-bold text-slate-800 mt-1.5">{task.title}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">{task.description}</div>
                  {task.assignedToName && (
                    <div className="mt-2 text-[10px] text-orange-800 font-medium flex items-center gap-1">
                      <span>Assigné à :</span>
                      <span className="underline">{task.assignedToName}</span>
                    </div>
                  )}
                </div>
              ))}
              {tasks.filter(t => t.status !== 'completed').length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs">
                  Aucune tâche urgente en cours !
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* 🖥️ LARAVEL 11 REST API GATEWAY REAL-TIME MONITOR */}
      <div className="bg-slate-900 text-slate-100 rounded-[24px] p-6 border border-slate-800 shadow-xl space-y-6 mt-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <h4 className="font-extrabold text-white text-base uppercase tracking-wider flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-400" />
                <span>Laravel 11 API Gateway - Moniteur en Temps Réel</span>
              </h4>
            </div>
            <p className="text-xs text-slate-400">
              Journal d'activité de l'API REST multi-tenant pour l'ingestion des réservations externes (OTAs, Channel Manager) et la prévention du surbooking.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="px-2.5 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono text-[10px] font-bold rounded-lg uppercase">
              Host: localhost:8000
            </span>
            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono text-[10px] font-bold rounded-lg uppercase">
              Laravel v11.x
            </span>
            <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono text-[10px] font-bold rounded-lg uppercase">
              PHP v8.2
            </span>
          </div>
        </div>

        {/* Action simulators */}
        <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-3">
          <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5 font-mono">
            <Terminal className="w-4 h-4 text-orange-400" />
            <span>CONSOLE DE SIMULATION DE REQUÊTES (TEST API)</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Cliquez sur un des scénarios ci-dessous pour déclencher un appel HTTP simulé vers l'API Laravel et observer la réponse du contrôleur de passerelle (ChannelManagerController) :
          </p>
          <div className="flex flex-wrap gap-2.5 pt-1">
            <button
              onClick={() => handleSimulateApiCall('success')}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-emerald-900/30 transition-all cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Simuler Ingestion OK (201)</span>
            </button>
            <button
              onClick={() => handleSimulateApiCall('overbooking')}
              className="px-3.5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-orange-900/30 transition-all cursor-pointer active:scale-95"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Simuler Surbooking (422)</span>
            </button>
            <button
              onClick={() => handleSimulateApiCall('unauthorized')}
              className="px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-slate-900/30 transition-all cursor-pointer active:scale-95"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Simuler Jeton Invalide (401)</span>
            </button>
            <button
              onClick={() => handleSimulateApiCall('bad_request')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-slate-900/10 transition-all cursor-pointer active:scale-95"
            >
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>Simuler Tenant Manquant (400)</span>
            </button>
          </div>
        </div>

        {/* Logs Live List */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-400 flex items-center justify-between px-1">
            <span>FLUX DES REQUÊTES ENTRANTES (Derniers événements)</span>
            <span className="font-mono text-[10px] text-slate-500">Mise à jour en direct</span>
          </div>

          <div className="divide-y divide-slate-850 bg-slate-950/40 rounded-2xl border border-slate-800/60 overflow-hidden">
            {apiLogs.map((log) => {
              const isSuccess = log.status >= 200 && log.status < 300;
              const isOverbooking = log.status === 422;
              const isClientError = log.status >= 400 && log.status < 500 && log.status !== 422;
              
              const statusBadgeColor = isSuccess 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : isOverbooking 
                ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20';

              const methodColor = 'bg-blue-500/10 text-blue-400 border-blue-500/20';

              return (
                <div key={log.id} className="p-4 hover:bg-slate-900/40 transition-all">
                  <div 
                    onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* Method Badge */}
                      <span className={`px-2 py-0.5 font-mono text-[10px] font-bold rounded-md border ${methodColor}`}>
                        {log.method}
                      </span>
                      
                      {/* Path & Source */}
                      <span className="font-mono text-xs text-slate-200 font-semibold">{log.path}</span>
                      
                      {/* Source Badge */}
                      {log.source && (
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-300 font-sans text-[10px] font-semibold rounded-md border border-slate-700/50">
                          {log.source}
                        </span>
                      )}

                      {/* Tenant Badge */}
                      {log.tenantId ? (
                        <span className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded font-mono">
                          Tenant: {log.tenantId}
                        </span>
                      ) : (
                        <span className="text-[10px] text-rose-400 bg-rose-950/20 border border-rose-900/30 px-1.5 py-0.5 rounded font-mono">
                          Tenant: None
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-auto">
                      {/* WhatsApp Sent Notification Status */}
                      {log.whatsAppTriggered && (
                        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 px-2 py-0.5 rounded-full font-sans font-bold uppercase tracking-wider animate-pulse">
                          <Send className="w-3 h-3" />
                          <span>WhatsApp envoyé</span>
                        </div>
                      )}

                      {/* Status Badge */}
                      <span className={`px-2.5 py-0.5 font-mono text-[10px] font-bold rounded-lg border ${statusBadgeColor}`}>
                        {log.status} {log.statusText}
                      </span>

                      {/* IP / Timestamp */}
                      <span className="text-[10px] font-mono text-slate-500">
                        {new Date(log.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Expanded JSON details for payload/response */}
                  {expandedLogId === log.id && (
                    <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
                      {/* Request Payload */}
                      <div className="space-y-1.5 text-left">
                        <div className="text-[10px] font-bold text-slate-400 font-mono flex items-center gap-1.5 uppercase">
                          <span>Request Payload (Entrante)</span>
                          <span className="text-slate-600">| IP: {log.clientIp}</span>
                        </div>
                        <pre className="p-3 bg-slate-950 text-blue-300 rounded-xl font-mono text-[11px] overflow-x-auto max-h-[160px] border border-slate-900 shadow-inner leading-relaxed">
                          {JSON.stringify(log.payload, null, 2)}
                        </pre>
                      </div>

                      {/* Response JSON */}
                      <div className="space-y-1.5 text-left">
                        <div className="text-[10px] font-bold text-slate-400 font-mono uppercase">
                          Response JSON (Sortante)
                        </div>
                        <pre className={`p-3 bg-slate-950 rounded-xl font-mono text-[11px] overflow-x-auto max-h-[160px] border border-slate-900 shadow-inner leading-relaxed ${isSuccess ? 'text-emerald-400' : 'text-orange-400'}`}>
                          {JSON.stringify(log.response, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Helper Badge explain */}
        <div className="p-4 bg-blue-950/30 border border-blue-900/40 rounded-2xl text-xs text-blue-300 flex items-start gap-2.5">
          <Info className="w-4.5 h-4.5 text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-left">
            <span className="font-bold block text-white">Pourquoi est-ce utile pour le débogage ?</span>
            <p className="text-[11px] text-blue-300/80 leading-relaxed">
              Ce panneau reflète les règles d'intégrité de notre API Laravel 11. Notamment, si vous simulez un cas de <strong>Surbooking (422)</strong>, l'API renvoie le code <code>OVERBOOKING_PREVENTION</code> et empêche l'enregistrement pour éviter la surréservation. De plus, pour chaque réservation réussie (201), le webhook simule le déclenchement asynchrone des notifications WhatsApp pour envoyer le code PIN et l'access_code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
