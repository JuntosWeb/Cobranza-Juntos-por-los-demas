import Link from 'next/link';
import { Receipt, Users, CheckSquare, Zap, HeartHandshake, BarChart3, Settings } from 'lucide-react';
import { auth } from '@/auth';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { SidebarNav } from './SidebarNav';
import { MobileNav } from './MobileNav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row font-outfit">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden md:flex w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 flex-col z-20 shadow-xl shadow-slate-200/20 shrink-0">
        <div className="p-8 flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-jpld.png" alt="Juntos por los Demás" className="mb-4 object-contain w-[140px] h-[80px] drop-shadow-sm" />
          <p className="text-[11px] uppercase tracking-widest font-semibold text-slate-400">Sistema de Administración</p>
        </div>
        
        <SidebarNav role={session?.user?.role} />

        <div className="p-5 border-t border-slate-100 bg-slate-50/50">
          <div className="mb-4 px-2">
            <p className="text-sm font-semibold text-slate-900 truncate">{session?.user?.name || 'Usuario'}</p>
            <p className="text-xs text-slate-500 truncate">{session?.user?.email}</p>
            <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wide">
              {session?.user?.role}
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header Blur effect */}
        <header className="absolute top-0 w-full h-16 bg-slate-50/80 backdrop-blur-md border-b border-slate-200/50 flex items-center justify-between md:justify-end px-4 md:px-8 z-10">
          <div className="md:hidden flex items-center">
            <MobileNav role={session?.user?.role} name={session?.user?.name || ''} email={session?.user?.email || ''} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-jpld.png" alt="Logo" className="ml-2 h-8 object-contain drop-shadow-sm" />
          </div>
          <div className="flex items-center gap-4">
            {/* Future header items can go here */}
          </div>
        </header>
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pt-20 md:pt-24 pb-12 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
