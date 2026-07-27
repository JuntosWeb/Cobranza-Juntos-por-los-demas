"use client";

import { Printer } from 'lucide-react';

export function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2"
    >
      <Printer className="w-5 h-5" />
      Imprimir Recibo
    </button>
  );
}
