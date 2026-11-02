"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Thermometer, 
  Smile, 
  ShieldAlert, 
  Power, 
  Bell, 
  LineChart, 
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Environment', href: '/environment', icon: Thermometer },
    { name: 'Attendance', href: '/attendance', icon: Users },
    { name: 'Engagement', href: '/engagement', icon: Smile },
    { name: 'Safety', href: '/safety', icon: ShieldAlert },
    { name: 'Automation', href: '/automation', icon: Power },
    { name: 'Alerts', href: '/alerts', icon: Bell },
    { name: 'Analytics', href: '/analytics', icon: LineChart },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-slate-950 border-r border-slate-800 p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center">
          <span className="font-bold text-white text-xl">S</span>
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-100">SmartClass AI</span>
      </div>
      
      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-blue-600/10 text-blue-500" 
                  : "text-slate-400 hover:text-slate-50 hover:bg-slate-900"
              )}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto border-t border-slate-800 pt-4 px-2">
        <div className="text-xs text-slate-500 font-medium">SYSTEM STATUS</div>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-sm text-slate-300">Phase 1: Simulation</span>
        </div>
      </div>
    </div>
  );
}
