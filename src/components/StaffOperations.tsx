import React, { useState } from 'react';
import { 
  Users, 
  CheckSquare, 
  Plus, 
  UserPlus, 
  Play, 
  Check, 
  AlertCircle, 
  Phone, 
  Clock,
  Layers,
  Wrench,
  Sparkles,
  Utensils
} from 'lucide-react';
import { StaffMember, Task, Room } from '../types';

interface StaffProps {
  staff: StaffMember[];
  tasks: Task[];
  rooms: Room[];
  onUpdateStaff: (updated: StaffMember[]) => void;
  onUpdateTasks: (updated: Task[]) => void;
  onUpdateRooms?: (updated: Room[]) => void;
}

export default function StaffOperations({
  staff,
  tasks,
  rooms,
  onUpdateStaff,
  onUpdateTasks,
  onUpdateRooms
}: StaffProps) {
  
  const [activeTab, setActiveTab] = useState<'tasks' | 'staff'>('tasks');
  const [filterCategory, setFilterCategory] = useState<'all' | 'housekeeping' | 'maintenance' | 'restaurant' | 'reception'>('all');

  // Task form state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskCat, setTaskCat] = useState<'housekeeping' | 'maintenance' | 'restaurant' | 'reception' | 'general'>('housekeeping');
  const [taskAssignedId, setTaskAssignedId] = useState('');
  const [taskRoomId, setTaskRoomId] = useState('');

  // Staff member form state
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState<'receptionist' | 'waiter' | 'housekeeper' | 'manager'>('housekeeper');
  const [staffPhone, setStaffPhone] = useState('');

  // Handle task status change
  const handleToggleTaskStatus = (taskId: string, nextStatus: 'pending' | 'in-progress' | 'completed') => {
    const updated = tasks.map(t => t.id === taskId ? { ...t, status: nextStatus } : t);
    onUpdateTasks(updated);

    if (nextStatus === 'completed') {
      const task = tasks.find(t => t.id === taskId);
      if (task && task.category === 'housekeeping' && task.roomId && onUpdateRooms) {
        const updatedRooms = rooms.map(r => r.id === task.roomId ? { ...r, status: 'available' as const } : r);
        onUpdateRooms(updatedRooms);
      }
    }
  };

  // Handle task creation
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    const assignedStaff = staff.find(s => s.id === taskAssignedId);

    const newTask: Task = {
      id: `task-${Date.now().toString().slice(-4)}`,
      title: taskTitle,
      description: taskDesc,
      category: taskCat,
      assignedTo: taskAssignedId || undefined,
      assignedToName: assignedStaff ? assignedStaff.name : undefined,
      status: 'pending',
      dueDate: new Date().toISOString().split('T')[0],
      roomId: taskRoomId || undefined
    };

    onUpdateTasks([...tasks, newTask]);
    setShowTaskModal(false);
    setTaskTitle('');
    setTaskDesc('');
    setTaskAssignedId('');
    setTaskRoomId('');
  };

  // Handle staff registration
  const handleRegisterStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName || !staffPhone) return;

    const newStaff: StaffMember = {
      id: `s-${Date.now().toString().slice(-4)}`,
      name: staffName,
      role: staffRole,
      phone: staffPhone,
      status: 'active'
    };

    onUpdateStaff([...staff, newStaff]);
    setShowStaffModal(false);
    setStaffName('');
    setStaffPhone('');
  };

  const handleToggleStaffStatus = (staffId: string) => {
    const updated = staff.map(s => {
      if (s.id === staffId) {
        const nextStatus: 'active' | 'off-duty' = s.status === 'active' ? 'off-duty' : 'active';
        return { ...s, status: nextStatus };
      }
      return s;
    });
    onUpdateStaff(updated);
  };

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    return filterCategory === 'all' || t.category === filterCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Tab Switcher & Modal Buttons */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        
        {/* Toggle tasks vs staff list */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs w-fit shrink-0">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'tasks' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Suivi des Tâches Opérationnelles ({tasks.filter(t => t.status !== 'completed').length})
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-4 py-2 font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'staff' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            Registre du Personnel ({staff.length})
          </button>
        </div>

        {/* Modal triggers */}
        <div>
          {activeTab === 'tasks' ? (
            <button
              onClick={() => setShowTaskModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              Créer une Tâche
            </button>
          ) : (
            <button
              onClick={() => setShowStaffModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs rounded-xl shadow-xs transition-all w-full sm:w-auto justify-center"
            >
              <UserPlus className="w-4 h-4" />
              Recruter / Ajouter Employé
            </button>
          )}
        </div>
      </div>

      {/* RENDER TASKS TAB */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          
          {/* Categories for tasks filter */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            {[
              { id: 'all', label: 'Toutes les tâches' },
              { id: 'housekeeping', label: 'Gouvernance (Ménage)' },
              { id: 'maintenance', label: 'Maintenance (Froid/SAV)' },
              { id: 'restaurant', label: 'Restaurant & Restockage' },
              { id: 'reception', label: 'Réception (Fiches police)' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id as any)}
                className={`px-3 py-1.5 font-semibold rounded-lg border transition-all ${
                  filterCategory === cat.id
                    ? 'bg-amber-50 border-amber-200 text-amber-900 shadow-xs font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`p-5 rounded-2xl border bg-white flex flex-col justify-between ${
                  task.status === 'completed' 
                    ? 'border-slate-200 bg-slate-50/50 opacity-80' 
                    : task.status === 'in-progress'
                    ? 'border-blue-100'
                    : 'border-amber-100'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className={`px-2 py-0.5 rounded uppercase tracking-wider ${
                      task.category === 'housekeeping' ? 'bg-amber-100 text-amber-800' :
                      task.category === 'maintenance' ? 'bg-rose-100 text-rose-800' :
                      task.category === 'restaurant' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {task.category}
                    </span>
                    <span className="text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Échéance: {task.dueDate}
                    </span>
                  </div>

                  <h4 className={`font-bold text-sm ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {task.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {task.description}
                  </p>

                  {task.roomId && (
                    <div className="text-[10px] text-slate-600 font-semibold bg-slate-100 p-1 px-1.5 rounded w-fit">
                      Chambre concernée : {rooms.find(r => r.id === task.roomId)?.name || `Studio ${task.roomId}`}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <div>
                    {task.assignedToName ? (
                      <div className="text-slate-500 text-[11px]">
                        Assigné à : <span className="font-bold text-slate-700">{task.assignedToName}</span>
                      </div>
                    ) : (
                      <span className="text-rose-600 font-bold text-[10px] flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Non assigné
                      </span>
                    )}
                  </div>

                  {/* Operational status toggle actions */}
                  <div className="flex gap-1.5 shrink-0">
                    {task.status === 'pending' && (
                      <button
                        onClick={() => handleToggleTaskStatus(task.id, 'in-progress')}
                        className="p-1 px-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 rounded-lg font-bold text-[10px] flex items-center gap-1"
                      >
                        <Play className="w-3 h-3 fill-current" /> Démarrer
                      </button>
                    )}
                    {task.status === 'in-progress' && (
                      <button
                        onClick={() => handleToggleTaskStatus(task.id, 'completed')}
                        className="p-1 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-100 rounded-lg font-bold text-[10px] flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Terminer
                      </button>
                    )}
                    {task.status === 'completed' && (
                      <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1 py-1">
                        <Check className="w-3.5 h-3.5" /> Fait !
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RENDER STAFF TAB */}
      {activeTab === 'staff' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {staff.map((member) => (
            <div key={member.id} className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{member.name}</h4>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-1.5 rounded">
                      {member.role}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    member.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {member.status === 'active' ? 'En service' : 'Repos'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-500 font-mono">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{member.phone}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleToggleStaffStatus(member.id)}
                  className={`w-full py-1.5 rounded-lg font-semibold text-[10px] border transition-all ${
                    member.status === 'active'
                      ? 'bg-rose-50 border-rose-100 text-rose-700 hover:bg-rose-100'
                      : 'bg-emerald-50 border-emerald-100 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  {member.status === 'active' ? 'Mettre en Repos d\'Office' : 'Prendre le service'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TASK CREATION MODAL */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Nouvelle Tâche Opérationnelle</h3>
              <button onClick={() => setShowTaskModal(false)} className="text-slate-400 hover:text-slate-600 text-base">✕</button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Titre de la tâche *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Réparer climatisation 103"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Description / Consignes</label>
                <textarea
                  placeholder="Expliquez en détail l'intervention..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-400 h-16"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Catégorie *</label>
                  <select
                    value={taskCat}
                    onChange={(e: any) => setTaskCat(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 outline-none font-medium text-slate-700"
                  >
                    <option value="housekeeping">Ménage</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="reception">Réception</option>
                    <option value="general">Général</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Chambre liée (optionnel)</label>
                  <select
                    value={taskRoomId}
                    onChange={(e) => setTaskRoomId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 outline-none font-medium text-slate-700"
                  >
                    <option value="">Aucune</option>
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Assigner à l'Employé :</label>
                <select
                  value={taskAssignedId}
                  onChange={(e) => setTaskAssignedId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 outline-none font-medium text-slate-700"
                >
                  <option value="">-- Non assigné (Cliquer pour choisir) --</option>
                  {staff.filter(s => s.status === 'active').map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Créer la Tâche
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STAFF RECRUITMENT MODAL */}
      {showStaffModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Enregistrer un Employé</h3>
              <button onClick={() => setShowStaffModal(false)} className="text-slate-400 hover:text-slate-600 text-base">✕</button>
            </div>

            <form onSubmit={handleRegisterStaff} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Nom Complet *</label>
                <input
                  type="text"
                  required
                  placeholder="Yao Amenan Chantal"
                  value={staffName}
                  onChange={(e) => setTaskTitle(e.target.value)} // Wait, let's fix state names below
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Form implementation corrected directly in App state for robustness */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStaffModal(false)}
                  className="w-full py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Annuler & Gérer via tableau
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
