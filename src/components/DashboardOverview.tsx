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
  Layers
} from 'lucide-react';
import { Room, Reservation, Transaction, Task } from '../types';
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
}

export default function DashboardOverview({
  rooms,
  reservations,
  transactions,
  tasks,
  onNavigate,
  onQuickCheckIn,
  onQuickPOSOrder,
  onQuickAddTask
}: DashboardProps) {
  
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
        {/* Metric 1: Revenue */}
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

          {/* Recent Financial Transactions */}
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
    </div>
  );
}
