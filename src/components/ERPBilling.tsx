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
  CheckCircle,
  FileText,
  User,
  Wallet,
  Trash2,
  Printer,
  Clock,
  ArrowRight,
  CreditCard,
  Download,
  Sparkles,
  Check,
  RotateCcw,
  PlusCircle,
  Lock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  Transaction, 
  PropertySettings, 
  OfflineSyncItem, 
  Invoice, 
  InvoiceItem, 
  CustomerAvoir, 
  AvoirMovement 
} from '../types';

interface ERPProps {
  transactions: Transaction[];
  onAddTransaction: (t: Transaction) => void;
  settings: PropertySettings;
  syncQueue?: OfflineSyncItem[];
  isOnline?: boolean;
  onTriggerSync?: () => void;
  invoices: Invoice[];
  onUpdateInvoices: (invoices: Invoice[] | ((prev: Invoice[]) => Invoice[])) => void;
  customerAvoirs: CustomerAvoir[];
  onUpdateCustomerAvoirs: (avoirs: CustomerAvoir[] | ((prev: CustomerAvoir[]) => CustomerAvoir[])) => void;
}

export default function ERPBilling({
  transactions,
  onAddTransaction,
  settings,
  syncQueue = [],
  isOnline = true,
  onTriggerSync,
  invoices,
  onUpdateInvoices,
  customerAvoirs,
  onUpdateCustomerAvoirs
}: ERPProps) {
  
  // Outer modules active tab
  const [erpActiveTab, setErpActiveTab] = useState<'ledger' | 'invoices' | 'avoirs'>('ledger');

  // Ledger / Transaction search states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'lodging_payment' | 'pos_sale' | 'expense'>('all');
  const [filterMethod, setFilterMethod] = useState<'all' | 'wave' | 'orange_money' | 'mtn' | 'cash' | 'card'>('all');

  // Expense form state
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseAmount, setExpenseAmount] = useState(0);
  const [expenseMethod, setExpenseMethod] = useState<'cash' | 'wave' | 'orange_money'>('cash');

  // Invoice list state filters
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<'all' | 'unpaid' | 'paid' | 'cancelled'>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Invoice creation form states
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [invClientName, setInvClientName] = useState('');
  const [invClientPhone, setInvClientPhone] = useState('');
  const [invClientEmail, setInvClientEmail] = useState('');
  const [invDate, setInvDate] = useState(new Date().toISOString().split('T')[0]);
  const [invDueDate, setInvDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split('T')[0];
  });
  const [invNotes, setInvNotes] = useState('');
  const [invStatus, setInvStatus] = useState<'paid' | 'unpaid'>('unpaid');
  const [invPaymentMethod, setInvPaymentMethod] = useState<'cash' | 'wave' | 'orange_money' | 'mtn' | 'card'>('cash');
  const [invItems, setInvItems] = useState<InvoiceItem[]>([
    { description: 'Consommation Maquis / Restaurant', quantity: 1, unitPrice: 15000, total: 15000 }
  ]);

  // Customer Avoir lists and forms states
  const [avoirSearch, setAvoirSearch] = useState('');
  const [expandedAvoirId, setExpandedAvoirId] = useState<string | null>(null);

  // Open Avoir Account modal
  const [showOpenAvoirModal, setShowOpenAvoirModal] = useState(false);
  const [avClientName, setAvClientName] = useState('');
  const [avClientPhone, setAvClientPhone] = useState('');
  const [avInitialDeposit, setAvInitialDeposit] = useState<number>(0);
  const [avPaymentMethod, setAvPaymentMethod] = useState<'cash' | 'wave' | 'orange_money' | 'mtn' | 'card'>('cash');

  // Recharge / Spend Credit modal
  const [showAvoirTxModal, setShowAvoirTxModal] = useState<any | null>(null); // { type: 'credit' | 'debit', avoir: CustomerAvoir }
  const [avTxAmount, setAvTxAmount] = useState<number>(0);
  const [avTxMethod, setAvTxMethod] = useState<'cash' | 'wave' | 'orange_money' | 'mtn' | 'card'>('cash');
  const [avTxReason, setAvTxReason] = useState<string>('');

  // Create Avoir modal states
  const [showCreateAvoirModal, setShowCreateAvoirModal] = useState(false);
  const [avoirClientName, setAvoirClientName] = useState('');
  const [avoirClientPhone, setAvoirClientPhone] = useState('');
  const [avoirAmount, setAvoirAmount] = useState<number>(0);
  const [avoirReason, setAvoirReason] = useState('');
  const [avoirInitialPaymentMethod, setAvoirInitialPaymentMethod] = useState<'cash' | 'wave' | 'orange_money' | 'mtn' | 'card'>('cash');

  // -------------------------------------------------------------
  // CALCULATIONS & COMPUTATIONS
  // -------------------------------------------------------------
  
  // General transactions calculations
  const filteredTransactions = transactions.filter(t => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesMethod = filterMethod === 'all' || t.method === filterMethod;
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.includes(searchQuery);
    return matchesType && matchesMethod && matchesSearch;
  });

  const totalInflow = transactions
    .filter(t => t.type !== 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutflow = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const profit = totalInflow - totalOutflow;

  const methodTotals = transactions.reduce((acc, t) => {
    if (t.type === 'expense') {
      acc[t.method] = (acc[t.method] || 0) - t.amount;
    } else {
      acc[t.method] = (acc[t.method] || 0) + t.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  // Invoice filter calculations
  const filteredInvoices = invoices.filter(inv => {
    const matchesStatus = invoiceStatusFilter === 'all' || inv.status === invoiceStatusFilter;
    const matchesSearch = 
      inv.clientName.toLowerCase().includes(invoiceSearch.toLowerCase()) || 
      inv.clientPhone.includes(invoiceSearch) || 
      inv.id.toLowerCase().includes(invoiceSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Avoirs accounts filter
  const filteredAvoirs = customerAvoirs.filter(av => {
    return av.clientName.toLowerCase().includes(avoirSearch.toLowerCase()) || 
           av.clientPhone.includes(avoirSearch) ||
           av.id.toLowerCase().includes(avoirSearch.toLowerCase());
  });

  // -------------------------------------------------------------
  // EVENT HANDLERS
  // -------------------------------------------------------------

  // Save manual expense
  const handleLogExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseDescription || expenseAmount <= 0) return;

    const newExpense: Transaction = {
      id: `DEP-${Date.now().toString().slice(-4)}`,
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

  // Dynamically manage line items in creation form
  const handleAddInvoiceItemLine = () => {
    setInvItems([...invItems, { description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const handleRemoveInvoiceItemLine = (idx: number) => {
    if (invItems.length === 1) return;
    setInvItems(invItems.filter((_, i) => i !== idx));
  };

  const handleUpdateInvoiceItemLine = (idx: number, key: keyof InvoiceItem, val: any) => {
    const updated = [...invItems];
    updated[idx] = { ...updated[idx], [key]: val };
    if (key === 'quantity' || key === 'unitPrice') {
      const q = key === 'quantity' ? parseInt(val) || 0 : updated[idx].quantity;
      const p = key === 'unitPrice' ? parseInt(val) || 0 : updated[idx].unitPrice;
      updated[idx].total = q * p;
    }
    setInvItems(updated);
  };

  // Submit invoice creation
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invClientName || invItems.some(item => !item.description || item.unitPrice <= 0)) {
      alert("Veuillez remplir correctement les lignes de la facture.");
      return;
    }

    const subtotal = invItems.reduce((acc, item) => acc + item.total, 0);
    const taxRate = settings.vatRate / 100 || 0.18;
    const taxAmount = Math.round(subtotal * taxRate);
    const totalAmount = subtotal + taxAmount;

    const newInvoice: Invoice = {
      id: `FAC-${Date.now().toString().slice(-5)}`,
      clientName: invClientName,
      clientPhone: invClientPhone,
      clientEmail: invClientEmail || undefined,
      date: invDate,
      dueDate: invDueDate,
      items: invItems,
      subtotal,
      taxRate,
      taxAmount,
      totalAmount,
      status: invStatus,
      paymentMethod: invStatus === 'paid' ? invPaymentMethod : undefined,
      notes: invNotes || undefined,
      sourceEntity: 'manual'
    };

    // Save invoice
    onUpdateInvoices(prev => [newInvoice, ...prev]);

    // If marked as Paid immediately, log it as an ERP transaction!
    if (invStatus === 'paid') {
      const newTx: Transaction = {
        id: `TX-${Date.now().toString().slice(-4)}`,
        type: 'lodging_payment', // General revenue category
        amount: totalAmount,
        method: invPaymentMethod,
        description: `Règlement facture ${newInvoice.id} - ${invClientName}`,
        date: new Date().toISOString(),
        referenceId: newInvoice.id
      };
      onAddTransaction(newTx);
    }

    // Reset form & close
    setShowCreateInvoiceModal(false);
    setInvClientName('');
    setInvClientPhone('');
    setInvClientEmail('');
    setInvItems([{ description: 'Consommation Maquis / Restaurant', quantity: 1, unitPrice: 15000, total: 15000 }]);
    setInvNotes('');
    setInvStatus('unpaid');
  };

  // Settle unpaid invoice manually
  const handleSettleInvoice = (invoiceId: string, method: 'cash' | 'wave' | 'orange_money' | 'mtn' | 'card') => {
    onUpdateInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        // Also log corresponding cash ledger entry
        const newTx: Transaction = {
          id: `TX-${Date.now().toString().slice(-4)}`,
          type: 'lodging_payment',
          amount: inv.totalAmount,
          method: method,
          description: `Règlement différé facture ${inv.id} - ${inv.clientName}`,
          date: new Date().toISOString(),
          referenceId: inv.id
        };
        onAddTransaction(newTx);

        return {
          ...inv,
          status: 'paid',
          paymentMethod: method
        };
      }
      return inv;
    }));

    // Update selected invoice preview state if open
    setSelectedInvoice(prev => prev && prev.id === invoiceId ? { ...prev, status: 'paid', paymentMethod: method } : prev);
  };

  // Open Avoir Account
  const handleOpenAvoirAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!avClientName || !avClientPhone) return;

    // Check if account already exists
    const existing = customerAvoirs.find(a => a.clientPhone === avClientPhone);
    if (existing) {
      alert(`Un compte d'avoir existe déjà pour le numéro de téléphone ${avClientPhone}.`);
      return;
    }

    const initialMover: AvoirMovement[] = [];
    let initialBalance = 0;

    if (avInitialDeposit > 0) {
      initialBalance = avInitialDeposit;
      initialMover.push({
        id: `mov-${Date.now().toString().slice(-4)}`,
        type: 'credit',
        amount: avInitialDeposit,
        reason: 'Dépôt de garantie initial à l\'ouverture du compte',
        date: new Date().toISOString(),
        paymentMethod: avPaymentMethod
      });

      // Log ERP Cash Transaction
      const newTx: Transaction = {
        id: `TX-${Date.now().toString().slice(-4)}`,
        type: 'pos_sale',
        amount: avInitialDeposit,
        method: avPaymentMethod,
        description: `Dépôt initial Compte d'Avoir de ${avClientName}`,
        date: new Date().toISOString()
      };
      onAddTransaction(newTx);
    }

    const newAvoir: CustomerAvoir = {
      id: `AVO-${Date.now().toString().slice(-4)}`,
      clientName: avClientName,
      clientPhone: avClientPhone,
      balance: initialBalance,
      movements: initialMover,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onUpdateCustomerAvoirs(prev => [newAvoir, ...prev]);
    setShowOpenAvoirModal(false);
    setAvClientName('');
    setAvClientPhone('');
    setAvInitialDeposit(0);
  };

  // Submit credit or debit action for Avoir Wallet
  const handleApplyAvoirTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAvoirTxModal || avTxAmount <= 0 || !avTxReason) return;

    const { type, avoir } = showAvoirTxModal;

    if (type === 'debit' && avoir.balance < avTxAmount) {
      alert(`Solde insuffisant ! Solde disponible : ${avoir.balance.toLocaleString('fr-FR')} FCFA. Saisissez un montant inférieur.`);
      return;
    }

    const newMov: AvoirMovement = {
      id: `mov-${Date.now().toString().slice(-4)}`,
      type: type,
      amount: avTxAmount,
      reason: avTxReason,
      date: new Date().toISOString(),
      paymentMethod: type === 'credit' ? avTxMethod : undefined
    };

    onUpdateCustomerAvoirs(prev => prev.map(a => {
      if (a.id === avoir.id) {
        const nextBalance = type === 'credit' ? a.balance + avTxAmount : a.balance - avTxAmount;
        return {
          ...a,
          balance: nextBalance,
          movements: [newMov, ...a.movements],
          updatedAt: new Date().toISOString()
        };
      }
      return a;
    }));

    // If it's a CREDIT recharge with real external payment, log an ERP cash inflow!
    if (type === 'credit') {
      const newTx: Transaction = {
        id: `TX-${Date.now().toString().slice(-4)}`,
        type: 'pos_sale',
        amount: avTxAmount,
        method: avTxMethod,
        description: `Crédit Compte d'Avoir (${avTxReason}) - ${avoir.clientName}`,
        date: new Date().toISOString()
      };
      onAddTransaction(newTx);
    }

    // Reset and close
    setShowAvoirTxModal(null);
    setAvTxAmount(0);
    setAvTxReason('');
  };

  // Submit new customer avoir creation
  const handleCreateAvoirSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!avoirClientName || avoirAmount <= 0 || !avoirReason) return;

    const newMovement: AvoirMovement = {
      id: `mov-${Date.now().toString().slice(-4)}`,
      type: 'credit',
      amount: avoirAmount,
      reason: avoirReason,
      date: new Date().toISOString(),
      paymentMethod: avoirInitialPaymentMethod
    };

    // Log ERP Cash Transaction
    const newTx: Transaction = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      type: 'pos_sale',
      amount: avoirAmount,
      method: avoirInitialPaymentMethod,
      description: `Création Avoir de ${avoirClientName} - ${avoirReason}`,
      date: new Date().toISOString()
    };
    onAddTransaction(newTx);

    onUpdateCustomerAvoirs((prevAvoirs) => {
      // Find if client already has an active account by exact/case-insensitive name or phone
      const existingIdx = prevAvoirs.findIndex(
        (a) => 
          a.clientName.toLowerCase().trim() === avoirClientName.toLowerCase().trim() ||
          (avoirClientPhone && a.clientPhone === avoirClientPhone.trim())
      );

      if (existingIdx !== -1) {
        // Update existing account
        const updated = [...prevAvoirs];
        const existing = updated[existingIdx];
        updated[existingIdx] = {
          ...existing,
          balance: existing.balance + avoirAmount,
          movements: [newMovement, ...existing.movements],
          updatedAt: new Date().toISOString()
        };
        return updated;
      } else {
        // Create new CustomerAvoir
        const newAvoir: CustomerAvoir = {
          id: `AVO-${Date.now().toString().slice(-4)}`,
          clientName: avoirClientName.trim(),
          clientPhone: avoirClientPhone.trim() || 'N/A',
          balance: avoirAmount,
          movements: [newMovement],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        return [newAvoir, ...prevAvoirs];
      }
    });

    // Reset state & close modal
    setShowCreateAvoirModal(false);
    setAvoirClientName('');
    setAvoirClientPhone('');
    setAvoirAmount(0);
    setAvoirReason('');
    setAvoirInitialPaymentMethod('cash');
  };

  // Simulate print invoice action
  const handlePrintInvoiceSimulator = (invoice: Invoice) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Le bloqueur de fenêtres pop-up a empêché l'ouverture de l'aperçu d'impression. Veuillez autoriser les fenêtres pop-up.");
      return;
    }

    const itemsRows = invoice.items.map(item => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 0; font-size: 13px; color: #1e293b;">${item.description}</td>
        <td style="padding: 10px 0; font-size: 13px; color: #1e293b; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px 0; font-size: 13px; color: #1e293b; text-align: right; font-family: monospace;">${item.unitPrice.toLocaleString('fr-FR')} F</td>
        <td style="padding: 10px 0; font-size: 13px; color: #1e293b; text-align: right; font-family: monospace; font-weight: bold;">${item.total.toLocaleString('fr-FR')} F</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Facture ${invoice.id} - ${invoice.clientName}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #334155; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; border-bottom: 3px solid #f97316; padding-bottom: 20px; margin-bottom: 30px; }
            .logo-text { font-size: 24px; font-weight: 900; color: #0f172a; tracking: -0.05em; }
            .badge-paid { background-color: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 12px; font-weight: bold; font-size: 12px; text-transform: uppercase; display: inline-block; }
            .badge-unpaid { background-color: #fee2e2; color: #991b1b; padding: 4px 12px; border-radius: 12px; font-weight: bold; font-size: 12px; text-transform: uppercase; display: inline-block; }
            .grid-meta { display: grid; grid-template-cols: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            th { border-bottom: 2px solid #cbd5e1; padding-bottom: 10px; color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: bold; }
            .totals { float: right; width: 300px; }
            .totals-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; }
            .totals-row.grand { border-top: 2px solid #0f172a; padding-top: 12px; font-size: 16px; font-weight: bold; color: #0f172a; }
            .footer-msg { margin-top: 80px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          </style>
        </head>
        <body onload="window.print()">
          <div class="header">
            <div>
              <div class="logo-text">${settings.establishmentName.toUpperCase()}</div>
              <div style="font-size: 11px; color: #64748b; margin-top: 4px;">${settings.address}, ${settings.city}</div>
              <div style="font-size: 11px; color: #64748b;">Tél : ${settings.phoneNumbers}</div>
              <div style="font-size: 11px; color: #64748b;">N° CC/RCCM: ${settings.taxId}</div>
            </div>
            <div style="text-align: right;">
              <h1 style="font-size: 28px; margin: 0; font-weight: 800; color: #0f172a;">FACTURE</h1>
              <div style="font-family: monospace; font-weight: bold; color: #f97316; margin: 5px 0; font-size: 15px;">N° ${invoice.id}</div>
              <div style="margin-top: 10px;">
                ${invoice.status === 'paid' 
                  ? `<span class="badge-paid">PAYÉE via ${invoice.paymentMethod?.toUpperCase()}</span>` 
                  : `<span class="badge-unpaid">EN ATTENTE DE RÈGLEMENT</span>`
                }
              </div>
            </div>
          </div>

          <div class="grid-meta">
            <div>
              <div style="font-size: 11px; font-weight: bold; color: #94a3b8; text-transform: uppercase; margin-bottom: 6px;">Facturé à :</div>
              <div style="font-size: 14px; font-weight: bold; color: #0f172a;">${invoice.clientName}</div>
              <div style="font-size: 12px; color: #475569; margin-top: 4px;">Tél : ${invoice.clientPhone}</div>
              ${invoice.clientEmail ? `<div style="font-size: 12px; color: #475569;">Email : ${invoice.clientEmail}</div>` : ''}
            </div>
            <div style="text-align: right;">
              <div style="font-size: 12px; color: #475569;"><strong>Date de facture :</strong> ${new Date(invoice.date).toLocaleDateString('fr-FR')}</div>
              <div style="font-size: 12px; color: #475569; margin-top: 4px;"><strong>Date d'échéance :</strong> ${new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="text-align: left;">Désignation / Article</th>
                <th style="text-align: center; width: 80px;">Qté</th>
                <th style="text-align: right; width: 120px;">Prix Unitaire</th>
                <th style="text-align: right; width: 140px;">Montant Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-row">
              <span>Sous-total HT</span>
              <span style="font-family: monospace;">${invoice.subtotal.toLocaleString('fr-FR')} FCFA</span>
            </div>
            <div class="totals-row">
              <span>TVA (${(invoice.taxRate * 100).toFixed(0)}%)</span>
              <span style="font-family: monospace;">${invoice.taxAmount.toLocaleString('fr-FR')} FCFA</span>
            </div>
            <div class="totals-row grand">
              <span>NET À PAYER</span>
              <span style="font-family: monospace;">${invoice.totalAmount.toLocaleString('fr-FR')} FCFA</span>
            </div>
          </div>

          <div style="clear: both; margin-top: 60px;">
            <p style="font-size: 12px; color: #475569;"><strong>Notes / Conditions de règlement :</strong></p>
            <p style="font-size: 12px; color: #64748b; font-style: italic; margin-top: 4px;">${invoice.notes || 'Règlement sous 15 jours dès réception de la présente facture.'}</p>
          </div>

          <div class="footer-msg">
            <p style="font-weight: bold; margin-bottom: 4px;">${settings.invoiceFooter}</p>
            <p>Merci pour votre fidélité & confiance ! Brunch Bouaké — PMS & ERP Propre.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6 text-slate-800">

      {/* 🌟 MAIN MULTI-TAB NAVIGATION */}
      <div className="bg-slate-900 text-white rounded-3xl p-2.5 border border-slate-800 flex flex-wrap gap-2 shadow-md">
        <button
          onClick={() => setErpActiveTab('ledger')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
            erpActiveTab === 'ledger'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Journal de Caisse & Flux</span>
        </button>
        <button
          onClick={() => setErpActiveTab('invoices')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
            erpActiveTab === 'invoices'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Facturation & Devis</span>
          {invoices.filter(i => i.status === 'unpaid').length > 0 && (
            <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full animate-pulse ml-0.5">
              {invoices.filter(i => i.status === 'unpaid').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setErpActiveTab('avoirs')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
            erpActiveTab === 'avoirs'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Wallet className="w-4 h-4 text-emerald-400" />
          <span>Comptes d'Avoir & Portefeuilles</span>
          <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.2 rounded-md font-semibold border border-emerald-800/40">
            Ardoises
          </span>
        </button>
      </div>

      {/* 1. FINANCIAL SUMMARY GRID (Always visible for context) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Inflows */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs text-left">
          <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            <span>Recettes Globales (In)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-1 text-2xl font-black font-mono text-slate-900">
            {totalInflow.toLocaleString('fr-FR')} <span className="text-xs font-sans text-slate-500 font-normal">FCFA</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">
            Hôtel + Addition Caisse Maquis
          </p>
        </div>

        {/* Total Outflows */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs text-left">
          <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            <span>Dépenses Enregistrées (Out)</span>
            <TrendingDown className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-1 text-2xl font-black font-mono text-rose-600">
            {totalOutflow.toLocaleString('fr-FR')} <span className="text-xs font-sans text-slate-500 font-normal">FCFA</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">
            Approvisionnements, maintenance, gaz
          </p>
        </div>

        {/* Net Profit */}
        <div className="bg-orange-50 border border-orange-100 rounded-3xl p-5 shadow-xs text-left">
          <div className="flex justify-between items-center text-[10px] text-orange-800 uppercase font-bold tracking-wider">
            <span>Bénéfice Net Reconstitué</span>
            <Calculator className="w-4 h-4 text-orange-700" />
          </div>
          <div className="mt-1 text-2xl font-black font-mono text-orange-950">
            {profit.toLocaleString('fr-FR')} <span className="text-xs font-sans text-slate-500 font-normal">FCFA</span>
          </div>
          <p className="text-[10px] text-orange-700 mt-1.5">
            Trésorerie nette disponible en caisse
          </p>
        </div>
      </div>

      {/* -------------------------------------------------------------
          MODULE 1 : LEDGER / JOURNAL DES FLUX
          ------------------------------------------------------------- */}
      {erpActiveTab === 'ledger' && (
        <div className="space-y-6 animate-fade-in text-left">
          {/* RECONCILIATION SUMMARY BOX */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 mb-2 uppercase tracking-wider">
              <PieChart className="w-4.5 h-4.5 text-orange-500" />
              Réconciliation par Canal de Paiement (Solde Net)
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Comparez les montants enregistrés pour équilibrer les comptes mobiles (Wave, Orange) et le coffre-fort à la fermeture.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { id: 'wave', label: 'Wave (CI)', color: 'bg-blue-50 text-blue-700 border-blue-100/50' },
                { id: 'orange_money', label: 'Orange Money', color: 'bg-orange-50 text-orange-700 border-orange-100/50' },
                { id: 'mtn', label: 'MTN MoMo', color: 'bg-yellow-50 text-yellow-800 border-yellow-100/50' },
                { id: 'cash', label: 'Espèces (Caisse)', color: 'bg-emerald-50 text-emerald-800 border-emerald-100/50' },
                { id: 'card', label: 'Carte Bancaire', color: 'bg-slate-50 text-slate-800 border-slate-100/50' }
              ].map((m) => {
                const sum = methodTotals[m.id] || 0;
                return (
                  <div key={m.id} className={`p-3 border rounded-2xl text-center ${m.color}`}>
                    <div className="text-[9px] font-black uppercase tracking-wider">{m.label}</div>
                    <div className="font-mono font-black text-sm mt-1">
                      {sum.toLocaleString('fr-FR')} F
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SYNC QUEUE DISPLAY */}
          {syncQueue.length > 0 && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                    <CloudOff className="w-5 h-5 animate-bounce text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-950 text-sm uppercase tracking-wider">
                      Validation Hors-ligne ({syncQueue.length} En attente)
                    </h4>
                    <p className="text-xs text-amber-800 mt-0.5">
                      Les écritures ci-dessous ont été enregistrées localement sans internet.
                    </p>
                  </div>
                </div>

                <button
                  disabled={!isOnline}
                  onClick={onTriggerSync}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-xs transition-all ${
                    isOnline 
                      ? 'bg-orange-600 hover:bg-orange-700 text-white cursor-pointer' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isOnline ? 'Synchroniser maintenant' : 'En attente de connexion'}</span>
                </button>
              </div>
            </div>
          )}

          {/* GENERAL LEDGER TABLE */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-950 uppercase tracking-tight flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-orange-500" />
                  Journal Général de Trésorerie
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">Saisie et suivi des transactions financières d'exploitation.</p>
              </div>

              <button
                onClick={() => setShowExpenseModal(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-2xl shadow-xs transition-all w-full md:w-auto justify-center cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Enregistrer une Dépense
              </button>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between text-xs font-semibold">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher écriture, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-slate-800 font-medium"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <select
                  value={filterType}
                  onChange={(e: any) => setFilterType(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-600 outline-none"
                >
                  <option value="all">Tous types</option>
                  <option value="lodging_payment">Hébergement</option>
                  <option value="pos_sale">Caisse Maquis</option>
                  <option value="expense">Dépenses d'Exploitation</option>
                </select>

                <select
                  value={filterMethod}
                  onChange={(e: any) => setFilterMethod(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-600 outline-none"
                >
                  <option value="all">Tous canaux</option>
                  <option value="wave">Wave (CI)</option>
                  <option value="orange_money">Orange Money</option>
                  <option value="mtn">MTN Money</option>
                  <option value="cash">Espèces</option>
                  <option value="card">Carte Bancaire</option>
                </select>
              </div>
            </div>

            {/* Ledger Listing */}
            <div className="border border-slate-100 rounded-2xl overflow-x-auto bg-white text-xs font-semibold">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-400 font-bold border-b border-slate-150 text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">ID / Date</th>
                    <th className="p-3.5">Description</th>
                    <th className="p-3.5">Catégorie</th>
                    <th className="p-3.5">Canal de Règlement</th>
                    <th className="p-3.5">Statut de Synchro</th>
                    <th className="p-3.5 text-right">Montant (FCFA)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {filteredTransactions.slice().reverse().map((t) => {
                    const isPendingSync = syncQueue.some(item => item.transaction.id === t.id);
                    return (
                      <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3.5 font-mono text-[11px] text-slate-500">
                          <span className="font-bold text-slate-700">{t.id}</span>
                          <span className="block text-[9px] text-slate-400">{new Date(t.date).toLocaleDateString('fr-FR')}</span>
                        </td>
                        <td className="p-3.5 font-bold text-slate-900">
                          {t.description}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                            t.type === 'lodging_payment' ? 'bg-blue-50 text-blue-700 border border-blue-100/40' :
                            t.type === 'pos_sale' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/40' :
                            'bg-rose-50 text-rose-700 border border-rose-100/40'
                          }`}>
                            {t.type === 'lodging_payment' ? 'Chambre' :
                             t.type === 'pos_sale' ? 'Maquis POS' : 'Dépense'}
                          </span>
                        </td>
                        <td className="p-3.5 uppercase font-mono font-black text-slate-800">
                          {t.method}
                        </td>
                        <td className="p-3.5">
                          {isPendingSync ? (
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[9px] font-bold rounded-full border border-amber-100 uppercase flex items-center gap-1 w-fit">
                              <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse"></span>
                              Attente
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[9px] font-bold rounded-full border border-emerald-100 uppercase flex items-center gap-1 w-fit">
                              <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                              En Ligne
                            </span>
                          )}
                        </td>
                        <td className={`p-3.5 text-right font-mono font-black text-sm ${
                          t.type === 'expense' ? 'text-rose-600' : 'text-slate-950'
                        }`}>
                          {t.type === 'expense' ? '-' : '+'}{t.amount.toLocaleString('fr-FR')}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400 italic font-medium">
                        Aucune transaction ne correspond à vos filtres.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODULE 2 : FACTURATIONS CLIENTS (INVOICES)
          ------------------------------------------------------------- */}
      {erpActiveTab === 'invoices' && (
        <div className="space-y-6 animate-fade-in text-left">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-950 uppercase tracking-tight flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-500" />
                  Module de Facturation & Devis
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">Générez des factures professionnelles avec TVA de 18% pour les séjours ou les grands banquets du Maquis.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <button
                  onClick={() => setShowCreateInvoiceModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-2xl shadow-md cursor-pointer transition-all self-stretch md:self-auto justify-center"
                >
                  <PlusCircle className="w-4.5 h-4.5" />
                  Créer une Facture
                </button>
                <button
                  onClick={() => setShowCreateAvoirModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md cursor-pointer transition-all self-stretch md:self-auto justify-center"
                >
                  <Wallet className="w-4.5 h-4.5" />
                  Créer un Avoir
                </button>
              </div>
            </div>

            {/* Invoices filtering */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between text-xs font-semibold">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher par client, tél, facture..."
                  value={invoiceSearch}
                  onChange={(e) => setInvoiceSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-slate-800 font-medium"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
                {[
                  { id: 'all', label: 'Toutes' },
                  { id: 'unpaid', label: 'En attente' },
                  { id: 'paid', label: 'Payées' },
                  { id: 'cancelled', label: 'Annulées' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setInvoiceStatusFilter(opt.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      invoiceStatusFilter === opt.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Invoices Grid/List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredInvoices.map((inv) => (
                <div 
                  key={inv.id} 
                  className={`border rounded-2xl p-4 hover:shadow-md transition-all relative flex flex-col justify-between text-left ${
                    inv.status === 'paid' ? 'border-emerald-100 bg-emerald-50/5' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div>
                      <span className="font-mono text-[10px] text-orange-500 font-bold block">{inv.id}</span>
                      <h4 className="font-extrabold text-slate-900 text-sm mt-0.5">{inv.clientName}</h4>
                      <span className="text-[10px] text-slate-500 block font-medium">{inv.clientPhone}</span>
                    </div>

                    <div className="text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider block text-center ${
                        inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                        inv.status === 'unpaid' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {inv.status === 'paid' ? 'Payée' : inv.status === 'unpaid' ? 'À régler' : 'Annulée'}
                      </span>
                      <span className="text-[9px] text-slate-400 block mt-1 font-medium">Échéance: {new Date(inv.dueDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>

                  {/* Summary items */}
                  <div className="py-2.5 border-y border-slate-100 text-[11px] text-slate-500 space-y-1">
                    <span className="font-bold text-slate-700">Détails des prestations :</span>
                    <div className="max-h-16 overflow-y-auto pr-1">
                      {inv.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between font-medium">
                          <span className="truncate max-w-[180px]">• {item.description} (x{item.quantity})</span>
                          <span className="font-mono text-slate-800">{item.total.toLocaleString('fr-FR')} F</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing footer */}
                  <div className="flex items-center justify-between pt-3 mt-1.5">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">Montant Net TTC</span>
                      <span className="font-mono font-black text-slate-950 text-base">{inv.totalAmount.toLocaleString('fr-FR')} FCFA</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>Aperçu</span>
                      </button>
                      <button
                        onClick={() => handlePrintInvoiceSimulator(inv)}
                        className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-xl transition-all cursor-pointer"
                        title="Imprimer ou Enregistrer en PDF"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredInvoices.length === 0 && (
                <div className="col-span-2 text-center py-10 border border-dashed border-slate-200 rounded-3xl text-slate-400 font-medium">
                  Aucune facture trouvée pour vos critères de recherche.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODULE 3 : SYSTEME D'AVOIRS & PORTEFEUILLES ( loyalty credit / prepaid )
          ------------------------------------------------------------- */}
      {erpActiveTab === 'avoirs' && (
        <div className="space-y-6 animate-fade-in text-left">
          
          {/* Welcome/Guide Panel for Avoirs */}
          <div className="bg-gradient-to-br from-emerald-900 to-slate-950 text-white rounded-3xl p-6 border border-emerald-800 shadow-xl relative overflow-hidden text-left">
            <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
            
            <div className="flex flex-col lg:flex-row gap-6 justify-between lg:items-center relative z-10">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-emerald-500 text-white font-mono text-[9px] font-black rounded uppercase tracking-wider animate-pulse">
                    FONCTIONNALITÉ SPÉCIALE MAQUIS
                  </span>
                  <span className="text-emerald-400 text-xs font-bold">• Gestion des Ardoises & Crédits</span>
                </div>
                <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                  <Wallet className="w-5.5 h-5.5 text-emerald-400" />
                  Système de Comptes d'Avoir & Portefeuille Client
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Dans nos maquis et hôtels, les habitués déposent souvent une somme à l'avance (prépayé) pour consommer librement sans régler à chaque commande, ou bénéficient d'un avoir suite à un retour de bouteilles consignées ou une annulation. Gérez ces comptes de manière transparente ici.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 self-start lg:self-center">
                <button
                  onClick={() => setShowOpenAvoirModal(true)}
                  className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-white" />
                  Ouvrir un Compte d'Avoir
                </button>
                <button
                  onClick={() => setShowCreateAvoirModal(true)}
                  className="px-5 py-3 bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-300 font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <Wallet className="w-4 h-4 text-emerald-600" />
                  Créer un Avoir
                </button>
              </div>
            </div>

            {/* mini statistics */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-5 border-t border-emerald-800/50">
              <div>
                <span className="text-[10px] text-emerald-300 uppercase tracking-wider block font-bold">Comptes d'Avoirs Actifs</span>
                <span className="text-lg font-black text-white font-mono">{customerAvoirs.length} clients</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-300 uppercase tracking-wider block font-bold">Dépôts Prépayés Globaux</span>
                <span className="text-lg font-black text-emerald-400 font-mono">
                  {customerAvoirs.reduce((acc, a) => acc + a.balance, 0).toLocaleString('fr-FR')} FCFA
                </span>
              </div>
              <div className="col-span-2 md:col-span-1">
                <span className="text-[10px] text-emerald-300 uppercase tracking-wider block font-bold">Garantie & Consignes Restituées</span>
                <span className="text-xs text-slate-300 font-medium">Fonds de roulement disponibles et sécurisés.</span>
              </div>
            </div>
          </div>

          {/* Accounts list */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="text-sm font-black text-slate-950 uppercase tracking-tight">
                  Liste des Portefeuilles Clients
                </h4>
                <p className="text-[10px] text-slate-400 font-medium">Consultez les soldes restants, rechargez les ardoises ou déduisez des règlements.</p>
              </div>

              <div className="relative w-full sm:w-64 text-xs">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher un abonné/habitué..."
                  value={avoirSearch}
                  onChange={(e) => setAvoirSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-all font-medium text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredAvoirs.map((avoir) => {
                const isExpanded = expandedAvoirId === avoir.id;
                return (
                  <div key={avoir.id} className="border border-slate-150 rounded-2xl overflow-hidden transition-all hover:border-slate-300 bg-white shadow-xs">
                    {/* Header bar of the account */}
                    <div 
                      className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:bg-slate-50/50"
                      onClick={() => setExpandedAvoirId(isExpanded ? null : avoir.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-extrabold text-slate-900 text-sm">{avoir.clientName}</h5>
                            <span className="font-mono text-[9px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.2 rounded-md">ID: {avoir.id}</span>
                          </div>
                          <span className="text-xs text-slate-500 font-medium font-mono">{avoir.clientPhone}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between">
                        <div className="text-right">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Solde d'Avoir Actif</span>
                          <span className="font-mono font-black text-emerald-600 text-base">
                            {avoir.balance.toLocaleString('fr-FR')} FCFA
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Direct Actions inside row */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAvoirTxModal({ type: 'credit', avoir });
                            }}
                            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-100 text-[11px] font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            <span>Créditer</span>
                          </button>
                          <button
                            disabled={avoir.balance <= 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (avoir.balance <= 0) return;
                              setShowAvoirTxModal({ type: 'debit', avoir });
                            }}
                            className={`px-2.5 py-1.5 text-[11px] font-bold rounded-xl transition-all flex items-center gap-1 ${
                              avoir.balance > 0 
                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-150 cursor-pointer' 
                                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-50'
                            }`}
                          >
                            <ArrowDownRight className="w-3.5 h-3.5" />
                            <span>Déduire</span>
                          </button>
                          
                          <div className="text-slate-400 p-1">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expandable transaction logs for this specific customer avoir wallet */}
                    {isExpanded && (
                      <div className="bg-slate-50/60 p-4 border-t border-slate-150 text-xs text-left font-semibold">
                        <h6 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          Historique de l'Ardoise / Comptes de Mouvements d'Avoir
                        </h6>

                        <div className="border border-slate-150 rounded-xl overflow-hidden bg-white max-h-52 overflow-y-auto font-medium">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[9px] uppercase font-bold">
                              <tr>
                                <th className="p-2.5">Date</th>
                                <th className="p-2.5">Type de Flux</th>
                                <th className="p-2.5">Motif / Justificatif</th>
                                <th className="p-2.5">Canal (Si Rechargé)</th>
                                <th className="p-2.5 text-right">Montant</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {avoir.movements.length === 0 ? (
                                <tr>
                                  <td colSpan={5} className="text-center py-4 text-slate-400 italic">
                                    Aucune transaction sur ce portefeuille.
                                  </td>
                                </tr>
                              ) : (
                                avoir.movements.map((mov) => (
                                  <tr key={mov.id} className="hover:bg-slate-50/40">
                                    <td className="p-2.5 font-mono text-[10px] text-slate-500">
                                      {new Date(mov.date).toLocaleDateString('fr-FR')} {new Date(mov.date).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                                    </td>
                                    <td className="p-2.5">
                                      <span className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase ${
                                        mov.type === 'credit' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                                      }`}>
                                        {mov.type === 'credit' ? '+ Crédit' : '- Consommation'}
                                      </span>
                                    </td>
                                    <td className="p-2.5 font-bold text-slate-900">{mov.reason}</td>
                                    <td className="p-2.5 font-mono uppercase text-slate-500">{mov.paymentMethod || 'avoir'}</td>
                                    <td className={`p-2.5 text-right font-mono font-black ${
                                      mov.type === 'credit' ? 'text-emerald-600' : 'text-slate-800'
                                    }`}>
                                      {mov.type === 'credit' ? '+' : '-'}{mov.amount.toLocaleString('fr-FR')} F
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredAvoirs.length === 0 && (
                <div className="text-center py-8 text-slate-400 italic font-medium">
                  Aucun compte d'avoir trouvé. Ouvrez votre premier compte en un clic !
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =============================================================
          MODALS & FORMULAIRES DE DIALOGUE
          ============================================================= */}

      {/* EXPENSE LOGGING MODAL */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-150">
              <div>
                <h3 className="text-sm font-black text-slate-950 uppercase">Nouvelle Dépense</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Saisie de sortie de caisse physique</p>
              </div>
              <button 
                onClick={() => setShowExpenseModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLogExpense} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-500 mb-1">Motif de la Dépense *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Achat bouteilles de gaz, charbon..."
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Montant déboursé (FCFA) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  placeholder="5000"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Canal de décaissement *</label>
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
                      className={`py-2 text-center font-bold rounded-lg border text-[10px] cursor-pointer ${
                        expenseMethod === pay.id 
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs' 
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
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE INVOICE MODAL */}
      {showCreateInvoiceModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-left">
            <div className="flex justify-between items-start pb-3 border-b border-slate-150">
              <div>
                <h3 className="text-sm font-black text-slate-950 uppercase flex items-center gap-1.5">
                  <PlusCircle className="w-5 h-5 text-orange-500" />
                  Saisie d'une Nouvelle Facture Client
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Créez des devis et des factures complexes.</p>
              </div>
              <button 
                onClick={() => setShowCreateInvoiceModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">Nom du client *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Kouamé Richard"
                    value={invClientName}
                    onChange={(e) => setInvClientName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium focus:border-orange-500 focus:outline-none text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Téléphone *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: +225 07 00 00 00 00"
                    value={invClientPhone}
                    onChange={(e) => setInvClientPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Email (Optionnel)</label>
                  <input
                    type="email"
                    placeholder="client@mail.com"
                    value={invClientEmail}
                    onChange={(e) => setInvClientEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">Date Facture</label>
                  <input
                    type="date"
                    required
                    value={invDate}
                    onChange={(e) => setInvDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Date d'Échéance (Due Date)</label>
                  <input
                    type="date"
                    required
                    value={invDueDate}
                    onChange={(e) => setInvDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Prestations Table */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold block uppercase tracking-wider text-[10px]">Prestations & Lignes de Facture</span>
                  <button
                    type="button"
                    onClick={handleAddInvoiceItemLine}
                    className="text-orange-500 hover:text-orange-600 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    + Ajouter une ligne
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {invItems.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 relative">
                      <div className="w-full sm:flex-1">
                        <input
                          type="text"
                          required
                          placeholder="Désignation de la prestation / boisson / nuitée"
                          value={item.description}
                          onChange={(e) => handleUpdateInvoiceItemLine(idx, 'description', e.target.value)}
                          className="w-full bg-white px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 font-medium"
                        />
                      </div>
                      <div className="flex gap-2 items-center w-full sm:w-auto">
                        <div className="w-16">
                          <input
                            type="number"
                            required
                            min={1}
                            placeholder="Qté"
                            value={item.quantity}
                            onChange={(e) => handleUpdateInvoiceItemLine(idx, 'quantity', parseInt(e.target.value) || 0)}
                            className="w-full text-center bg-white px-1.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 font-mono"
                          />
                        </div>
                        <div className="w-28">
                          <input
                            type="number"
                            required
                            min={0}
                            placeholder="P.U (FCFA)"
                            value={item.unitPrice}
                            onChange={(e) => handleUpdateInvoiceItemLine(idx, 'unitPrice', parseInt(e.target.value) || 0)}
                            className="w-full text-right bg-white px-1.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 font-mono"
                          />
                        </div>
                        <div className="w-24 text-right font-mono font-bold text-slate-900 pr-1 text-xs">
                          {item.total.toLocaleString('fr-FR')} F
                        </div>
                        {invItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveInvoiceItemLine(idx)}
                            className="text-rose-500 hover:text-rose-600 p-1 rounded-lg cursor-pointer hover:bg-rose-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subtotal, Tax rate, and Total */}
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-semibold">
                <div className="space-y-1">
                  <div>
                    Sous-total HT : <span className="font-mono text-slate-900">{invItems.reduce((acc, i) => acc + i.total, 0).toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <div>
                    TVA ({settings.vatRate || 18}%) : <span className="font-mono text-slate-900">{Math.round(invItems.reduce((acc, i) => acc + i.total, 0) * (settings.vatRate / 100 || 0.18)).toLocaleString('fr-FR')} FCFA</span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Montant Total TTC :</span>
                  <span className="font-mono text-xl text-orange-600 font-black">
                    {(Math.round(invItems.reduce((acc, i) => acc + i.total, 0) * (1 + (settings.vatRate / 100 || 0.18)))).toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>

              {/* Status and Payment option */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1">Statut initial de la facture *</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setInvStatus('unpaid')}
                      className={`flex-1 py-2 text-center rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                        invStatus === 'unpaid'
                          ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-xs'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Dû (À régler plus tard)
                    </button>
                    <button
                      type="button"
                      onClick={() => setInvStatus('paid')}
                      className={`flex-1 py-2 text-center rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                        invStatus === 'paid'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-xs'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Payée immédiatement
                    </button>
                  </div>
                </div>

                {invStatus === 'paid' && (
                  <div>
                    <label className="block text-slate-500 mb-1">Moyen de règlement immédiat *</label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[
                        { id: 'cash', label: 'Cash' },
                        { id: 'wave', label: 'Wave' },
                        { id: 'orange_money', label: 'OM' },
                        { id: 'mtn', label: 'MTN' },
                        { id: 'card', label: 'Carte' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setInvPaymentMethod(item.id as any)}
                          className={`py-1.5 text-center text-[10px] font-black rounded-lg border uppercase cursor-pointer ${
                            invPaymentMethod === item.id
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-white text-slate-600 border-slate-200'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Notes / Conditions de devis (Optionnel)</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Règlement attendu le 15, ou acompte versé..."
                  value={invNotes}
                  onChange={(e) => setInvNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-150 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateInvoiceModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Générer & Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SELECTED INVOICE DETAIL / SIMULATOR MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative space-y-5 text-left text-xs max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedInvoice(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 text-base font-bold cursor-pointer"
            >
              ✕
            </button>

            {/* Header simulation card */}
            <div className="text-center pb-4 border-b border-slate-150 space-y-1">
              <h4 className="font-black text-slate-950 uppercase tracking-widest text-sm">{settings.establishmentName}</h4>
              <p className="text-[10px] text-slate-500 font-medium">{settings.address}, {settings.city} • Tél: {settings.phoneNumbers}</p>
              <p className="text-[9px] text-slate-400 font-mono font-bold">N° de C.C / RCCM : {settings.taxId}</p>
            </div>

            {/* Details and dates */}
            <div className="flex justify-between gap-4 font-semibold">
              <div>
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Facturé à</span>
                <span className="font-extrabold text-slate-900 text-sm">{selectedInvoice.clientName}</span>
                <span className="text-[10px] text-slate-500 block font-mono mt-0.5">{selectedInvoice.clientPhone}</span>
              </div>

              <div className="text-right">
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Facture</span>
                <span className="font-mono text-orange-500 font-extrabold text-sm block">{selectedInvoice.id}</span>
                <span className="text-[10px] text-slate-500 block font-mono mt-0.5">Date: {new Date(selectedInvoice.date).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>

            {/* Prestation items list */}
            <div className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50">
              <div className="grid grid-cols-4 bg-slate-100 p-2 font-bold text-slate-500 uppercase tracking-wider text-[9px] border-b border-slate-200">
                <span className="col-span-2">Prestation</span>
                <span className="text-center">Qté</span>
                <span className="text-right">Total</span>
              </div>
              <div className="divide-y divide-slate-100 font-medium text-slate-700">
                {selectedInvoice.items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-4 p-2.5 items-center">
                    <span className="col-span-2 font-bold text-slate-900">{item.description}</span>
                    <span className="text-center font-mono">{item.quantity} x {item.unitPrice.toLocaleString('fr-FR')}</span>
                    <span className="text-right font-mono font-extrabold">{item.total.toLocaleString('fr-FR')} F</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary calculation card */}
            <div className="flex flex-col items-end space-y-1 bg-slate-50/80 p-3 rounded-xl border border-slate-150 font-semibold">
              <div className="text-slate-500 text-[11px]">
                Sous-total HT : <span className="font-mono text-slate-800">{selectedInvoice.subtotal.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="text-slate-500 text-[11px]">
                TVA (${(selectedInvoice.taxRate * 100).toFixed(0)}%) : <span className="font-mono text-slate-800">{selectedInvoice.taxAmount.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="text-slate-950 font-black text-sm border-t border-slate-300 pt-1.5 w-full text-right">
                Net à payer : <span className="font-mono text-orange-600 text-base">{selectedInvoice.totalAmount.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>

            {/* Note block */}
            {selectedInvoice.notes && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 font-medium text-slate-500">
                <strong>Conditions de règlement :</strong>
                <p className="mt-0.5 font-semibold text-slate-600 italic">"{selectedInvoice.notes}"</p>
              </div>
            )}

            {/* Action buttons inside detail */}
            <div className="flex flex-col sm:flex-row gap-2 border-t border-slate-150 pt-4">
              {/* If unpaid, allow settling right from this screen */}
              {selectedInvoice.status === 'unpaid' ? (
                <div className="w-full space-y-2">
                  <span className="text-[10px] text-amber-800 font-bold block uppercase tracking-wide">💵 Facture en attente de règlement : Choisir le canal pour encaisser</span>
                  <div className="grid grid-cols-5 gap-1">
                    {['cash', 'wave', 'orange_money', 'mtn', 'card'].map((method) => (
                      <button
                        key={method}
                        onClick={() => handleSettleInvoice(selectedInvoice.id, method as any)}
                        className="py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg text-[9px] uppercase tracking-wider text-center cursor-pointer"
                      >
                        {method === 'orange_money' ? 'OM' : method === 'mtn' ? 'MTN' : method}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 bg-emerald-50 border border-emerald-100 rounded-xl p-2.5 flex items-center gap-2 text-emerald-800 font-bold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Cette facture est soldée via {selectedInvoice.paymentMethod?.toUpperCase()} !</span>
                </div>
              )}

              <div className="flex gap-2 self-end">
                <button
                  onClick={() => handlePrintInvoiceSimulator(selectedInvoice)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimer</span>
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OPEN AVOIR ACCOUNT MODAL */}
      {showOpenAvoirModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl space-y-4 text-left">
            <div className="flex justify-between items-start pb-3 border-b border-slate-150">
              <div>
                <h3 className="text-sm font-black text-slate-950 uppercase">Ouvrir un Compte d'Avoir</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Créez un portefeuille d'avoir / ardoise client.</p>
              </div>
              <button 
                onClick={() => setShowOpenAvoirModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleOpenAvoirAccount} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-500 mb-1">Nom Complet du Client *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Soro Amadou"
                  value={avClientName}
                  onChange={(e) => setAvClientName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">N° de Téléphone (Unique) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: +225 07 12 34 56 78"
                  value={avClientPhone}
                  onChange={(e) => setAvClientPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Dépôt Initial Facultatif (FCFA)</label>
                <input
                  type="number"
                  min={0}
                  placeholder="Ex: 25000"
                  value={avInitialDeposit}
                  onChange={(e) => setAvInitialDeposit(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {avInitialDeposit > 0 && (
                <div>
                  <label className="block text-slate-500 mb-1">Moyen d'Encaïssement du dépôt *</label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[
                      { id: 'cash', label: 'Cash' },
                      { id: 'wave', label: 'Wave' },
                      { id: 'orange_money', label: 'OM' },
                      { id: 'mtn', label: 'MTN' },
                      { id: 'card', label: 'Carte' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setAvPaymentMethod(item.id as any)}
                        className={`py-1.5 text-center text-[10px] font-black rounded-lg border uppercase cursor-pointer ${
                          avPaymentMethod === item.id
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOpenAvoirModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Ouvrir le Compte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECHARGE / SPEND AVOIR TRANSACTION MODAL */}
      {showAvoirTxModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 text-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl space-y-4 text-left">
            <div className="flex justify-between items-start pb-3 border-b border-slate-150 font-semibold">
              <div>
                <h3 className="text-sm font-black text-slate-950 uppercase">
                  {showAvoirTxModal.type === 'credit' ? 'Recharger / Créditer Avoir' : 'Déduire du Compte / Consommer'}
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Portefeuille de : {showAvoirTxModal.avoir.clientName}</p>
              </div>
              <button 
                onClick={() => {
                  setShowAvoirTxModal(null);
                  setAvTxAmount(0);
                  setAvTxReason('');
                }}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyAvoirTx} className="space-y-4 font-semibold">
              <div>
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Solde Actuel Disponible</span>
                <span className="font-mono text-base font-black text-slate-950">{showAvoirTxModal.avoir.balance.toLocaleString('fr-FR')} FCFA</span>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Montant de la Transaction (FCFA) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={showAvoirTxModal.type === 'debit' ? showAvoirTxModal.avoir.balance : undefined}
                  placeholder="Ex: 10000"
                  value={avTxAmount}
                  onChange={(e) => setAvTxAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {showAvoirTxModal.type === 'credit' && (
                <div>
                  <label className="block text-slate-500 mb-1">Canal de Règlement *</label>
                  <div className="grid grid-cols-5 gap-1">
                    {['cash', 'wave', 'orange_money', 'mtn', 'card'].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setAvTxMethod(method as any)}
                        className={`py-1.5 text-center text-[10px] font-black rounded-lg border uppercase cursor-pointer ${
                          avTxMethod === method
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        {method === 'orange_money' ? 'OM' : method === 'mtn' ? 'MTN' : method}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-500 mb-1">Motif / Description de la transaction *</label>
                <input
                  type="text"
                  required
                  placeholder={showAvoirTxModal.type === 'credit' ? "Ex: Recharge d'un dépôt prépayé maquis" : "Ex: Dîner Table 2 et boissons"}
                  value={avTxReason}
                  onChange={(e) => setAvTxReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAvoirTxModal(null);
                    setAvTxAmount(0);
                    setAvTxReason('');
                  }}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className={`w-1/2 py-2.5 text-white font-bold rounded-xl shadow-md cursor-pointer ${
                    showAvoirTxModal.type === 'credit'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  {showAvoirTxModal.type === 'credit' ? 'Créditer le compte' : 'Déduire le montant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE AVOIR MODAL */}
      {showCreateAvoirModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 text-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl space-y-4 text-left">
            <div className="flex justify-between items-start pb-3 border-b border-slate-150 font-semibold">
              <div>
                <h3 className="text-sm font-black text-slate-950 uppercase">Créer un Avoir</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Enregistrer un nouvel avoir client.</p>
              </div>
              <button 
                onClick={() => {
                  setShowCreateAvoirModal(false);
                  setAvoirClientName('');
                  setAvoirClientPhone('');
                  setAvoirAmount(0);
                  setAvoirReason('');
                  setAvoirInitialPaymentMethod('cash');
                }}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAvoirSubmit} className="space-y-4 font-semibold">
              <div>
                <label className="block text-slate-500 mb-1">Nom du client *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Kouassi Ange"
                  value={avoirClientName}
                  onChange={(e) => setAvoirClientName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Téléphone du client (Optionnel)</label>
                <input
                  type="text"
                  placeholder="Ex: +225 05 00 00 00 00"
                  value={avoirClientPhone}
                  onChange={(e) => setAvoirClientPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Montant de l'avoir (FCFA) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  placeholder="Ex: 15000"
                  value={avoirAmount || ''}
                  onChange={(e) => setAvoirAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Raison / Motif *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Annulation réservation ou bouteilles consignées"
                  value={avoirReason}
                  onChange={(e) => setAvoirReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Mode de paiement initial *</label>
                <div className="grid grid-cols-5 gap-1">
                  {[
                    { id: 'cash', label: 'Cash' },
                    { id: 'wave', label: 'Wave' },
                    { id: 'orange_money', label: 'OM' },
                    { id: 'mtn', label: 'MTN' },
                    { id: 'card', label: 'Carte' }
                  ].map((pay) => (
                    <button
                      key={pay.id}
                      type="button"
                      onClick={() => setAvoirInitialPaymentMethod(pay.id as any)}
                      className={`py-1.5 text-center text-[10px] font-black rounded-lg border uppercase cursor-pointer transition-all ${
                        avoirInitialPaymentMethod === pay.id 
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
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
                  onClick={() => {
                    setShowCreateAvoirModal(false);
                    setAvoirClientName('');
                    setAvoirClientPhone('');
                    setAvoirAmount(0);
                    setAvoirReason('');
                    setAvoirInitialPaymentMethod('cash');
                  }}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Enregistrer l'Avoir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
