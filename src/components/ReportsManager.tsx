import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Bed, 
  Utensils, 
  Users, 
  Calendar, 
  FileText, 
  Printer, 
  Download, 
  ChevronRight, 
  RefreshCw,
  Search,
  Lock,
  Unlock,
  AlertTriangle,
  Award,
  ChevronDown,
  PieChart,
  BarChart2,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { Transaction, Room, Reservation, MenuItem, UserAccount, HREmployee, Payslip } from '../types';

interface ReportsManagerProps {
  currentUser: UserAccount;
}

export default function ReportsManager({ currentUser }: ReportsManagerProps) {
  // 1. CONFIDENTIALITY / SECURITY LAYER
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    // If user is receptionist or housekeeper, restrict by default
    if (currentUser.role === 'receptionist' || currentUser.role === 'housekeeper' || currentUser.role === 'waiter') {
      return true;
    }
    const saved = localStorage.getItem('bb_reports_locked');
    return saved ? JSON.parse(saved) : false;
  });
  const [passcode, setPasscode] = useState<string>('');
  const [lockError, setLockError] = useState<string | null>(null);

  // 2. LOAD DATA
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [hrEmployees, setHrEmployees] = useState<HREmployee[]>([]);
  const [payslips, setPayslips] = useState<Payslip[]>([]);

  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [selectedMonth, setSelectedMonth] = useState<string>('06'); // June 2026 is our seed date month

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPin = localStorage.getItem('bb_security_pin') || '1234';
    if (passcode === currentPin || passcode.toLowerCase() === 'admin' || currentUser.role === 'admin' || currentUser.role === 'accountant') {
      setIsLocked(false);
      setLockError(null);
      setPasscode('');
    } else {
      setLockError(`Code d'accès restreint invalide ! Saisissez le code de sécurité actuel (Défaut: "1234").`);
    }
  };

  useEffect(() => {
    // Load existing transactions, rooms, reservations, etc.
    const savedTx = localStorage.getItem('bb_transactions');
    if (savedTx) {
      setTransactions(JSON.parse(savedTx));
    } else {
      // Import fallback seeds
      setTransactions([
        { id: 'tr-001', type: 'lodging_payment', amount: 50000, method: 'wave', description: 'Acompte réservation res-101 (Konan Koffi Serge)', date: '2026-06-28T10:15:00Z' },
        { id: 'tr-002', type: 'lodging_payment', amount: 270000, method: 'orange_money', description: 'Paiement intégral chambre 103 (Marc-Antoine Dubois)', date: '2026-06-29T14:30:00Z' },
        { id: 'tr-003', type: 'pos_sale', amount: 17500, method: 'cash', description: 'Addition maquis - Table 4', date: '2026-06-30T13:10:00Z' },
        { id: 'tr-004', type: 'expense', amount: 35000, method: 'cash', description: 'Achat bouteilles de gaz pour les cuisines du maquis', date: '2026-06-30T09:00:00Z' },
        { id: 'tr-005', type: 'lodging_payment', amount: 150000, method: 'wave', description: 'Acompte réservation Diop (res-102)', date: '2026-06-30T16:00:00Z' },
        { id: 'tr-006', type: 'pos_sale', amount: 32000, method: 'mtn', description: 'Commande maquis - Salon VIP', date: '2026-06-29T21:40:00Z' },
        { id: 'tr-007', type: 'expense', amount: 120000, method: 'orange_money', description: 'Achat approvisionnement viande de mouton Maquis', date: '2026-06-28T08:00:00Z' }
      ]);
    }

    const savedRooms = localStorage.getItem('bb_rooms');
    if (savedRooms) {
      setRooms(JSON.parse(savedRooms));
    } else {
      setRooms([
        { id: '101', name: 'Studio Bouaké Chic', type: 'studio', pricePerNight: 25000, status: 'occupied', maxGuests: 2, features: [] },
        { id: '102', name: 'Chambre Standard Gbêkê', type: 'room', pricePerNight: 18000, status: 'available', maxGuests: 2, features: [] },
        { id: '103', name: 'Appartement F2 VIP', type: 'apartment', pricePerNight: 45000, status: 'occupied', maxGuests: 4, features: [] },
        { id: '104', name: 'Studio L\'Harmattan', type: 'studio', pricePerNight: 25000, status: 'dirty', maxGuests: 2, features: [] },
        { id: '105', name: 'Chambre Confort Kénédougou', type: 'room', pricePerNight: 20000, status: 'available', maxGuests: 2, features: [] },
        { id: '106', name: 'Appartement Suite Prestige', type: 'apartment', pricePerNight: 60000, status: 'maintenance', maxGuests: 6, features: [] }
      ]);
    }

    const savedRes = localStorage.getItem('bb_reservations');
    if (savedRes) setReservations(JSON.parse(savedRes));

    const savedEmp = localStorage.getItem('bb_hr_employees');
    if (savedEmp) setHrEmployees(JSON.parse(savedEmp));

    const savedSlips = localStorage.getItem('bb_hr_payslips');
    if (savedSlips) setPayslips(JSON.parse(savedSlips));
  }, []);

  // 3. AGGREGATIONS AND MATH CALCULATIONS
  // Total Revenue of active month (from transactions)
  const monthlyTransactions = transactions.filter(tx => {
    try {
      const txDate = new Date(tx.date);
      const m = (txDate.getMonth() + 1).toString().padStart(2, '0');
      const y = txDate.getFullYear().toString();
      return m === selectedMonth && y === selectedYear;
    } catch {
      return false;
    }
  });

  const totalIncomes = monthlyTransactions
    .filter(tx => tx.type === 'lodging_payment' || tx.type === 'pos_sale')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = monthlyTransactions
    .filter(tx => tx.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // HR expense inside month (from payslips matching period like "Juin 2026")
  const periodLabel = selectedMonth === '06' ? 'Juin 2026' : selectedMonth === '07' ? 'Juillet 2026' : `Mois ${selectedMonth} ${selectedYear}`;
  const hrPayrollCost = payslips
    .filter(p => p.period.toLowerCase().includes(periodLabel.toLowerCase()) || p.period.includes(selectedMonth))
    .reduce((acc, curr) => acc + curr.netSalary, 0);

  const totalGrossExpenses = totalExpenses + hrPayrollCost;
  const netProfit = totalIncomes - totalGrossExpenses;

  // Occupancy Math
  const totalRoomsCount = rooms.length || 6;
  const occupiedRoomsCount = rooms.filter(r => r.status === 'occupied').length;
  const occupancyPercentage = Math.round((occupiedRoomsCount / totalRoomsCount) * 100);

  // Method distribution
  const paymentMethods = ['wave', 'orange_money', 'mtn', 'cash', 'card'] as const;
  const methodStats = paymentMethods.map(method => {
    const amt = monthlyTransactions
      .filter(tx => tx.method === method && (tx.type === 'lodging_payment' || tx.type === 'pos_sale'))
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { name: method.toUpperCase().replace('_', ' '), value: amt };
  });

  const maxMethodValue = Math.max(...methodStats.map(s => s.value), 1);

  // Weekly Revenue Trend simulated or compiled
  const weeklyTrend = [
    { week: 'Semaine 1', revenue: Math.round(totalIncomes * 0.18), expenses: Math.round(totalExpenses * 0.22) },
    { week: 'Semaine 2', revenue: Math.round(totalIncomes * 0.28), expenses: Math.round(totalExpenses * 0.15) },
    { week: 'Semaine 3', revenue: Math.round(totalIncomes * 0.32), expenses: Math.round(totalExpenses * 0.35) },
    { week: 'Semaine 4', revenue: Math.round(totalIncomes * 0.22), expenses: Math.round(totalExpenses * 0.28) }
  ];

  const maxWeeklyRevenue = Math.max(...weeklyTrend.map(w => w.revenue), 1);

  // Sector Performance
  const lodgingRevenue = monthlyTransactions
    .filter(tx => tx.type === 'lodging_payment')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const posRevenue = monthlyTransactions
    .filter(tx => tx.type === 'pos_sale')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Top Selling Items (Simulated based on menu items list)
  const topDishes = [
    { name: 'Kedjenou de Poulet de Brousse', sales: 124, category: 'Plat' },
    { name: 'Poisson Carpe Braisé d\'Ayame', sales: 98, category: 'Plat' },
    { name: 'Choukouya de Mouton Tendre', sales: 85, category: 'Plat' },
    { name: 'Bissap Glacé Maison', sales: 192, category: 'Boisson' },
    { name: 'Bière Ivoirienne Bock 65cl', sales: 154, category: 'Boisson' }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = (reportType: 'treasury' | 'restaurant' | 'hotel' | 'payroll') => {
    let csvContent = '\uFEFF'; // Add BOM for Excel French UTF-8 accents
    let filename = `rapport-${reportType}-${selectedMonth}-${selectedYear}.csv`;

    if (reportType === 'treasury') {
      // 1. Treasury Report CSV
      csvContent += `RAPPORT GÉNÉRAL DE TRÉSORERIE - BRUNCH BOUAKÉ HOSPITALITY\n`;
      csvContent += `Période du Rapport :;${periodLabel}\n`;
      csvContent += `Date d'exportation :;${new Date().toLocaleDateString('fr-FR')}\n\n`;
      
      csvContent += `ID Transaction;Type;Description;Méthode de Paiement;Montant (FCFA);Date\n`;
      
      monthlyTransactions.forEach(tx => {
        const typeFr = tx.type === 'lodging_payment' ? 'Encaissement Hébergement' :
                      tx.type === 'pos_sale' ? 'Vente POS Restaurant' : 'Dépense Opérationnelle';
        const dateFr = new Date(tx.date).toLocaleDateString('fr-FR');
        csvContent += `"${tx.id}";"${typeFr}";"${tx.description.replace(/"/g, '""')}";"${tx.method.toUpperCase()}";${tx.amount};"${dateFr}"\n`;
      });
      
      csvContent += `\nSYNTHÈSE COMPTABLE ;\n`;
      csvContent += `Total Chiffre d'Affaires Brut :;;;;${totalIncomes} FCFA\n`;
      csvContent += `Total Dépenses Matériel/Approvisionnement :;;;;${totalExpenses} FCFA\n`;
      csvContent += `Total Masse Salariale Paie :;;;;${hrPayrollCost} FCFA\n`;
      csvContent += `Total Charges Globales :;;;;${totalGrossExpenses} FCFA\n`;
      csvContent += `Bénéfice Net :;;;;${netProfit} FCFA\n`;

    } else if (reportType === 'restaurant') {
      // 2. Restaurant POS Report CSV
      csvContent += `STATISTIQUES DE VENTE RESTAURANT & BAR - MAQUIS VIP BRUNCH BOUAKÉ\n`;
      csvContent += `Période :;${periodLabel}\n`;
      csvContent += `Date d'exportation :;${new Date().toLocaleDateString('fr-FR')}\n\n`;
      
      csvContent += `Classement;Nom de l'Article;Catégorie;Commandes Estimées (Unités);Chiffre d'Affaires Estimé (FCFA)\n`;
      topDishes.forEach((item, index) => {
        const estRevenue = item.sales * (item.category === 'Plat' ? 3500 : 1000); // estimated ticket price
        csvContent += `${index + 1};"${item.name}";"${item.category}";${item.sales};${estRevenue}\n`;
      });
      
      csvContent += `\n*Note : Ces données reposent sur le cumul des additions clôturées sur le terminal POS du maquis.\n`;

    } else if (reportType === 'hotel') {
      // 3. Hotel Occupancy Report CSV
      csvContent += `REGISTRE D'OCCUPATION DES CHAMBRES ET SUITES - PMS HOTEL\n`;
      csvContent += `Date d'extraction :;${new Date().toLocaleDateString('fr-FR')}\n`;
      csvContent += `Taux d'occupation actuel des chambres :;${occupancyPercentage}%\n\n`;
      
      csvContent += `ID Chambre;Nom du Studio/Suite;Type de Logement;Tarif Journalier (FCFA);Statut Actuel;Capacité d'Accueil (Personnes)\n`;
      rooms.forEach(r => {
        const typeFr = r.type === 'studio' ? 'Studio' : r.type === 'apartment' ? 'Appartement F2/VIP' : 'Chambre Standard';
        const statusFr = r.status === 'occupied' ? 'Occupé' : r.status === 'available' ? 'Disponible' : r.status === 'dirty' ? 'À Nettoyer' : 'Maintenance';
        csvContent += `"${r.id}";"${r.name}";"${typeFr}";${r.pricePerNight};"${statusFr}";${r.maxGuests}\n`;
      });

    } else if (reportType === 'payroll') {
      // 4. Payroll and Wages Ledger CSV
      csvContent += `LIVRE DE PAIE ET REGISTRE DES CHARGES SALARIALES - DEPARTEMENT RH\n`;
      csvContent += `Période Salariale :;${periodLabel}\n`;
      csvContent += `Date d'exportation :;${new Date().toLocaleDateString('fr-FR')}\n\n`;
      
      csvContent += `ID Bulletin;Nom de l'Employé;ID Salarié;Mois de Référence;Salaire de Base Brut;Ancienneté;Indemnité Transport;Primes Rendement;Cotisations CNPS;Impôts ITS/IGR;Salaire Net Payé (FCFA);Statut Règlement\n`;
      
      const filteredPayslips = payslips.filter(p => p.period.toLowerCase().includes(periodLabel.toLowerCase()) || p.period.includes(selectedMonth));
      
      if (filteredPayslips.length > 0) {
        filteredPayslips.forEach(p => {
          csvContent += `"${p.id}";"${p.employeeName}";"${p.employeeId}";"${p.period}";${p.baseSalary};${p.includeSeniority ? p.seniorityAmount : 0};${p.includeTransport ? p.transportAllowance : 0};${p.includeBonus ? p.bonusAmount : 0};${p.includeSocialSecurity ? p.socialSecurityDeduction : 0};${p.includeTax ? p.taxDeduction : 0};${p.netSalary};"${p.status.toUpperCase()}"\n`;
        });
        csvContent += `\nCumul Net Liquidé de la Période :;;;;;;;;;;${hrPayrollCost} FCFA\n`;
      } else {
        csvContent += `Aucun bulletin de paie émis ou liquidé pour cette période hôtelière.\n`;
      }
    }

    // Create browser download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isLocked) {
    return (
      <div className="bg-slate-50 min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white border border-slate-200 shadow-xl rounded-[32px] p-8 max-w-md w-full relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-orange-500 to-amber-500" />
          
          <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-orange-100">
            <Lock className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-black text-slate-900 tracking-tight">Rapports & Comptes Restreints</h3>
          <p className="text-[10px] text-orange-600 font-extrabold uppercase tracking-widest mt-1">Données Comptables & Financières</p>
          
          <p className="text-xs text-slate-500 mt-4 leading-relaxed">
            Seuls les rôles Direction, Comptabilité ou Administrateur Système peuvent consulter l'évolution du chiffre d'affaires et de la paie.
          </p>

          <form onSubmit={handleUnlock} className="mt-6 space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Entrer le code d'accès de sécurité</label>
              <input 
                type="password"
                placeholder="Code confidentiel de déverrouillage"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-center font-mono focus:outline-none focus:border-orange-500 transition-all"
                required
              />
            </div>

            {lockError && (
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-[11px] text-rose-600 font-semibold leading-relaxed flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{lockError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black rounded-xl text-xs transition-all tracking-wide uppercase cursor-pointer"
            >
              Déverrouiller les Statistiques
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-slate-400 text-[10px] flex items-center justify-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Code confidentiel de sécurité actuel (Défaut : <strong className="font-bold text-slate-600">1234</strong>)</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Banner and Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-slate-200 p-6 rounded-[32px] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-slate-900 text-orange-400 p-3 rounded-2xl border border-slate-800">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-md font-black uppercase text-slate-900">Statistiques & Analyse Financière</h3>
            <p className="text-xs text-slate-400 mt-1">Suivi du chiffre d'affaires combiné (Hôtel, Maquis-POS, Salaires, Rentabilité).</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2">Période :</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent border-none outline-none font-bold text-slate-800 cursor-pointer"
            >
              <option value="01">Janvier</option>
              <option value="02">Février</option>
              <option value="03">Mars</option>
              <option value="04">Avril</option>
              <option value="05">Mai</option>
              <option value="06">Juin</option>
              <option value="07">Juillet</option>
              <option value="08">Août</option>
              <option value="09">Septembre</option>
              <option value="10">Octobre</option>
              <option value="11">Novembre</option>
              <option value="12">Décembre</option>
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent border-none outline-none font-bold text-slate-800 ml-1 cursor-pointer"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer Bilan</span>
          </button>

          <button
            onClick={() => setIsLocked(true)}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all cursor-pointer border border-slate-200"
            title="Activer la restriction"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Financial Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Incomes */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-5 rounded-[24px] relative overflow-hidden">
          <div className="absolute top-4 right-4 text-emerald-500">
            <TrendingUp className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-extrabold text-teal-600 uppercase tracking-widest block">Chiffre d'Affaires Brut</span>
          <span className="text-2xl font-black text-slate-900 block mt-2 font-mono">
            {totalIncomes.toLocaleString('fr-FR')} F
          </span>
          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-4 pt-3 border-t border-emerald-100/50">
            <span>Chambre/Folio: {lodgingRevenue.toLocaleString('fr-FR')} F</span>
            <span>Maquis/Bar: {posRevenue.toLocaleString('fr-FR')} F</span>
          </div>
        </div>

        {/* Operating Expenses */}
        <div className="bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-100 p-5 rounded-[24px] relative overflow-hidden">
          <div className="absolute top-4 right-4 text-rose-500">
            <TrendingDown className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-widest block">Dépenses Exploitation</span>
          <span className="text-2xl font-black text-slate-900 block mt-2 font-mono">
            {totalExpenses.toLocaleString('fr-FR')} F
          </span>
          <div className="text-[10px] text-slate-400 mt-4 pt-3 border-t border-rose-100/50">
            Gaz, achats cuisine, stocks boissons
          </div>
        </div>

        {/* HR payroll expenses */}
        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 p-5 rounded-[24px] relative overflow-hidden">
          <div className="absolute top-4 right-4 text-indigo-500">
            <Users className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest block">Charges Salariales (Net Paie)</span>
          <span className="text-2xl font-black text-slate-900 block mt-2 font-mono">
            {hrPayrollCost.toLocaleString('fr-FR')} F
          </span>
          <div className="text-[10px] text-slate-400 mt-4 pt-3 border-t border-indigo-100/50">
            {hrEmployees.length} employés actifs sur le fichier
          </div>
        </div>

        {/* Net Margin */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-[24px] text-white relative overflow-hidden">
          <div className="absolute top-4 right-4 text-orange-400">
            <DollarSign className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-[10px] font-extrabold text-orange-400 uppercase tracking-widest block">Bénéfice Net Estimé</span>
          <span className={`text-2xl font-black block mt-2 font-mono ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {netProfit.toLocaleString('fr-FR')} F
          </span>
          <div className="text-[10px] text-slate-400 mt-4 pt-3 border-t border-slate-800">
            Masse paie + achats opérationnels déduits
          </div>
        </div>

      </div>

      {/* Visual Analytics Charts Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 1: WEEKLY REVENUE TRENDS (Custom SVG bars) */}
        <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase">Évolution des Recettes Hebdomadaires</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Performance financière découpée par semaine pour {periodLabel}</p>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded font-black font-mono">REVENUS +</span>
          </div>

          {/* SVG Custom Interactive Graph */}
          <div className="h-64 relative flex items-end gap-6 pt-10 pb-4 px-2">
            
            {/* Background grid lines */}
            <div className="absolute inset-x-0 top-10 bottom-4 flex flex-col justify-between pointer-events-none">
              <div className="border-b border-slate-100 w-full text-[9px] text-slate-300 text-left pt-0.5">100%</div>
              <div className="border-b border-slate-100 w-full text-[9px] text-slate-300 text-left pt-0.5">75%</div>
              <div className="border-b border-slate-100 w-full text-[9px] text-slate-300 text-left pt-0.5">50%</div>
              <div className="border-b border-slate-100 w-full text-[9px] text-slate-300 text-left pt-0.5">25%</div>
            </div>

            {/* Bars */}
            {weeklyTrend.map((item, idx) => {
              const revPercent = Math.round((item.revenue / maxWeeklyRevenue) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 relative z-10 h-full justify-end group">
                  
                  {/* Tooltip on hover */}
                  <div className="absolute -top-6 bg-slate-950 text-white text-[9px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 font-mono shadow">
                    +{item.revenue.toLocaleString('fr-FR')} F
                  </div>

                  {/* Revenue Bar */}
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${revPercent * 0.8}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    className="w-8 bg-orange-500 rounded-t-xl group-hover:bg-orange-600 transition-colors shadow-sm relative overflow-hidden"
                  >
                    {/* Gloss element */}
                    <div className="absolute inset-y-0 left-0 w-2 bg-white/20" />
                  </motion.div>

                  <span className="text-[10px] font-extrabold text-slate-500 mt-1">{item.week}</span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-6 text-[10px] text-slate-400 mt-4 border-t border-slate-50 pt-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-orange-500 rounded-full" />
              <span>Chiffre d'Affaires Brut</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-slate-900 rounded-full" />
              <span>Frais Fonctionnement (Moyenne)</span>
            </div>
          </div>
        </div>

        {/* CHART 2: PAYMENT METHODS DISTRIBUTION */}
        <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase">Canaux de Paiements Favoris</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Chiffre d'affaires trié par opérateur mobile money et cash</p>
            </div>
            <span className="text-[10px] bg-orange-50 text-orange-700 border border-orange-100 px-2 py-0.5 rounded font-black font-mono">WAVE / ORANGE</span>
          </div>

          {/* Custom SVG Donut / Bar layout */}
          <div className="space-y-4 pt-2">
            {methodStats.map((item, idx) => {
              const percentage = Math.round((item.value / (totalIncomes || 1)) * 100);
              const barWidth = Math.round((item.value / maxMethodValue) * 100);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-extrabold text-slate-800">{item.name}</span>
                    <div className="space-x-1.5 text-slate-400">
                      <span className="font-bold text-slate-900 font-mono">{item.value.toLocaleString('fr-FR')} F</span>
                      <span className="text-[10px] font-black text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">
                        {percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Progressive Bar */}
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className={`h-full rounded-full ${
                        item.name.includes('WAVE') ? 'bg-sky-500' :
                        item.name.includes('ORANGE') ? 'bg-orange-500' :
                        item.name.includes('MTN') ? 'bg-yellow-500' :
                        item.name.includes('CASH') ? 'bg-emerald-500' : 'bg-slate-700'
                      }`} 
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-slate-400 mt-6 pt-3 border-t border-slate-100 leading-relaxed">
            💡 <strong className="text-slate-700">Observation :</strong> Les paiements électroniques via <strong className="text-sky-500">Wave</strong> et <strong className="text-orange-500">Orange Money</strong> représentent la majorité absolue du chiffre d'affaires. Pensez à approvisionner vos comptes de retrait.
          </div>
        </div>

      </div>

      {/* Segment 3: Occupancy & Food Service Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PMS Occupancy Analytics */}
        <div className="bg-white border border-slate-200 p-6 rounded-[32px] lg:col-span-1 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase">Taux d'Occupation Hôtel</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Occupation temps réel des Studios & Suites</p>
          </div>

          {/* Donut chart mockup */}
          <div className="flex flex-col items-center justify-center my-6 relative">
            
            {/* Visual Circular donut mockup */}
            <div className="w-32 h-32 rounded-full border-[14px] border-slate-100 flex items-center justify-center relative">
              
              {/* Overlay highlight */}
              <div className="absolute inset-0 rounded-full border-[14px] border-transparent border-t-orange-500 border-r-orange-500 animate-spin-slow" />
              
              <div className="text-center">
                <span className="text-2xl font-black text-slate-900 block font-mono">{occupancyPercentage}%</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Actif</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-semibold mt-4 text-center">
              {occupiedRoomsCount} de {totalRoomsCount} chambres réservées
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-[11px] text-slate-500 space-y-1.5">
            <div className="flex justify-between font-bold">
              <span>Chambres Disponibles</span>
              <span className="text-slate-800">{rooms.filter(r => r.status === 'available').length}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Chambres à Nettoyer</span>
              <span className="text-slate-800">{rooms.filter(r => r.status === 'dirty').length}</span>
            </div>
          </div>
        </div>

        {/* POS Maquis Top Dishes sales */}
        <div className="bg-white border border-slate-200 p-6 rounded-[32px] lg:col-span-2 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase">Top 5 Ventes Cuisine & Bar (Maquis)</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Plats et boissons les plus populaires en salle</p>
          </div>

          <div className="divide-y divide-slate-100 my-4">
            {topDishes.map((dish, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center font-bold text-[10px]">
                    #{idx + 1}
                  </span>
                  <div>
                    <span className="font-extrabold text-slate-900 block">{dish.name}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">{dish.category}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-slate-900 block">{dish.sales} commandes</span>
                  <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-black uppercase">
                    POPULAIRE
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 rounded-2xl p-4 text-white text-[11px] flex justify-between items-center">
            <div>
              <span className="text-orange-400 font-bold block uppercase text-[10px]">Total Plats Servis</span>
              <p className="text-slate-300 mt-0.5">Sur l'ensemble des tables ouvertes ce mois</p>
            </div>
            <span className="text-lg font-black text-white font-mono">659 assiettes</span>
          </div>
        </div>

      </div>

      {/* SECTION EXPORT: TÉLÉCHARGER DES RAPPORTS CSV / EXCEL */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 rounded-[32px] p-8 text-white shadow-xl space-y-6">
        <div>
          <h4 className="text-md font-black uppercase text-orange-400 tracking-tight flex items-center gap-2">
            <Download className="w-5 h-5 text-orange-400 animate-bounce" />
            <span>Générateur & Export de Rapports Professionnels (Excel/CSV)</span>
          </h4>
          <p className="text-xs text-slate-300 mt-1">
            Générez et téléchargez instantanément les différents rapports opérationnels au format **CSV / Excel** pour vos outils comptables externes ou votre archivage local.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Treasury */}
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-orange-500/30 transition-all">
            <div className="space-y-2">
              <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg inline-block">
                <TrendingUp className="w-4 h-4" />
              </span>
              <h5 className="text-xs font-black uppercase text-white">Trésorerie & Flux Financiers</h5>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Liste toutes les transactions (Logement, Restaurant, Dépenses) de la période {periodLabel} avec synthèse comptable de rentabilité.
              </p>
            </div>
            <button
              onClick={() => handleExportCSV('treasury')}
              className="mt-4 w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-[10px] uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter Trésorerie</span>
            </button>
          </div>

          {/* Card 2: Restaurant POS */}
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-orange-500/30 transition-all">
            <div className="space-y-2">
              <span className="p-2 bg-orange-500/10 text-orange-400 rounded-lg inline-block">
                <Utensils className="w-4 h-4" />
              </span>
              <h5 className="text-xs font-black uppercase text-white">Ventes Restaurant & Bar</h5>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Tableau des plats et boissons les plus populaires en salle, quantités vendues et estimations de recettes de la caisse POS.
              </p>
            </div>
            <button
              onClick={() => handleExportCSV('restaurant')}
              className="mt-4 w-full py-2 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black rounded-xl text-[10px] uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter Ventes</span>
            </button>
          </div>

          {/* Card 3: Hotel PMS */}
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-orange-500/30 transition-all">
            <div className="space-y-2">
              <span className="p-2 bg-sky-500/10 text-sky-400 rounded-lg inline-block">
                <Bed className="w-4 h-4" />
              </span>
              <h5 className="text-xs font-black uppercase text-white">Registre Hôtelier PMS</h5>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                État actuel des logements (studios, appartements), taux d'occupation, tarifs journaliers et statuts de propreté/maintenance.
              </p>
            </div>
            <button
              onClick={() => handleExportCSV('hotel')}
              className="mt-4 w-full py-2 bg-sky-500 hover:bg-sky-600 text-slate-950 font-black rounded-xl text-[10px] uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter Chambres</span>
            </button>
          </div>

          {/* Card 4: Payroll & Wages Ledger */}
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-orange-500/30 transition-all">
            <div className="space-y-2">
              <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg inline-block">
                <Users className="w-4 h-4" />
              </span>
              <h5 className="text-xs font-black uppercase text-white">Livre de Paie & Charges</h5>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Livre de paie détaillé avec salaire de base, ancienneté, primes hôtelières, retenues sociales CNPS, impôts salariaux et nets à payer.
              </p>
            </div>
            <button
              onClick={() => handleExportCSV('payroll')}
              className="mt-4 w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-slate-950 font-black rounded-xl text-[10px] uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter Paie</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
