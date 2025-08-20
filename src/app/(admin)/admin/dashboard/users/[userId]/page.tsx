import {auth} from "@/infraestructure/auth";
import {redirect} from "next/navigation";
import {UserRoles} from "@/domain/enums/user.roles";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertTriangle, User, Home, Users as FamilyIcon} from "lucide-react";
import {DependantRelationshipTranslation} from "@/domain/enums/dependant-relationship.enum";
import {BackButton} from "@/components/ui/back-button";
import {UserActions} from "./_components/user-actions";
import {Badge} from "@/components/ui/badge";
import {Dependant} from "@/domain/entities/dependant.entity";
import {getUserFamilyAction} from "@/infraestructure/actions/admin/get-user-family.action";

const InfoField = ({label, value}: {label: string; value: React.ReactNode}) => (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base font-semibold">{value || 'Não informado'}</p>
    </div>
);

export default async function UserDetailsPage({params}: {params: Promise<{userId: string}>}) {
  const {userId} = await params;
  const session = await auth();
  if (!session?.accessToken || !session.user.roles.includes(UserRoles.ADMIN)) {
    redirect('/login');
  }
  const familyData = await getUserFamilyAction(userId).catch(() => null);
  if (!familyData || !familyData) {
    return (
        <div className="space-y-4">
          <BackButton>Voltar</BackButton>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>Não foi possível carregar os dados para este usuário ou a família não foi encontrada.</AlertDescription>
          </Alert>
        </div>
    );
  }

  const dependants = familyData.family.dependants.map((d: any) => new Dependant(d));
  const holder = familyData.user;

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <BackButton>Voltar</BackButton>
          <UserActions user={holder} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <User className="h-6 w-6" /> Dossiê do Responsável
            </CardTitle>
            <CardDescription>
              Informações pessoais e de contato de {holder.firstName} {holder.lastName}.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoField label="Nome Completo" value={`${holder.firstName} ${holder.lastName}`} />
            <InfoField label="Email" value={holder.email} />
            <InfoField label="Telefone" value={holder.phone} />
            <InfoField label="CPF" value={holder.cpf} />
            <InfoField label="Perfis" value={
              holder.roles.map(role => <Badge className="mr-2 mt-2" key={role} variant="secondary">{role}</Badge>)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3"><Home className="h-6 w-6" /> Endereço</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoField label="Logradouro" value={`${holder.address.street}, ${holder.address.number}`} />
            <InfoField label="Bairro" value={holder.address.district} />
            <InfoField label="Cidade / UF" value={`${holder.address.city} / ${holder.address.state}`} />
            <InfoField label="CEP" value={holder.address.zipCode} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3"><FamilyIcon
                className="h-6 w-6" /> Dependentes ({dependants.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Idade</TableHead>
                    <TableHead>Parentesco</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dependants.length > 0 ? dependants.map(dep => (
                      <TableRow key={dep.id}>
                        <TableCell>{dep.firstName} {dep.lastName}</TableCell>
                        <TableCell>{dep.getAge()} anos</TableCell>
                        <TableCell>{DependantRelationshipTranslation[dep.relationship]}</TableCell>
                      </TableRow>
                  )) : (
                      <TableRow>
                        <TableCell colSpan={3}
                                   className="h-24 text-center">Nenhum dependente cadastrado para esta família.</TableCell>
                      </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
