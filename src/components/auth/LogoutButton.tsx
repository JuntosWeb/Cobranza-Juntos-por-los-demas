"use client";

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-md text-red-600 hover:bg-red-50 font-medium"
    >
      <LogOut className="w-5 h-5" />
      Cerrar Sesión
    </button>
  );
}
