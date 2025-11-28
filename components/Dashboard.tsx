import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { DollarSign, Briefcase, AlertTriangle, TrendingUp } from 'lucide-react';
import { Project } from '../types';

interface DashboardProps {
  projects: Project[];
}

const data = [
  { name: 'Jan', orcado: 4000, realizado: 2400 },
  { name: 'Fev', orcado: 3000, realizado: 1398 },
  { name: 'Mar', orcado: 2000, realizado: 9800 },
  { name: 'Abr', orcado: 2780, realizado: 3908 },
  { name: 'Mai', orcado: 1890, realizado: 4800 },
  { name: 'Jun', orcado: 2390, realizado: 3800 },
];

const dataCost = [
  { name: 'Fundação', value: 12000 },
  { name: 'Estrutura', value: 25000 },
  { name: 'Alvenaria', value: 18000 },
  { name: 'Instalações', value: 22000 },
  { name: 'Acabamento', value: 30000 },
];

const StatCard = ({ title, value, sub, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
    <span className="text-xs text-slate-400">{sub}</span>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ projects }) => {
  return (
    <div className="p-6 space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Visão Geral</h1>
        <p className="text-slate-500">Bem-vindo de volta, Engenheiro.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total em Obras" 
          value="R$ 1.2M" 
          sub="+12% vs mês anterior" 
          icon={DollarSign} 
          color="bg-primary-500" 
        />
        <StatCard 
          title="Obras Ativas" 
          value={projects.filter(p => p.status === 'active').length} 
          sub="3 em planejamento" 
          icon={Briefcase} 
          color="bg-indigo-500" 
        />
        <StatCard 
          title="Desvio de Custo" 
          value="+4.2%" 
          sub="Acima do orçado" 
          icon={AlertTriangle} 
          color="bg-amber-500" 
        />
        <StatCard 
          title="Eficiência" 
          value="92%" 
          sub="Produtividade média" 
          icon={TrendingUp} 
          color="bg-emerald-500" 
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-80">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Orçado vs Realizado (Semestral)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorOrcado" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRealizado" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Area type="monotone" dataKey="orcado" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorOrcado)" />
              <Area type="monotone" dataKey="realizado" stroke="#f59e0b" fillOpacity={1} fill="url(#colorRealizado)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-80">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Curva ABC (Por Etapa)</h3>
           <ResponsiveContainer width="100%" height="80%">
            <BarChart
              data={dataCost}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Legend />
              <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;