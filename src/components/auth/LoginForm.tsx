"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const res = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (res?.error) {
      setError('Credenciales incorrectas');
    } else {
      router.push('/dashboard/cobranza');
      router.refresh();
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md text-center">
          {error}
        </div>
      )}
      <div>
        <Label htmlFor="username">Usuario</Label>
        <div className="mt-1">
          <Input
            id="username"
            name="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="password">Contraseña</Label>
        <div className="mt-1">
          <Input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="admin123"
          />
        </div>
      </div>

      <div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
        </Button>
      </div>
      
      <div className="mt-4 text-xs text-center text-slate-500 space-y-1">
        <p>Mock users para el MVP:</p>
        <p>Admin: admin / admin123</p>
        <p>Staff: staff / staff123</p>
      </div>
    </form>
  );
}
