// src/app/dashboard/affiliation/page.tsx

import { auth } from '@/lib/auth';
import { FamilyResponseDto } from '@/contracts/api/family.dto';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { familyStatusTranslation, getFamilyStatusVariant } from '@/lib/translations';
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {FamilyStatus} from "@/domain/enums/family-status.enum";

// Função de busca de dados, executada no servidor.
async function getFamilyData(accessToken: string): Promise<FamilyResponseDto | null> {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  try {
    // O endpoint está alinhado com o openapi.json.
    const res = await fetch(`${BACKEND_URL}/dependants/my-family`, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      // Usamos cache por demanda. A invalidação ocorrerá quando o status da família mudar.
      next: { tags: ['family-status'] },
    });
    if (!res.ok) {
      console.error("API Error:", res.status, await res.text());
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("Network Error fetching family data:", error);
    return null;
  }
}

// Helper para formatar datas de forma segura.
const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  // O bloco try-catch lida com strings de data inválidas que a API possa retornar.
  try {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return 'Data inválida';
  }
};

export default async function AffiliationPage() {
  const session = await auth();

  // Defesa em profundidade: O middleware já deve barrar, mas verificamos novamente.
  if (!session?.accessToken) {
    return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Acesso Negado</AlertTitle>
          <AlertDescription>
            Sessão inválida ou expirada. Por favor, faça o login novamente.
          </AlertDescription>
        </Alert>
    );
  }

  const family = await getFamilyData(session.accessToken);

  if (!family) {
    return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro Crítico</AlertTitle>
          <AlertDescription>
            Não foi possível carregar os dados da sua afiliação no momento. Se o problema persistir, contate o suporte.
          </AlertDescription>
        </Alert>
    );
  }

  // Mapeamento visual para cada status. Robusto e centralizado.
  const statusInfo: Record<FamilyStatus, { icon: React.ElementType, color: string }> = {
    [FamilyStatus.AFFILIATED]: { icon: CheckCircle, color: 'text-green-600' },
    [FamilyStatus.PENDING_PAYMENT]: { icon: Clock, color: 'text-yellow-600' },
    [FamilyStatus.EXPIRED]: { icon: XCircle, color: 'text-red-600' },
    [FamilyStatus.NOT_AFFILIATED]: { icon: AlertTriangle, color: 'text-slate-500' },
  };

  const CurrentStatusIcon = statusInfo[family.status]?.icon || AlertTriangle;
  const currentStatusColor = statusInfo[family.status]?.color || 'text-slate-500';

  return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Minha Afiliação</CardTitle>
            <CardDescription>
              Detalhes sobre o status e a validade da afiliação da sua família.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4 p-4 border bg-muted/50 rounded-lg">
              <CurrentStatusIcon className={`h-10 w-10 flex-shrink-0 ${currentStatusColor}`} />
              <div className="flex-grow">
                <p className="text-sm text-muted-foreground">Status Atual</p>
                <Badge variant={getFamilyStatusVariant(family.status)} className="text-base font-semibold">
                  {familyStatusTranslation[family.status] || 'Status Desconhecido'}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Data da Afiliação</p>
                <p className="text-xl font-semibold">{formatDate(family.affiliatedAt)}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Data de Expiração</p>
                <p className="text-xl font-semibold">{formatDate(family.affiliationExpiresAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Membros da Família</CardTitle>
            <CardDescription>
              Sua afiliação inclui {family.dependants.length} dependente(s).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              O gerenciamento detalhado dos dependentes pode ser feito na seção "Dependentes".
            </p>
          </CardContent>
        </Card>
      </div>
  );
}