"use client";
import { Bell, User } from 'lucide-react';
import { useSimulation } from '@/contexts/SimulationContext';

export function Header() {
  const { isDemoRunning } = useSimulation();

  return (
    <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-slate-100 hidden sm:block">ETC Smart Classroom 01</h2>
        <div className="bg-blue-900/50 text-blue-400 border border-blue-800/50 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          SIMULATION MODE
        </div>
        {isDemoRunning && (
           <div className="bg-amber-900/50 text-amber-400 border border-amber-800/50 px-3 py-1 rounded-full text-xs font-medium animate-pulse">
             FULL DEMO RUNNING
           </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:text-slate-100 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-950"></span>
        </button>
        <div className="flex items-center gap-2 pl-4 border-l border-slate-800">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-slate-200">Demo Faculty</div>
            <div className="text-xs text-slate-500">Teacher Admin</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
            <User className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
