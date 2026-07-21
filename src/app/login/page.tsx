import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-jpld.png" alt="Juntos por los Demás" className="h-20 w-auto object-contain mb-6 drop-shadow-sm" />
        <p className="mt-2 text-center text-sm text-slate-500 max-w-sm">
          Plataforma de gestión administrativa y seguimiento de pagos.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-blue-900/5 sm:rounded-2xl sm:px-10 border border-slate-100">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
