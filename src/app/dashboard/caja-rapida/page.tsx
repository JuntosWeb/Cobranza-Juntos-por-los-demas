import { CajaRapidaForm } from './CajaRapidaForm';
import { CajaRapidaGastosForm } from './CajaRapidaGastosForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';



export default async function CajaRapidaPage() {
  const session = await auth();
  const recordedBy = session?.user?.email || 'Desconocido';

  const recentExpenses = await prisma.expense.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Caja Rápida / Vales de Efectivo</h1>
        <p className="text-slate-500 mt-2 max-w-lg mx-auto">
          Registra ingresos misceláneos o salidas de efectivo (gastos).
        </p>
      </div>
      
      <Tabs defaultValue="ingreso" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="ingreso">Registrar Ingreso (Valoración)</TabsTrigger>
          <TabsTrigger value="gasto">Registrar Salida (Vale/Gasto)</TabsTrigger>
        </TabsList>
        <TabsContent value="ingreso">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <CajaRapidaForm recordedBy={recordedBy} />
          </div>
        </TabsContent>
        <TabsContent value="gasto">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <CajaRapidaGastosForm 
              recordedBy={recordedBy} 
              recentExpenses={recentExpenses} 
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
