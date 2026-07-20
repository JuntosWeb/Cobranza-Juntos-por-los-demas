import Link from 'next/link';
import { Receipt, Users, CheckSquare, Zap, HeartHandshake, BarChart3 } from 'lucide-react';
import { auth } from '@/auth';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { SettingsModal } from '@/components/SettingsModal';
import { getSystemSettings } from '@/lib/actions/settings.actions';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const settings = await getSystemSettings();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-6 flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-jpld.png" alt="Juntos por los Demás" className="mb-3 object-contain w-[140px] h-[80px]" />
          <p className="text-xs text-slate-500 mt-1">Sistema de Administración</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/dashboard/cobranza" className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-700 hover:bg-primary/10 hover:text-primary transition-colors font-medium">
            <Receipt className="w-5 h-5 text-primary/70" />
            Cobranza
          </Link>
          <Link href="/dashboard/caja-rapida" className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-700 hover:bg-primary/10 hover:text-primary transition-colors font-medium">
            <Zap className="w-5 h-5 text-primary/70" />
            Caja Rápida
          </Link>
          <Link href="/dashboard/padrinos" className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-700 hover:bg-primary/10 hover:text-primary transition-colors font-medium">
            <HeartHandshake className="w-5 h-5 text-primary/70" />
            Padrinos
          </Link>
          <Link href="/dashboard/reportes" className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-700 hover:bg-primary/10 hover:text-primary transition-colors font-medium">
            <BarChart3 className="w-5 h-5 text-primary/70" />
            Reportes
          </Link>
          <Link href="/dashboard/conciliacion" className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-700 hover:bg-primary/10 hover:text-primary transition-colors font-medium">
            <CheckSquare className="w-5 h-5 text-primary/70" />
            Conciliación
          </Link>
          <Link href="/dashboard/pacientes" className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-700 hover:bg-primary/10 hover:text-primary transition-colors font-medium">
            <Users className="w-5 h-5 text-primary/70" />
            Pacientes
          </Link>
        </nav>

        <div className="p-4 border-t">
          <div className="mb-4 px-3">
            <p className="text-sm font-medium text-slate-900">{session?.user?.name || 'Usuario'}</p>
            <p className="text-xs text-slate-500 truncate">{session?.user?.email}</p>
            <p className="text-xs text-primary mt-1 font-semibold">Rol: {session?.user?.role}</p>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b h-14 flex items-center justify-end px-6 shadow-sm shrink-0">
          <SettingsModal settings={settings} />
        </header>
        <div className="p-8 flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
