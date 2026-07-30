import { getPatientsWithPaymentStatus, getServicePrices } from '@/lib/actions/patient.actions';
import { getSystemSettings } from '@/lib/actions/settings.actions';
import { PatientList } from './PatientList';

export const dynamic = 'force-dynamic';

export default async function PacientesPage() {
  const [patients, servicePrices, settings] = await Promise.all([
    getPatientsWithPaymentStatus(),
    getServicePrices(),
    getSystemSettings()
  ]);

  const groupedServices = servicePrices.reduce((acc, curr) => {
    const sName = curr.service.name;
    if (!acc[sName]) acc[sName] = [];
    acc[sName].push(curr);
    return acc;
  }, {} as Record<string, typeof servicePrices>);

  return (
    <PatientList 
      patients={patients}
      groupedServices={groupedServices} 
      patientCategories={settings?.patientCategories || ['PARTICULAR', 'FUNDACION']} 
    />
  );
}
