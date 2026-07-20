import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

type Sponsor = {
  id: string;
  name: string;
  birthday: Date | null;
  whatsapp: string | null;
};

type Props = {
  sponsors: Sponsor[];
};

export function BirthdaysWidget({ sponsors }: Props) {
  const currentMonth = new Date().getMonth();
  const birthdaysThisMonth = sponsors.filter(s => 
    s.birthday && new Date(s.birthday).getMonth() === currentMonth
  ).sort((a, b) => new Date(a.birthday!).getDate() - new Date(b.birthday!).getDate());

  if (birthdaysThisMonth.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 mb-6 flex items-center shadow-sm">
      <div className="text-3xl mr-4">🎂</div>
      <div className="flex-1">
        <h3 className="font-bold text-blue-900">Cumpleaños del Mes</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {birthdaysThisMonth.map(s => (
            <Badge key={s.id} variant="outline" className="bg-white border-blue-200 text-blue-800 py-1">
              <span className="font-semibold mr-1">{format(new Date(s.birthday!), "d 'de' MMMM", { locale: es })}:</span>
              {s.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
