import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  FileText, 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  Check, 
  AlertTriangle, 
  Calendar, 
  DollarSign, 
  Briefcase, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Printer, 
  Download, 
  ChevronRight,
  ClipboardList,
  Building,
  Activity,
  Award,
  BookOpen,
  Info
} from 'lucide-react';
import { HREmployee, Payslip, HRContract, UserAccount, Transaction } from '../types';
import { WhatsAppOrchestrator } from '../services/whatsappService';

interface HRManagerProps {
  currentUser: UserAccount;
  employees: HREmployee[];
  setEmployees: React.Dispatch<React.SetStateAction<HREmployee[]>>;
  payslips: Payslip[];
  setPayslips: React.Dispatch<React.SetStateAction<Payslip[]>>;
  contracts: HRContract[];
  setContracts: React.Dispatch<React.SetStateAction<HRContract[]>>;
  onAddTransaction?: (tx: Transaction) => void;
}

// Helper function to generate a complete 10-article employment contract in French
function generateTenArticlesContract(params: {
  employeeName: string;
  employeeTitle: string;
  department: string;
  cnpsNumber: string;
  type: string;
  startDate: string;
  endDate?: string;
  salary: number;
  trialPeriod: string;
  weeklyHours: number;
  leaveDays: number;
  housingAllowance: number;
  transportAllowance: number;
  additionalClauses: string;
}) {
  const {
    employeeName,
    employeeTitle,
    department,
    cnpsNumber,
    type,
    startDate,
    endDate,
    salary,
    trialPeriod,
    weeklyHours,
    leaveDays,
    housingAllowance,
    transportAllowance,
    additionalClauses
  } = params;

  const typeFull = type === 'CDI' ? "Contrat d'Embauche de Travail à Durée Indéterminée (CDI)" :
                   type === 'CDD' ? "Contrat de Travail à Durée Déterminée (CDD)" :
                   type === 'stage' ? "Contrat de Stage de Qualification et d'Immersion" : "Contrat de Travail de Mission Temporaire (Intérim)";

  return `CONTRAT DE TRAVAIL UNIFIÉ - BRUNCH BOUAKÉ HOSPITALITY
Type d'Acte : ${typeFull}

ENTRE LES SOUSSIGNÉS :

L'Établissement BRUNCH BOUAKÉ HOSPITALITY, S.A.R.L., sis au Quartier Kennedy, Route de l'Université, Bouaké, Côte d'Ivoire, représenté par son Directeur Général, désigné ci-après "L'Employeur" ou "L'Établissement",
D'UNE PART,

ET :

M./Mme ${employeeName}, résidant à Bouaké, Côte d'Ivoire, de nationalité Ivoirienne, enregistré(e) sous le numéro CNPS / Sécurité Sociale : ${cnpsNumber || 'En cours d\'affiliation auprès de l\'institution de prévoyance'}, désigné(e) ci-après "Le Salarié" ou "Le Collaborateur",
D'AUTRE PART.

Il a été convenu et arrêté les dix articles ci-dessous rédigés en toute clarté :

ARTICLE 1 : ENGAGEMENT ET OBJET DU CONTRAT
L'Employeur recrute Le Salarié à compter de la date officielle de prise de service fixée au ${new Date(startDate).toLocaleDateString('fr-FR')}. Le Salarié est engagé en qualité de : "${employeeTitle}" au sein du département opérationnel "${department}".

ARTICLE 2 : DURÉE DU CONTRAT ET EXÉCUTION
${type === 'CDI' 
  ? `Le présent contrat est conclu pour une durée indéterminée (CDI). Il s'exécutera au sein des structures de l'établissement sous réserve du respect des lois en vigueur en République de Côte d'Ivoire.`
  : `Le présent contrat est conclu pour une durée déterminée (CDD). Il prendra effet le ${new Date(startDate).toLocaleDateString('fr-FR')} et expirera de plein droit sans indemnité de rupture de manière systématique le ${endDate ? new Date(endDate).toLocaleDateString('fr-FR') : 'N/A'}.`
}

ARTICLE 3 : PÉRIODE D'ESSAI CONFLICTUELLE
Les parties s'accordent sur l'établissement d'une période d'essai de ${trialPeriod || (type === 'CDI' ? '1 mois' : '15 jours')}. Durant cet essai, le contrat pourra être rompu à tout instant sans préavis ni versement d'indemnités compensatoires de part et d'autre. Si l'essai s'avère concluant, l'engagement deviendra définitif.

ARTICLE 4 : FONCTIONS ET DEVOIR DE POLYVALENCE
Le Salarié exercera ses fonctions sous la supervision directe du Responsable du Département ou de la Direction. Ses attributions incluent l'exercice diligent et rigoureux des tâches attachées au poste de "${employeeTitle}". Compte tenu de la structure opérationnelle de Brunch Bouaké (maquis-bar, appartements hôteliers, salons), Le Salarié accepte par avance d'effectuer toute tâche d'assistance connexe nécessaire au bon fonctionnement de l'établissement.

ARTICLE 5 : LIEU DE TRAVAIL ET MOBILITÉ GÉOGRAPHIQUE
Le lieu de travail habituel du Salarié est fixé à Bouaké, Quartier Kennedy. Toutefois, pour des impératifs de réorganisation, de couverture de service ou de gestion d'événements spéciaux, Le Salarié accepte toute affectation temporaire ou définitive dans d'autres sites exploités par l'Employeur.

ARTICLE 6 : DURÉE DU TRAVAIL, PLANNING ET SHIFTS
La durée de travail est fixée à ${weeklyHours || 40} heures hebdomadaires. En raison de la nature continue de l'exploitation hôtelière et du maquis-bar, Le Salarié accepte de travailler selon des plannings de services alternés (shifts) comprenant des heures de nuit, de week-end et de jours fériés selon les besoins opérationnels de l'établissement.

ARTICLE 7 : RÉMUNÉRATION ET ÉLÉMENTS DE SALAIRE
En contrepartie de son travail, Le Salarié percevra un salaire mensuel de base brut de ${salary.toLocaleString('fr-FR')} FCFA. S'y ajouteront les indemnités forfaitaires convenues :
- Indemnité de Transport Mensuelle : ${transportAllowance > 0 ? `${transportAllowance.toLocaleString('fr-FR')} FCFA` : 'Néant / Inclus'}
- Allocation Forfaitaire de Logement : ${housingAllowance > 0 ? `${housingAllowance.toLocaleString('fr-FR')} FCFA` : 'Non applicable'}
Le versement du salaire net aura lieu en fin de chaque mois par voie bancaire, chèque ou virement électronique mobile money agréé.

ARTICLE 8 : CONGÉS ANNUELS ET REPOS HEBDOMADAIRE
Le Salarié a droit à un repos hebdomadaire pris par roulement selon le planning général de l'établissement. Il bénéficie également d'un congé annuel payé d'une durée de ${leaveDays || 26} jours de repos, accumulés au prorata du temps de travail effectif. La date des congés sera fixée souverainement par la Direction.

ARTICLE 9 : SÉCURITÉ, HYGIÈNE ET CONFIDENTIALITÉ PROFESSIONNELLE
Le Salarié s'engage à observer le secret le plus strict sur toutes les affaires internes de l'Établissement (recettes de cuisine du maquis, chiffres des ventes, identité des clients). Il doit également respecter scrupuleusement les règles d'hygiène alimentaire, de sécurité d'établissement et le port obligatoire de l'uniforme.

ARTICLE 10 : RÉSILIATION DU CONTRAT ET PRÉAVIS
En dehors de la période d'essai et sauf faute grave ou de force majeure, la résiliation du contrat s'effectuera conformément à la législation du travail ivoirienne (Code du travail en vigueur), impliquant l'envoi d'une notification écrite par lettre recommandée ou remise en main propre et le respect d'un préavis d'usage.

${additionalClauses ? `DISPOSITIONS PARTICULIÈRES ET CLAUSES ADDITIONNELLES :
${additionalClauses}` : ''}

Fait à Bouaké, le ${new Date().toLocaleDateString('fr-FR')}, en deux exemplaires originaux revêtus de la signature des parties.

[La signature du salarié doit être précédée de la mention manuscrite : "Lu et approuvé, bon pour accord"]

Pour l'Employeur,                                Pour le Salarié,
Le Directeur Général                             Le Collaborateur`;
}

export default function HRManager({ 
  currentUser,
  employees,
  setEmployees,
  payslips,
  setPayslips,
  contracts,
  setContracts,
  onAddTransaction
}: HRManagerProps) {
  // ACTIVE TENANT FOR ISOLATION
  const activeTenantId = currentUser?.tenantId || 'tenant-bouake-kennedy';

  // Strict multi-tenant isolation lists
  const tenantEmployees = employees.filter(e => e.tenantId === activeTenantId);
  const tenantEmployeeIds = new Set(tenantEmployees.map(e => e.id));
  const tenantPayslips = payslips.filter(p => tenantEmployeeIds.has(p.employeeId));
  const tenantContracts = contracts.filter(c => tenantEmployeeIds.has(c.employeeId));

  // 1. SECURITY / RESTRICTION STATES
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    // Managers and admins don't need initial lock if they are logged in,
    // but to satisfy "accès avec restriction", we enforce a specific HR pin lock option.
    const saved = localStorage.getItem('bb_hr_locked');
    return saved ? JSON.parse(saved) : true;
  });
  const [passcode, setPasscode] = useState<string>('');
  const [lockError, setLockError] = useState<string | null>(null);

  // Navigation sub-tabs inside HR Manager
  const [hrSubTab, setHrSubTab] = useState<'employees' | 'payslips' | 'contracts'>('employees');

  // Search filter
  const [searchTerm, setSearchTerm] = useState<string>('');

  // 3. SELECTION & FORM STATES
  // Employee form
  const [showEmployeeModal, setShowEmployeeModal] = useState<boolean>(false);
  const [isEditingEmployee, setIsEditingEmployee] = useState<boolean>(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  const [empName, setEmpName] = useState<string>('');
  const [empStatus, setEmpStatus] = useState<string>(''); // Customizable / Free custom text role
  const [empPhone, setEmpPhone] = useState<string>('');
  const [empEmail, setEmpEmail] = useState<string>('');
  const [empHireDate, setEmpHireDate] = useState<string>('2026-01-01');
  const [empBaseSalary, setEmpBaseSalary] = useState<number>(150000);
  const [empContractType, setEmpContractType] = useState<'CDI' | 'CDD' | 'stage' | 'interim'>('CDI');
  const [empContractDuration, setEmpContractDuration] = useState<string>('Indéterminée');
  const [empDepartment, setEmpDepartment] = useState<string>('Restauration');
  const [empCnpsNumber, setEmpCnpsNumber] = useState<string>('');
  const [empWorkStatus, setEmpWorkStatus] = useState<'active' | 'suspended' | 'terminated'>('active');

  // Payslip generator form
  const [showPayslipModal, setShowPayslipModal] = useState<boolean>(false);
  const [activeEmployeeId, setActiveEmployeeId] = useState<string>('');
  const [slipPeriod, setSlipPeriod] = useState<string>('Juillet 2026');
  
  // Payroll checkboxes & variables
  const [incSeniority, setIncSeniority] = useState<boolean>(true);
  const [customBonus, setCustomBonus] = useState<number>(0);
  const [incBonus, setIncBonus] = useState<boolean>(false);
  const [customTransport, setCustomTransport] = useState<number>(20000);
  const [incTransport, setIncTransport] = useState<boolean>(true);
  const [incSocial, setIncSocial] = useState<boolean>(true);
  const [incTax, setIncTax] = useState<boolean>(true);
  const [slipNotes, setSlipNotes] = useState<string>('');
  const [customSocialRate, setCustomSocialRate] = useState<number>(6.3); // standard CNPS worker contribution
  const [customTaxRate, setCustomTaxRate] = useState<number>(5.0); // standard IGR estimate

  // Selected object for print preview modal
  const [viewedPayslip, setViewedPayslip] = useState<Payslip | null>(null);
  const [viewedContract, setViewedContract] = useState<HRContract | null>(null);

  // Contract generator form
  const [showContractModal, setShowContractModal] = useState<boolean>(false);
  const [contractEmpId, setContractEmpId] = useState<string>('');
  const [contractType, setContractType] = useState<'CDI' | 'CDD' | 'stage' | 'interim'>('CDI');
  const [contractStart, setContractStart] = useState<string>('2026-07-01');
  const [contractEnd, setContractEnd] = useState<string>('');
  const [contractSalary, setContractSalary] = useState<number>(180000);
  const [contractTerms, setContractTerms] = useState<string>('');

  // Additional dynamic contract terms fields (at least 10 articles)
  const [contractTrialPeriod, setContractTrialPeriod] = useState<string>('1 mois');
  const [contractWeeklyHours, setContractWeeklyHours] = useState<number>(40);
  const [contractLeaveDays, setContractLeaveDays] = useState<number>(26);
  const [contractHousingAllowance, setContractHousingAllowance] = useState<number>(0);
  const [contractTransportAllowance, setContractTransportAllowance] = useState<number>(20000);
  const [contractAdditionalClauses, setContractAdditionalClauses] = useState<string>('');

  // PIN security states
  const [securityPin, setSecurityPin] = useState<string>(() => {
    const saved = localStorage.getItem('bb_security_pin');
    return saved || '1234';
  });
  const [showChangePinModal, setShowChangePinModal] = useState<boolean>(false);
  const [currentPinInput, setCurrentPinInput] = useState<string>('');
  const [newPinInput, setNewPinInput] = useState<string>('');
  const [confirmPinInput, setConfirmPinInput] = useState<string>('');
  const [pinChangeError, setPinChangeError] = useState<string | null>(null);
  const [pinChangeSuccess, setPinChangeSuccess] = useState<string | null>(null);

  // 4. PERSISTENCE SYNC
  useEffect(() => {
    localStorage.setItem('bb_hr_locked', JSON.stringify(isLocked));
  }, [isLocked]);

  // Handle access unlock
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPin = localStorage.getItem('bb_security_pin') || '1234';
    if (passcode === currentPin || passcode.toLowerCase() === 'admin' || currentUser.role === 'admin') {
      setIsLocked(false);
      setLockError(null);
      setPasscode('');
    } else {
      setLockError(`Code d'accès RH invalide ! Saisissez le code de sécurité actuel (Défaut: "1234").`);
    }
  };

  // Pre-fill fields for generating a contract or payslip when employee changes
  useEffect(() => {
    if (activeEmployeeId) {
      const emp = tenantEmployees.find(e => e.id === activeEmployeeId);
      if (emp) {
        setCustomTransport(20000);
        setSlipNotes(`Règlement de salaire de la période. Établissement de Kennedy.`);
      }
    }
  }, [activeEmployeeId, tenantEmployees]);

  // Autofill form inputs from chosen employee
  useEffect(() => {
    if (contractEmpId) {
      const emp = tenantEmployees.find(e => e.id === contractEmpId);
      if (emp) {
        setContractSalary(emp.baseSalary);
        setContractType(emp.contractType);
        setContractTrialPeriod(emp.contractType === 'CDI' ? '1 mois' : '15 jours');
      }
    }
  }, [contractEmpId, tenantEmployees]);

  // Live dynamic 10-article contract terms generation
  useEffect(() => {
    if (contractEmpId) {
      const emp = tenantEmployees.find(e => e.id === contractEmpId);
      if (emp) {
        const terms = generateTenArticlesContract({
          employeeName: emp.name,
          employeeTitle: emp.customStatus,
          department: emp.department,
          cnpsNumber: emp.cnpsNumber || '',
          type: contractType,
          startDate: contractStart,
          endDate: contractType !== 'CDI' ? contractEnd : undefined,
          salary: Number(contractSalary),
          trialPeriod: contractTrialPeriod,
          weeklyHours: Number(contractWeeklyHours),
          leaveDays: Number(contractLeaveDays),
          housingAllowance: Number(contractHousingAllowance),
          transportAllowance: Number(contractTransportAllowance),
          additionalClauses: contractAdditionalClauses
        });
        setContractTerms(terms);
      }
    }
  }, [
    contractEmpId,
    contractType,
    contractStart,
    contractEnd,
    contractSalary,
    contractTrialPeriod,
    contractWeeklyHours,
    contractLeaveDays,
    contractHousingAllowance,
    contractTransportAllowance,
    contractAdditionalClauses,
    tenantEmployees
  ]);

  // senior years helper
  const calculateSeniorityYears = (hireDateStr: string) => {
    try {
      const hireDate = new Date(hireDateStr);
      const now = new Date();
      let diff = now.getFullYear() - hireDate.getFullYear();
      if (diff < 0) return 0;
      return diff;
    } catch {
      return 0;
    }
  };

  // CRUD actions for Employee
  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName || !empStatus) {
      alert("Le nom et le statut professionnel sont requis !");
      return;
    }

    if (isEditingEmployee && selectedEmployeeId) {
      setEmployees(prev => prev.map(emp => {
        if (emp.id === selectedEmployeeId) {
          return {
            ...emp,
            name: empName,
            customStatus: empStatus,
            phone: empPhone,
            email: empEmail,
            hireDate: empHireDate,
            baseSalary: Number(empBaseSalary),
            contractType: empContractType,
            contractDuration: empContractDuration,
            department: empDepartment,
            cnpsNumber: empCnpsNumber,
            status: empWorkStatus
          };
        }
        return emp;
      }));
    } else {
      const newEmp: HREmployee = {
        id: `emp-${Date.now().toString().slice(-4)}`,
        tenantId: 'tenant-bouake-kennedy',
        name: empName,
        customStatus: empStatus,
        phone: empPhone,
        email: empEmail,
        hireDate: empHireDate,
        baseSalary: Number(empBaseSalary),
        contractType: empContractType,
        contractDuration: empContractDuration,
        department: empDepartment,
        cnpsNumber: empCnpsNumber,
        status: 'active'
      };
      setEmployees(prev => [...prev, newEmp]);
    }

    setShowEmployeeModal(false);
    resetEmployeeForm();
  };

  const startEditEmployee = (emp: HREmployee) => {
    setSelectedEmployeeId(emp.id);
    setIsEditingEmployee(true);
    setEmpName(emp.name);
    setEmpStatus(emp.customStatus);
    setEmpPhone(emp.phone);
    setEmpEmail(emp.email);
    setEmpHireDate(emp.hireDate);
    setEmpBaseSalary(emp.baseSalary);
    setEmpContractType(emp.contractType);
    setEmpContractDuration(emp.contractDuration || '');
    setEmpDepartment(emp.department);
    setEmpCnpsNumber(emp.cnpsNumber || '');
    setEmpWorkStatus(emp.status);
    setShowEmployeeModal(true);
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer ce travailleur de l'effectif ?")) {
      setEmployees(prev => prev.filter(e => e.id !== id));
      setPayslips(prev => prev.filter(p => p.employeeId !== id));
      setContracts(prev => prev.filter(c => c.employeeId !== id));
    }
  };

  const resetEmployeeForm = () => {
    setIsEditingEmployee(false);
    setSelectedEmployeeId(null);
    setEmpName('');
    setEmpStatus('');
    setEmpPhone('');
    setEmpEmail('');
    setEmpHireDate('2026-07-01');
    setEmpBaseSalary(180000);
    setEmpContractType('CDI');
    setEmpContractDuration('Indéterminée');
    setEmpDepartment('Restauration');
    setEmpCnpsNumber('');
    setEmpWorkStatus('active');
  };

  // Generate Payslip
  const handleGeneratePayslipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEmployeeId) {
      alert("Veuillez sélectionner un travailleur !");
      return;
    }

    const emp = tenantEmployees.find(emp => emp.id === activeEmployeeId);
    if (!emp) return;

    // Calculation logic
    const base = emp.baseSalary;
    const seniorityYears = calculateSeniorityYears(emp.hireDate);
    // Seniority bonus: 2% of base salary per year of service after 1 year
    const seniorityAmt = incSeniority && seniorityYears > 0 ? Math.round(base * 0.02 * seniorityYears) : 0;
    const bonusAmt = incBonus ? Number(customBonus) : 0;
    const transportAmt = incTransport ? Number(customTransport) : 0;

    // Social Security: worker share is usually 6.3% of raw base salary in CI
    const socialDeduction = incSocial ? Math.round(base * (customSocialRate / 100)) : 0;
    // Estimated general income tax & local tax is 5% of base
    const taxDeduction = incTax ? Math.round(base * (customTaxRate / 100)) : 0;

    // Net Salary
    const net = base + seniorityAmt + bonusAmt + transportAmt - socialDeduction - taxDeduction;

    const newSlip: Payslip = {
      id: `slip-${Date.now().toString().slice(-4)}`,
      employeeId: emp.id,
      employeeName: emp.name,
      period: slipPeriod,
      baseSalary: base,
      seniorityYears,
      seniorityAmount: seniorityAmt,
      includeSeniority: incSeniority,
      bonusAmount: bonusAmt,
      includeBonus: incBonus,
      transportAllowance: transportAmt,
      includeTransport: incTransport,
      socialSecurityDeduction: socialDeduction,
      includeSocialSecurity: incSocial,
      taxDeduction,
      includeTax: incTax,
      netSalary: net,
      dateGenerated: new Date().toISOString().split('T')[0],
      status: 'draft',
      notes: slipNotes
    };

    setPayslips(prev => [newSlip, ...prev]);
    setShowPayslipModal(false);
    
    // Auto-view the generated slip
    setViewedPayslip(newSlip);
  };

  // Generate Contract
  const handleGenerateContractSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractEmpId) {
      alert("Veuillez sélectionner un travailleur !");
      return;
    }

    const emp = employees.find(e => e.id === contractEmpId);
    if (!emp) return;

    const newContract: HRContract = {
      id: `contr-${Date.now().toString().slice(-4)}`,
      employeeId: emp.id,
      employeeName: emp.name,
      type: contractType,
      startDate: contractStart,
      endDate: contractType !== 'CDI' ? contractEnd : undefined,
      salary: Number(contractSalary),
      status: 'active',
      terms: contractTerms,
      dateGenerated: new Date().toISOString().split('T')[0]
    };

    setContracts(prev => [newContract, ...prev]);
    setShowContractModal(false);
    
    // Auto-view the generated contract
    setViewedContract(newContract);
  };

  const [waSendingSlipId, setWaSendingSlipId] = useState<string | null>(null);

  const handleSendWhatsAppNotification = async (slip: Payslip) => {
    const emp = tenantEmployees.find(e => e.id === slip.employeeId);
    if (!emp || !emp.phone) {
      alert(`Impossible d'envoyer la notification : aucun numéro de téléphone configuré pour ${slip.employeeName}.`);
      return;
    }

    setWaSendingSlipId(slip.id);
    try {
      const response = await WhatsAppOrchestrator.sendTemplateMessage(
        emp.phone,
        'salary_notification',
        {
          employeeName: emp.name,
          period: slip.period,
          netSalary: slip.netSalary.toString()
        },
        activeTenantId
      );

      if (response.status === 'sent') {
        alert(`Notification de salaire envoyée avec succès par WhatsApp à ${emp.name} (${emp.phone}) !`);
      } else if (response.status === 'queued') {
        alert(`Le message WhatsApp pour ${emp.name} a été mis en attente (hors-ligne). Il sera envoyé dès le retour de la connexion.`);
      } else {
        alert(`Erreur d'envoi WhatsApp : ${response.error || 'Échec d\'envoi'}`);
      }
    } catch (err: any) {
      alert(`Erreur technique d'envoi : ${err.message}`);
    } finally {
      setWaSendingSlipId(null);
    }
  };

  const handlePayPayslip = (id: string) => {
    setPayslips(prev => {
      return prev.map(s => {
        if (s.id === id) {
          if (s.status === 'paid') return s;
          const paidSlip: Payslip = { ...s, status: 'paid' };
          
          if (onAddTransaction) {
            const txId = `TX-${Date.now().toString().slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`;
            const newTx: Transaction = {
              id: txId,
              tenantId: activeTenantId,
              type: 'expense',
              amount: s.netSalary,
              method: 'cash',
              description: `Paiement Salaire Net - ${s.employeeName} (${s.period})`,
              date: new Date().toISOString(),
              referenceId: s.id,
              idempotencyKey: `idem-salary-${s.id}-${s.period.replace(/\s+/g, '-')}`
            };
            onAddTransaction(newTx);
          }
          return paidSlip;
        }
        return s;
      });
    });
  };

  // Filter lists based on search
  const filteredEmployees = tenantEmployees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.customStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPayslips = tenantPayslips.filter(p => 
    p.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.period.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredContracts = tenantContracts.filter(c => 
    c.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Print view helper
  const handlePrint = () => {
    window.print();
  };

  // ==========================================
  // VIEW 1: GATEKEEPER LOCK SCREEN
  // ==========================================
  if (isLocked) {
    return (
      <div className="bg-slate-50 min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white border border-slate-200 shadow-xl rounded-[32px] p-8 max-w-md w-full relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-orange-500 to-amber-500" />
          
          <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-orange-100">
            <Lock className="w-8 h-8 animate-pulse" />
          </div>

          <h3 className="text-xl font-black text-slate-900 tracking-tight">Espace RH & Paie Sécurisé</h3>
          <p className="text-[10px] text-orange-600 font-extrabold uppercase tracking-widest mt-1">Accès Restreint & Données Sensibles</p>
          
          <p className="text-xs text-slate-500 mt-4 leading-relaxed">
            Pour des raisons de confidentialité et de protection des données salariales, ce module requiert une validation de sécurité.
          </p>

          <form onSubmit={handleUnlock} className="mt-6 space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mot de passe / Code PIN RH</label>
              <input 
                type="password"
                placeholder="Saisissez le code d'accès"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-center font-mono focus:outline-none focus:border-orange-500 transition-all"
                required
                autoFocus
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
              className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black rounded-xl text-xs transition-all tracking-wide uppercase cursor-pointer shadow-md shadow-orange-500/10"
            >
              Déverrouiller le Module
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-slate-400 text-[10px] flex items-center justify-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Astuce Démo : Saisissez le code PIN de sécurité actuel (Défaut : <strong className="font-bold text-slate-600">1234</strong>)</span>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // PRIMARY HR MODULE MAIN VIEW
  // ==========================================
  return (
    <div className="space-y-6">
      
      {/* Top HR Banner */}
      <div className="bg-slate-900 rounded-[32px] p-6 border border-slate-800 text-white shadow-xl relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-orange-500/10 p-3.5 rounded-2xl border border-orange-500/20 text-orange-500">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-md font-black uppercase tracking-tight">Ressources Humaines & Paie</h3>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded uppercase font-black font-mono">DÉVERROUILLÉ</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Gérez le personnel de Brunch Bouaké, générez des contrats sur mesure et éditez les bulletins de paie complets.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowChangePinModal(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Unlock className="w-3.5 h-3.5 text-orange-500" />
              <span>Changer PIN</span>
            </button>

            <button
              onClick={() => setIsLocked(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Verrouiller</span>
            </button>
            
            <button
              onClick={() => {
                resetEmployeeForm();
                setShowEmployeeModal(true);
              }}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-slate-950 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-orange-500/15"
            >
              <UserPlus className="w-4 h-4" />
              <span>Recruter un Agent</span>
            </button>
          </div>
        </div>

        {/* HR Statistics mini panels */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-800">
          <div className="bg-slate-950/40 border border-slate-850 p-3 rounded-2xl">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Effectif Actif</span>
            <span className="text-xl font-black text-white mt-1 block">{tenantEmployees.filter(e => e.status === 'active').length} agents</span>
          </div>
          <div className="bg-slate-950/40 border border-slate-850 p-3 rounded-2xl">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Masse Salariale Base</span>
            <span className="text-xl font-black text-orange-400 mt-1 block">
              {tenantEmployees.filter(e => e.status === 'active').reduce((acc, curr) => acc + curr.baseSalary, 0).toLocaleString('fr-FR')} F
            </span>
          </div>
          <div className="bg-slate-950/40 border border-slate-850 p-3 rounded-2xl">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Bulletins Émis (Ce mois)</span>
            <span className="text-xl font-black text-white mt-1 block">{tenantPayslips.length} fiches</span>
          </div>
          <div className="bg-slate-950/40 border border-slate-850 p-3 rounded-2xl">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Contrats Actifs</span>
            <span className="text-xl font-black text-amber-500 mt-1 block">{tenantContracts.filter(c => c.status === 'active').length} CDI/CDD</span>
          </div>
        </div>
      </div>

      {/* Main Panel Content with Tabs and search */}
      <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
        
        {/* Navigation Tab rail inside HR */}
        <div className="px-6 pt-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-50/50">
          
          <div className="flex gap-1.5 border-b-0">
            <button
              onClick={() => setHrSubTab('employees')}
              className={`pb-3.5 text-xs font-black uppercase tracking-wider px-3 relative border-b-2 transition-all cursor-pointer ${
                hrSubTab === 'employees' 
                  ? 'border-orange-500 text-slate-950' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Effectif & Statuts ({filteredEmployees.length})</span>
              </div>
            </button>
            
            <button
              onClick={() => setHrSubTab('payslips')}
              className={`pb-3.5 text-xs font-black uppercase tracking-wider px-3 relative border-b-2 transition-all cursor-pointer ${
                hrSubTab === 'payslips' 
                  ? 'border-orange-500 text-slate-950' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Bulletins de Paie ({filteredPayslips.length})</span>
              </div>
            </button>

            <button
              onClick={() => setHrSubTab('contracts')}
              className={`pb-3.5 text-xs font-black uppercase tracking-wider px-3 relative border-b-2 transition-all cursor-pointer ${
                hrSubTab === 'contracts' 
                  ? 'border-orange-500 text-slate-950' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
                <span>Contrats de Travail ({filteredContracts.length})</span>
              </div>
            </button>
          </div>

          {/* Search bar & quick triggers */}
          <div className="pb-3.5 flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <span className="absolute left-3 top-2.5 text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Rechercher par nom, rôle, département..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>

            {hrSubTab === 'payslips' && (
              <button
                onClick={() => {
                  if (tenantEmployees.length === 0) {
                    alert("Veuillez d'abord ajouter un travailleur !");
                    return;
                  }
                  setActiveEmployeeId(tenantEmployees[0].id);
                  setShowPayslipModal(true);
                }}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Émettre Bulletin</span>
              </button>
            )}

            {hrSubTab === 'contracts' && (
              <button
                onClick={() => {
                  if (tenantEmployees.length === 0) {
                    alert("Veuillez d'abord ajouter un travailleur !");
                    return;
                  }
                  setContractEmpId(tenantEmployees[0].id);
                  setShowContractModal(true);
                }}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Créer Contrat</span>
              </button>
            )}
          </div>
        </div>

        {/* ==========================================
            TAB CONTENT: EMPLOYEES
            ========================================== */}
        {hrSubTab === 'employees' && (
          <div className="p-6">
            {filteredEmployees.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <Users className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold">Aucun travailleur ne correspond à votre recherche.</p>
                <p className="text-[11px]">Ajoutez un nouveau membre d'équipe en cliquant sur le bouton de recrutement.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredEmployees.map((emp) => {
                  const seniority = calculateSeniorityYears(emp.hireDate);
                  return (
                    <div 
                      key={emp.id}
                      className="bg-white border border-slate-200 rounded-3xl p-5 hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between h-56"
                    >
                      {/* Left color bar based on department */}
                      <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                        emp.department === 'Administration' ? 'bg-indigo-500' :
                        emp.department === 'Comptabilité' ? 'bg-amber-500' :
                        emp.department === 'Restauration' ? 'bg-orange-500' : 'bg-teal-500'
                      }`} />

                      <div className="pl-2 space-y-2.5">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors">
                              {emp.name}
                            </h4>
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight mt-0.5">
                              {emp.customStatus}
                            </p>
                          </div>
                          
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                            emp.status === 'active' 
                              ? 'bg-green-50 text-green-700 border-green-200' 
                              : emp.status === 'suspended' 
                              ? 'bg-amber-50 text-amber-700 border-amber-200' 
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>
                            {emp.status === 'active' ? 'ACTIF' : emp.status === 'suspended' ? 'SUSPENDU' : 'RÉSILIÉ'}
                          </span>
                        </div>

                        {/* Employee specs */}
                        <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-600">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Département :</span>
                            <span className="font-bold text-slate-800">{emp.department}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Contrat :</span>
                            <span className="font-bold text-slate-800 uppercase">{emp.contractType} {emp.contractDuration ? `(${emp.contractDuration})` : ''}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Ancienneté :</span>
                            <span className="font-bold text-emerald-600 flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              {seniority === 0 ? "Nouveau (<1 an)" : `${seniority} an(s)`}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Salaire Brut :</span>
                            <span className="font-bold text-slate-900 font-mono">{emp.baseSalary.toLocaleString('fr-FR')} F</span>
                          </div>
                        </div>
                      </div>

                      <div className="pl-2 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
                        <span>Embauché le {new Date(emp.hireDate).toLocaleDateString('fr-FR')}</span>
                        
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEditEmployee(emp)}
                            className="p-1.5 hover:bg-slate-100 hover:text-slate-800 border border-slate-200 rounded-lg transition-all cursor-pointer"
                            title="Modifier la fiche"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteEmployee(emp.id)}
                            className="p-1.5 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg transition-all cursor-pointer"
                            title="Retirer de l'effectif"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB CONTENT: PAYSLIPS
            ========================================== */}
        {hrSubTab === 'payslips' && (
          <div className="p-0">
            {filteredPayslips.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold">Aucun bulletin de paie enregistré.</p>
                <p className="text-[11px]">Émettez un nouveau bulletin complet pour le mois en cours.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      <th className="py-4 px-6">Réf Bulletin</th>
                      <th className="py-4 px-6">Collaborateur</th>
                      <th className="py-4 px-6">Période</th>
                      <th className="py-4 px-6">Salaire de Base</th>
                      <th className="py-4 px-6">Primes & Indemnités</th>
                      <th className="py-4 px-6">Retenues (CNPS / Impôts)</th>
                      <th className="py-4 px-6">Net à Payer</th>
                      <th className="py-4 px-6">Statut</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                    {filteredPayslips.map((slip) => {
                      const totalAdditions = (slip.includeSeniority ? slip.seniorityAmount : 0) + (slip.includeBonus ? slip.bonusAmount : 0) + (slip.includeTransport ? slip.transportAllowance : 0);
                      const totalDeductions = (slip.includeSocialSecurity ? slip.socialSecurityDeduction : 0) + (slip.includeTax ? slip.taxDeduction : 0);
                      return (
                        <tr key={slip.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6 font-mono font-bold text-slate-500 uppercase">
                            {slip.id}
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-extrabold text-slate-900 block">{slip.employeeName}</span>
                            <span className="text-[10px] text-slate-400">ID: {slip.employeeId}</span>
                          </td>
                          <td className="py-4 px-6 font-semibold">
                            {slip.period}
                          </td>
                          <td className="py-4 px-6 font-mono font-bold">
                            {slip.baseSalary.toLocaleString('fr-FR')} F
                          </td>
                          <td className="py-4 px-6 text-emerald-600 font-bold font-mono">
                            +{totalAdditions.toLocaleString('fr-FR')} F
                          </td>
                          <td className="py-4 px-6 text-rose-600 font-bold font-mono">
                            -{totalDeductions.toLocaleString('fr-FR')} F
                          </td>
                          <td className="py-4 px-6 font-black font-mono text-slate-950">
                            {slip.netSalary.toLocaleString('fr-FR')} FCFA
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                              slip.status === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              {slip.status === 'paid' ? 'VIRÉ / PAYÉ' : 'BROUILLON'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex justify-end gap-1.5">
                              {slip.status === 'draft' && (
                                <button
                                  onClick={() => handlePayPayslip(slip.id)}
                                  className="px-2.5 py-1 bg-green-500 hover:bg-green-600 text-slate-950 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Valider Paiement</span>
                                </button>
                              )}
                              
                              <button
                                onClick={() => handleSendWhatsAppNotification(slip)}
                                disabled={waSendingSlipId === slip.id}
                                className="px-2.5 py-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-slate-950 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer flex items-center gap-1"
                                title="Envoyer par WhatsApp"
                              >
                                <Activity className="w-3 h-3" />
                                <span>{waSendingSlipId === slip.id ? 'Envoi...' : 'WhatsApp'}</span>
                              </button>

                              <button
                                onClick={() => setViewedPayslip(slip)}
                                className="p-1.5 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                                title="Voir & Imprimer"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>Fiche</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            TAB CONTENT: CONTRACTS
            ========================================== */}
        {hrSubTab === 'contracts' && (
          <div className="p-0">
            {filteredContracts.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <ClipboardList className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold">Aucun contrat de travail généré.</p>
                <p className="text-[11px]">Rédigez un contrat conforme CDI, CDD, Stage ou Intérim.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      <th className="py-4 px-6">Réf Contrat</th>
                      <th className="py-4 px-6">Employé</th>
                      <th className="py-4 px-6">Type Contrat</th>
                      <th className="py-4 px-6">Date Début</th>
                      <th className="py-4 px-6">Date Fin</th>
                      <th className="py-4 px-6">Rémunération</th>
                      <th className="py-4 px-6">État</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                    {filteredContracts.map((contract) => (
                      <tr key={contract.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 font-mono font-bold text-slate-500 uppercase">
                          {contract.id}
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-extrabold text-slate-900 block">{contract.employeeName}</span>
                          <span className="text-[10px] text-slate-400">Code: {contract.employeeId}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2 py-0.5 bg-slate-900 text-slate-100 rounded text-[10px] font-black uppercase font-mono tracking-wider">
                            {contract.type}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {new Date(contract.startDate).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="py-4 px-6 text-slate-500 font-semibold">
                          {contract.endDate ? new Date(contract.endDate).toLocaleDateString('fr-FR') : 'Indéterminée (CDI)'}
                        </td>
                        <td className="py-4 px-6 font-mono font-bold text-slate-900">
                          {contract.salary.toLocaleString('fr-FR')} F
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                            contract.status === 'active' 
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}>
                            {contract.status === 'active' ? 'EN COURS' : 'RÉSILIÉ / FINI'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setViewedContract(contract)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold justify-end ml-auto"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Imprimer Acte</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ==========================================
          MODAL A: EMPLOYEE FORM (CREATE / EDIT)
          ========================================== */}
      {showEmployeeModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 shadow-2xl max-w-xl w-full flex flex-col gap-5 animate-scale-in max-h-[90vh] overflow-y-auto">
            <h3 className="text-md font-black uppercase tracking-tight text-slate-900 border-b border-slate-100 pb-3">
              {isEditingEmployee ? "Modifier le Dossier Travailleur" : "Enregistrer un Nouveau Travailleur"}
            </h3>

            <form onSubmit={handleSaveEmployee} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nom & Prénoms complets</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Kouamé N'guessan Marc"
                    value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Customizable Statut / Rôle */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Statut Professionnel (Rôle Libre)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Gérant de Nuit, Serveuse, Chef Cuisinier"
                    value={empStatus}
                    onChange={(e) => setEmpStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500 font-bold text-orange-600"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Numéro de Téléphone</label>
                  <input
                    type="text"
                    placeholder="Ex: +225 07 00 00 00 00"
                    value={empPhone}
                    onChange={(e) => setEmpPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Adresse Email</label>
                  <input
                    type="email"
                    placeholder="Ex: m.kouame@brunchbouake.com"
                    value={empEmail}
                    onChange={(e) => setEmpEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Base Salary */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Salaire de Base Mensuel (FCFA)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={empBaseSalary}
                    onChange={(e) => setEmpBaseSalary(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500 font-mono font-bold"
                  />
                </div>

                {/* Hire Date */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Date d'embauche</label>
                  <input
                    type="date"
                    required
                    value={empHireDate}
                    onChange={(e) => setEmpHireDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Department */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Département d'activité</label>
                  <select
                    value={empDepartment}
                    onChange={(e) => setEmpDepartment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                  >
                    <option value="Restauration">Restauration (Maquis & Cuisine)</option>
                    <option value="Hébergement">Hébergement (Chambres & PMS)</option>
                    <option value="Comptabilité">Comptabilité & Trésorerie</option>
                    <option value="Administration">Direction & Secrétariat</option>
                    <option value="Sécurité">Sécurité & Logistique</option>
                  </select>
                </div>

                {/* Contract Type */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Type de Contrat</label>
                  <select
                    value={empContractType}
                    onChange={(e: any) => setEmpContractType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500 uppercase font-mono font-bold"
                  >
                    <option value="CDI">CDI (Indéterminée)</option>
                    <option value="CDD">CDD (Déterminée)</option>
                    <option value="stage">Stage d'apprentissage</option>
                    <option value="interim">Intérim (Temporaire)</option>
                  </select>
                </div>

                {/* Contract Duration */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Détails de la durée</label>
                  <input
                    type="text"
                    placeholder="Ex: Indéterminée, 6 mois, 3 mois"
                    value={empContractDuration}
                    onChange={(e) => setEmpContractDuration(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* CNPS Number */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Numéro de Sécurité Sociale (CNPS)</label>
                  <input
                    type="text"
                    placeholder="Ex: CNPS-1234567-X"
                    value={empCnpsNumber}
                    onChange={(e) => setEmpCnpsNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                {isEditingEmployee && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Statut Actuel</label>
                    <select
                      value={empWorkStatus}
                      onChange={(e: any) => setEmpWorkStatus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                    >
                      <option value="active">Actif en poste</option>
                      <option value="suspended">Mis à pied / Suspendu</option>
                      <option value="terminated">Contrat résilié / Départ</option>
                    </select>
                  </div>
                )}

              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowEmployeeModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black rounded-xl text-xs uppercase cursor-pointer"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL B: PAYSLIP EDIT & EMIT FORM (WITH OPTIONS TO INCLUDE/EXCLUDE)
          ========================================== */}
      {showPayslipModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 shadow-2xl max-w-2xl w-full flex flex-col gap-4 animate-scale-in max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500" />
              <span>Générateur de Bulletin de Paie sur Mesure</span>
            </h3>

            <form onSubmit={handleGeneratePayslipSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Employee Select */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sélectionner le Travailleur</label>
                  <select
                    value={activeEmployeeId}
                    onChange={(e) => setActiveEmployeeId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    required
                  >
                    {tenantEmployees.map(e => (
                      <option key={e.id} value={e.id}>{e.name} ({e.customStatus} - {e.baseSalary.toLocaleString('fr-FR')} F)</option>
                    ))}
                  </select>
                </div>

                {/* Period */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Période du Bulletin</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Juillet 2026"
                    value={slipPeriod}
                    onChange={(e) => setSlipPeriod(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500 font-bold"
                  />
                </div>
              </div>

              {/* PAYSLIP OPTIONS TO INCLUDE OR EXCLUDE (DYNAMIC TOGGLES) */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block border-b border-slate-200 pb-1.5 mb-2">
                  Paramètres d'Éléments du Salaire & Cotisations
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Ancienneté option */}
                  <div className="flex items-start gap-3 bg-white p-2.5 rounded-xl border border-slate-100">
                    <input 
                      type="checkbox"
                      id="opt-seniority"
                      checked={incSeniority}
                      onChange={(e) => setIncSeniority(e.target.checked)}
                      className="mt-1 accent-orange-500 cursor-pointer w-4 h-4"
                    />
                    <label htmlFor="opt-seniority" className="text-xs text-slate-700 cursor-pointer select-none">
                      <strong className="font-extrabold text-slate-950 block">Prime d'Ancienneté (2% / an)</strong>
                      <span className="text-[10px] text-slate-400 leading-none">
                        Calcule automatiquement une majoration selon la date d'embauche.
                      </span>
                    </label>
                  </div>

                  {/* Transport option */}
                  <div className="flex items-start gap-3 bg-white p-2.5 rounded-xl border border-slate-100">
                    <input 
                      type="checkbox"
                      id="opt-transport"
                      checked={incTransport}
                      onChange={(e) => setIncTransport(e.target.checked)}
                      className="mt-1 accent-orange-500 cursor-pointer w-4 h-4"
                    />
                    <div className="flex-1">
                      <label htmlFor="opt-transport" className="text-xs text-slate-700 cursor-pointer select-none block font-extrabold text-slate-950">
                        Indemnité de Transport
                      </label>
                      <input 
                        type="number"
                        placeholder="Montant FCFA"
                        value={customTransport}
                        disabled={!incTransport}
                        onChange={(e) => setCustomTransport(Number(e.target.value))}
                        className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* Bonus option */}
                  <div className="flex items-start gap-3 bg-white p-2.5 rounded-xl border border-slate-100">
                    <input 
                      type="checkbox"
                      id="opt-bonus"
                      checked={incBonus}
                      onChange={(e) => setIncBonus(e.target.checked)}
                      className="mt-1 accent-orange-500 cursor-pointer w-4 h-4"
                    />
                    <div className="flex-1">
                      <label htmlFor="opt-bonus" className="text-xs text-slate-700 cursor-pointer select-none block font-extrabold text-slate-950">
                        Primes de Maquis / Rendement
                      </label>
                      <input 
                        type="number"
                        placeholder="Saisir montant"
                        value={customBonus}
                        disabled={!incBonus}
                        onChange={(e) => setCustomBonus(Number(e.target.value))}
                        className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* CNPS option */}
                  <div className="flex items-start gap-3 bg-white p-2.5 rounded-xl border border-slate-100">
                    <input 
                      type="checkbox"
                      id="opt-social"
                      checked={incSocial}
                      onChange={(e) => setIncSocial(e.target.checked)}
                      className="mt-1 accent-orange-500 cursor-pointer w-4 h-4"
                    />
                    <div className="flex-1">
                      <label htmlFor="opt-social" className="text-xs text-slate-700 cursor-pointer select-none block font-extrabold text-rose-600">
                        Dépouiller Charges Sociales (CNPS)
                      </label>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <input 
                          type="number"
                          step="0.1"
                          value={customSocialRate}
                          disabled={!incSocial}
                          onChange={(e) => setCustomSocialRate(Number(e.target.value))}
                          className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-mono font-bold"
                        />
                        <span className="text-[10px] text-slate-400">% de cotisation</span>
                      </div>
                    </div>
                  </div>

                  {/* Impôts option */}
                  <div className="flex items-start gap-3 bg-white p-2.5 rounded-xl border border-slate-100">
                    <input 
                      type="checkbox"
                      id="opt-tax"
                      checked={incTax}
                      onChange={(e) => setIncTax(e.target.checked)}
                      className="mt-1 accent-orange-500 cursor-pointer w-4 h-4"
                    />
                    <div className="flex-1">
                      <label htmlFor="opt-tax" className="text-xs text-slate-700 cursor-pointer select-none block font-extrabold text-rose-600">
                        Retenue d'Impôt Salarial (ITS/IGR)
                      </label>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <input 
                          type="number"
                          step="0.1"
                          value={customTaxRate}
                          disabled={!incTax}
                          onChange={(e) => setCustomTaxRate(Number(e.target.value))}
                          className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-mono font-bold"
                        />
                        <span className="text-[10px] text-slate-400">% estimé</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Notes ou observations</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Prime de bon rendement maquis..."
                  value={slipNotes}
                  onChange={(e) => setSlipNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowPayslipModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase cursor-pointer"
                >
                  Établir & Visualiser Fiche
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL C: CONTRACT GENERATOR FORM
          ========================================== */}
      {showContractModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 shadow-2xl max-w-3xl w-full flex flex-col gap-4 animate-scale-in max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-orange-500" />
              <span>Rédaction de Contrat de Travail Unifié (10 Articles Légaux)</span>
            </h3>

            <form onSubmit={handleGenerateContractSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Employee Select */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Choisir l'employé</label>
                  <select
                    value={contractEmpId}
                    onChange={(e) => setContractEmpId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                    required
                  >
                    <option value="">-- Sélectionner un travailleur --</option>
                    {tenantEmployees.map(e => (
                      <option key={e.id} value={e.id}>{e.name} ({e.customStatus})</option>
                    ))}
                  </select>
                </div>

                {/* Contract Type */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Modèle de durée</label>
                  <select
                    value={contractType}
                    onChange={(e: any) => setContractType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-orange-500"
                  >
                    <option value="CDI">CDI (Contrat à Durée Indéterminée)</option>
                    <option value="CDD">CDD (Contrat à Durée Déterminée)</option>
                    <option value="stage">Stage d'Apprentissage ou d'Immersion</option>
                    <option value="interim">Contrat Intérimaire</option>
                  </select>
                </div>

                {/* Start Date */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Date de prise de service</label>
                  <input
                    type="date"
                    value={contractStart}
                    onChange={(e) => setContractStart(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                {/* End Date (Only CDD/Stage) */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Date de fin prévue (CDD/Stage/Interim)</label>
                  <input
                    type="date"
                    disabled={contractType === 'CDI'}
                    value={contractEnd}
                    onChange={(e) => setContractEnd(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500 disabled:opacity-50"
                  />
                </div>

              </div>

              {/* Dynamic Contract Articles Parameters */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block border-b border-slate-200 pb-1.5">
                  Options de Rédaction d'Articles (Génération Auto-Modulaire)
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Salaire Mensuel Brut (FCFA)</label>
                    <input
                      type="number"
                      value={contractSalary}
                      onChange={(e) => setContractSalary(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Période d'Essai</label>
                    <input
                      type="text"
                      placeholder="Ex: 1 mois, 15 jours"
                      value={contractTrialPeriod}
                      onChange={(e) => setContractTrialPeriod(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Heures de Travail Hebdo.</label>
                    <input
                      type="number"
                      value={contractWeeklyHours}
                      onChange={(e) => setContractWeeklyHours(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Congés Payés (Jours/An)</label>
                    <input
                      type="number"
                      value={contractLeaveDays}
                      onChange={(e) => setContractLeaveDays(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Allocation Logement (FCFA)</label>
                    <input
                      type="number"
                      value={contractHousingAllowance}
                      onChange={(e) => setContractHousingAllowance(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Indemnité Transport (FCFA)</label>
                    <input
                      type="number"
                      value={contractTransportAllowance}
                      onChange={(e) => setContractTransportAllowance(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Clauses Particulières / Directives Additionnelles</label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Clause de non-concurrence de 6 mois sur la ville de Bouaké..."
                    value={contractAdditionalClauses}
                    onChange={(e) => setContractAdditionalClauses(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                  />
                </div>
              </div>

              {/* Terms Content Editor */}
              <div className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Texte de l'Acte Juridique Généré (Modifiable)</label>
                  <span className="text-[9px] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded font-bold uppercase">10 Articles Actifs</span>
                </div>
                <textarea
                  rows={8}
                  value={contractTerms}
                  onChange={(e) => setContractTerms(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-orange-500 font-mono leading-relaxed"
                />
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowContractModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black rounded-xl text-xs uppercase cursor-pointer"
                >
                  Générer & Établir Contrat Officiel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL D: BULLETIN DE PAIE PRINT PREVIEW (A4 BEAUTIFUL LETTERHEAD)
          ========================================== */}
      {viewedPayslip && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[32px] p-8 shadow-2xl max-w-3xl w-full flex flex-col gap-6 animate-scale-in max-h-[95vh] overflow-y-auto print:shadow-none print:p-0">
            
            {/* Action panel */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 print:hidden">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest flex items-center gap-1">
                <Check className="w-4 h-4 text-emerald-500" /> Prévisualisation d'Impression Bulletin de Paie
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSendWhatsAppNotification(viewedPayslip)}
                  disabled={waSendingSlipId === viewedPayslip.id}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Activity className="w-4 h-4" />
                  <span>{waSendingSlipId === viewedPayslip.id ? 'Envoi...' : 'Envoyer par WhatsApp'}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimer en PDF / A4</span>
                </button>
                <button
                  onClick={() => setViewedPayslip(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>

            {/* A4 Formatted Area */}
            <div className="border border-slate-300 p-8 rounded-2xl shadow-inner font-sans bg-white print:border-none print:p-0 print:shadow-none space-y-6 text-slate-800">
              
              {/* Header Letterhead */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5">
                <div>
                  <h1 className="text-xl font-black text-slate-950 uppercase tracking-tight">Brunch Bouaké Hospitality</h1>
                  <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider font-mono">Maquis & Hébergement de Prestige</p>
                  <p className="text-[10px] text-slate-400 mt-1.5">Quartier Kennedy, route de l'Université, Bouaké</p>
                  <p className="text-[10px] text-slate-400">CC N° 1293847 B | Tél: +225 07 48 29 10 11</p>
                </div>
                <div className="text-right">
                  <div className="bg-slate-900 text-white px-4 py-2 rounded-xl inline-block text-center">
                    <span className="text-[9px] font-bold uppercase tracking-widest block text-slate-400">BULLETIN DE PAIE</span>
                    <span className="text-xs font-mono font-bold">{viewedPayslip.period}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 font-mono">Fiche N° : {viewedPayslip.id.toUpperCase()}</p>
                </div>
              </div>

              {/* Employees and employer section */}
              <div className="grid grid-cols-2 gap-6 text-[11px] leading-relaxed">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                  <h4 className="font-extrabold text-slate-900 uppercase text-[9px] tracking-wider text-slate-500">EMPLOYEUR</h4>
                  <p className="font-black text-slate-900">Brunch Bouaké Hospitality Ltd.</p>
                  <p>Ville: Bouaké, Côte d'Ivoire</p>
                  <p>ID Employeur: RCCM CI-BKE-2024-B-992</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                  <h4 className="font-extrabold text-slate-900 uppercase text-[9px] tracking-wider text-slate-500">SALARIÉ</h4>
                  <p className="font-black text-slate-900">{viewedPayslip.employeeName}</p>
                  <p>Date d'embauche : {tenantEmployees.find(e => e.id === viewedPayslip.employeeId)?.hireDate || 'N/A'}</p>
                  <p className="font-bold text-orange-600 uppercase">
                    Fonction: {tenantEmployees.find(e => e.id === viewedPayslip.employeeId)?.customStatus || 'Travailleur'}
                  </p>
                  <p>Numéro CNPS: {tenantEmployees.find(e => e.id === viewedPayslip.employeeId)?.cnpsNumber || 'Non Affilié'}</p>
                </div>
              </div>

              {/* Financial Breakdown Table */}
              <table className="w-full text-left border-collapse border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-800">
                    <th className="p-2.5 border-r border-slate-300">Désignation</th>
                    <th className="p-2.5 border-r border-slate-300 text-right">Base / Taux</th>
                    <th className="p-2.5 border-r border-slate-300 text-right">Gains (+)</th>
                    <th className="p-2.5 text-right">Retenues (-)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                  
                  {/* Base Salary */}
                  <tr>
                    <td className="p-2.5 font-sans font-semibold border-r border-slate-300">Salaire de Base Mensuel</td>
                    <td className="p-2.5 text-right border-r border-slate-300">{viewedPayslip.baseSalary.toLocaleString('fr-FR')}</td>
                    <td className="p-2.5 text-right border-r border-slate-300 text-slate-900 font-bold">+{viewedPayslip.baseSalary.toLocaleString('fr-FR')}</td>
                    <td className="p-2.5 text-right">--</td>
                  </tr>

                  {/* Seniority */}
                  {viewedPayslip.includeSeniority && viewedPayslip.seniorityYears > 0 && (
                    <tr>
                      <td className="p-2.5 font-sans border-r border-slate-300">
                        Indemnité d'Ancienneté ({viewedPayslip.seniorityYears} ans)
                      </td>
                      <td className="p-2.5 text-right border-r border-slate-300">{viewedPayslip.seniorityYears * 2}%</td>
                      <td className="p-2.5 text-right border-r border-slate-300 text-emerald-600 font-bold">+{viewedPayslip.seniorityAmount.toLocaleString('fr-FR')}</td>
                      <td className="p-2.5 text-right">--</td>
                    </tr>
                  )}

                  {/* Transport Allowance */}
                  {viewedPayslip.includeTransport && (
                    <tr>
                      <td className="p-2.5 font-sans border-r border-slate-300">Indemnité de Transport Forfaitaire</td>
                      <td className="p-2.5 text-right border-r border-slate-300">Fixe</td>
                      <td className="p-2.5 text-right border-r border-slate-300 text-emerald-600 font-bold">+{viewedPayslip.transportAllowance.toLocaleString('fr-FR')}</td>
                      <td className="p-2.5 text-right">--</td>
                    </tr>
                  )}

                  {/* Custom Bonus */}
                  {viewedPayslip.includeBonus && viewedPayslip.bonusAmount > 0 && (
                    <tr>
                      <td className="p-2.5 font-sans border-r border-slate-300">Primes Exceptionnelles / Caisse POS</td>
                      <td className="p-2.5 text-right border-r border-slate-300">Occasionnel</td>
                      <td className="p-2.5 text-right border-r border-slate-300 text-emerald-600 font-bold">+{viewedPayslip.bonusAmount.toLocaleString('fr-FR')}</td>
                      <td className="p-2.5 text-right">--</td>
                    </tr>
                  )}

                  {/* Social Security */}
                  {viewedPayslip.includeSocialSecurity && (
                    <tr>
                      <td className="p-2.5 font-sans border-r border-slate-300 text-rose-700 font-medium">Cotisation Sociale CNPS Retenue</td>
                      <td className="p-2.5 text-right border-r border-slate-300">{customSocialRate}%</td>
                      <td className="p-2.5 text-right border-r border-slate-300">--</td>
                      <td className="p-2.5 text-right text-rose-600 font-bold">-{viewedPayslip.socialSecurityDeduction.toLocaleString('fr-FR')}</td>
                    </tr>
                  )}

                  {/* Taxes */}
                  {viewedPayslip.includeTax && (
                    <tr>
                      <td className="p-2.5 font-sans border-r border-slate-300 text-rose-700 font-medium">Retenue à la source Impôt (ITS/IGR)</td>
                      <td className="p-2.5 text-right border-r border-slate-300">{customTaxRate}%</td>
                      <td className="p-2.5 text-right border-r border-slate-300">--</td>
                      <td className="p-2.5 text-right text-rose-600 font-bold">-{viewedPayslip.taxDeduction.toLocaleString('fr-FR')}</td>
                    </tr>
                  )}

                </tbody>
              </table>

              {/* Total calculations */}
              <div className="grid grid-cols-2 gap-4 border-t border-slate-900 pt-4 text-xs">
                <div>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">Observations :</p>
                  <p className="text-slate-600 italic leading-relaxed mt-1 text-[10px] max-w-sm">
                    {viewedPayslip.notes || "Aucun commentaire spécifique."}
                  </p>
                </div>
                <div className="bg-slate-950 text-white rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Total Gains Bruts :</span>
                    <span className="font-mono">
                      {((viewedPayslip.baseSalary) + 
                       (viewedPayslip.includeSeniority ? viewedPayslip.seniorityAmount : 0) + 
                       (viewedPayslip.includeBonus ? viewedPayslip.bonusAmount : 0) + 
                       (viewedPayslip.includeTransport ? viewedPayslip.transportAllowance : 0)).toLocaleString('fr-FR')} F
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1.5">
                    <span>Total Retenues :</span>
                    <span className="font-mono">
                      {-((viewedPayslip.includeSocialSecurity ? viewedPayslip.socialSecurityDeduction : 0) + 
                       (viewedPayslip.includeTax ? viewedPayslip.taxDeduction : 0)).toLocaleString('fr-FR')} F
                    </span>
                  </div>
                  <div className="flex justify-between font-extrabold text-sm text-orange-400">
                    <span className="uppercase">Net Payé (FCFA) :</span>
                    <span className="font-mono text-base">{viewedPayslip.netSalary.toLocaleString('fr-FR')} F</span>
                  </div>
                </div>
              </div>

              {/* Signature Blocks */}
              <div className="grid grid-cols-2 gap-10 pt-16 text-center text-[10px] font-bold border-t border-dashed border-slate-200">
                <div>
                  <p className="text-slate-400 uppercase tracking-wider mb-10">SIGNATURE DE L'EMPLOYÉ</p>
                  <div className="border-b border-slate-300 w-32 mx-auto" />
                  <p className="text-[8px] text-slate-400 mt-1">(Précédée de la mention "Lu et approuvé")</p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase tracking-wider mb-10 font-black text-slate-600">DIRECTION BRUNCH BOUAKÉ</p>
                  <div className="border-b border-slate-300 w-32 mx-auto" />
                  <p className="text-[8px] text-slate-400 mt-1">(Timbre humide et cachet de l'entreprise)</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ==========================================
          MODAL E: CONTRACT DOCUMENT PRINT VIEW (A4 FORMAL TERMS)
          ========================================== */}
      {viewedContract && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[32px] p-8 shadow-2xl max-w-3xl w-full flex flex-col gap-6 animate-scale-in max-h-[95vh] overflow-y-auto print:shadow-none print:p-0">
            
            {/* Action panel */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 print:hidden">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest flex items-center gap-1">
                <Check className="w-4 h-4 text-emerald-500" /> Prévisualisation du Contrat de Travail Acte
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimer le Contrat</span>
                </button>
                <button
                  onClick={() => setViewedContract(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>

            {/* A4 Formatted Area */}
            <div className="border border-slate-300 p-8 rounded-2xl shadow-inner font-sans bg-white print:border-none print:p-0 print:shadow-none space-y-6 text-slate-800 text-left">
              
              <div className="text-center space-y-1">
                <h1 className="text-lg font-black uppercase text-slate-950 tracking-tight">RÉPUBLIQUE DE CÔTE D'IVOIRE</h1>
                <p className="text-[9px] font-bold text-slate-500">Union - Discipline - Travail</p>
                <div className="border-b-2 border-slate-900 w-24 mx-auto my-3" />
                <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-900 bg-slate-100 py-1 rounded">
                  CONTRAT DE TRAVAIL UNIFIÉ ({viewedContract.type})
                </h2>
                <p className="text-[9px] font-mono text-slate-400">Réf Acte : {viewedContract.id.toUpperCase()}</p>
              </div>

              {/* Terms pre formatted */}
              <div className="text-xs space-y-4 whitespace-pre-wrap leading-relaxed text-slate-700 font-sans p-4 bg-slate-50 rounded-2xl border border-slate-100">
                {viewedContract.terms}
              </div>

              {/* Execution details */}
              <div className="text-[11px] text-slate-600 space-y-1 bg-white p-3 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-800">DURÉE & CONDITIONS :</p>
                <p>Type de Contrat : <span className="font-bold uppercase text-slate-900">{viewedContract.type}</span></p>
                <p>Date d'effet officielle : <span className="font-bold text-slate-900">{new Date(viewedContract.startDate).toLocaleDateString('fr-FR')}</span></p>
                {viewedContract.endDate && (
                  <p>Date de fin prévue : <span className="font-bold text-slate-900">{new Date(viewedContract.endDate).toLocaleDateString('fr-FR')}</span></p>
                )}
                <p>Rémunération de base stipulée : <span className="font-bold font-mono text-emerald-700">{viewedContract.salary.toLocaleString('fr-FR')} F CFA</span> brut par mois.</p>
              </div>

              {/* Signature Blocks */}
              <div className="grid grid-cols-2 gap-10 pt-16 text-center text-[10px] font-bold border-t border-dashed border-slate-200">
                <div>
                  <p className="text-slate-400 uppercase tracking-wider mb-14">SIGNATURE PRÉCÉDÉE DE LA MENTION "LU ET ACCEPTE" - SALARIÉ</p>
                  <p className="text-slate-900 font-bold">{viewedContract.employeeName}</p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase tracking-wider mb-14">LA DIRECTION BRUNCH BOUAKÉ HOSPITALITY</p>
                  <p className="text-slate-900 font-bold">Le Directeur Général</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ==========================================
          MODAL F: CHANGE SECURITY PIN
          ========================================== */}
      {showChangePinModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 shadow-2xl max-w-sm w-full flex flex-col gap-4 animate-scale-in text-slate-900">
            <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
              <Lock className="w-5 h-5 text-orange-500" />
              <h3 className="text-sm font-black uppercase tracking-tight">Changer le Code PIN de Sécurité</h3>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const currentPin = localStorage.getItem('bb_security_pin') || '1234';
              if (currentPinInput !== currentPin) {
                setPinChangeError("Le code PIN actuel est incorrect.");
                setPinChangeSuccess(null);
                return;
              }
              if (newPinInput.length < 4) {
                setPinChangeError("Le nouveau PIN doit comporter au moins 4 caractères.");
                setPinChangeSuccess(null);
                return;
              }
              if (newPinInput !== confirmPinInput) {
                setPinChangeError("Les nouveaux codes PIN ne correspondent pas.");
                setPinChangeSuccess(null);
                return;
              }
              localStorage.setItem('bb_security_pin', newPinInput);
              setSecurityPin(newPinInput);
              setPinChangeSuccess("Code PIN modifié avec succès !");
              setPinChangeError(null);
              setCurrentPinInput('');
              setNewPinInput('');
              setConfirmPinInput('');
              setTimeout(() => {
                setShowChangePinModal(false);
                setPinChangeSuccess(null);
              }, 1500);
            }} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-left">Code PIN Actuel</label>
                <input
                  type="password"
                  required
                  placeholder="Code actuel"
                  value={currentPinInput}
                  onChange={(e) => setCurrentPinInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-center font-mono focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-left">Nouveau Code PIN</label>
                <input
                  type="password"
                  required
                  placeholder="Nouveau code (Ex: 5678)"
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-center font-mono focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-left">Confirmer le Nouveau Code PIN</label>
                <input
                  type="password"
                  required
                  placeholder="Confirmer nouveau code"
                  value={confirmPinInput}
                  onChange={(e) => setConfirmPinInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-center font-mono focus:outline-none focus:border-orange-500"
                />
              </div>

              {pinChangeError && (
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-2.5 text-[10px] text-rose-600 font-semibold text-center">
                  {pinChangeError}
                </div>
              )}

              {pinChangeSuccess && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-2.5 text-[10px] text-emerald-600 font-bold text-center">
                  {pinChangeSuccess}
                </div>
              )}

              <div className="border-t border-slate-100 pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePinModal(false);
                    setPinChangeError(null);
                    setPinChangeSuccess(null);
                  }}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black rounded-xl text-xs uppercase cursor-pointer"
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
