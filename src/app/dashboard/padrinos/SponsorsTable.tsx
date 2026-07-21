"use client";

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, DollarSign, History, HeartHandshake } from 'lucide-react';
import { SponsorModal } from './SponsorModal';
import { SponsorPaymentModal } from './SponsorPaymentModal';
import { SponsorPaymentHistoryModal } from './SponsorPaymentHistoryModal';

type Props = {
  sponsors: any[];
};

const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

export function SponsorsTable({ sponsors }: Props) {
  const [editingSponsor, setEditingSponsor] = useState<any | null>(null);
  const [payingSponsor, setPayingSponsor] = useState<any | null>(null);
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historySponsor, setHistorySponsor] = useState<any | null>(null);

  const hasPaidMonth = (sponsor: any, monthPrefix: string) => {
    // Checking if there is a payment that covers this month
    return sponsor.sponsorPayments.some((p: any) => 
      p.periodCovered && p.periodCovered.toUpperCase().includes(monthPrefix)
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Button 
          onClick={() => { setEditingSponsor(null); setIsSponsorModalOpen(true); }} 
          className="rounded-xl shadow-xl shadow-primary/20 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 px-6 font-semibold"
        >
          + Nuevo Padrino
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-blue-900/5 overflow-x-auto overflow-y-hidden">
        <Table className="min-w-[1200px]">
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[250px]">Padrino / Datos</TableHead>
              <TableHead>Ahijados</TableHead>
              {MONTHS.map(m => (
                <TableHead key={m} className="text-center text-xs">{m}</TableHead>
              ))}
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sponsors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={15} className="text-center py-20">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                      <HeartHandshake className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-lg font-semibold text-slate-700">No hay padrinos registrados</p>
                    <p className="text-sm text-slate-500">Haz clic en "Nuevo Padrino" para comenzar.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sponsors.map((sponsor) => {
                return (
                  <TableRow key={sponsor.id} className="hover:bg-slate-50/80 transition-colors duration-200">
                    <TableCell>
                      <div className="font-medium">{sponsor.name}</div>
                      <div className="text-xs text-slate-500">
                        Folio: {sponsor.folio || 'N/A'} | {sponsor.periodicity}
                      </div>
                      <div className="text-xs font-semibold text-green-700">
                        Cuota: ${sponsor.monthlyCommitment.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {sponsor.patients.length === 0 && <span className="text-xs text-slate-500">Sin ahijados</span>}
                        {sponsor.patients.map((p: any) => (
                          <span key={p.id} className="text-xs">
                            • {p.fullName}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    
                    {MONTHS.map(m => {
                      const paid = hasPaidMonth(sponsor, m);
                      return (
                        <TableCell key={m} className="text-center p-1">
                          {paid ? (
                            <div className="w-6 h-6 mx-auto bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-[10px] font-bold">✓</span>
                            </div>
                          ) : (
                            <div className="w-6 h-6 mx-auto border-2 border-slate-200 rounded-full"></div>
                          )}
                        </TableCell>
                      );
                    })}

                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => { setHistorySponsor(sponsor); setIsHistoryModalOpen(true); }}
                        title="Ver Historial / Anular"
                        className="hover:bg-slate-100 hover:text-blue-600 transition-colors"
                      >
                        <History className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => { setPayingSponsor(sponsor); setIsPaymentModalOpen(true); }}
                        title="Registrar Pago"
                        className="hover:bg-green-50 hover:border-green-200 transition-colors"
                      >
                        <DollarSign className="w-4 h-4 text-green-600" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => { setEditingSponsor(sponsor); setIsSponsorModalOpen(true); }}
                        title="Editar Padrino"
                        className="hover:bg-slate-100 transition-colors"
                      >
                        <Edit className="w-4 h-4 text-slate-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {isSponsorModalOpen && (
        <SponsorModal 
          isOpen={isSponsorModalOpen} 
          onClose={() => setIsSponsorModalOpen(false)} 
          sponsor={editingSponsor}
        />
      )}

      {isPaymentModalOpen && payingSponsor && (
        <SponsorPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          sponsor={payingSponsor}
        />
      )}

      {isHistoryModalOpen && historySponsor && (
        <SponsorPaymentHistoryModal
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          sponsor={historySponsor}
        />
      )}
    </div>
  );
}
