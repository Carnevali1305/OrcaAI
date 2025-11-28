import React, { useState } from 'react';
import { LayoutDashboard, FolderKanban, FileText, Settings, LogOut, Menu, BrainCircuit, Users, BookOpen, TrendingUp, BarChart, X, Plus } from 'lucide-react';
import LandingPage from './components/LandingPage';
import AuthFlow from './components/AuthFlow';
import Dashboard from './components/Dashboard';
import BudgetManager from './components/BudgetManager';
import ReferenceTables from './components/ReferenceTables';
import RealizedCostManager from './components/RealizedCostManager';
import AIConsultantPage from './components/AIConsultantPage';
import { Project, User, PlanTier, ViewState, Budget, Client, ReferenceTable, RealizedCost } from './types';

// --- MOCK DATA INITIALIZATION ---
const INITIAL_PROJECTS: Project[] = [
  { id: 'p1', name: 'Residencial Alpha', client: 'João Silva', address: 'Rua das Flores, 123', status: 'active', totalBudget: 450000, startDate: '2023-10-01', completionPercentage: 35 },
  { id: 'p2', name: 'Reforma Comercial Centro', client: 'Tech Solutions', address: 'Av. Paulista, 1000', status: 'planning', totalBudget: 120000, startDate: '2024-02-15', completionPercentage: 0 },
];

const INITIAL_BUDGETS: Budget[] = [
  { 
    id: 'b1', projectId: 'p1', version: 1, bdi: 25, totalWithBdi: 0, createdAt: new Date().toISOString(), status: 'draft',
    items: [
      { id: '1', code: 'SINAPI-001', description: 'ALVENARIA DE VEDAÇÃO DE BLOCOS CERÂMICOS', unit: 'm²', quantity: 150, unitPrice: 85.50, totalPrice: 12825, category: 'PAREDES', source: 'SINAPI' },
      { id: '2', code: 'SINAPI-002', description: 'CONTRAPISO EM ARGAMASSA TRAÇO 1:4', unit: 'm²', quantity: 145, unitPrice: 42.20, totalPrice: 6119, category: 'PISOS', source: 'SINAPI' },
    ]
  },
  {
    id: 'b2', projectId: 'p2', version: 1, bdi: 20, totalWithBdi: 0, createdAt: new Date().toISOString(), status: 'draft',
    items: []
  }
];

const App: React.FC = () => {
  // --- GLOBAL STATE ---
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('landing');
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Data Store
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [clients, setClients] = useState<Client[]>([
    { id: 'c1', name: 'João Silva', email: 'joao@gmail.com', phone: '11999999999', company: 'Pessoa Física' },
    { id: 'c2', name: 'Tech Solutions', email: 'contato@tech.com', phone: '1133334444', company: 'Tech Soluções Ltda' }
  ]);
  const [tables, setTables] = useState<ReferenceTable[]>([
    { id: 't1', name: 'SINAPI 02/2024', type: 'SINAPI', region: 'São Paulo', date: '2024-02-01' }
  ]);
  const [realizedCosts, setRealizedCosts] = useState<RealizedCost[]>([]);
  
  // Selection State
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>('p1');

  // Modal State
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState({
    name: '',
    client: '',
    address: '',
    startDate: new Date().toISOString().split('T')[0]
  });

  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [newClientForm, setNewClientForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });

  // --- ACTIONS ---
  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView('dashboard');
  };

  const handleUpdateBudget = (updatedBudget: Budget) => {
    setBudgets(budgets.map(b => b.id === updatedBudget.id ? updatedBudget : b));
  };

  const handleCreateRevision = (baseBudget: Budget) => {
    const newVersion = baseBudget.version + 1;
    const newBudget: Budget = {
      ...baseBudget,
      id: `b-${Date.now()}`,
      version: newVersion,
      createdAt: new Date().toISOString()
    };
    setBudgets([...budgets, newBudget]);
    alert(`Revisão ${newVersion} criada com sucesso!`);
  };

  const openNewProjectModal = () => {
    setNewProjectForm({
      name: '',
      client: '',
      address: '',
      startDate: new Date().toISOString().split('T')[0]
    });
    setIsNewProjectModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectForm.name) return;

    const newProject: Project = {
      id: `p-${Date.now()}`,
      name: newProjectForm.name,
      client: newProjectForm.client || 'Cliente Padrão',
      address: newProjectForm.address || 'Endereço não informado',
      status: 'planning',
      totalBudget: 0,
      startDate: newProjectForm.startDate,
      completionPercentage: 0
    };
    
    const newBudget: Budget = {
      id: `b-${Date.now()}`,
      projectId: newProject.id,
      version: 1,
      bdi: 20,
      items: [],
      totalWithBdi: 0,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };

    setProjects([...projects, newProject]);
    setBudgets([...budgets, newBudget]);
    setSelectedProjectId(newProject.id);
    setIsNewProjectModalOpen(false);
    setView('budget-editor');
  };

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient: Client = {
      id: `c-${Date.now()}`,
      name: newClientForm.name,
      email: newClientForm.email,
      phone: newClientForm.phone,
      company: newClientForm.company
    };
    setClients([...clients, newClient]);
    setIsNewClientModalOpen(false);
    setNewClientForm({ name: '', email: '', phone: '', company: '' });
  };

  // --- RENDERERS ---

  if (view === 'landing') {
    return <LandingPage onLogin={() => setView('auth')} />;
  }

  if (view === 'auth') {
    return <AuthFlow onComplete={handleLoginSuccess} onCancel={() => setView('landing')} />;
  }

  // Authenticated Layout
  const navItems = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'projects', label: 'Minhas Obras', icon: FolderKanban },
    { id: 'budget-editor', label: 'Orçamentos', icon: FileText },
    { id: 'realized', label: 'Orçado x Realizado', icon: TrendingUp },
    { id: 'tables', label: 'Tabelas Referência', icon: BookOpen },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'reports', label: 'Relatórios', icon: BarChart },
    { id: 'ai-consultant', label: 'Consultor IA', icon: BrainCircuit },
  ];

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard projects={projects} />;
      case 'tables':
        return <ReferenceTables tables={tables} onImport={(t) => setTables([...tables, t])} />;
      case 'realized':
        const budgetForRealized = budgets.find(b => b.projectId === selectedProjectId);
        return (
           <RealizedCostManager 
              budget={budgetForRealized} 
              costs={realizedCosts.filter(c => c.projectId === selectedProjectId)}
              onAddCost={(c) => setRealizedCosts([...realizedCosts, c])}
              onDeleteCost={(id) => setRealizedCosts(realizedCosts.filter(c => c.id !== id))}
           />
        );
      case 'budget-editor':
        const activeProject = projects.find(p => p.id === selectedProjectId);
        if (!activeProject) return <div className="p-6">Selecione uma obra na aba "Minhas Obras" primeiro.</div>;
        return (
          <BudgetManager 
            project={activeProject}
            budgets={budgets}
            onUpdateBudget={handleUpdateBudget}
            onCreateRevision={handleCreateRevision}
          />
        );
      case 'projects':
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
               <h1 className="text-2xl font-bold text-slate-900">Minhas Obras</h1>
               <button onClick={openNewProjectModal} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center gap-2">
                 <Plus className="w-4 h-4" /> Nova Obra
               </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => { setSelectedProjectId(p.id); setView('budget-editor'); }}
                  className={`bg-white p-6 rounded-xl border cursor-pointer hover:shadow-md transition ${selectedProjectId === p.id ? 'border-primary-500 ring-1 ring-primary-500' : 'border-slate-200'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900">{p.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                      {p.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">{p.address}</p>
                  <div className="flex justify-between text-xs text-slate-500 mt-4">
                    <span>Cliente: {p.client}</span>
                    <span>{new Date(p.startDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'clients':
         return (
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-slate-900">Gestão de Clientes</h1>
                  <button 
                    onClick={() => setIsNewClientModalOpen(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Novo Cliente
                  </button>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50"><tr><th className="p-4">Nome</th><th className="p-4">Empresa</th><th className="p-4">Email</th></tr></thead>
                        <tbody>
                            {clients.map(c => (
                                <tr key={c.id} className="border-t border-slate-100"><td className="p-4 font-medium">{c.name}</td><td className="p-4">{c.company}</td><td className="p-4 text-slate-500">{c.email}</td></tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
         );
      case 'ai-consultant':
        return <AIConsultantPage />;
      default:
        return <div className="p-6 flex items-center justify-center h-full text-slate-400">Módulo em construção 🚧</div>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col z-20 shadow-xl`}
      >
        <div className="h-16 flex items-center justify-center border-b border-slate-800">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">O</div>
              OrçaAI
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-lg flex items-center justify-center font-bold">O</div>
          )}
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${view === item.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <item.icon className={`w-5 h-5 min-w-[20px] transition-transform group-hover:scale-110 ${view === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
              {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center'}`}>
            <img src={user?.avatarUrl} alt="User" className="w-10 h-10 rounded-full border-2 border-slate-700" />
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate text-white">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.company}</p>
              </div>
            )}
          </div>
          {isSidebarOpen && (
             <button onClick={() => setView('landing')} className="mt-4 flex items-center gap-2 text-xs text-slate-500 hover:text-red-400 transition w-full px-1">
                <LogOut className="w-3 h-3" /> Sair da conta
             </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-slate-500 hover:text-primary-600 transition">
                <Menu className="w-6 h-6" />
            </button>
            {selectedProjectId && view !== 'projects' && (
                <div className="hidden md:flex items-center text-sm text-slate-500 border-l border-slate-200 pl-4 ml-2">
                    <span className="mr-2">Obra Atual:</span>
                    <span className="font-semibold text-slate-800">{projects.find(p => p.id === selectedProjectId)?.name}</span>
                </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="text-xs font-semibold text-amber-700">Plano {user?.plan}</span>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-slate-50 scroll-smooth">
          {renderContent()}
        </main>
      </div>

      {/* Create Project Modal */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-900">Nova Obra</h3>
              <button onClick={() => setIsNewProjectModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveProject} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Obra</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ex: Residencial Flores"
                  value={newProjectForm.name}
                  onChange={e => setNewProjectForm({...newProjectForm, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cliente</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Nome do cliente"
                  value={newProjectForm.client}
                  onChange={e => setNewProjectForm({...newProjectForm, client: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Endereço</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Local da obra"
                  value={newProjectForm.address}
                  onChange={e => setNewProjectForm({...newProjectForm, address: e.target.value})}
                />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Data de Início</label>
                 <input 
                    type="date"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={newProjectForm.startDate}
                    onChange={e => setNewProjectForm({...newProjectForm, startDate: e.target.value})}
                 />
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsNewProjectModalOpen(false)} className="flex-1 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">Cancelar</button>
                <button type="submit" className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">Criar Obra</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Client Modal */}
      {isNewClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-900">Novo Cliente</h3>
              <button onClick={() => setIsNewClientModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveClient} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={newClientForm.name}
                  onChange={e => setNewClientForm({...newClientForm, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Empresa</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={newClientForm.company}
                  onChange={e => setNewClientForm({...newClientForm, company: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={newClientForm.email}
                  onChange={e => setNewClientForm({...newClientForm, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={newClientForm.phone}
                  onChange={e => setNewClientForm({...newClientForm, phone: e.target.value})}
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsNewClientModalOpen(false)} className="flex-1 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">Cancelar</button>
                <button type="submit" className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">Salvar Cliente</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;