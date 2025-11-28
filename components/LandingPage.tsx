import React from 'react';
import { Check, ArrowRight, BarChart3, Brain, FileText, Layers } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
              O
            </div>
            <span className="text-xl font-bold text-slate-900">OrçaAI</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-primary-600">Funcionalidades</a>
            <a href="#pricing" className="hover:text-primary-600">Planos</a>
            <a href="#testimonials" className="hover:text-primary-600">Depoimentos</a>
          </div>
          <div className="flex gap-4">
            <button onClick={onLogin} className="text-sm font-medium text-slate-600 hover:text-primary-600">
              Entrar
            </button>
            <button onClick={onLogin} className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition">
              Começar Grátis
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold mb-8 border border-primary-100">
          <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse"></span>
          Nova IA Gemini 2.5 Integrada
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Orçamentos de obras <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">
            10x mais rápidos com IA
          </span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          Integração com SINAPI e TCPO, levantamento de quantitativos automático e relatórios profissionais em minutos. O SaaS definitivo para engenheiros e construtoras.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button onClick={onLogin} className="flex items-center justify-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 transition shadow-lg shadow-primary-600/20">
            Testar Grátis por 7 Dias <ArrowRight className="w-5 h-5" />
          </button>
          <button className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-slate-50 transition">
            Ver Demonstração
          </button>
        </div>
        
        {/* Mock UI Image */}
        <div className="mt-16 rounded-2xl border border-slate-200 shadow-2xl overflow-hidden bg-slate-50 relative group">
           {/* Construction themed image */}
           <img 
             src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop" 
             alt="OrçaAI Dashboard Context" 
             className="w-full h-auto opacity-90 object-cover" 
           />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none"></div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Tudo o que você precisa para orçar</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Do levantamento de quantitativos à entrega da proposta comercial.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-8 h-8 text-indigo-600" />,
                title: "IA Especialista",
                desc: "Sugestão automática de composições e análise de inconsistências no orçamento."
              },
              {
                icon: <Layers className="w-8 h-8 text-primary-600" />,
                title: "SINAPI & TCPO",
                desc: "Bases oficiais atualizadas mensalmente. Importe também suas próprias tabelas Excel."
              },
              {
                icon: <BarChart3 className="w-8 h-8 text-emerald-600" />,
                title: "Orçado x Realizado",
                desc: "Controle financeiro da obra em tempo real com Curva ABC e Dashboards."
              },
              {
                icon: <FileText className="w-8 h-8 text-orange-600" />,
                title: "Relatórios Profissionais",
                desc: "Exporte em PDF e Excel com sua marca. Propostas comerciais prontas para enviar."
              },
              {
                icon: <Check className="w-8 h-8 text-cyan-600" />,
                title: "QTO Assistido",
                desc: "A IA ajuda a ler plantas baixas e extrair listas de materiais preliminares."
              },
              {
                icon: <Check className="w-8 h-8 text-pink-600" />,
                title: "BDI Personalizado",
                desc: "Configure encargos, lucros e despesas indiretas por obra ou globalmente."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <div className="mb-4 bg-slate-50 w-14 h-14 rounded-lg flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Planos que cabem no seu orçamento</h2>
            <p className="text-slate-600">Escolha o plano ideal para o tamanho da sua construtora.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Básico</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold text-slate-900">R$ 39</span>
                <span className="text-slate-500">/mês</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2 text-slate-600 text-sm">
                  <Check className="w-4 h-4 text-green-500" /> 3 obras ativas
                </li>
                <li className="flex items-center gap-2 text-slate-600 text-sm">
                  <Check className="w-4 h-4 text-green-500" /> Importar Excel Próprio
                </li>
                <li className="flex items-center gap-2 text-slate-600 text-sm">
                  <Check className="w-4 h-4 text-green-500" /> IA Modo Básico
                </li>
              </ul>
              <button onClick={onLogin} className="w-full py-3 px-4 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition">
                Começar Básico
              </button>
            </div>

            {/* Intermediate */}
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-900 shadow-xl relative transform scale-105">
              <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                POPULAR
              </div>
              <h3 className="text-lg font-semibold text-white">Intermediário</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold text-white">R$ 89</span>
                <span className="text-slate-400">/mês</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2 text-slate-300 text-sm">
                  <Check className="w-4 h-4 text-primary-400" /> Tudo do Básico
                </li>
                <li className="flex items-center gap-2 text-slate-300 text-sm">
                  <Check className="w-4 h-4 text-primary-400" /> SINAPI e TCPO
                </li>
                <li className="flex items-center gap-2 text-slate-300 text-sm">
                  <Check className="w-4 h-4 text-primary-400" /> 10 obras ativas
                </li>
                <li className="flex items-center gap-2 text-slate-300 text-sm">
                  <Check className="w-4 h-4 text-primary-400" /> Orçado x Realizado
                </li>
              </ul>
              <button onClick={onLogin} className="w-full py-3 px-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition">
                Assinar Intermediário
              </button>
            </div>

            {/* Advanced */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Avançado</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold text-slate-900">R$ 179</span>
                <span className="text-slate-500">/mês</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2 text-slate-600 text-sm">
                  <Check className="w-4 h-4 text-green-500" /> Obras Ilimitadas
                </li>
                <li className="flex items-center gap-2 text-slate-600 text-sm">
                  <Check className="w-4 h-4 text-green-500" /> QTO Automático (IA)
                </li>
                <li className="flex items-center gap-2 text-slate-600 text-sm">
                  <Check className="w-4 h-4 text-green-500" /> Multiusuário
                </li>
                <li className="flex items-center gap-2 text-slate-600 text-sm">
                  <Check className="w-4 h-4 text-green-500" /> Simulador de Cenários
                </li>
              </ul>
              <button onClick={onLogin} className="w-full py-3 px-4 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition">
                Contatar Vendas
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2024 OrçaAI. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;