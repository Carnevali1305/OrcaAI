import React, { useState } from 'react';
import { Plus, Trash2, TrendingUp, AlertTriangle } from 'lucide-react';
import { RealizedCost, Budget } from '../types';

interface RealizedCostManagerProps {
  budget: Budget | undefined;
  costs: RealizedCost[];
  onAddCost: (cost: RealizedCost) => void;
  onDeleteCost: (id: string) => void;
}

const RealizedCostManager: React.FC<RealizedCostManagerProps> = ({ budget, costs, onAddCost, onDeleteCost }) => {
  const [newCost, setNewCost] = useState({ description: '', amount: '', category: 'Material' });

  const totalRealized = costs.reduce((sum, cost) => sum + cost.amount, 0);
  const totalBudgeted = budget ? budget.totalWithBdi : 0;
  const variance = totalBudgeted > 0 ? ((totalRealized - totalBudgeted) / totalBudgeted) * 100 : 0;

  const handleAdd = () => {
    if (!newCost.description || !newCost.amount || !budget) return;
    onAddCost({
      id: `c-${Date.now()}`,
      projectId: budget.projectId,
      description: newCost.description,
      amount: parseFloat(newCost.amount),
      date: new Date().toISOString().split('T')[0],
      category: newCost.category
    });
    setNewCost({ description: '', amount: '', category: 'Material' });
  };

  if (!budget) return <div className="p-6 text-center text-slate-500">Selecione um projeto com orçamento primeiro.</div>;

  return (
    <div className="p-6">
      <header className="mb-6 flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Orçado x Realizado</h1>
           <p className="text-slate-500">Controle financeiro da obra.</p>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">Total Orçado</p>
          <h3 className="text-2xl font-bold text-slate-900">R$ {totalBudgeted.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">Total Realizado</p>
          <h3 className={`text-2xl font-bold ${totalRealized > totalBudgeted ? 'text-red-600' : 'text-slate-900'}`}>
            R$ {totalRealized.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>
        <div className={`p-6 rounded-xl border shadow-sm ${variance > 0 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-sm font-medium ${variance > 0 ? 'text-red-700' : 'text-emerald-700'}`}>Desvio Acumulado</span>
            {variance > 0 ? <AlertTriangle className="w-4 h-4 text-red-600" /> : <TrendingUp className="w-4 h-4 text-emerald-600" />}
          </div>
          <h3 className={`text-2xl font-bold ${variance > 0 ? 'text-red-800' : 'text-emerald-800'}`}>
            {variance > 0 ? '+' : ''}{variance.toFixed(2)}%
          </h3>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <h3 className="font-bold text-slate-900 mb-4">Lançar Novo Custo</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" 
                placeholder="Ex: Cimento 50kg"
                value={newCost.description}
                onChange={e => setNewCost({...newCost, description: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Valor (R$)</label>
              <input 
                type="number" 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" 
                placeholder="0.00"
                value={newCost.amount}
                onChange={e => setNewCost({...newCost, amount: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
              <select 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                value={newCost.category}
                onChange={e => setNewCost({...newCost, category: e.target.value})}
              >
                <option>Material</option>
                <option>Mão de Obra</option>
                <option>Equipamento</option>
                <option>Serviço Terceiro</option>
                <option>Administrativo</option>
              </select>
            </div>
            <button onClick={handleAdd} className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition">
              <Plus className="w-4 h-4" /> Adicionar Custo
            </button>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
           <table className="w-full text-left">
             <thead className="bg-slate-50">
               <tr>
                 <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Data</th>
                 <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Descrição</th>
                 <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Categoria</th>
                 <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Valor</th>
                 <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-center">Ações</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {costs.map((cost) => (
                 <tr key={cost.id} className="hover:bg-slate-50">
                   <td className="p-4 text-sm text-slate-600">{new Date(cost.date).toLocaleDateString()}</td>
                   <td className="p-4 text-sm font-medium text-slate-900">{cost.description}</td>
                   <td className="p-4 text-sm text-slate-600"><span className="px-2 py-1 bg-slate-100 rounded text-xs">{cost.category}</span></td>
                   <td className="p-4 text-sm font-bold text-slate-900 text-right">R$ {cost.amount.toFixed(2)}</td>
                   <td className="p-4 text-center">
                     <button onClick={() => onDeleteCost(cost.id)} className="text-slate-400 hover:text-red-500">
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </td>
                 </tr>
               ))}
               {costs.length === 0 && (
                 <tr>
                   <td colSpan={5} className="p-8 text-center text-slate-400">Nenhum custo lançado ainda.</td>
                 </tr>
               )}
             </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default RealizedCostManager;
