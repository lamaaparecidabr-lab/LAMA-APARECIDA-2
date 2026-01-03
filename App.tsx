
import React, { useState, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { RouteTracker } from './components/RouteTracker';
import { MapView } from './components/MapView';
import { View, User, Route } from './types';
import { Bike, Compass, Users, Calendar, Trophy, Image as ImageIcon, ExternalLink, Shield, Gauge, ChevronRight, Zap, Map, Volume2, VolumeX, Maximize2, MapPin, Navigation, Lock, Radio } from 'lucide-react';
import { getRouteInsights } from './services/geminiService';

const LAMA_LOGO_URL = 'https://raw.githubusercontent.com/lamaaparecidabr-lab/LAMA-APARECIDA/411b86094f7e7539386b7340eb607162cae150b5/components/logo.jpg';
const YOUTUBE_ID = '-VzuMRXCizo';

const CLUBHOUSE_COORDS = { lat: -16.790924, lng: -49.231221 };
const CLUBHOUSE_ADDRESS = "R. X-011 - Sitios Santa Luzia, Aparecida de Goiânia - GO, 74922-570";
const CLUBHOUSE_MARK_NAME = "l.a.m.a. aparecida casa club";

// Estado inicial vazio para as rotas do usuário (serão preenchidas apenas via gravação)
const INITIAL_ROUTES: Route[] = [];

const iconicRoutes: Route[] = [
  {
    id: 'i1',
    title: 'Estrada Real de Goiás',
    description: 'Um mergulho na história do Brasil Central, com paisagens típicas do cerrado e estradas desafiadoras.',
    distance: '120 km',
    difficulty: 'Moderada',
    points: [{ lat: -16.7600, lng: -49.2800, timestamp: 0 }],
    status: 'planejada',
    thumbnail: 'https://images.unsplash.com/photo-14714478331149-c72f17e33c73?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'i2',
    title: 'Rota das Águas Quentes',
    description: 'Trajeto clássico partindo de Aparecida rumo às estâncias termais da região.',
    distance: '160 km',
    difficulty: 'Fácil',
    points: [{ lat: -16.7600, lng: -49.2800, timestamp: 0 }],
    status: 'planejada',
    thumbnail: 'https://images.unsplash.com/photo-1515777315835-281b94c9589f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'i3',
    title: 'Los Caracoles (Mendoza - Santiago)',
    description: 'Uma das estradas mais famosas do mundo. Curvas em cotovelo nos Andes ligando Argentina e Chile.',
    distance: '360 km',
    difficulty: 'Lendária',
    points: [{ lat: -32.8901, lng: -68.8440, timestamp: 0 }],
    status: 'planejada',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop'
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

  const publicViews: View[] = ['home', 'clubhouse'];
  const needsAuth = !isAuthenticated && !publicViews.includes(currentView);

  const renderLogin = () => (
    <div className="min-h-[70vh] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-700">
      <div className="w-full max-w-md bg-zinc-900/80 border border-zinc-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl backdrop-blur-xl">
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-yellow-500/10 rounded-full border border-yellow-500/20">
            <Lock className="text-yellow-500" size={32} />
          </div>
        </div>
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-oswald text-white font-black uppercase italic tracking-tighter">Área Restrita</h2>
          <p className="text-zinc-500 text-[10px] mt-2 uppercase tracking-widest font-black">Identifique-se para acessar o radar do clube</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-4">Membro / Email</label>
            <input
              type="email"
              required
              className="w-full bg-black/50 border border-zinc-800 text-white px-6 py-4 rounded-2xl focus:ring-2 focus:ring-yellow-500/50 outline-none transition-all placeholder:text-zinc-800"
              placeholder="membro@lama.com"
              value={loginForm.email}
              onChange={e => setLoginForm({...loginForm, email: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-4">Senha de Acesso</label>
            <input
              type="password"
              required
              className="w-full bg-black/50 border border-zinc-800 text-white px-6 py-4 rounded-2xl focus:ring-2 focus:ring-yellow-500/50 outline-none transition-all placeholder:text-zinc-800"
              placeholder="••••••••"
              value={loginForm.password}
              onChange={e => setLoginForm({...loginForm, password: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
            Entrar no Capítulo <Zap size={16} />
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#050505] text-zinc-300">
      <Sidebar 
        currentView={currentView} 
        setView={setView} 
        onLogout={() => { setIsAuthenticated(false); setView('home'); }} 
      />
      
      <main className="flex-1 p-5 md:p-12 pb-24 md:pb-12 max-w-[1400px] mx-auto w-full overflow-y-auto custom-scrollbar">
        {needsAuth ? renderLogin() : (
          <div className="animate-in fade-in duration-700">
            {currentView === 'home' && (
              <div className="space-y-12 md:space-y-20">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-8 md:pb-16">
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

                <section className="relative rounded-[2.5rem] md:rounded-[4rem] overflow-hidden bg-zinc-900 border border-zinc-800 aspect-[4/5] md:aspect-[21/9] shadow-3xl group">
                  <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <iframe 
                    ref={videoRef}
                    className="w-full h-full object-cover opacity-60 transition-all duration-1000 scale-110 group-hover:scale-100"
                    src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&mute=1&loop=1&playlist=${YOUTUBE_ID}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=1`} 
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                  {/* Conteúdo Overlay do Vídeo */}
                  <div className="absolute inset-0 z-20 p-8 md:p-16 flex flex-col justify-between pointer-events-none">
                    <div className="space-y-4 md:space-y-6">
                      <h3 className="text-4xl md:text-7xl font-oswald font-black text-white uppercase italic tracking-tighter leading-none">Respeito <span className="text-yellow-500">& Liberdade.</span></h3>
                      <p className="text-zinc-400 max-w-2xl text-sm md:text-xl leading-relaxed font-light">Unindo a irmandade sob os valores da maior associação de Moto Turismo do Mundo.</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 pointer-events-auto items-center">
                       <button onClick={() => setView('clubhouse')} className="bg-white text-black px-8 md:px-12 py-4 md:py-5 rounded-2xl md:rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-[10px] md:text-[11px] hover:bg-yellow-500 transition-all shadow-2xl">Visitar Sede</button>
                       
                       <button onClick={toggleMute} className="bg-zinc-900/80 backdrop-blur-md text-white p-4 md:p-5 rounded-2xl md:rounded-[1.5rem] hover:bg-yellow-500 hover:text-black transition-all shadow-2xl border border-white/10">
                         {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                       </button>
                       <a href={`https://www.youtube.com/watch?v=${YOUTUBE_ID}`} target="_blank" rel="noopener noreferrer" className="bg-zinc-900/80 backdrop-blur-md text-white p-4 md:p-5 rounded-2xl md:rounded-[1.5rem] hover:bg-blue-600 transition-all shadow-2xl border border-white/10">
                         <Maximize2 size={20} />
                       </a>
                    </div>
                  </div>
                </section>

                {/* Seção de estatísticas reduzida no mobile para compensar o vídeo maior */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
                  {[
                    { icon: Users, label: 'Membros', value: '18', color: 'text-yellow-500' },
                    { icon: Compass, label: 'Km Rodados', value: '12.4k', color: 'text-red-600' },
                    { icon: Calendar, label: 'Missões', value: '28', color: 'text-yellow-500' },
                    { icon: Trophy, label: 'Anos', value: '03', color: 'text-red-600' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-zinc-900/30 border border-zinc-900/50 p-4 md:p-10 rounded-2xl md:rounded-[3rem] backdrop-blur-sm">
                      <stat.icon size={16} className={`${stat.color} mb-3 md:mb-4`} />
                      <p className="text-2xl md:text-5xl font-oswald font-black text-white italic tracking-tighter leading-none">{stat.value}</p>
                      <p className="text-zinc-600 text-[8px] md:text-[11px] uppercase font-black tracking-[0.3em] mt-1 md:mt-2">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentView === 'clubhouse' && (
              <div className="space-y-12">
                <header className="flex items-center gap-4 md:gap-6">
                   <div className="w-2 md:w-3 h-10 md:h-14 bg-yellow-500 rounded-full"></div>
                   <h2 className="text-4xl md:text-6xl font-oswald font-black text-white italic uppercase tracking-tighter">Casa <span className="text-yellow-500">Club</span></h2>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
                  <div className="space-y-10 order-2 lg:order-1">
                    <div className="bg-zinc-950 p-10 md:p-16 rounded-[3rem] border border-zinc-900 relative overflow-hidden shadow-3xl">
                      <div className="absolute top-0 right-0 p-10 opacity-5"><MapPin size={120} /></div>
                      <div className="relative z-10 space-y-8">
                        <div className="flex items-center gap-4">
                          <div className="bg-yellow-500 p-3 rounded-2xl"><Shield size={24} className="text-black" /></div>
                          <span className="text-zinc-600 font-black uppercase text-[10px] tracking-widest">Sede Oficial Aparecida</span>
                        </div>
                        <h3 className="text-4xl md:text-5xl font-oswald font-black text-white uppercase italic tracking-tighter leading-none">Ponto de <span className="text-yellow-500">Encontro</span></h3>
                        <p className="text-zinc-400 text-lg md:text-xl font-light leading-relaxed">{CLUBHOUSE_ADDRESS}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CLUBHOUSE_MARK_NAME)}`} target="_blank" rel="noopener noreferrer" className="bg-white text-black py-6 rounded-3xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-yellow-500 transition-all shadow-2xl">
                        Google Maps <ExternalLink size={18} />
                      </a>
                      <a href={`https://waze.com/ul?q=${encodeURIComponent(CLUBHOUSE_MARK_NAME)}&navigate=yes`} target="_blank" rel="noopener noreferrer" className="bg-zinc-900 border border-zinc-800 text-[#33CCFF] py-6 rounded-3xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-4 transition-all shadow-2xl">
                        Abrir no Waze <Navigation size={18} />
                      </a>
                    </div>
                  </div>

                  <div className="h-[400px] lg:h-auto order-1 lg:order-2 rounded-[3rem] overflow-hidden border border-zinc-800 shadow-3xl relative">
                    <MapView points={[{...CLUBHOUSE_COORDS, timestamp: Date.now()}]} className="w-full h-full opacity-80" isInteractive />
                  </div>
                </div>
              </div>
            )}

            {currentView === 'explorer' && (
              <div className="space-y-12">
                <header className="flex items-center gap-4">
                   <div className="w-2 h-10 bg-yellow-500 rounded-full"></div>
                   <h2 className="text-4xl font-oswald font-black text-white italic uppercase tracking-tighter">Rotas <span className="text-yellow-500">Icônicas</span></h2>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {iconicRoutes.map(route => (
                    <div key={route.id} className="bg-zinc-950 rounded-[2.5rem] overflow-hidden border border-zinc-900 group shadow-2xl flex flex-col">
                      <div className="relative h-48 md:h-64 overflow-hidden">
                        <img src={route.thumbnail} alt={route.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
                      </div>
                      <div className="p-8 md:p-10 flex-1 flex flex-col">
                        <h3 className="text-2xl md:text-3xl font-oswald font-black text-white uppercase italic tracking-tighter">{route.title}</h3>
                        <p className="text-zinc-500 text-sm mt-4 leading-relaxed line-clamp-3 flex-1">{route.description}</p>
                        <div className="mt-6 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                           <span className="flex items-center gap-1"><Gauge size={14} className="text-yellow-500"/> {route.distance}</span>
                           <span className="flex items-center gap-1"><Shield size={14} className="text-red-600"/> {route.difficulty}</span>
                        </div>
                        <button onClick={() => fetchInsights(route)} className="mt-8 w-full bg-zinc-900 border border-zinc-800 text-yellow-500 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-yellow-500 hover:text-black transition-all">Ver Briefing</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentView === 'my-routes' && (
              <div className="space-y-12">
                <header className="flex items-center gap-4">
                   <div className="w-2 h-10 bg-red-600 rounded-full"></div>
                   <h2 className="text-4xl font-oswald font-black text-white italic uppercase tracking-tighter">Minhas <span className="text-yellow-500">Missões Gravadas</span></h2>
                </header>
                
                {routes.filter(r => r.status === 'concluída').length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {routes.filter(r => r.status === 'concluída').map(route => (
                      <div key={route.id} className="bg-zinc-950 rounded-[2.5rem] overflow-hidden border border-zinc-900 flex flex-col group shadow-2xl">
                        <div className="relative h-48 overflow-hidden">
                           <MapView points={route.points} className="w-full h-full border-none rounded-none" />
                           <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/10 text-yellow-500">Gravado</div>
                        </div>
                        <div className="p-8">
                          <h3 className="text-xl md:text-2xl font-oswald font-black text-white italic uppercase tracking-tighter">{route.title}</h3>
                          <p className="text-zinc-500 text-xs mt-3 leading-relaxed">{route.description}</p>
                          <div className="mt-6 flex items-center gap-6 border-t border-zinc-900 pt-6">
                             <div className="flex flex-col">
                                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Distância</span>
                                <span className="text-white font-bold">{route.distance}</span>
                             </div>
                             <div className="flex flex-col">
                                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Nível</span>
                                <span className="text-white font-bold">{route.difficulty}</span>
                             </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-32 text-center space-y-8 bg-zinc-900/10 rounded-[4rem] border border-dashed border-zinc-900 animate-pulse">
                    <div className="bg-zinc-950 p-8 rounded-full border border-zinc-900 shadow-2xl">
                       <Radio size={48} className="text-zinc-800" />
                    </div>
                    <div className="space-y-3">
                       <h3 className="text-2xl font-oswald font-black text-zinc-500 uppercase italic tracking-tighter">Nenhuma Rota Gravada</h3>
                       <p className="text-zinc-700 text-xs uppercase font-black tracking-[0.2em] max-w-sm">Vá para a aba <span className="text-red-600">"Gravar"</span> para registrar sua primeira missão em tempo real!</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentView === 'tracking' && <RouteTracker onSave={handleSaveRoute} />}

            {currentView === 'gallery' && (
              <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-8">
                <div className="bg-zinc-950 p-10 rounded-full border border-zinc-900 shadow-2xl">
                  <ImageIcon size={60} className="text-yellow-500 opacity-80" />
                </div>
                <h3 className="text-4xl font-oswald font-black text-white uppercase italic tracking-tighter">Galeria de <span className="text-blue-500">Missões</span></h3>
                <a href="https://www.facebook.com/lamaaparecidabr/photos" target="_blank" rel="noreferrer" className="bg-zinc-900 hover:bg-yellow-500 hover:text-black border border-zinc-800 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-[0.3em] flex items-center gap-3 transition-all">
                  Álbuns Oficiais <ExternalLink size={16} />
                </a>
              </div>
            )}

            {currentView === 'profile' && (
              <div className="max-w-5xl mx-auto">
                <div className="bg-zinc-950 p-10 md:p-20 rounded-[3rem] md:rounded-[5rem] border border-zinc-900 flex flex-col md:flex-row items-center gap-10 md:gap-20 shadow-3xl">
                  <div className="relative">
                    <img src={user?.avatar} alt="Avatar" className="w-48 h-48 md:w-72 md:h-72 rounded-[2rem] md:rounded-[4rem] border-4 border-zinc-900 object-cover" />
                    <div className="absolute -bottom-4 -right-4 bg-red-600 p-3 rounded-2xl shadow-xl"><Shield size={24} className="text-white" /></div>
                  </div>
                  <div className="text-center md:text-left space-y-6">
                    <div className="space-y-3">
                      <span className="bg-yellow-500 text-black text-[9px] font-black uppercase px-2 py-1 rounded-md tracking-[0.2em]">Membro Capítulo</span>
                      <h2 className="text-4xl md:text-8xl font-oswald font-black text-white uppercase italic tracking-tighter leading-none">{user?.name}</h2>
                    </div>
                    <div className="flex items-center gap-4 bg-zinc-900/40 border border-zinc-800/50 px-6 py-4 rounded-2xl text-zinc-300">
                      <Bike size={24} className="text-yellow-500" />
                      <div className="flex flex-col text-left">
                         <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600">Montaria</span>
                         <span className="font-bold text-white">{user?.bikeModel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {insights && insights !== 'carregando' && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-zinc-950 border border-zinc-900 p-8 md:p-16 rounded-[2.5rem] max-w-2xl w-full relative shadow-3xl">
            <button onClick={() => setInsights(null)} className="absolute top-6 right-6 text-zinc-600 hover:text-white transition-all uppercase font-black text-[9px] tracking-[0.3em]">✕ Fechar</button>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-yellow-500 rounded-2xl"><Shield size={24} className="text-black" /></div>
              <h3 className="text-2xl font-oswald font-black text-white uppercase italic tracking-tighter">Briefing de <span className="text-yellow-500">Missão</span></h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                {insights.safetyTips.map((tip: string, i: number) => (
                  <div key={i} className="flex gap-4 p-5 bg-zinc-900/40 rounded-[1.5rem] border border-zinc-800/40 text-zinc-300 text-sm">
                    <span className="text-yellow-500 font-black italic text-xl">0{i+1}</span>
                    <p className="font-light">{tip}</p>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-yellow-500/5 rounded-[2rem] italic text-zinc-400 text-center">
                <span className="text-white text-lg font-light">"{insights.scenicHighlight}"</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
