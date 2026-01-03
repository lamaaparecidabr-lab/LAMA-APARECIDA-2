
import React from 'react';
import { Home, Compass, Map, User, LogOut, Radio, Image as ImageIcon, Shield } from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  onLogout: () => void;
}

const LAMA_LOGO_URL = 'https://raw.githubusercontent.com/lamaaparecidabr-lab/LAMA-APARECIDA/411b86094f7e7539386b7340eb607162cae150b5/components/logo.jpg';

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout }) => {
  const menuItems = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'explorer', icon: Compass, label: 'Icônicas' },
    { id: 'tracking', icon: Radio, label: 'Gravar' },
    { id: 'my-routes', icon: Map, label: 'Rotas' },
    { id: 'gallery', icon: ImageIcon, label: 'Galeria' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-80 bg-black border-r border-zinc-900 flex-col h-screen sticky top-0 z-40 transition-all duration-700 shadow-2xl">
        <div className="p-10 flex flex-row items-center gap-6">
          <div className="relative group shrink-0">
            <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            <img src={LAMA_LOGO_URL} alt="LAMA" className="relative w-16 h-16 object-contain filter drop-shadow-[0_0_15px_rgba(234,179,8,0.4)] transform group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="relative">
            <div className="flex flex-col">
              <h1 className="font-oswald text-3xl font-black tracking-[0.10em] uppercase italic leading-[0.75] text-white">
                L.A.M.A.
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-yellow-500 font-black uppercase tracking-[0.2em] text-[15px] font-oswald italic">Aparecida</span>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-6 py-8">
          <ul className="space-y-4">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setView(item.id as View)}
                  className={`w-full flex items-center gap-6 px-7 py-5 rounded-[2rem] transition-all relative group overflow-hidden ${
                    currentView === item.id
                      ? 'bg-zinc-900/50 text-yellow-500 border border-yellow-500/20 shadow-[0_10px_30px_-10px_rgba(234,179,8,0.2)]'
                      : 'text-zinc-700 hover:bg-zinc-900/20 hover:text-zinc-400'
                  }`}
                >
                  {currentView === item.id && (
                    <div className="absolute left-0 w-2 h-8 bg-yellow-500 rounded-r-full shadow-[0_0_20px_rgba(234,179,8,0.6)] animate-pulse"></div>
                  )}
                  <item.icon size={22} className={currentView === item.id ? 'scale-110' : 'group-hover:scale-110 transition-transform duration-500'} />
                  <span className="font-black uppercase tracking-[0.25em] text-[10px] italic leading-none">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-8 border-t border-zinc-900/50">
          <div className="bg-zinc-900/30 rounded-3xl p-4 mb-6 flex items-center gap-4 border border-zinc-900/50 group hover:border-red-600/30 transition-colors">
             <div className="bg-red-600/10 p-2 rounded-xl group-hover:bg-red-600/20 transition-colors"><Shield size={16} className="text-red-600" /></div>
             <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 leading-tight">Nível de Acesso:<br/><span className="text-white">Capitão de Estrada</span></span>
          </div>
          <button 
            onClick={onLogout} 
            className="w-full flex items-center gap-6 px-7 py-6 text-zinc-800 hover:text-red-600 hover:bg-red-600/5 rounded-[2rem] transition-all group"
          >
            <LogOut size={24} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-black uppercase tracking-[0.25em] text-[10px]">Sair</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation - Increased Z-Index to avoid map overlap */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-2xl border-t border-zinc-900 px-2 py-3 z-[2000] flex justify-around items-center shadow-[0_-15px_50px_rgba(0,0,0,0.9)]">
        {menuItems.slice(0, 4).map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as View)}
            className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-2xl transition-all ${
              currentView === item.id ? 'text-yellow-500' : 'text-zinc-600'
            }`}
          >
            <item.icon size={20} strokeWidth={currentView === item.id ? 3 : 2} />
            <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
        <button
          onClick={onLogout}
          className="flex flex-col items-center gap-1.5 px-3 py-2 text-red-600/70"
        >
          <LogOut size={20} />
          <span className="text-[9px] font-black uppercase tracking-widest">Sair</span>
        </button>
      </nav>
    </>
  );
};
