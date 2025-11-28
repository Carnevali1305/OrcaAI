import React, { useState, useEffect } from 'react';
import { Plus, Download, Search, FileSpreadsheet, Trash2, Edit2, Sparkles, Copy, ChevronDown, Check } from 'lucide-react';
import { Budget, BudgetItem, Project } from '../types';
import AIModal from './AIModal';

interface BudgetManagerProps {
  project: Project;
  budgets: Budget[];
  onUpdateBudget: (budget: Budget) => void;
  onCreateRevision: (baseBudget: Budget) => void;
}

// Mock Database of Reference Items
const REFERENCE_DB: BudgetItem[] = [
  { id: 'db1', code: 'SINAPI-92145', description: 'ARMADURA DE PILAR OU VIGA DE UMA ESTRUTURA CONVENCIONAL DE CONCRETO ARMADO', unit: 'KG', quantity: 1, unitPrice: 14.50, totalPrice: 14.50, category: 'ESTRUTURA', source: 'SINAPI' },
  { id: 'db2', code: 'SINAPI-87301', description: 'ARGAMASSA TRAÇO 1:3 (EM VOLUME DE CIMENTO E AREIA MÉDIA ÚMIDA)', unit: 'm³', quantity: 1, unitPrice: 650.00, totalPrice: 650.00, category: 'ALVENARIA', source: 'SINAPI' },
  { id: 'db3', code: 'TCPO-14.202', description: 'PORTA DE MADEIRA PARA PINTURA, SEMI-OCA (LEVE OU MÉDIA)', unit: 'UN', quantity: 1, unitPrice: 350.00, totalPrice: 350.00, category: 'ESQUADRIAS', source: 'TCPO' },
  { id: 'db4', code: 'SINAPI-101908', description: 'PISO CERÂMICO ESMALTADO PEI-4', unit: 'm²', quantity: 1, unitPrice: 45.90, totalPrice: 45.90, category: 'PISOS', source: 'SINAPI' },
];

const BudgetManager: React.FC<BudgetManagerProps> = ({ project, budgets, onUpdateBudget, onCreateRevision }) => {
  // Find the active budget (highest version) if not provided via some state
  const activeBudget = budgets.find(b => b.projectId === project.id) || budgets[0]; // Fallback
  
  const [items, setItems] = useState<BudgetItem[]>(activeBudget ? activeBudget.items : []);
  const [isAIModalOpen, setAIModalOpen] = useState(false);
  const [isAddItemModalOpen, setAddItemModalOpen] = useState(false);
  const [bdi, setBdi] = useState(activeBudget ? activeBudget.bdi : 25.0);
  const [searchTerm, setSearchTerm] = useState('');

  // Sync state when prop changes (e.g., switching versions)
  useEffect(() => {
    if (activeBudget) {
      setItems(activeBudget.items);
      setBdi(activeBudget.bdi);
    }
  }, [activeBudget]);

  const totalDirect = items.reduce((acc, item) => acc + item.totalPrice, 0);
  const totalWithBDI = totalDirect * (1 + bdi / 100);

  const handleDelete = (id: string) => {
    const newItems = items.filter(i => i.id !== id);
    setItems(newItems);
    if(activeBudget) onUpdateBudget({ ...activeBudget, items: newItems });
  };

  const handleAddItem = (item: BudgetItem) => {
    const newItem = { ...item, id: `item-${Date.now()}`, quantity: 1, totalPrice: item.unitPrice };
    const newItems = [...items, newItem];
    setItems(newItems);
    if(activeBudget) onUpdateBudget({ ...activeBudget, items: newItems });
    setAddItemModalOpen(false);
  };

  const handleUpdateItemQuantity = (id: string, qty: number) => {
    const newItems = items.map(i => {
      if (i.id === id) {
        return { ...i, quantity: qty, totalPrice: qty * i.unitPrice };
      }
      return i;
    });
    setItems(newItems);
    if(activeBudget) onUpdateBudget({ ...activeBudget, items: newItems });
  };

  const handleBdiChange = (val: number) => {
    setBdi(val);
    if(activeBudget) onUpdateBudget({ ...activeBudget, bdi: val });
  };

  const generateContext = () => {
    return `Projeto: ${project.name}. Orçamento Total: R$ ${totalDirect.toFixed(2)}. 
    Itens: ${items.map(i => i.description).join(', ')}.`;
  };

  // Filter items for the "Add Item" modal
  const searchResults = REFERENCE_DB.filter(i => i.description.toLowerCase().includes(searchTerm.toLowerCase()) || i.code.toLowerCase().includes(searchTerm.toLowerCase()));

  if (!activeBudget) {
    return <div className="p-6">Nenhum orçamento encontrado para este projeto.</div>;
  }

  return (
    <div className="p-6 h-full flex flex-col relative">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
          <div className="flex items-center gap-2 mt-1">
             <div className="relative group">
               <button className="flex items-center gap-1 text-sm bg-slate-100 px-2 py-1 rounded text-slate-700 hover:bg-slate-200">
                  Versão {activeBudget.version}.0 <ChevronDown className="w-3 h-3" />
               </button>
               {/* Dropdown Revisions Simulation */}
               <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 shadow-lg rounded-lg hidden group-hover:block z-20">
                  {budgets.filter(b => b.projectId === project.id).map(b => (
                    <div key={b.id} className="px-4 py-2 hover:bg-slate-50 text-sm cursor-pointer flex justify-between">
                       <span>Versão {b.version}.0</span>
                       {b.id === activeBudget.id && <Check className="w-4 h-4 text-green-500" />}
                    </div>
                  ))}
               </div>
             </div>
             <span className="text-sm text-slate-400">•</span>
             <span className="text-sm text-slate-500">Última edição: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button 
             onClick={() => onCreateRevision(activeBudget)}
             className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition text-sm"
           >
            <Copy className="w-4 h-4" /> Nova Revisão
          </button>
           <button 
             onClick={() => setAIModalOpen(true)}
             className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm shadow-md shadow-indigo-200"
           >
            <Sparkles className="w-4 h-4" /> Consultar IA
          </button>
          <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition text-sm">
            <Download className="w-4 h-4" /> PDF
          </button>
          <button 
             onClick={() => setAddItemModalOpen(true)}
             className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition text-sm shadow-md shadow-primary-200"
           >
            <Plus className="w-4 h-4" /> Adicionar Item
          </button>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-sm text-slate-500">Custo Direto</span>
          <p className="text-2xl font-bold text-slate-800">R$ {totalDirect.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-1">
             <span className="text-sm text-slate-500">BDI (%)</span>
             <input 
                type="number" 
                value={bdi} 
                onChange={(e) => handleBdiChange(Number(e.target.value))} 
                className="w-20 text-right text-sm border border-slate-300 rounded px-2 py-1 outline-none focus:border-primary-500"
             />
          </div>
          <p className="text-xl font-bold text-slate-800 text-right">R$ {(totalDirect * (bdi/100)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
          <span className="text-sm text-emerald-700">Preço de Venda (Total)</span>
          <p className="text-2xl font-bold text-emerald-800">R$ {totalWithBDI.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-4">
           <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Itens do Orçamento</span>
        </div>
        
        <div className="overflow-auto flex-1">
            <table className="w-full text-left border-collapse">
            <thead className="bg-white sticky top-0 z-10 border-b border-slate-100">
                <tr>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">Código</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Descrição</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">Fonte</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-24">Quant.</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-32">Unit. (R$)</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-32">Total (R$)</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center w-20"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
                {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition group">
                    <td className="p-4 text-xs text-slate-500 font-mono">{item.code}</td>
                    <td className="p-4 text-sm text-slate-900 font-medium">
                        {item.description}
                        <div className="text-xs text-slate-400 mt-1">{item.category}</div>
                    </td>
                    <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.source === 'SINAPI' ? 'bg-blue-100 text-blue-700' : item.source === 'TCPO' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                            {item.source}
                        </span>
                    </td>
                    <td className="p-4 text-right">
                        <input 
                           type="number" 
                           className="w-16 text-right border border-transparent hover:border-slate-300 focus:border-primary-500 rounded px-1 text-sm bg-transparent"
                           value={item.quantity}
                           onChange={(e) => handleUpdateItemQuantity(item.id, Number(e.target.value))}
                        />
                        <span className="text-xs text-slate-400 ml-1">{item.unit}</span>
                    </td>
                    <td className="p-4 text-sm text-slate-700 text-right">{item.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="p-4 text-sm text-slate-900 font-bold text-right">{item.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="p-4 text-center">
                        <button onClick={() => handleDelete(item.id)} className="text-slate-300 hover:text-red-600 transition opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                    </td>
                </tr>
                ))}
                {items.length === 0 && (
                   <tr>
                      <td colSpan={7} className="p-12 text-center text-slate-400">
                         Nenhum item adicionado. Clique em "Adicionar Item" ou use a IA.
                      </td>
                   </tr>
                )}
            </tbody>
            </table>
        </div>
      </div>

      <AIModal 
        isOpen={isAIModalOpen} 
        onClose={() => setAIModalOpen(false)} 
        contextData={generateContext()}
      />

      {/* Add Item Modal */}
      {isAddItemModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white w-full max-w-2xl h-[600px] rounded-2xl shadow-xl flex flex-col">
                  <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                      <h2 className="font-bold text-lg">Adicionar Composição</h2>
                      <button onClick={() => setAddItemModalOpen(false)}><span className="sr-only">Fechar</span>x</button>
                  </div>
                  <div className="p-4 border-b border-slate-200">
                      <div className="relative">
                          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                          <input 
                            type="text" 
                            placeholder="Buscar no SINAPI, TCPO..." 
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                          />
                      </div>
                  </div>
                  <div className="flex-1 overflow-auto p-2">
                      {searchResults.length === 0 ? (
                          <div className="text-center p-8 text-slate-400">Nenhum item encontrado. Tente "argamassa" ou "porta".</div>
                      ) : (
                        searchResults.map(item => (
                            <div key={item.id} className="p-3 hover:bg-slate-50 rounded-lg cursor-pointer flex justify-between items-center border-b border-slate-50 last:border-0" onClick={() => handleAddItem(item)}>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-500">{item.code}</span>
                                        <span className={`text-[10px] px-1.5 rounded ${item.source === 'SINAPI' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>{item.source}</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-800 line-clamp-1">{item.description}</p>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-slate-900">R$ {item.unitPrice.toFixed(2)}</span>
                                    <span className="text-xs text-slate-500">/ {item.unit}</span>
                                </div>
                            </div>
                        ))
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default BudgetManager;
