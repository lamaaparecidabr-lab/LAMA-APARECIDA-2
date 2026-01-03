
import React from 'react';
import { Home, Compass, Map, User, LogOut, Radio, Image as ImageIcon, Shield } from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  onLogout: () => void;
}

const LAMA_LOGO_URL = 'https://i.postimg.cc/q7S7Yp4G/lama-logo.png';

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout }) => {
  const menuItems = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'explorer', icon: Compass, label: 'Radar Destinos' },
    { id: 'my-routes', icon: Map, label: 'Minhas Missões' },
    { id: 'tracking', icon: Radio, label: 'Telemetria' },
    { id: 'gallery', icon: ImageIcon, label: 'Arquivo Fotos' },
    { id: 'profile', icon: User, label: 'Dados Membro' },
  ];

  return (
    <aside className="w-28 md:w-80 bg-black border-r border-zinc-900 flex flex-col h-screen sticky top-0 z-40 transition-all duration-700 shadow-2xl">
      <div className="p-10 flex flex-col md:flex-row items-center gap-5">
        <div className="relative group shrink-0">
          <div className="absolute inset-0 bg-yellow-500/10 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          <img src={LAMA_LOGO_URL} alt="LAMA" className="relative w-14 h-14 object-contain filter drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]" />
        </div>
        <div className="hidden md:block">
           <h1 className="font-oswald text-xl font-black tracking-tighter uppercase italic leading-[0.9] text-white">
            L.A.M.A. <br/><span className="text-yellow-500">Aparecida</span>
          </h1>
        </div>
      </div>

      <nav className="flex-1 px-6 py-12">
        <ul className="space-y-5">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setView(item.id as View)}
                className={`w-full flex items-center gap-6 px-7 py-6 rounded-[2rem] transition-all relative group overflow-hidden ${
                  currentView === item.id
                    ? 'bg-zinc-900/50 text-yellow-500 border border-yellow-500/20 shadow-[0_10px_30px_-10px_rgba(234,179,8,0.2)]'
                    : 'text-zinc-700 hover:bg-zinc-900/20 hover:text-zinc-400'
                }`}
              >
                {currentView === item.id && (
                  <div className="absolute left-0 w-2 h-8 bg-yellow-500 rounded-r-full shadow-[0_0_20px_rgba(234,179,8,0.6)] animate-pulse"></div>
                )}
                <item.icon size={24} className={currentView === item.id ? 'scale-110' : 'group-hover:scale-110 transition-transform duration-500'} />
                <span className="hidden md:block font-black uppercase tracking-[0.25em] text-[10px] italic leading-none">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-8 border-t border-zinc-900/50">
        <div className="bg-zinc-900/30 rounded-3xl p-4 mb-6 hidden md:flex items-center gap-4 border border-zinc-900/50">
           <div className="bg-red-600/10 p-2 rounded-xl"><Shield size={16} className="text-red-600" /></div>
           <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 leading-tight">Nível de Acesso:<br/><span className="text-white">Capitão de Estrada</span></span>
        </div>
        <button 
          onClick={onLogout} 
          className="w-full flex items-center gap-6 px-7 py-6 text-zinc-800 hover:text-red-600 hover:bg-red-600/5 rounded-[2rem] transition-all group"
        >
          <LogOut size={24} className="group-hover:-translate-x-1 transition-transform" />
          <span className="hidden md:block font-black uppercase tracking-[0.25em] text-[10px]">Sair da Sede</span>
        </button>
      </div>
    </aside>
  );
};
