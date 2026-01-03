
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { RouteTracker } from './components/RouteTracker';
import { MapView } from './components/MapView';
import { View, User, Route } from './types';
import { Plus, Bike, Map as MapIcon, ChevronRight, Info, Shield, Camera, Gauge, Compass, Users, Calendar, Trophy, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { getRouteInsights } from './services/geminiService';

// URL do Logo Oficial
const LAMA_LOGO_URL = 'https://i.postimg.cc/q7S7Yp4G/lama-logo.png';

const INITIAL_ROUTES: Route[] = [
  {
    id: '1',
    title: 'Estrada Real de Goiás',
    description: 'Um mergulho na história do Brasil Central, com paisagens típicas do cerrado e estradas desafiadoras.',
    distance: '120 km',
    difficulty: 'Moderada',
    points: [
      { lat: -16.7600, lng: -49.2800, timestamp: 0 },
      { lat: -16.8000, lng: -49.3000, timestamp: 1 },
    ],
    status: 'planejada',
    thumbnail: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Rota das Águas Quentes',
    description: 'Trajeto clássico partindo de Aparecida rumo às estâncias termais da região.',
    distance: '160 km',
    difficulty: 'Fácil',
    points: [
      { lat: -16.7600, lng: -49.2800, timestamp: 0 },
      { lat: -17.7400, lng: -48.6200, timestamp: 1 },
    ],
    status: 'concluída',
    thumbnail: 'https://images.unsplash.com/photo-1515777315835-281b94c9589f?q=80&w=800&auto=format&fit=crop'
  }
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setView] = useState<View>('home');
  const [user, setUser] = useState<User | null>(null);
  const [routes, setRoutes] = useState<Route[]>(INITIAL_ROUTES);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [insights, setInsights] = useState<any>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      id: '1',
      name: 'Membro L.A.M.A. Aparecida',
      email: loginForm.email,
      bikeModel: 'Harley Davidson Fat Boy',
      avatar: 'https://picsum.photos/seed/lama-biker/100/100'
    });
    setIsAuthenticated(true);
  };

  const handleAddPlannedRoute = (route: Route) => {
    setRoutes(prev => prev.map(r => r.id === route.id ? { ...r, status: 'planejada' } : r));
  };

  const fetchInsights = async (route: Route) => {
    setInsights('carregando');
    const data = await getRouteInsights(route.title, 'Aparecida de Goiânia, Goiás, Brasil');
    setInsights(data);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 bg-[url('https://images.unsplash.com/photo-1558981403-c5f91cbba527?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        <div className="relative w-full max-w-md bg-zinc-900/90 border border-zinc-800 p-10 rounded-3xl shadow-2xl backdrop-blur-md">
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-yellow-500 blur-2xl opacity-20"></div>
              <img 
                src={LAMA_LOGO_URL} 
                alt="L.A.M.A. Logo Oficial" 
                className="w-56 h-56 object-contain relative z-10 drop-shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-transform duration-500" 
              />
            </div>
          </div>
          <h2 className="text-3xl font-oswald text-center text-white font-bold mb-2 tracking-tight uppercase italic">L.A.M.A. Aparecida</h2>
          <p className="text-yellow-500/80 text-center mb-8 font-medium uppercase tracking-widest text-[10px]">Irmandade • Respeito • Tradição</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-zinc-400 text-sm font-medium mb-2 uppercase tracking-tighter">Matrícula (E-mail)</label>
              <input
                type="email"
                required
                className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
                placeholder="membro@lamaaparecida.com.br"
                value={loginForm.email}
                onChange={e => setLoginForm({...loginForm, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-sm font-medium mb-2 uppercase tracking-tighter">Senha de Acesso</label>
              <input
                type="password"
                required
                className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={e => setLoginForm({...loginForm, password: e.target.value})}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-yellow-500/20 uppercase tracking-widest"
            >
              ACESSAR PORTAL
            </button>
          </form>
          <div className="mt-8 text-center text-zinc-600 text-[10px] uppercase font-bold tracking-widest">
            © 2025 L.A.M.A. Aparecida - Capítulo Brasil
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar currentView={currentView} setView={setView} onLogout={() => setIsAuthenticated(false)} />
      
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        {currentView === 'home' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800 pb-12">
              <div className="flex items-center gap-6">
                <div className="bg-zinc-900 p-2 rounded-2xl border border-zinc-800 shadow-xl">
                  <img src={LAMA_LOGO_URL} alt="Logo Oficial" className="w-16 h-16 md:w-28 md:h-28 object-contain" />
                </div>
                <div>
                  <span className="text-yellow-500 font-bold uppercase tracking-[0.25em] text-[12px] block mb-2">LATIN AMERICAN MOTORCYCLE ASSOCIATION</span>
                  <h1 className="text-4xl md:text-6xl font-oswald font-bold text-white uppercase mt-6 tracking-tighter italic">
                    Capítulo <span className="text-yellow-500">Aparecida</span>
                  </h1>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Situação do Asfalto</p>
                  <p className="text-yellow-500 font-bold flex items-center justify-end gap-1 text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div> PRONTO PARA RODAR
                  </p>
                </div>
              </div>
            </header>

            <section className="relative rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-zinc-800 aspect-video md:aspect-[21/9] shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent z-10"></div>
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 grayscale scale-125">
                <img src={LAMA_LOGO_URL} alt="Background Texture" className="w-full h-full object-contain" />
              </div>

              <iframe 
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[3s]"
                src="https://www.youtube.com/embed/S_7iW5D6pSw?autoplay=1&mute=1&loop=1&playlist=S_7iW5D6pSw&controls=0&showinfo=0&rel=0&modestbranding=1" 
                title="L.A.M.A. Intro Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>

              <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-20 space-y-4 max-w-2xl">
                <div className="bg-red-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full w-fit tracking-widest border border-white/20">
                  Respeito & Honra
                </div>
                <h3 className="text-4xl md:text-5xl font-oswald font-bold text-white uppercase leading-none italic">
                  Irmandade <span className="text-yellow-500">Sem Fronteiras.</span>
                </h3>
                <p className="text-zinc-300 text-lg font-light leading-relaxed">
                  Integrando a maior associação de motociclistas da América Latina. O Capítulo Aparecida de Goiânia vive a liberdade e a força do Cerrado.
                </p>
                <div className="pt-2 flex gap-4">
                  <button onClick={() => setView('explorer')} className="bg-yellow-500 text-black px-8 py-4 rounded-xl font-bold hover:bg-white transition-all flex items-center gap-2 uppercase tracking-widest text-sm shadow-xl shadow-yellow-500/10">
                    Explorar Destinos <ChevronRight size={18} />
                  </button>
                  <button className="bg-zinc-900/50 backdrop-blur-md text-white border border-white/10 px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all uppercase tracking-widest text-sm">
                    Sede Regional
                  </button>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {[
                { icon: Users, label: 'Irmãos Ativos', value: '142', color: 'text-yellow-500' },
                { icon: Compass, label: 'Km Rodados', value: '12.4k', color: 'text-red-600' },
                { icon: Calendar, label: 'Eventos 2025', value: '28', color: 'text-yellow-500' },
                { icon: Trophy, label: 'Anos de Estrada', value: '15', color: 'text-red-600' },
              ].map((stat, i) => (
                <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl hover:bg-zinc-900 transition-colors group">
                  <stat.icon size={24} className={`${stat.color} mb-3 group-hover:scale-110 transition-transform`} />
                  <p className="text-3xl font-oswald font-bold text-white">{stat.value}</p>
                  <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <h4 className="text-xl font-bold text-white flex items-center gap-2">
                  <div className="w-1 h-6 bg-yellow-500 rounded-full"></div>
                  Agenda Oficial do Capítulo
                </h4>
                <div className="space-y-4">
                  {[
                    { title: 'Moto-Churrasco Beneficente', date: '15 Abr', desc: 'Arrecadação de alimentos para comunidades de Aparecida.', category: 'Social', special: true },
                    { title: 'Reunião Mensal de Batedores', date: '22 Abr', desc: 'Definição das novas rotas para o comboio de Maio.', category: 'Oficial', special: false },
                    { title: 'Viagem para Pirenópolis', date: '01 Mai', desc: 'Saída às 06:00 do Posto de Comando Regional.', category: 'Estrada', special: false },
                  ].map((event, i) => (
                    <div key={i} className="group bg-zinc-900 p-5 rounded-2xl border border-zinc-800 hover:border-yellow-500/50 transition-all flex items-center gap-6 cursor-pointer">
                      <div className={`p-3 rounded-xl text-center min-w-[70px] transition-colors ${event.special ? 'bg-red-600 group-hover:bg-yellow-500' : 'bg-zinc-800 group-hover:bg-yellow-500'}`}>
                        <p className="text-white group-hover:text-black font-bold leading-none">{event.date.split(' ')[0]}</p>
                        <p className={`text-[10px] uppercase font-black ${event.special ? 'text-white/80' : 'text-zinc-500'} group-hover:text-black`}>{event.date.split(' ')[1]}</p>
                      </div>
                      <div className="flex-1">
                        <span className="text-yellow-500 text-[10px] font-bold uppercase tracking-tighter">{event.category}</span>
                        <h5 className="text-white font-bold text-lg">{event.title}</h5>
                        <p className="text-zinc-400 text-sm">{event.desc}</p>
                      </div>
                      <ChevronRight size={20} className="text-zinc-700 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-xl font-bold text-white flex items-center gap-2">
                  <div className="w-1 h-6 bg-red-600 rounded-full"></div>
                  Inteligência L.A.M.A.
                </h4>
                <div className="bg-gradient-to-br from-yellow-500/10 to-zinc-900 border border-yellow-500/20 p-8 rounded-[2rem] space-y-4">
                  <div className="bg-yellow-500 p-3 rounded-2xl w-fit">
                    <Info className="text-black" size={24} />
                  </div>
                  <h5 className="text-xl font-bold text-white leading-tight">Gemini Integrado <br/> <span className="text-yellow-500">IA de Segurança</span></h5>
                  <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                    Nossa plataforma usa IA de ponta para analisar rotas no Cerrado, fornecendo dicas de pilotagem e alertas baseados em dados reais.
                  </p>
                  <button onClick={() => setView('explorer')} className="text-yellow-500 font-bold text-sm flex items-center gap-2 hover:text-white transition-colors">
                    Testar na Aba Explorar <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'explorer' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <header>
              <h2 className="text-4xl font-oswald font-bold uppercase text-white italic">Próximos <span className="text-yellow-500">Destinos</span></h2>
              <p className="text-zinc-400 mt-2">Explore e planeje sua próxima aventura saindo de Aparecida.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {routes.map(route => (
                <div key={route.id} className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden flex flex-col md:flex-row h-full group hover:shadow-2xl hover:shadow-yellow-500/5 transition-all">
                  <div className="md:w-1/2 relative h-64 md:h-auto">
                    <img src={route.thumbnail} alt={route.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 bg-yellow-500 px-3 py-1 rounded-full border border-black/10 text-xs font-bold text-black uppercase">
                      {route.difficulty}
                    </div>
                  </div>
                  <div className="p-8 md:w-1/2 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-500 transition-colors">{route.title}</h3>
                      <div className="flex items-center gap-2 text-yellow-500 font-bold mb-4">
                        <Gauge size={18} /> {route.distance}
                      </div>
                      <p className="text-zinc-400 line-clamp-3 text-sm">{route.description}</p>
                    </div>
                    
                    <div className="mt-6 flex flex-col gap-3">
                      <button 
                        onClick={() => fetchInsights(route)}
                        className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all border border-zinc-700"
                      >
                        <Info size={18} className="text-yellow-500" /> Dicas do Gemini
                      </button>
                      <button 
                        onClick={() => handleAddPlannedRoute(route)}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                      >
                        MARCAR COMO PLANEJADA <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {insights && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
                <div className="bg-zinc-900 border border-yellow-500/30 p-10 rounded-3xl max-w-2xl w-full relative shadow-2xl">
                  <button onClick={() => setInsights(null)} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors">Fechar</button>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-yellow-500 p-3 rounded-2xl">
                      <Shield className="text-black" size={32} />
                    </div>
                    <h3 className="text-3xl font-oswald font-bold text-white uppercase italic">Análise da <span className="text-yellow-500">Rota</span></h3>
                  </div>
                  
                  {insights === 'carregando' ? (
                    <div className="space-y-4 animate-pulse">
                      <div className="h-6 bg-zinc-800 rounded-full w-3/4"></div>
                      <div className="h-6 bg-zinc-800 rounded-full w-1/2"></div>
                      <div className="h-24 bg-zinc-800 rounded-2xl w-full"></div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div>
                        <h4 className="text-yellow-500 font-bold uppercase mb-4 flex items-center gap-2">
                           <Info size={18} /> Dicas de Segurança
                        </h4>
                        <ul className="space-y-4">
                          {insights.safetyTips.map((tip: string, i: number) => (
                            <li key={i} className="flex gap-4 p-4 bg-zinc-950 rounded-2xl border border-zinc-800 text-zinc-300">
                              <span className="text-yellow-500 font-bold">#0{i+1}</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-red-600 font-bold uppercase mb-3 flex items-center gap-2">
                          <Compass size={18} /> Destaque Paisagístico
                        </h4>
                        <p className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 text-zinc-300 italic border-l-4 border-red-600">
                          "{insights.scenicHighlight}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'my-routes' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
             <header className="flex justify-between items-center">
              <div>
                <h2 className="text-4xl font-oswald font-bold uppercase text-white italic">Minha <span className="text-yellow-500">Garagem</span></h2>
                <p className="text-zinc-400 mt-2">Histórico de conquistas e planos futuros.</p>
              </div>
              <button onClick={() => setView('tracking')} className="bg-yellow-500 text-black p-4 rounded-2xl transition-all hover:scale-105 shadow-lg shadow-yellow-500/10">
                <Plus size={24} />
              </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {routes.filter(r => r.status !== 'concluída').map(route => (
                <div key={route.id} className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden group">
                  <MapView points={route.points} className="h-48 group-hover:h-56 transition-all duration-500" />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-yellow-500 transition-colors">{route.title}</h3>
                      <span className="bg-yellow-500/10 text-yellow-500 text-[10px] font-black uppercase px-2 py-1 rounded">Planejada</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-500 text-sm">
                      <span className="flex items-center gap-1"><MapIcon size={14} className="text-yellow-500" /> {route.distance}</span>
                      <button className="text-yellow-500 hover:underline font-bold">Ver Mapa</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'tracking' && <RouteTracker />}

        {currentView === 'gallery' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
            <header>
              <h2 className="text-4xl font-oswald font-bold uppercase text-white italic">Nossa <span className="text-yellow-500">Galeria</span></h2>
              <p className="text-zinc-400 mt-2">Registros históricos e momentos da irmandade em Aparecida.</p>
            </header>

            <div className="relative bg-zinc-900 rounded-[3rem] border border-zinc-800 overflow-hidden min-h-[500px] flex flex-col items-center justify-center p-12 text-center shadow-2xl">
              <div className="absolute inset-0 opacity-10 grayscale">
                <img src="https://images.unsplash.com/photo-1558981403-c5f91cbba527?q=80&w=2070&auto=format&fit=crop" alt="Background" className="w-full h-full object-cover" />
              </div>
              
              <div className="relative z-10 space-y-8 max-w-xl">
                <div className="bg-yellow-500/10 p-6 rounded-full w-fit mx-auto border border-yellow-500/20">
                  <ImageIcon size={64} className="text-yellow-500" />
                </div>
                <h3 className="text-3xl font-oswald font-bold text-white uppercase italic">Explore Nossa História no <span className="text-blue-500">Facebook</span></h3>
                <p className="text-zinc-400 text-lg leading-relaxed">
                  Mantemos nossa galeria oficial atualizada em nossa página do Facebook. Clique no botão abaixo para ver as fotos das nossas últimas rotas, eventos e encontros.
                </p>
                <a 
                  href="https://www.facebook.com/lamaaparecidabr/photos" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-yellow-500 hover:bg-yellow-600 text-black px-10 py-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl shadow-yellow-500/20 uppercase tracking-widest"
                >
                  ACESSAR GALERIA OFICIAL <ExternalLink size={20} />
                </a>
              </div>
            </div>
          </div>
        )}

        {currentView === 'profile' && (
          <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in-95 duration-500">
            <div className="bg-zinc-900 p-12 rounded-[40px] border border-zinc-800 flex flex-col md:flex-row items-center gap-10 shadow-2xl">
              <div className="relative">
                <img src={user?.avatar} alt="Avatar" className="w-40 h-40 rounded-[35px] border-4 border-yellow-500 object-cover" />
                <div className="absolute -bottom-2 -right-2 bg-red-600 p-3 rounded-2xl shadow-lg border-4 border-zinc-900">
                  <Camera size={24} className="text-white" />
                </div>
              </div>
              <div className="text-center md:text-left space-y-4">
                <h2 className="text-5xl font-oswald font-bold text-white tracking-tighter uppercase italic">{user?.name}</h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="bg-zinc-950 border border-zinc-800 px-5 py-2 rounded-2xl flex items-center gap-2">
                    <Bike size={18} className="text-yellow-500" />
                    <span className="text-zinc-300 font-medium">{user?.bikeModel}</span>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-800 px-5 py-2 rounded-2xl flex items-center gap-2">
                    <MapIcon size={18} className="text-red-600" />
                    <span className="text-zinc-300 font-medium">12 Rotas Concluídas</span>
                  </div>
                </div>
                <p className="text-zinc-500 max-w-lg italic">"Andar de moto é o jeito mais rápido de chegar à paz de espírito. Orgulho L.A.M.A. Aparecida."</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
