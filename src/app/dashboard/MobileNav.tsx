"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarNav } from "./SidebarNav";
import { LogoutButton } from "@/components/auth/LogoutButton";

export function MobileNav({ role, name, email }: { role?: string, name?: string, email?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
        <Menu className="h-6 w-6 text-slate-700" />
        <span className="sr-only">Toggle menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0 flex flex-col bg-white/95 backdrop-blur-xl">
        <div className="p-8 flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-jpld.png" alt="Juntos por los Demás" className="mb-4 object-contain w-[140px] h-[80px] drop-shadow-sm" />
          <p className="text-[11px] uppercase tracking-widest font-semibold text-slate-400">Sistema de Administración</p>
        </div>
        
        <div className="flex-1 overflow-y-auto" onClick={() => setOpen(false)}>
          <SidebarNav role={role} />
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50/50">
          <div className="mb-4 px-2">
            <p className="text-sm font-semibold text-slate-900 truncate">{name || 'Usuario'}</p>
            <p className="text-xs text-slate-500 truncate">{email}</p>
            <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wide">
              {role}
            </div>
          </div>
          <LogoutButton />
        </div>
      </SheetContent>
    </Sheet>
  );
}
