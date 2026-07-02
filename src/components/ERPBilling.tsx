import React, { useState } from 'react';
import { 
  Receipt, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Search, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calculator,
  PieChart,
  Wifi,
  WifiOff,
  RefreshCw,
  Cloud,
  CloudOff,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Transaction, PropertySettings, OfflineSyncItem } from '../types';

interface ERPProps {
  transactions: Transaction[];
  onAddTransaction: (t: Transaction) => void;
  settings: PropertySettings;
  syncQueue?: OfflineSyncItem[];
  isOnline?: boolean;
  onTriggerSync?: () => void;
}

export default function ERPBilling({
  transactions,
  onAddTransaction,
  settings,
  syncQueue = [],
  isOnline = true,
  onTriggerSync
}: ERPProps) {
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'lodging_payment' | 'pos_sale' | 'expense'>('all');
  const [filterMethod, setFilterMethod] = useState<'all' | 'wave' | 'orange_money' | 'mtn' | 'cash' | 'card'>('all');

  // Expense form state
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseAmount, setExpenseAmount] = useState(0);
  const [expenseMethod, setExpenseMethod] = useState<'cash' | 'wave' | 'orange_money'>('cash');

  // Filtered transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesMethod = filterMethod === 'all' || t.method === filterMethod;
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.includes(searchQuery);
    return matchesType && matchesMethod && matchesSearch;
  });

  // Analytics totals
  const totalInflow = transactions
    .filter(t => t.type !== 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutflow = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const profit = totalInflow - totalOutflow;

  // Breakdown of payment methods
  const methodTotals = transactions.reduce((acc, t) => {
    if (t.type === 'expense') {
      acc[t.method] = (acc[t.method] || 0) - t.amount;
    } else {
      acc[t.method] = (acc[t.method] || 0) + t.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const handleLogExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseDescription || expenseAmount <= 0) return;

    const newExpense: Transaction = {
      id: `tr-${Date.now().toString().slice(-4)}`,
      type: 'expense',
      amount: expenseAmount,
      method: expenseMethod,
      description: expenseDescription,
      date: new Date().toISOString()
    };

    onAddTransaction(newExpense);
    setShowExpenseModal(false);
    setExpenseDescription('');
    setExpenseAmount(0);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. FINANCIAL SUMMARY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Inflows */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-center text-xs text-slate-500 uppercase font-semibold">
            <span>Recettes Globales (In)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">
            {totalInflow.toLocaleString('fr-FR')} <span className="text-xs font-sans text-slate-500 font-normal">FCFA</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            Hôtel + Addition Caisse Maquis
          </p>
        </div>

        {/* Total Outflows */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-center text-xs text-slate-500 uppercase font-semibold">
            <span>Dépenses Enregistrées (Out)</span>
            <TrendingDown className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-rose-600">
            {totalOutflow.toLocaleString('fr-FR')} <span className="text-xs font-sans text-slate-500 font-normal">FCFA</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            Approvisionnement, maintenance, gaz
          </p>
        </div>

        {/* Net Profit */}
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-center text-xs text-orange-800 uppercase font-semibold">
            <span>Bénéfice Net Reconstitué</span>
            <Calculator className="w-4 h-4 text-orange-700" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-orange-950">
            {profit.toLocaleString('fr-FR')} <span className="text-xs font-sans text-slate-500 font-normal">FCFA</span>
          </div>
          <p className="text-[10px] text-orange-700 mt-2">
            Trésorerie nette disponible en caisse
          </p>
        </div>
      </div>

      {/* 2. RECONCILIATION SUMMARY BOX */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-3">
          <PieChart className="w-4 h-4 text-orange-500" />
          Réconciliation par Méthode de Paiement (Solde Net Reconstitué)
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Comparez les montants enregistrés pour équilibrer les comptes Wave et le coffre-fort physique à la fermeture.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          {[
            { id: 'wave', label: 'Wave (CI)', color: 'bg-blue-50 text-blue-700 border-blue-100' },
            { id: 'orange_money', label: 'Orange Money', color: 'bg-orange-50 text-orange-700 border-orange-100' },
            { id: 'mtn', label: 'MTN MoMo', color: 'bg-yellow-50 text-yellow-800 border-yellow-100' },
            { id: 'cash', label: 'Espèces', color: 'bg-emerald-50 text-emerald-800 border-emerald-100' },
            { id: 'card', label: 'Carte Bancaire', color: 'bg-slate-50 text-slate-800 border-slate-100' }
          ].map((m) => {
            const sum = methodTotals[m.id] || 0;
            return (
              <div key={m.id} className={`p-3 border rounded-xl text-center ${m.color}`}>
                <div className="text-[10px] font-bold uppercase tracking-wider">{m.label}</div>
                <div className="font-mono font-bold text-xs mt-1.5">
                  {sum.toLocaleString('fr-FR')} F
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2.5 OFFLINE SYNC QUEUE MANAGEMENT CARD */}
      {syncQueue.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-[24px] p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                <CloudOff className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                  <span>File d'attente de synchronisation ({syncQueue.length})</span>
                </h4>
                <p className="text-xs text-amber-800 font-medium">
                  {syncQueue.length} transaction(s) enregistrée(s localement) en attente de synchronisation.
                </p>
              </div>
            </div>

            <button
              disabled={!isOnline}
              onClick={onTriggerSync}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all ${
                isOnline 
                  ? 'bg-orange-600 hover:bg-orange-700 text-white cursor-pointer' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isOnline ? 'Synchroniser maintenant' : 'Hors-ligne (Activer "En Ligne" pour synchroniser)'}</span>
            </button>
          </div>

          {/* List of pending transactions */}
          <div className="border border-amber-200/60 rounded-xl overflow-hidden bg-white/80 backdrop-blur-xs text-xs">
            <div className="p-3 bg-amber-50/50 text-amber-900 font-bold border-b border-amber-200/50 flex items-center justify-between">
              <span>Opérations en attente de validation serveur</span>
              <span className="text-[10px] uppercase font-mono bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-extrabold">Stockage local temporaire</span>
            </div>
            <div className="divide-y divide-amber-100 font-medium">
              {syncQueue.map((item) => (
                <div key={item.id} className="p-3 flex items-center justify-between hover:bg-amber-50/20">
                  <div className="flex flex-col gap-0.5">
                    <div className="text-slate-900 font-semibold">{item.transaction.description}</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1.5 font-mono">
                      <span>Réf: {item.transaction.id}</span>
                      <span>•</span>
                      <span>Date: {new Date(item.transaction.date).toLocaleDateString('fr-FR')}</span>
                      <span>•</span>
                      <span className="uppercase text-amber-700 bg-amber-100/50 px-1 py-0.2 rounded text-[8px] font-bold">{item.transaction.method}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-slate-800 font-mono text-sm">
                      {item.transaction.type === 'expense' ? '-' : '+'}{item.transaction.amount.toLocaleString('fr-FR')} FCFA
                    </span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-bold rounded-full uppercase flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                      Attente
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. TRANSACTION HISTORY & FILTERS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        
        {/* Actions bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-orange-500" />
              Journal des Mouvements de Trésorerie (ERP)
            </h3>
            <p className="text-xs text-slate-500">Toutes les opérations d'entrées et de sorties</p>
          </div>

          <button
            onClick={() => setShowExpenseModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all w-full md:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            Enregistrer une Dépense
          </button>
        </div>

        {/* Filters and search */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher écriture, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all text-slate-800"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <select
              value={filterType}
              onChange={(e: any) => setFilterType(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-semibold text-slate-600 outline-none"
            >
              <option value="all">Tous types</option>
              <option value="lodging_payment">Hébergement</option>
              <option value="pos_sale">Caisse Maquis</option>
              <option value="expense">Dépenses</option>
            </select>

            <select
              value={filterMethod}
              onChange={(e: any) => setFilterMethod(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-semibold text-slate-600 outline-none"
            >
              <option value="all">Tous canaux</option>
              <option value="wave">Wave</option>
              <option value="orange_money">Orange Money</option>
              <option value="mtn">MTN Money</option>
              <option value="cash">Espèces</option>
              <option value="card">Carte</option>
            </select>
          </div>
        </div>

        {/* Tables list of payments */}
        <div className="border border-slate-150 rounded-2xl overflow-hidden bg-white text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Réf / Date</th>
                <th className="p-3">Description</th>
                <th className="p-3">Type</th>
                <th className="p-3">Canal</th>
                <th className="p-3">Sync</th>
                <th className="p-3 text-right">Montant (FCFA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.slice().reverse().map((t) => {
                const isPendingSync = syncQueue.some(item => item.transaction.id === t.id);
                return (
                  <tr key={t.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono text-[11px] text-slate-500">
                      <span className="font-bold text-slate-700">{t.id}</span>
                      <span className="block text-[9px] text-slate-400">{new Date(t.date).toLocaleDateString('fr-FR')}</span>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">
                      {t.description}
                    </td>
                    <td className="p-3 uppercase">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        t.type === 'lodging_payment' ? 'bg-blue-100 text-blue-800' :
                        t.type === 'pos_sale' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {t.type === 'lodging_payment' ? 'Chambre' :
                         t.type === 'pos_sale' ? 'Maquis POS' : 'Dépense'}
                      </span>
                    </td>
                    <td className="p-3 uppercase font-semibold text-orange-800 font-mono text-[10px]">
                      {t.method}
                    </td>
                    <td className="p-3 font-semibold">
                      {isPendingSync ? (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[9px] font-bold rounded-md border border-amber-200 uppercase flex items-center gap-1.5 w-fit" title="Cette écriture est stockée en cache et sera synchronisée dès la reconnexion.">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          En Attente
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[9px] font-bold rounded-md border border-emerald-150 uppercase flex items-center gap-1.5 w-fit" title="Écriture validée et enregistrée de manière permanente sur le serveur central de Bouaké.">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Synchronisé
                        </span>
                      )}
                    </td>
                    <td className={`p-3 text-right font-mono font-bold text-sm ${
                      t.type === 'expense' ? 'text-rose-600' : 'text-slate-900'
                    }`}>
                      {t.type === 'expense' ? '-' : '+'}{t.amount.toLocaleString('fr-FR')}
                    </td>
                  </tr>
                );
              })}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 italic">
                    Aucune transaction ne correspond à vos filtres.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EXPENSE LOGGING MODAL */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl space-y-5">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Nouvelle Dépense</h3>
                <p className="text-xs text-slate-500 mt-1">Saisie de sortie de caisse</p>
              </div>
              <button 
                onClick={() => setShowExpenseModal(false)}
                className="text-slate-400 hover:text-slate-600 text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLogExpense} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Motif de la Dépense *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Achat bouteilles de gaz, Lessive..."
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Montant déboursé (FCFA) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  placeholder="5000"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Canal de décaissement *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'cash', label: 'Caisse (Cash)' },
                    { id: 'wave', label: 'Wave (CI)' },
                    { id: 'orange_money', label: 'Orange Money' }
                  ].map((pay) => (
                    <button
                      key={pay.id}
                      type="button"
                      onClick={() => setExpenseMethod(pay.id as any)}
                      className={`py-2 text-center font-bold rounded-lg border text-[10px] ${
                        expenseMethod === pay.id 
                          ? 'bg-rose-600 text-white border-rose-600' 
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {pay.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
