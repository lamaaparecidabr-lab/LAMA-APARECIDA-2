
import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, MapPin, Gauge, Clock, Radio, Shield } from 'lucide-react';
import { RoutePoint } from '../types';
import { MapView } from './MapView';

export const RouteTracker: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [points, setPoints] = useState<RoutePoint[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    let interval: any;
    if (isRecording && startTime) {
      interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, startTime]);

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não suportada.");
      return;
    }

    setIsRecording(true);
    setStartTime(Date.now());
    setPoints([]);

    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const newPoint = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timestamp: pos.timestamp,
        };
        setPoints(prev => [...prev, newPoint]);
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
  };

  const stopTracking = () => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
    }
    setIsRecording(false);
    setStartTime(null);
    setElapsed(0);
    alert("Percurso salvo com sucesso na sede virtual!");
  };

  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
          <h2 className="text-5xl font-oswald font-black uppercase tracking-tighter text-white italic">
            Gravar <span className="text-yellow-500">Rota</span>
          </h2>
        </div>
        <p className="text-yellow-500/60 font-black uppercase tracking-[0.2em] text-[10px] ml-5">Monitoramento de Telemetria em Tempo Real</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3">
          <MapView points={points} className="h-[600px] border-yellow-500/10 shadow-2xl rounded-[3rem]" isInteractive />
        </div>

        <div className="space-y-8">
          <div className="bg-zinc-950 p-10 rounded-[2.5rem] border border-zinc-900 space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 blur-2xl"></div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 font-black uppercase text-[10px] tracking-widest flex items-center gap-2"><Clock size={16} className="text-yellow-500" /> Tempo</span>
                <span className="text-3xl font-mono text-white font-black italic">{formatTime(elapsed)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-zinc-900 pt-6">
                <span className="text-zinc-600 font-black uppercase text-[10px] tracking-widest flex items-center gap-2"><Gauge size={16} className="text-red-600" /> Km Rodados</span>
                <span className="text-3xl font-mono text-white font-black italic">{(points.length * 0.05).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-zinc-900 pt-6">
                <span className="text-zinc-600 font-black uppercase text-[10px] tracking-widest flex items-center gap-2"><MapPin size={16} className="text-yellow-500" /> Checkpoints</span>
                <span className="text-3xl font-mono text-white font-black italic">{points.length}</span>
              </div>
            </div>
          </div>

          {!isRecording ? (
            <button
              onClick={startTracking}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-6 rounded-[2rem] font-black text-xs transition-all shadow-xl shadow-yellow-500/20 uppercase tracking-[0.25em] flex items-center justify-center gap-3"
            >
              <Play fill="currentColor" size={20} /> Gravar Rota
            </button>
          ) : (
            <button
              onClick={stopTracking}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-6 rounded-[2rem] font-black text-xs transition-all shadow-xl shadow-red-600/20 uppercase tracking-[0.25em] flex items-center justify-center gap-3 animate-pulse"
            >
              <Square fill="currentColor" size={20} /> Encerrar Missão
            </button>
          )}

          <div className="bg-zinc-900/30 p-6 rounded-2xl border border-zinc-800 flex items-center gap-4">
             <Shield className="text-red-600 shrink-0" size={20} />
             <p className="text-[10px] text-zinc-500 font-bold uppercase leading-relaxed italic">Sua localização é enviada apenas para o radar interno do motoclube.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
