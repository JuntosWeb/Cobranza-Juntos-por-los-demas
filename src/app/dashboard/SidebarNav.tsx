"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Receipt, Users, CheckSquare, Zap, HeartHandshake, BarChart3, Settings } from 'lucide-react';

type Props = {
  role?: string;
};

export function SidebarNav({ role }: Props) {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard/cobranza', icon: Receipt, label: 'Cobranza' },
    { href: '/dashboard/caja-rapida', icon: Zap, label: 'Caja Rápida' },
    { href: '/dashboard/padrinos', icon: HeartHandshake, label: 'Padrinos' },
    { href: '/dashboard/reportes', icon: BarChart3, label: 'Reportes' },
    { href: '/dashboard/conciliacion', icon: CheckSquare, label: 'Conciliación' },
    { href: '/dashboard/pacientes', icon: Users, label: 'Pacientes' },
  ];

  if (role === 'ADMIN') {
    navItems.push({ href: '/dashboard/configuracion', icon: Settings, label: 'Configuración' });
  }

  return (
    <nav className="flex-1 px-4 space-y-1.5 mt-6">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 group ${isActive ? 'bg-primary/10 text-primary shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-primary/70'}`} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
