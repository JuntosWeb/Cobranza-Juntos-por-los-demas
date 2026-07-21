import { getSponsors } from '@/lib/actions/sponsor.actions';
import { SponsorsTable } from './SponsorsTable';
import { BirthdaysWidget } from './BirthdaysWidget';

export const dynamic = 'force-dynamic';

export default async function PadrinosPage() {
  const sponsors = await getSponsors();

  return (
    <div className="space-y-6">
      <BirthdaysWidget sponsors={sponsors} />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 mb-6 gap-4 sm:gap-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Padrinos CRM</h1>
          <p className="text-slate-500 mt-1">Control administrativo y seguimiento de pagos de donantes.</p>
        </div>
      </div>
      <SponsorsTable sponsors={sponsors} />
    </div>
  );
}
