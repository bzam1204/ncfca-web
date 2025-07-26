import {auth} from '@/lib/auth';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {CheckCircle, AlertTriangle, XCircle, Clock} from 'lucide-react';
import {familyStatusTranslation, getFamilyStatusVariant} from '@/lib/translations';
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {FamilyStatus} from "@/domain/enums/family-status.enum";
import {getMyFamily} from "@/use-cases/use-my-family.use-case";

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day : '2-digit',
      month : 'long',
      year : 'numeric',
    });
  } catch {
    return 'Data inválida';
  }
};

export default async function AffiliationPage() {
  const session = await auth();
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

  const family = await getMyFamily(session.accessToken);

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

  const statusInfo: Record<FamilyStatus, {icon: React.ElementType, color: string}> = {
    [FamilyStatus.AFFILIATED] : {icon : CheckCircle, color : 'text-green-600'},
    [FamilyStatus.PENDING_PAYMENT] : {icon : Clock, color : 'text-yellow-600'},
    [FamilyStatus.EXPIRED] : {icon : XCircle, color : 'text-red-600'},
    [FamilyStatus.NOT_AFFILIATED] : {icon : AlertTriangle, color : 'text-slate-500'},
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
              O gerenciamento detalhado dos dependentes pode ser feito na seção &quotDependentes&quot.
            </p>
          </CardContent>
        </Card>
      </div>
  );
}
