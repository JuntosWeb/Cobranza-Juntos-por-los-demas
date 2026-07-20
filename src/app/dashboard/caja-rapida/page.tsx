import { CajaRapidaForm } from './CajaRapidaForm';
import { auth } from '@/auth';

export default async function CajaRapidaPage() {
  const session = await auth();
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Caja Rápida</h1>
        <p className="text-slate-500 mt-2 max-w-lg mx-auto">
          Registra ingresos misceláneos, cobros de valoraciones o pacientes de primera vez sin crear expediente.
        </p>
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <CajaRapidaForm recordedBy={session?.user?.email || 'Desconocido'} />
      </div>
    </div>
  );
}
