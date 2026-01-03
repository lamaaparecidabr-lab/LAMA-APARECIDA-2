
import React, { useState, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { RouteTracker } from './components/RouteTracker';
import { MapView } from './components/MapView';
import { View, User, Route } from './types';
import { Bike, Compass, Users, Calendar, Trophy, Image as ImageIcon, ExternalLink, Shield, Gauge, ChevronRight, Zap, Map, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { getRouteInsights } from './services/geminiService';

const LAMA_LOGO_URL = 'https://raw.githubusercontent.com/lamaaparecidabr-lab/LAMA-APARECIDA/411b86094f7e7539386b7340eb607162cae150b5/components/logo.jpg';
const YOUTUBE_ID = '-VzuMRXCizo';

const INITIAL_ROUTES: Route[] = [
  {
    id: '1',
    title: 'Estrada Real de Goiás',
    description: 'Um mergulho na história do Brasil Central, com paisagens típicas do cerrado e estradas desafiadoras.',
    distance: '120 km',
    difficulty: 'Moderada',
    points: [{ lat: -16.7600, lng: -49.2800, timestamp: 0 }],
    status: 'planejada',
    thumbnail: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Rota das Águas Quentes',
    description: 'Trajeto clássico partindo de Aparecida rumo às estâncias termais da região.',
    distance: '160 km',
    difficulty: 'Fácil',
    points: [{ lat: -16.7600, lng: -49.2800, timestamp: 0 }],
    status: 'planejada',
    thumbnail: 'https://images.unsplash.com/photo-1515777315835-281b94c9589f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Los Caracoles (Mendoza - Santiago)',
    description: 'A lendária travessia dos Andes. Curvas fechadas e altitudes extremas em uma das estradas mais bonitas do mundo.',
    distance: '364 km',
    difficulty: 'Lendária',
    points: [{ lat: -32.8901, lng: -68.8440, timestamp: 0 }],
    status: 'planejada',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop'
  }
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setView] = useState<View>('home');
  const [user, setUser] = useState<User | null>(null);
  const [routes, setRoutes] = useState<Route[]>(INITIAL_ROUTES);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [insights, setInsights] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLIFrameElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      id: '1',
      name: 'Membro L.A.M.A.',
      email: loginForm.email,
      bikeModel: 'Harley Davidson Fat Boy',
      avatar: 'https://picsum.photos/seed/lama-biker/100/100'
    });
    setIsAuthenticated(true);
  };

  const toggleMute = () => {
    if (videoRef.current?.contentWindow) {
      const command = isMuted ? 'unMute' : 'mute';
      videoRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args: [] }),
        '*'
      );
      setIsMuted(!isMuted);
    }
  };

  const handleSaveRoute = (newRoute: Route) => {
    setRoutes(prev => [newRoute, ...prev]);
  };

  const fetchInsights = async (route: Route) => {
    setInsights('carregando');
    const data = await getRouteInsights(route.title, 'Aparecida de Goiânia, Brasil');
    setInsights(data);
  };

  const completedRoutes = routes.filter(r => r.status === 'concluída');
  const iconicRoutes = routes.filter(r => r.status === 'planejada');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1558981403-c5f91cbba527?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"></div>
        <div className="relative w-full max-w-md bg-zinc-900/90 border-t border-l border-white/10 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] backdrop-blur-xl ring-1 ring-white/5">
          <div className="flex justify-center mb-8 md:mb-12">
            <div className="relative group">
              <div className="absolute inset-0 bg-yellow-500/20 blur-[50px] rounded-full group-hover:bg-yellow-500/30 transition-all duration-700"></div>
              <img src={LAMA_LOGO_URL} alt="LAMA Logo" className="relative w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-2xl" />
            </div>
          </div>
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-3xl md:text-4xl font-oswald text-white font-black uppercase italic tracking-tighter">L.A.M.A. Aparecida</h2>
            <div className="h-1 w-12 bg-yellow-500 mx-auto mt-3 rounded-full"></div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-5">Usuário</label>
              <input
                type="email"
                required
                className="w-full bg-black/50 border border-zinc-800 text-white px-7 py-4 md:py-5 rounded-[1.2rem] md:rounded-[1.5rem] focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 outline-none transition-all placeholder:text-zinc-800"
                placeholder="membro@lama.com"
                value={loginForm.email}
                onChange={e => setLoginForm({...loginForm, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-5">Senha</label>
              <input
                type="password"
                required
                className="w-full bg-black/50 border border-zinc-800 text-white px-7 py-4 md:py-5 rounded-[1.2rem] md:rounded-[1.5rem] focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 outline-none transition-all placeholder:text-zinc-800"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={e => setLoginForm({...loginForm, password: e.target.value})}
              />
            </div>
            <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-5 md:py-6 rounded-[1.2rem] md:rounded-[1.5rem] font-black uppercase tracking-[0.25em] text-xs transition-all shadow-2xl shadow-yellow-500/20 active:scale-95 flex items-center justify-center gap-3">
              Acessar <Zap size={16} />
            </button>
          </form>
          <p className="mt-8 md:mt-10 text-center text-zinc-600 text-[9px] uppercase font-black tracking-widest">Respeito & Liberdade • Est. 2022</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#050505] text-zinc-300">
      <Sidebar currentView={currentView} setView={setView} onLogout={() => setIsAuthenticated(false)} />
      
      <main className="flex-1 p-5 md:p-12 pb-24 md:pb-12 max-w-[1400px] mx-auto w-full overflow-y-auto custom-scrollbar">
        {currentView === 'home' && (
          <div className="space-y-12 md:space-y-20 animate-in fade-in zoom-in-95 duration-1000">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 border-b border-zinc-900 pb-8 md:pb-16">
              <div className="flex items-center gap-6 md:gap-10">
                <div className="relative group">
                  <div className="absolute inset-0 bg-yellow-500/10 blur-[40px] rounded-full"></div>
                  <img src={LAMA_LOGO_URL} alt="Logo" className="relative w-16 h-16 md:w-28 md:h-28 object-contain" />
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <span className="text-yellow-500 font-black uppercase tracking-[0.2em] text-[10px] md:text-lg">LATIN AMERICAN MOTORCYCLE ASSOCIATION</span>
                  </div>
                  <h1 className="text-2xl md:text-5xl font-oswald font-black text-white uppercase italic tracking-tighter leading-[0.8] mt-2">
                    Capítulo <span className="text-yellow-500">Aparecida</span>
                  </h1>
                </div>
              </div>
            </header>

            <section className="relative rounded-[2.5rem] md:rounded-[4rem] overflow-hidden bg-zinc-900 border border-zinc-800 aspect-video md:aspect-[21/9] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] group ring-1 ring-white/5">
              <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <iframe 
                ref={videoRef}
                className="w-full h-full object-cover opacity-60 transition-all duration-1000 scale-110 group-hover:scale-100"
                src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&mute=1&loop=1&playlist=${YOUTUBE_ID}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=1`} 
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              ></iframe>
              
              <div className="absolute bottom-4 right-4 md:bottom-10 md:right-10 z-30 flex gap-2 md:gap-4">
                <button 
                  onClick={toggleMute}
                  className="bg-black/50 hover:bg-yellow-500 backdrop-blur-xl border border-white/10 p-3 md:p-4 rounded-xl md:rounded-2xl text-white hover:text-black transition-all group/btn shadow-2xl"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <a 
                  href={`https://www.youtube.com/watch?v=${YOUTUBE_ID}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-black/50 hover:bg-white backdrop-blur-xl border border-white/10 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl text-white hover:text-black transition-all font-black uppercase tracking-[0.2em] text-[8px] md:text-[10px] flex items-center gap-2 md:gap-3 shadow-2xl"
                >
                  <Maximize2 size={14} /> <span className="hidden xs:inline">Ver Original</span>
                </a>
              </div>

              <div className="absolute inset-0 z-20 p-6 md:p-16 flex flex-col justify-end pointer-events-none">
                <div className="hidden md:flex items-center gap-4 mb-6">
                  <div className="bg-red-600 text-white text-[10px] font-black uppercase px-4 py-2 rounded-xl tracking-[0.2em] shadow-xl shadow-red-600/30">Status: Operacional</div>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 text-white text-[10px] font-black uppercase px-4 py-2 rounded-xl tracking-[0.2em]">LAMA Worldwide</div>
                </div>
                <h3 className="text-3xl md:text-7xl font-oswald font-black text-white uppercase italic tracking-tighter leading-none mb-4 md:mb-6">Respeito <span className="text-yellow-500">& Liberdade.</span></h3>
                <p className="text-zinc-400 max-w-2xl text-sm md:text-xl leading-relaxed font-light mb-6 md:mb-10 line-clamp-2 md:line-clamp-none">
                  Unindo a irmandade sob os valores da maior associação de Moto Turismo do Mundo. Em Aparecida de Goiânia, forjamos o futuro sobre duas rodas.
                </p>
                <div className="flex flex-wrap gap-4 md:gap-6 pointer-events-auto">
                   <button onClick={() => setView('explorer')} className="bg-white text-black px-6 md:px-12 py-3.5 md:py-5 rounded-xl md:rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-[9px] md:text-[11px] hover:bg-yellow-500 transition-all shadow-2xl">Destinos</button>
                   <button onClick={() => setView('tracking')} className="bg-zinc-800/40 backdrop-blur-xl text-white border border-white/10 px-6 md:px-12 py-3.5 md:py-5 rounded-xl md:rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-[9px] md:text-[11px] hover:bg-zinc-700 transition-all">Gravar Rota</button>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
              {[
                { icon: Users, label: 'Membros', value: '18', color: 'text-yellow-500' },
                { icon: Compass, label: 'Km Rodados', value: '12.4k', color: 'text-red-600' },
                { icon: Calendar, label: 'Missões', value: '28', color: 'text-yellow-500' },
                { icon: Trophy, label: 'Anos', value: '03', color: 'text-red-600' },
              ].map((stat, i) => (
                <div key={i} className="bg-zinc-900/30 border border-zinc-900/50 p-6 md:p-10 rounded-2xl md:rounded-[3rem] hover:border-yellow-500/30 transition-all group relative overflow-hidden backdrop-blur-sm">
                  <stat.icon size={20} className={`${stat.color} mb-4 md:mb-6 transition-transform group-hover:scale-110`} />
                  <p className="text-3xl md:text-5xl font-oswald font-black text-white italic tracking-tighter leading-none">{stat.value}</p>
                  <p className="text-zinc-600 text-[9px] md:text-[11px] uppercase font-black tracking-[0.3em] mt-2 md:mt-3">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'explorer' && (
          <div className="space-y-10 md:space-y-16 animate-in slide-in-from-right-12 duration-1000">
            <header className="flex items-center gap-4 md:gap-6">
               <div className="w-2 md:w-3 h-10 md:h-14 bg-yellow-500 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.5)]"></div>
               <h2 className="text-4xl md:text-6xl font-oswald font-black text-white italic uppercase tracking-tighter">Rotas <span className="text-yellow-500">Icônicas</span></h2>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {iconicRoutes.map(route => (
                <div key={route.id} className="bg-zinc-950 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border border-zinc-900 group hover:border-yellow-500/20 transition-all shadow-2xl relative">
                  <div className="relative h-48 md:h-80 overflow-hidden">
                    <img src={route.thumbnail} alt={route.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
                    <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 flex gap-2 md:gap-4">
                       <span className="bg-yellow-500 text-black px-4 md:px-6 py-2 md:2.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-xl">{route.distance}</span>
                       <span className={`px-4 md:px-6 py-2 md:2.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest ${route.difficulty === 'Lendária' ? 'bg-red-600 text-white' : 'bg-white/10 backdrop-blur-xl border border-white/10 text-white'}`}>{route.difficulty}</span>
                    </div>
                  </div>
                  <div className="p-8 md:p-12 pt-6">
                    <h3 className="text-2xl md:text-4xl font-oswald font-black text-white uppercase italic tracking-tighter leading-none">{route.title}</h3>
                    <p className="text-zinc-500 text-sm md:text-lg mt-4 md:mt-6 leading-relaxed font-light line-clamp-3">{route.description}</p>
                    <button onClick={() => fetchInsights(route)} className="mt-8 md:mt-10 w-full bg-zinc-900 border border-zinc-800 text-yellow-500 py-4 md:py-6 rounded-2xl md:rounded-[2rem] font-black uppercase text-[9px] md:text-[10px] tracking-[0.3em] md:tracking-[0.4em] hover:bg-yellow-500 hover:text-black transition-all flex items-center justify-center gap-3 md:gap-4">
                      Briefing de Missão <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'my-routes' && (
          <div className="space-y-10 md:space-y-16 animate-in slide-in-from-right-12 duration-1000">
            <header className="flex items-center gap-4 md:gap-6">
               <div className="w-2 md:w-3 h-10 md:h-14 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)]"></div>
               <h2 className="text-4xl md:text-6xl font-oswald font-black text-white italic uppercase tracking-tighter">Rotas <span className="text-yellow-500">Concluídas</span></h2>
            </header>
            
            {completedRoutes.length === 0 ? (
              <div className="bg-zinc-900/20 border-2 border-dashed border-zinc-800 rounded-[2.5rem] md:rounded-[4rem] p-12 md:p-24 text-center">
                <Map size={48} className="text-zinc-800 mx-auto mb-6 md:size-64" />
                <h3 className="text-xl md:text-2xl font-oswald font-black text-zinc-600 uppercase tracking-widest">Nenhuma missão finalizada</h3>
                <p className="text-zinc-700 mt-4 max-w-xs md:max-w-md mx-auto text-sm">Registre seu primeiro trajeto oficial na aba 'Gravar Minha Rota'.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {completedRoutes.map(route => (
                  <div key={route.id} className="bg-zinc-950 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border border-zinc-900 group hover:border-red-500/20 transition-all shadow-2xl relative">
                    <div className="relative h-48 md:h-64 bg-black">
                      <MapView points={route.points} className="h-full w-full opacity-60 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none"></div>
                      <div className="absolute bottom-6 left-6 md:left-10 flex gap-2 md:gap-4">
                        <span className="bg-red-600 text-white px-4 md:px-5 py-2 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest shadow-xl">Finalizada</span>
                        <span className="bg-yellow-500 text-black px-4 md:px-5 py-2 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest shadow-xl">{route.distance}</span>
                      </div>
                    </div>
                    <div className="p-8 md:p-10 pt-6">
                      <h3 className="text-2xl md:text-3xl font-oswald font-black text-white uppercase italic tracking-tighter leading-none">{route.title}</h3>
                      <p className="text-zinc-500 text-sm mt-4 leading-relaxed font-light line-clamp-2">{route.description}</p>
                      <div className="mt-8 flex items-center justify-between border-t border-zinc-900 pt-6">
                        <div className="flex items-center gap-2 md:gap-3">
                           <div className="bg-zinc-800 p-2 rounded-lg"><Gauge size={12} className="text-yellow-500 md:size-14" /></div>
                           <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-zinc-600">Telemetria Salva</span>
                        </div>
                        <button onClick={() => setView('tracking')} className="text-yellow-500 font-black uppercase text-[8px] md:text-[10px] tracking-widest hover:text-white transition-colors">Detalhes</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === 'tracking' && <RouteTracker onSave={handleSaveRoute} />}

        {currentView === 'gallery' && (
          <div className="flex flex-col items-center justify-center min-h-[500px] md:min-h-[700px] text-center space-y-8 md:space-y-12 animate-in zoom-in-95 duration-1000">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500/15 blur-[60px] rounded-full"></div>
              <div className="bg-zinc-950 p-10 md:p-16 rounded-full border border-zinc-900 relative shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]">
                <ImageIcon size={60} className="text-yellow-500 opacity-80 md:size-100" />
              </div>
            </div>
            <div className="space-y-4 md:space-y-6">
              <h3 className="text-4xl md:text-6xl font-oswald font-black text-white uppercase italic tracking-tighter">História em <span className="text-blue-500">Imagens</span></h3>
              <p className="text-zinc-500 max-w-xs md:max-w-xl text-sm md:text-xl font-light leading-relaxed mx-auto px-4">Nossos registros históricos oficiais são preservados em nossa rede social.</p>
            </div>
            <a href="https://www.facebook.com/lamaaparecidabr/photos" target="_blank" rel="noreferrer" className="bg-zinc-900 hover:bg-yellow-500 hover:text-black border border-zinc-800 text-white px-8 md:px-16 py-5 md:py-7 rounded-2xl md:rounded-[2.5rem] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[9px] md:text-[11px] flex items-center gap-3 md:gap-5 transition-all shadow-2xl">
              Ver Álbuns Oficiais <ExternalLink size={16} />
            </a>
          </div>
        )}

        {currentView === 'profile' && (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <div className="bg-zinc-950 p-10 md:p-20 rounded-[2.5rem] md:rounded-[5rem] border border-zinc-900 flex flex-col md:flex-row items-center gap-10 md:gap-20 shadow-[0_60px_120px_-30px_rgba(0,0,0,1)] relative overflow-hidden">
              <div className="relative">
                <img src={user?.avatar} alt="Avatar" className="relative w-48 h-48 md:w-72 md:h-72 rounded-[2rem] md:rounded-[4rem] border-4 md:border-8 border-zinc-900 object-cover shadow-3xl" />
                <div className="absolute -bottom-4 -right-4 bg-red-600 p-3 rounded-2xl shadow-xl">
                  <Shield size={24} className="text-white md:size-32" />
                </div>
              </div>
              <div className="text-center md:text-left space-y-6 md:space-y-10 relative">
                <div className="space-y-3">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span className="bg-yellow-500 text-black text-[7px] md:text-[9px] font-black uppercase px-2 md:px-3 py-1 rounded-md tracking-[0.2em] md:tracking-[0.3em]">Elite L.A.M.A.</span>
                    <span className="text-zinc-600 font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-[8px] md:text-[10px]">Membro Capitão</span>
                  </div>
                  <h2 className="text-4xl md:text-8xl font-oswald font-black text-white uppercase italic tracking-tighter leading-none">{user?.name}</h2>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 md:gap-8">
                  <div className="flex items-center gap-4 md:gap-6 bg-zinc-900/40 border border-zinc-800/50 px-6 md:px-10 py-4 md:py-6 rounded-2xl md:rounded-[2.2rem] text-zinc-300">
                    <Bike size={24} className="text-yellow-500 md:size-32" />
                    <div className="flex flex-col text-left">
                       <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-zinc-600">Montaria</span>
                       <span className="font-bold text-white text-base md:text-xl">{user?.bikeModel}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {insights && insights !== 'carregando' && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-zinc-950 border border-zinc-900 p-8 md:p-16 rounded-[2.5rem] md:rounded-[4.5rem] max-w-2xl w-full relative shadow-[0_100px_200px_-50px_rgba(0,0,0,1)] ring-1 ring-white/10">
            <button onClick={() => setInsights(null)} className="absolute top-6 right-6 md:top-12 md:right-12 text-zinc-600 hover:text-white transition-all uppercase font-black text-[9px] md:text-[11px] tracking-[0.3em]">✕ Fechar</button>
            <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12">
              <div className="p-3 bg-yellow-500 rounded-2xl md:rounded-3xl shadow-xl shadow-yellow-500/20"><Shield size={24} className="text-black md:size-32" /></div>
              <h3 className="text-2xl md:text-4xl font-oswald font-black text-white uppercase italic tracking-tighter leading-none">Análise <span className="text-yellow-500">Tática</span></h3>
            </div>
            <div className="space-y-6 md:space-y-8">
              <div className="space-y-4">
                {insights.safetyTips.map((tip: string, i: number) => (
                  <div key={i} className="flex gap-4 md:gap-6 p-5 md:p-7 bg-zinc-900/40 rounded-[1.5rem] md:rounded-[2rem] border border-zinc-800/40 text-zinc-300 text-sm md:text-lg leading-relaxed">
                    <span className="text-yellow-500 font-black italic text-xl md:text-2xl shrink-0">0{i+1}</span>
                    <p className="font-light">{tip}</p>
                  </div>
                ))}
              </div>
              <div className="p-6 md:p-10 bg-yellow-500/5 rounded-[2rem] md:rounded-[3rem] border border-yellow-500/10 italic text-zinc-400 text-center relative">
                <span className="text-white text-lg md:text-2xl font-light">"{insights.scenicHighlight}"</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
