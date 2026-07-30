"use client";

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Users, Trash2, Plus } from 'lucide-react';
import { PatientForm } from './PatientForm';
import { updatePatientStatus } from '@/lib/actions/patient.actions';

type Props = {
  patients: any[];
  groupedServices: any;
  patientCategories: string[];
};

export function PatientList({ patients, groupedServices, patientCategories }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async (patient: any) => {
    if (confirm(`¿Estás seguro de que deseas dar de baja definitiva a ${patient.fullName}?`)) {
      const res = await updatePatientStatus(patient.id, 'INACTIVE', 'Baja solicitada manualmente');
      if (!res.success) alert(res.error || 'Ocurrió un error al dar de baja.');
    }
  };

  const activePatients = patients.filter(p => p.status !== 'INACTIVE');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 mb-6 gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800">Directorio de Pacientes</h1>
          <p className="text-slate-500">Gestiona los datos de los pacientes inscritos.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger render={<Button className="gap-2"><Plus className="w-4 h-4" /> Nuevo Paciente</Button>} />
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Alta de Paciente</DialogTitle>
            </DialogHeader>
            <PatientForm 
              groupedServices={groupedServices} 
              patientCategories={patientCategories} 
              onSuccess={() => setIsOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-blue-900/5 overflow-x-auto">
        <Table className="min-w-[800px] whitespace-nowrap">
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead>Folio</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Servicio Activo</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activePatients.map((patient) => (
              <TableRow key={patient.id} className="hover:bg-slate-50/80">
                <TableCell className="font-semibold text-slate-700">{patient.folio || 'N/A'}</TableCell>
                <TableCell className="font-medium">{patient.fullName}</TableCell>
                <TableCell>{patient.category}</TableCell>
                <TableCell className="text-slate-600">{patient.serviceName} ({patient.frequency}x - {patient.scheduleType})</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(patient)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {activePatients.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <Users className="w-8 h-8 text-slate-300" />
                    <p className="text-lg font-semibold text-slate-700">No hay pacientes activos</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
