import { Badge } from '@/components/ui/badge';
import { PatientStatus } from '@prisma/client';

type Props = {
  status: PatientStatus;
  hasPendingTransfer: boolean;
  hasLateFee: boolean;
  isSuspended: boolean;
  paymentColor?: string;
};

export function PaymentStatusBadge({ status, hasPendingTransfer, hasLateFee, isSuspended, paymentColor }: Props) {
  if (isSuspended || status === 'SUSPENDED') {
    return <Badge variant="destructive">Suspendido (Adeudo)</Badge>;
  }

  if (hasPendingTransfer) {
    return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pendiente Validar</Badge>;
  }

  const colorStyles: Record<string, { bg: string, text: string }> = {
    green: { bg: 'bg-emerald-500 hover:bg-emerald-600 text-white', text: 'Pagado (Mes Anterior)' },
    yellow: { bg: 'bg-yellow-400 hover:bg-yellow-500 text-slate-800', text: 'Pagado (1ra Sem)' },
    pink: { bg: 'bg-pink-400 hover:bg-pink-500 text-white', text: 'Pagado (2da Sem)' },
    blue: { bg: 'bg-blue-500 hover:bg-blue-600 text-white', text: 'Pagado (3ra Sem)' },
    purple: { bg: 'bg-purple-500 hover:bg-purple-600 text-white', text: 'Pagado (4ta Sem)' },
    orange: { bg: 'bg-orange-500 hover:bg-orange-600 text-white', text: 'Atraso (>4 Semanas)' },
    red: { bg: 'bg-red-500 hover:bg-red-600 text-white', text: 'Atraso (Mes Actual)' },
    gray: { bg: 'bg-slate-400 hover:bg-slate-500 text-white', text: 'Sin Registro / Al Corriente' }
  };

  const style = paymentColor ? colorStyles[paymentColor] : colorStyles['gray'];

  return <Badge className={style.bg}>{style.text}</Badge>;
}
