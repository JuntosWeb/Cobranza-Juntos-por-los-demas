"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Tag, Archive } from 'lucide-react';
import { createService, deleteService, updateService, upsertServicePrice, deactivateServicePrice } from '@/lib/actions/service.actions';

type ServicePrice = {
  id: string;
  frequency: number;
  scheduleType: string;
  monthlyPrice: number;
  isActive: boolean;
};

type Service = {
  id: string;
  name: string;
  prices: ServicePrice[];
};

export function ServicesTab({ services, scheduleTypes = ['A', 'B', 'C'] }: { services: Service[], scheduleTypes?: string[] }) {
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [newServiceName, setNewServiceName] = useState('');
  
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [editingPrice, setEditingPrice] = useState<ServicePrice | null>(null);
  const [priceForm, setPriceForm] = useState({ frequency: 1, scheduleType: scheduleTypes[0] || 'A', monthlyPrice: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = editingServiceId 
      ? await updateService(editingServiceId, newServiceName)
      : await createService(newServiceName);
      
    if (res.success) {
      setIsServiceOpen(false);
      setNewServiceName('');
      setEditingServiceId(null);
    } else alert(res.error);
    setIsSubmitting(false);
  };

  const handleDeleteService = async (id: string) => {
    if (confirm('¿Seguro que deseas eliminar este servicio?')) {
      const res = await deleteService(id);
      if (!res.success) alert(res.error);
    }
  };

  const openNewPrice = (srv: Service) => {
    setSelectedService(srv);
    setEditingPrice(null);
    setPriceForm({ frequency: 1, scheduleType: 'A', monthlyPrice: 0 });
    setIsPriceOpen(true);
  };

  const openEditPrice = (srv: Service, price: ServicePrice) => {
    setSelectedService(srv);
    setEditingPrice(price);
    setPriceForm({ frequency: price.frequency, scheduleType: price.scheduleType, monthlyPrice: price.monthlyPrice });
    setIsPriceOpen(true);
  };

  const handleSavePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;
    setIsSubmitting(true);
    const res = await upsertServicePrice({
      id: editingPrice?.id,
      serviceId: selectedService.id,
      frequency: priceForm.frequency,
      scheduleType: priceForm.scheduleType,
      monthlyPrice: priceForm.monthlyPrice,
    });
    if (res.success) setIsPriceOpen(false);
    else alert(res.error);
    setIsSubmitting(false);
  };

  const handleDeactivatePrice = async (id: string) => {
    if (confirm('¿Seguro que deseas desactivar este precio? Ya no estará disponible para nuevos cobros.')) {
      await deactivateServicePrice(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
        <div>
          <h3 className="text-lg font-semibold">Catálogo de Servicios y Precios</h3>
          <p className="text-sm text-slate-500">Administra las modalidades y tarifas vigentes.</p>
        </div>
        <Button onClick={() => setIsServiceOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Servicio
        </Button>
      </div>

      <div className="grid gap-6">
        {services.map(srv => (
          <div key={srv.id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="bg-slate-50 p-4 border-b flex justify-between items-center">
              <h4 className="font-bold text-slate-800 flex items-center">
                <Tag className="w-4 h-4 mr-2 text-primary" />
                {srv.name}
              </h4>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openNewPrice(srv)}>
                  <Plus className="w-4 h-4 mr-1" /> Agregar Tarifa
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800" onClick={() => {
                  setEditingServiceId(srv.id);
                  setNewServiceName(srv.name);
                  setIsServiceOpen(true);
                }}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteService(srv.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-0">
              {srv.prices.length === 0 ? (
                <p className="text-sm text-slate-500 p-4 text-center">No hay tarifas configuradas para este servicio.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Frecuencia</TableHead>
                      <TableHead>Horario</TableHead>
                      <TableHead>Precio Mensual</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {srv.prices.map(p => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.frequency}x por semana</TableCell>
                        <TableCell>Horario {p.scheduleType}</TableCell>
                        <TableCell>${p.monthlyPrice.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => openEditPrice(srv, p)}>
                            <Edit className="w-4 h-4 text-slate-500" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeactivatePrice(p.id)} title="Desactivar tarifa">
                            <Archive className="w-4 h-4 text-orange-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* modal pa nuevo o editar servicio */}
      <Dialog open={isServiceOpen} onOpenChange={(open) => {
        setIsServiceOpen(open);
        if (!open) { setEditingServiceId(null); setNewServiceName(''); }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingServiceId ? 'Editar Servicio' : 'Nuevo Servicio'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddService} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Nombre del Servicio</Label>
              <Input required value={newServiceName} onChange={e => setNewServiceName(e.target.value)} placeholder="Ej. NATACIÓN" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsServiceOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}>Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* modal para tarifa */}
      <Dialog open={isPriceOpen} onOpenChange={setIsPriceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPrice ? 'Editar Tarifa' : 'Nueva Tarifa'} - {selectedService?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSavePrice} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Frecuencia (veces x sem)</Label>
                <Input type="number" min="1" max="5" required value={priceForm.frequency} onChange={e => setPriceForm({...priceForm, frequency: Number(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <Label>Tipo de Horario</Label>
                <Select 
                  value={priceForm.scheduleType} 
                  onValueChange={v => setPriceForm({...priceForm, scheduleType: (v || '') as string})}
                >
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    {scheduleTypes.map(type => (
                      <SelectItem key={type} value={type}>Horario {type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Costo Mensual Base ($)</Label>
              <Input type="number" min="0" step="0.01" required value={priceForm.monthlyPrice} onChange={e => setPriceForm({...priceForm, monthlyPrice: Number(e.target.value)})} />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsPriceOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}>Guardar Tarifa</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
