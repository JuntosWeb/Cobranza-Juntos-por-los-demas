"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { forceGenerateMonthlyCharges } from '@/lib/actions/settings.actions';
import { AlertTriangle } from 'lucide-react';

export function ForceGenerateButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleForceGenerate = async () => {
    if (!confirm('¿Estás seguro de forzar la generación de mensualidades? Solo hazlo si el mes ya inició y los cargos no aparecieron automáticamente.')) return;
    
    setIsLoading(true);
    const res = await forceGenerateMonthlyCharges();
    setIsLoading(false);
    
    if (res.success) {
      alert(res.message);
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="bg-red-50 border border-red-200 p-6 rounded-2xl flex items-center justify-between">
      <div>
        <h3 className="text-red-800 font-bold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Forzar Generación de Mensualidades
        </h3>
        <p className="text-sm text-red-600 mt-1">
          Útil si el servidor automático falló el día 1 del mes. Esto evaluará a todos los pacientes activos y les generará su mensualidad pendiente si aún no la tienen.
        </p>
      </div>
      <Button 
        variant="destructive" 
        onClick={handleForceGenerate}
        disabled={isLoading}
      >
        {isLoading ? 'Generando...' : 'Generar Cargos Faltantes'}
      </Button>
    </div>
  );
}
