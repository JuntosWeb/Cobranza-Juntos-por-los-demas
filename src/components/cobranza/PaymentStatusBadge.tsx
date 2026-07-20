import { Badge } from '@/components/ui/badge';
import { PatientStatus } from '@prisma/client';

type Props = {
  status: PatientStatus;
  hasPendingTransfer: boolean;
  hasLateFee: boolean;
  isSuspended: boolean;
};

export function PaymentStatusBadge({ status, hasPendingTransfer, hasLateFee, isSuspended }: Props) {
  if (isSuspended || status === 'SUSPENDED') {
    return <Badge variant="destructive">Suspendido (Adeudo)</Badge>;
  }

  if (hasPendingTransfer) {
    return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pendiente Validar</Badge>;
  }

  if (hasLateFee) {
    return <Badge className="bg-orange-500 hover:bg-orange-600">Atraso / Con Recargo</Badge>;
  }

  return <Badge className="bg-green-500 hover:bg-green-600">Al Corriente</Badge>;
}
