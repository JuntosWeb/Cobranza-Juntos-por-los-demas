"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Edit, UserX, UserCheck } from 'lucide-react';
import { createUser, updateUser } from '@/lib/actions/user.actions';

type User = {
  id: string;
  name: string;
  username: string;
  role: string;
  isActive: boolean;
};

export function UsersTab({ users }: { users: User[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', username: '', role: 'STAFF', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openNewUser = () => {
    setEditingUser(null);
    setFormData({ name: '', username: '', role: 'STAFF', password: '' });
    setIsDialogOpen(true);
  };

  const openEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({ name: user.name, username: user.username, role: user.role, password: '' });
    setIsDialogOpen(true);
  };

  const handleToggleActive = async (user: User) => {
    if (confirm(`¿Seguro que deseas ${user.isActive ? 'desactivar' : 'activar'} a ${user.name}?`)) {
      await updateUser(user.id, { isActive: !user.isActive });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (editingUser) {
      const res = await updateUser(editingUser.id, formData);
      if (res.success) setIsDialogOpen(false);
      else alert(res.error);
    } else {
      if (!formData.password) {
        alert('La contraseña es requerida para nuevos usuarios');
        setIsSubmitting(false);
        return;
      }
      const res = await createUser(formData);
      if (res.success) setIsDialogOpen(false);
      else alert(res.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">Personal Autorizado</h3>
          <p className="text-sm text-slate-500">Cuentas con acceso al sistema.</p>
        </div>
        <Button onClick={openNewUser}>
          <UserPlus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Nombre</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(u => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell>{u.username}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {u.role}
                  </span>
                </TableCell>
                <TableCell>
                  {u.isActive ? (
                    <span className="text-green-600 flex items-center text-xs font-medium"><UserCheck className="w-3 h-3 mr-1"/> Activo</span>
                  ) : (
                    <span className="text-red-600 flex items-center text-xs font-medium"><UserX className="w-3 h-3 mr-1"/> Inactivo</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEditUser(u)} title="Editar">
                    <Edit className="w-4 h-4 text-slate-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleToggleActive(u)} title={u.isActive ? 'Desactivar' : 'Activar'}>
                    {u.isActive ? <UserX className="w-4 h-4 text-red-500" /> : <UserCheck className="w-4 h-4 text-green-500" />}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Nombre Completo</Label>
              <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ej. María Gómez" />
            </div>
            <div className="space-y-2">
              <Label>Usuario de acceso (Login)</Label>
              <Input required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="ej. mgomez" disabled={!!editingUser} />
            </div>
            <div className="space-y-2">
              <Label>Rol del Sistema</Label>
              <Select value={formData.role} onValueChange={v => setFormData({...formData, role: (v || '') as string})}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="STAFF">Staff (Caja/Recepción)</SelectItem>
                  <SelectItem value="ADMIN">Administrador (Todo)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{editingUser ? 'Nueva Contraseña (opcional)' : 'Contraseña'}</Label>
              <Input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="********" />
              {editingUser && <p className="text-xs text-slate-500">Deja en blanco para mantener la actual.</p>}
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
