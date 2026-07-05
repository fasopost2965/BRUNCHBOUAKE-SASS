import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Key, 
  UserX, 
  UserCheck, 
  Search, 
  Filter, 
  Trash2, 
  Plus, 
  Check, 
  AlertTriangle, 
  MapPin, 
  Building,
  RefreshCw,
  Sparkles,
  Info,
  ChevronDown
} from 'lucide-react';
import { UserAccount, UserRole } from '../types';
import { hashPassword } from '../utils/crypto';
import { validateUser } from '../utils/validation';

interface UserManagerProps {
  users: UserAccount[];
  onAddUser: (user: UserAccount) => void;
  onUpdateUser: (userId: string, updated: Partial<UserAccount>) => void;
  onDeleteUser: (userId: string) => void;
  onImpersonate: (user: UserAccount) => void;
  currentUser: UserAccount | null;
}

export default function UserManager({
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onImpersonate,
  currentUser
}: UserManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // New user form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('receptionist');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [password, setPassword] = useState('password123');
  const [isTemporary, setIsTemporary] = useState(true);
  const [branch, setBranch] = useState('Ancien-Koko');

  // Edit user state
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('receptionist');
  const [editStatus, setEditStatus] = useState<'active' | 'inactive' | 'blocked'>('active');
  const [editBranch, setEditBranch] = useState('Ancien-Koko');

  // Validation feedback
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password generator helper
  const generateRandomPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let newPass = '';
    for (let i = 0; i < 10; i++) {
      newPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPass);
    setSuccessMessage('Nouveau mot de passe sécurisé généré !');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const validatePasswordStrength = (pass: string) => {
    if (pass.length < 6) return 'Faible (min. 6 caractères)';
    if (pass.length < 10) return 'Moyen';
    return 'Fort';
  };

  // Quick seed action for standard demo users
  const handleQuickSeed = () => {
    const defaultDemoAccounts: Omit<UserAccount, 'id' | 'createdAt'>[] = [
      {
        name: 'Jean Dupont (Directeur)',
        username: 'admin@test',
        email: 'admin@brunchbouake.com',
        phone: '+225 07 48 29 10 11',
        role: 'admin',
        status: 'active',
        passwordHash: 'password',
        isTemporaryPassword: false,
        branch: 'Quartier Kennedy'
      },
      {
        name: 'Mariam Diallo',
        username: 'reception@test',
        email: 'm.diallo@brunchbouake.com',
        phone: '+225 05 55 12 34 56',
        role: 'receptionist',
        status: 'active',
        passwordHash: 'password',
        isTemporaryPassword: false,
        branch: 'Quartier Kennedy'
      },
      {
        name: 'Kouassi Kouamé Jean',
        username: 'waiter@test',
        email: 'k.jean@brunchbouake.com',
        phone: '+225 05 99 88 77 66',
        role: 'waiter',
        status: 'active',
        passwordHash: 'password',
        isTemporaryPassword: false,
        branch: 'Maquis Central'
      },
      {
        name: 'Aka Florence (Gouvernante)',
        username: 'housekeeping@test',
        email: 'f.aka@brunchbouake.com',
        phone: '+225 01 22 33 44 55',
        role: 'housekeeper',
        status: 'active',
        passwordHash: 'password',
        isTemporaryPassword: false,
        branch: 'Quartier Kennedy'
      },
      {
        name: 'Yao Amenan Chantal (Comptable)',
        username: 'cashier@test',
        email: 'c.yao@brunchbouake.com',
        phone: '+225 07 11 22 33 44',
        role: 'accountant',
        status: 'active',
        passwordHash: 'password',
        isTemporaryPassword: false,
        branch: 'Quartier Kennedy'
      },
      {
        name: 'Zadi Richard (Manager Général)',
        username: 'manager@test',
        email: 'r.zadi@brunchbouake.com',
        phone: '+225 07 44 55 66 77',
        role: 'manager',
        status: 'active',
        passwordHash: 'password',
        isTemporaryPassword: false,
        branch: 'Quartier Kennedy'
      }
    ];

    let count = 0;
    defaultDemoAccounts.forEach(account => {
      const exists = users.find(u => u.username.toLowerCase() === account.username.toLowerCase());
      if (!exists) {
        onAddUser({
          ...account,
          id: `usr-${Date.now().toString().slice(-4)}-${Math.random().toString(36).substring(2, 5)}`,
          createdAt: new Date().toISOString(),
          createdBy: currentUser?.name || 'Système'
        });
        count++;
      }
    });

    setSuccessMessage(`${count} comptes de test standard ont été créés avec succès !`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Run robust Zod runtime validation
    const validation = validateUser({
      name: fullName,
      username,
      email,
      phone,
      role,
      status,
      branch
    });

    if (!validation.success) {
      setErrorMessage(validation.message || "Erreur de validation des données.");
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Le mot de passe de sécurité est obligatoire.');
      return;
    }

    const normalizedUsername = username.trim().toLowerCase();
    const usernameExists = users.some(u => u.username.toLowerCase() === normalizedUsername);
    if (usernameExists) {
      setErrorMessage(`Le nom d'utilisateur "${username}" est déjà attribué.`);
      return;
    }

    if (email.trim()) {
      const emailExists = users.some(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (emailExists) {
        setErrorMessage(`L'adresse email "${email}" est déjà utilisée.`);
        return;
      }
    }

    const hashedPasswordValue = await hashPassword(password);

    const newUser: UserAccount = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: fullName.trim(),
      username: normalizedUsername,
      email: email.trim(),
      phone: phone.trim(),
      role,
      status,
      passwordHash: hashedPasswordValue,
      isTemporaryPassword: isTemporary,
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.name || 'Administrateur',
      branch
    };

    onAddUser(newUser);

    // Reset Form
    setFullName('');
    setUsername('');
    setEmail('');
    setPhone('');
    setPassword('password123');
    setIsTemporary(true);
    setShowAddForm(false);
    
    setSuccessMessage(`Le compte de ${newUser.name} a été créé.`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleStartEditing = (user: UserAccount) => {
    setEditingUserId(user.id);
    setEditFullName(user.name);
    setEditEmail(user.email);
    setEditPhone(user.phone);
    setEditRole(user.role);
    setEditStatus(user.status);
    setEditBranch(user.branch || 'Ancien-Koko');
  };

  const handleSaveEdit = (userId: string) => {
    if (!editFullName.trim()) {
      alert('Le nom complet est obligatoire.');
      return;
    }

    onUpdateUser(userId, {
      name: editFullName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      role: editRole,
      status: editStatus,
      branch: editBranch,
      updatedAt: new Date().toISOString(),
      updatedBy: currentUser?.name || 'Administrateur'
    });

    setEditingUserId(null);
    setSuccessMessage('Modifications enregistrées avec succès.');
    setTimeout(() => setSuccessMessage(''), 2500);
  };

  const handleResetPassword = (userId: string) => {
    const newPass = prompt("Saisissez le nouveau mot de passe temporaire pour cet utilisateur :", "brunch2026");
    if (newPass === null) return; // Cancelled
    if (!newPass.trim()) {
      alert("Le mot de passe ne peut pas être vide.");
      return;
    }

    onUpdateUser(userId, {
      passwordHash: newPass.trim(),
      isTemporaryPassword: true,
      updatedAt: new Date().toISOString(),
      updatedBy: currentUser?.name || 'Administrateur'
    });

    alert("Le mot de passe a été mis à jour avec succès. L'utilisateur devra le changer à sa prochaine connexion.");
  };

  const getRoleBadgeColor = (r: UserRole) => {
    switch (r) {
      case 'admin': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'manager': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'receptionist': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'waiter': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'accountant': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'housekeeper': return 'bg-teal-50 text-teal-700 border-teal-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getRoleLabelFrench = (r: UserRole) => {
    switch (r) {
      case 'admin': return 'Directeur / Admin';
      case 'manager': return 'Manager Général';
      case 'receptionist': return 'Réceptionniste';
      case 'waiter': return 'Serveur Resto';
      case 'accountant': return 'Comptable (Caissier)';
      case 'housekeeper': return 'Gouvernante (Ménage)';
      default: return r;
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'active':
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">Actif</span>;
      case 'inactive':
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 rounded-full border border-slate-200">Inactif</span>;
      case 'blocked':
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 rounded-full border border-rose-200">Bloqué</span>;
      default:
        return null;
    }
  };

  // Filter and search
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.phone && u.phone.includes(searchQuery));
    
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top action header card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-orange-500 rounded-xl">
                <Shield className="w-5 h-5 text-white animate-pulse" />
              </div>
              <h2 className="text-xl font-extrabold tracking-tight">Console d'Administration & Comptes Demo</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-xl">
              Gérez les habilitations, ajoutez des profils de collaborateurs pour Brunch Bouaké, et testez les différentes redirections de rôle en temps réel.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={handleQuickSeed}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-orange-400 font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
              title="Crée automatiquement admin@test, reception@test, waiter@test, cashier@test, etc."
            >
              <Sparkles className="w-4 h-4 text-orange-500" />
              Générer Comptes Demo
            </button>
            
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setEditingUserId(null);
              }}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Nouvel Utilisateur
            </button>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl flex items-center gap-2.5 text-xs font-bold animate-bounce shadow-xs">
          <Check className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl flex items-center gap-2.5 text-xs font-bold animate-pulse shadow-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1. CREATION / FORM CONTAINER */}
      {showAddForm && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-lg space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-950 text-sm flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-orange-500" />
              Ajouter un Collaborateur
            </h3>
            <button 
              onClick={() => setShowAddForm(false)}
              className="text-[10px] font-bold text-slate-400 hover:text-slate-600 px-2 py-1"
            >
              Annuler
            </button>
          </div>

          <form onSubmit={handleCreateUserSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="block text-slate-500 font-bold">Nom Complet *</label>
              <input
                type="text"
                required
                placeholder="Ex: Yao Amenan Chantal"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none bg-slate-50/50"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-slate-500 font-bold">Identifiant / Username *</label>
              <input
                type="text"
                required
                placeholder="Ex: reception@test ou chantal.yao"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none bg-slate-50/50 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-slate-500 font-bold">Rôle Fonctionnel *</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none bg-slate-50/50"
              >
                <option value="admin">Directeur / Admin</option>
                <option value="manager">Manager Général</option>
                <option value="receptionist">Réceptionniste</option>
                <option value="waiter">Serveur Resto</option>
                <option value="accountant">Comptable (Caissier)</option>
                <option value="housekeeper">Gouvernante (Ménage)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-slate-500 font-bold">Adresse Email</label>
              <input
                type="email"
                placeholder="chantal.yao@brunchbouake.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none bg-slate-50/50"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-slate-500 font-bold">Téléphone de Service</label>
              <input
                type="text"
                placeholder="+225 07 11 22 33 44"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none bg-slate-50/50"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-slate-500 font-bold">Succursale / Affectation</label>
              <select
                value={branch}
                onChange={e => setBranch(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none bg-slate-50/50"
              >
                <option value="Quartier Kennedy">Résidence Kennedy (Brunch Bouaké)</option>
                <option value="Maquis Central">Maquis Central Bouaké</option>
                <option value="Ancien-Koko">Villas Cocody-Koko</option>
              </select>
            </div>

            <div className="md:col-span-2 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <label className="block text-slate-700 font-extrabold">Mot de Passe Initial *</label>
                  <span className="text-[10px] text-slate-400">Robustesse : <strong className="text-orange-600 font-bold">{validatePasswordStrength(password)}</strong></span>
                </div>
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors text-[10px] font-bold text-slate-600 shrink-0"
                >
                  Générer Aléatoire
                </button>
              </div>

              <input
                type="text"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-orange-500 font-mono font-bold"
              />

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isTemporary}
                  onChange={e => setIsTemporary(e.target.checked)}
                  className="rounded text-orange-600 border-slate-300 w-4 h-4 focus:ring-orange-500"
                />
                <span className="text-slate-600 font-semibold select-none">Exiger le changement de mot de passe à la première connexion</span>
              </label>
            </div>

            <div className="flex items-end pt-4">
              <button
                type="submit"
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Valider l'Inscription
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. FILTERS AND SEARCH LIST */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-5 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, identifiant, email, téléphone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 border border-slate-100 rounded-xl">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 font-medium">Rôle:</span>
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="bg-transparent font-bold text-slate-700 focus:outline-none"
              >
                <option value="all">Tous les rôles</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="receptionist">Réceptionniste</option>
                <option value="waiter">Serveur Resto</option>
                <option value="accountant">Comptable</option>
                <option value="housekeeper">Housekeeping</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 border border-slate-100 rounded-xl">
              <span className="text-slate-400 font-medium">Statut:</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-transparent font-bold text-slate-700 focus:outline-none"
              >
                <option value="all">Tous statuts</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="blocked">Bloqué</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. TABLE OF USERS */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider font-mono">
                <th className="py-3 px-4 font-semibold">Collaborateur</th>
                <th className="py-3 px-4 font-semibold">Identifiant / Rôle</th>
                <th className="py-3 px-4 font-semibold">Contact / Affectation</th>
                <th className="py-3 px-4 font-semibold">Statut</th>
                <th className="py-3 px-4 font-semibold">Dernière Connexion</th>
                <th className="py-3 px-4 font-semibold text-right">Actions de Contrôle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-slate-300 opacity-60" />
                    Aucun collaborateur ne correspond à ces critères.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isEditing = editingUserId === u.id;
                  const isCurrentLogged = currentUser?.id === u.id;

                  return (
                    <tr 
                      key={u.id} 
                      className={`hover:bg-slate-50/50 transition-colors ${
                        isCurrentLogged ? 'bg-orange-50/30 font-bold' : ''
                      }`}
                    >
                      {/* Column 1: Collaborator */}
                      <td className="py-3.5 px-4">
                        {isEditing ? (
                          <div className="space-y-1 max-w-xs">
                            <input
                              type="text"
                              value={editFullName}
                              onChange={e => setEditFullName(e.target.value)}
                              className="px-2 py-1 border border-slate-200 rounded w-full font-bold bg-white"
                            />
                            <span className="text-[10px] font-mono text-slate-400 block">ID : {u.id}</span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-slate-900 font-bold block text-sm">{u.name}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              Créé le : {new Date(u.createdAt).toLocaleDateString('fr-FR')} {u.createdBy ? `par ${u.createdBy}` : ''}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Column 2: Identifiant / Rôle */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="space-y-1.5">
                          <span className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[11px] font-bold block w-fit">
                            {u.username}
                          </span>
                          {isEditing ? (
                            <select
                              value={editRole}
                              onChange={e => setEditRole(e.target.value as UserRole)}
                              className="px-1.5 py-0.5 border border-slate-200 rounded bg-white font-sans font-bold"
                            >
                              <option value="admin">Directeur / Admin</option>
                              <option value="manager">Manager Général</option>
                              <option value="receptionist">Réceptionniste</option>
                              <option value="waiter">Serveur Resto</option>
                              <option value="accountant">Comptable (Caissier)</option>
                              <option value="housekeeper">Gouvernante (Ménage)</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-0.5 rounded border text-[10px] font-bold inline-block font-sans ${getRoleBadgeColor(u.role)}`}>
                              {getRoleLabelFrench(u.role)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Column 3: Contact / Affectation */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          {isEditing ? (
                            <div className="space-y-1 max-w-xs">
                              <input
                                type="text"
                                placeholder="Email"
                                value={editEmail}
                                onChange={e => setEditEmail(e.target.value)}
                                className="px-2 py-1 border border-slate-200 rounded text-xs w-full bg-white"
                              />
                              <input
                                type="text"
                                placeholder="Téléphone"
                                value={editPhone}
                                onChange={e => setEditPhone(e.target.value)}
                                className="px-2 py-1 border border-slate-200 rounded text-xs w-full bg-white"
                              />
                              <input
                                type="text"
                                placeholder="Affectation"
                                value={editBranch}
                                onChange={e => setEditBranch(e.target.value)}
                                className="px-2 py-1 border border-slate-200 rounded text-xs w-full bg-white"
                              />
                            </div>
                          ) : (
                            <>
                              {u.email && <span className="text-slate-600 block text-[11px]">{u.email}</span>}
                              {u.phone && <span className="text-slate-500 block text-[10px] font-mono">{u.phone}</span>}
                              <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <Building className="w-3 h-3 text-orange-400 shrink-0" />
                                {u.branch || 'Résidence Brunch Bouaké'}
                              </span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Column 4: Statut */}
                      <td className="py-3.5 px-4">
                        {isEditing ? (
                          <select
                            value={editStatus}
                            onChange={e => setEditStatus(e.target.value as any)}
                            className="px-1.5 py-0.5 border border-slate-200 rounded bg-white text-xs font-bold"
                          >
                            <option value="active">Actif</option>
                            <option value="inactive">Inactif</option>
                            <option value="blocked">Bloqué</option>
                          </select>
                        ) : (
                          getStatusBadge(u.status)
                        )}
                      </td>

                      {/* Column 5: Dernière Connexion */}
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {u.lastLoginAt ? (
                          <>
                            <span className="block font-bold text-slate-600">
                              {new Date(u.lastLoginAt).toLocaleDateString('fr-FR')}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              à {new Date(u.lastLoginAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </>
                        ) : (
                          <span className="text-slate-400 italic">Jamais connecté</span>
                        )}
                        {u.isTemporaryPassword && (
                          <span className="block text-[9px] bg-amber-50 text-amber-800 border border-amber-100 rounded px-1 mt-1 w-max font-sans font-bold uppercase">
                            Changer MDP requis
                          </span>
                        )}
                      </td>

                      {/* Column 6: Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex justify-end gap-1.5 flex-wrap">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSaveEdit(u.id)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[10px] transition-colors cursor-pointer"
                              >
                                Enregistrer
                              </button>
                              <button
                                onClick={() => setEditingUserId(null)}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded text-[10px] transition-colors cursor-pointer"
                              >
                                Annuler
                              </button>
                            </>
                          ) : (
                            <>
                              {/* IMPERSONATE/TEST REDIRECT BUTTON */}
                              {u.status === 'active' && !isCurrentLogged && (
                                <button
                                  onClick={() => onImpersonate(u)}
                                  className="px-2 py-1 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                                  title={`Se connecter instantanément en tant que ${u.name}`}
                                >
                                  <RefreshCw className="w-3 h-3 text-orange-500 shrink-0" />
                                  Simuler Rôle
                                </button>
                              )}

                              <button
                                onClick={() => handleStartEditing(u)}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold transition-all cursor-pointer"
                              >
                                Modifier
                              </button>

                              <button
                                onClick={() => handleResetPassword(u.id)}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[10px] font-mono font-bold transition-all cursor-pointer"
                                title="Réinitialiser le mot de passe"
                              >
                                MDP
                              </button>

                              {!isCurrentLogged && (
                                <button
                                  onClick={() => {
                                    if (confirm(`Voulez-vous vraiment supprimer le compte de ${u.name} ?`)) {
                                      onDeleteUser(u.id);
                                    }
                                  }}
                                  className="p-1 text-rose-600 hover:text-white hover:bg-rose-500 rounded transition-all cursor-pointer"
                                  title="Supprimer définitivement"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit & Security policy disclaimer */}
      <div className="bg-amber-50/50 p-4 border border-amber-200/40 rounded-3xl flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <div className="text-[11px] text-amber-900/80 leading-relaxed">
          <strong className="text-amber-950 block mb-1">Politique d'Accès & Traçabilité Brunch Bouaké :</strong>
          Tous les changements de rôle, connexions de test, ou modifications de statut utilisateur sont enregistrés dans l'audit de sécurité local. Le mot de passe par défaut pour tous les comptes de démonstration fraîchement générés est <strong className="bg-white px-1.5 py-0.5 border border-amber-200 rounded font-mono text-[11px] text-amber-950">password</strong>.
        </div>
      </div>
    </div>
  );
}
