import { getServicePrices } from '@/lib/actions/patient.actions';
import { PatientForm } from './PatientForm';

export const dynamic = 'force-dynamic';

export default async function PacientesPage() {
  const servicePrices = await getServicePrices();

  // Agrupamos por servicio para el frontend
  const groupedServices = servicePrices.reduce((acc, curr) => {
    const sName = curr.service.name;
    if (!acc[sName]) acc[sName] = [];
    acc[sName].push(curr);
    return acc;
  }, {} as Record<string, typeof servicePrices>);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Alta de Paciente</h1>
        <p className="text-slate-500 mt-2 max-w-lg mx-auto">
          Registra un nuevo paciente en el sistema y asígnale su servicio base para generar automáticamente los cargos mensuales.
        </p>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-blue-900/5 p-8">
        <PatientForm groupedServices={groupedServices} />
      </div>
    </div>
  );
}
