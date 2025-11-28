import React, { useState } from 'react';
import { Check, CreditCard, ArrowRight, ArrowLeft } from 'lucide-react';
import { PlanTier, User } from '../types';

interface AuthFlowProps {
  onComplete: (user: User) => void;
  onCancel: () => void;
}

type Step = 'login' | 'register' | 'plans' | 'checkout';

const AuthFlow: React.FC<AuthFlowProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<Step>('login');
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>(PlanTier.INTERMEDIATE);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    password: ''
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('plans');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    onComplete({
      id: 'u1',
      name: 'Engenheiro Demo',
      email: formData.email || 'demo@orcaai.com',
      company: 'Construtora Exemplo',
      plan: PlanTier.ADVANCED,
      avatarUrl: 'https://ui-avatars.com/api/?name=Engenheiro+Demo&background=0D8ABC&color=fff'
    });
  };

  const handlePlanSelect = (plan: PlanTier) => {
    setSelectedPlan(plan);
    setStep('checkout');
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call and success
    setTimeout(() => {
      onComplete({
        id: `u-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        company: formData.company,
        plan: selectedPlan,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=0D8ABC&color=fff`
      });
    }, 1500);
  };

  const plans = [
    {
      id: PlanTier.BASIC,
      price: '39',
      features: ['3 obras ativas', 'Importar Excel Próprio', 'IA Modo Básico']
    },
    {
      id: PlanTier.INTERMEDIATE,
      price: '89',
      features: ['10 obras ativas', 'SINAPI e TCPO', 'Orçado x Realizado', 'IA Guiada']
    },
    {
      id: PlanTier.ADVANCED,
      price: '179',
      features: ['Obras Ilimitadas', 'QTO Automático (IA)', 'Multiusuário', 'Consultor Técnico']
    }
  ];

  if (step === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Entrar no OrçaAI</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
              <input type="email" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="seu@email.com" onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
              <input type="password" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition">Entrar</button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-slate-600">Não tem conta? <button onClick={() => setStep('register')} className="text-primary-600 font-semibold hover:underline">Criar conta grátis</button></p>
            <button onClick={onCancel} className="mt-4 text-sm text-slate-400 hover:text-slate-600">Voltar para Home</button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'register') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Crie sua conta</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
              <input type="text" required className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Construtora/Empresa</label>
              <input type="text" required className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
              <input type="email" required className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
              <input type="password" required className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
            <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition">Continuar para Planos</button>
          </form>
          <div className="mt-4 text-center">
            <button onClick={() => setStep('login')} className="text-sm text-slate-500 hover:text-primary-600">Já tenho conta</button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'plans') {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <button onClick={() => setStep('register')} className="flex items-center text-slate-500 mb-8 hover:text-slate-800"><ArrowLeft className="w-4 h-4 mr-2" /> Voltar</button>
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Escolha o plano ideal</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div key={plan.id} className={`bg-white p-8 rounded-2xl border ${selectedPlan === plan.id ? 'border-primary-500 ring-2 ring-primary-200' : 'border-slate-200'} shadow-sm cursor-pointer hover:shadow-md transition relative`} onClick={() => handlePlanSelect(plan.id as PlanTier)}>
                 {plan.id === PlanTier.INTERMEDIATE && <div className="absolute top-0 right-0 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">RECOMENDADO</div>}
                <h3 className="text-lg font-semibold text-slate-900">{plan.id}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold text-slate-900">R$ {plan.price}</span>
                  <span className="text-slate-500">/mês</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-slate-600 text-sm">
                      <Check className="w-4 h-4 text-green-500" /> {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-lg font-medium transition ${selectedPlan === plan.id ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  Selecionar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'checkout') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-2xl p-8 rounded-2xl shadow-xl flex flex-col md:flex-row gap-8">
          <div className="flex-1">
             <h2 className="text-2xl font-bold text-slate-900 mb-6">Pagamento Seguro</h2>
             <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
               <h3 className="font-semibold text-slate-800">Resumo do Pedido</h3>
               <p className="text-slate-600 text-sm mt-1">Plano {selectedPlan}</p>
               <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200">
                 <span className="font-bold text-slate-900">Total</span>
                 <span className="font-bold text-xl text-primary-600">R$ {plans.find(p => p.id === selectedPlan)?.price},00</span>
               </div>
             </div>
             <form onSubmit={handleCheckout} className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Nome no Cartão</label>
                 <input type="text" required className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none" placeholder="COMO NO CARTAO" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Número do Cartão</label>
                 <div className="relative">
                   <CreditCard className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                   <input type="text" required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none" placeholder="0000 0000 0000 0000" />
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Validade</label>
                   <input type="text" required className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none" placeholder="MM/AA" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">CVV</label>
                   <input type="text" required className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none" placeholder="123" />
                 </div>
               </div>
               <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2">
                 <Check className="w-5 h-5" /> Finalizar Assinatura
               </button>
             </form>
          </div>
          <div className="w-full md:w-1/3 bg-slate-50 p-6 rounded-xl border border-slate-200 text-sm text-slate-600">
            <h4 className="font-bold text-slate-900 mb-4">Garantia OrçaAI</h4>
            <p className="mb-4">Teste por 7 dias grátis. Você não será cobrado até o fim do período de teste.</p>
            <p>Cancelamento a qualquer momento direto no painel.</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthFlow;
