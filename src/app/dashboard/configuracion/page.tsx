import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSystemSettings } from '@/lib/actions/settings.actions';
import { getServicesWithPrices } from '@/lib/actions/service.actions';
import { getUsers } from '@/lib/actions/user.actions';
import { RulesTab } from './components/RulesTab';
import { ServicesTab } from './components/ServicesTab';
import { UsersTab } from './components/UsersTab';

export const metadata = {
  title: 'Configuración | Juntos por los Demás'
};

import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function ConfiguracionPage() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    redirect('/dashboard/cobranza');
  }
  const [settings, services, users] = await Promise.all([
    getSystemSettings(),
    getServicesWithPrices(),
    getUsers()
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración del Sistema</h1>
        <p className="text-slate-500 mt-2">
          Administra las reglas operativas, el catálogo de precios y el personal autorizado.
        </p>
      </div>

      <Tabs defaultValue="tarifas" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="tarifas">Catálogo de Tarifas</TabsTrigger>
          <TabsTrigger value="reglas">Reglas Operativas</TabsTrigger>
          <TabsTrigger value="usuarios">Cuentas de Personal</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tarifas">
          <ServicesTab services={services} scheduleTypes={settings.scheduleTypes} />
        </TabsContent>
        
        <TabsContent value="reglas">
          <RulesTab settings={settings} />
        </TabsContent>
        
        <TabsContent value="usuarios">
          <UsersTab users={users} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
