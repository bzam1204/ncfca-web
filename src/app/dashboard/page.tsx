import {auth} from '@/lib/auth'; // Importamos a função 'auth'

export default async function DashboardPage() {
  const session = await auth();
  return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2">Bem-vindo, {session?.user.name || session?.user.email}.</p>
        <div className="mt-6 p-4 border rounded-lg bg-slate-50">
          <h2 className="text-xl font-semibold">Dados da Sessão (Servidor)</h2>
          <pre className="mt-2 text-sm bg-slate-900 max-w-full text-white p-4 rounded-md overflow-x-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
        </div>
      </div>
  );
}