import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";
import Link from "next/link";
import {UserRoles} from "@/domain/enums/user.roles";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertTriangle, User, Home, Users as FamilyIcon, ChevronLeft} from "lucide-react";
import {FamilyResponseDto} from "@/contracts/api/family.dto";
import {DependantRelationshipTranslation} from "@/domain/enums/dependant-relationship.enum";
import {Button} from "@/components/ui/button";
import {UserActions} from "./_components/user-actions";
import {UserDto} from "@/contracts/api/user.dto";
import {Badge} from "@/components/ui/badge";

async function getUserFamily(userId: string, accessToken: string): Promise<{
  user: UserDto;
  family: FamilyResponseDto
} | null> {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const res = await fetch(`${BACKEND_URL}/admin/users/${userId}/family`, {
    headers : {'Authorization' : `Bearer ${accessToken}`},
    cache : 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

const InfoField = ({label, value}: {label: string; value: React.ReactNode}) => (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base font-semibold">{value || 'Não informado'}</p>
    </div>
);

const calculateAge = (birthdate: string) => {
  const birthDate = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};

export default async function UserDetailsPage({params}: {params: Promise<{userId: string}>}) {
  const {userId} = await params;
  const session = await auth();
  if (!session?.accessToken || !session.user.roles.includes(UserRoles.ADMIN)) {
    redirect('/login');
  }
  const familyData = await getUserFamily(userId, session.accessToken);
  if (!familyData || !familyData) { 
    return (
        <div className="space-y-4">
          <Button variant="outline" asChild>
            <Link href="/admin/dashboard/users"><ChevronLeft className="mr-2 h-4 w-4" /> Voltar para Usuários</Link>
          </Button>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>Não foi possível carregar os dados para este usuário ou a família não foi encontrada.</AlertDescription>
          </Alert>
        </div>
    );
  }

  const {dependants} = familyData.family;
  const holder = familyData.user;

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" asChild>
            <Link href="/admin/dashboard/users"><ChevronLeft className="mr-2 h-4 w-4" /> Voltar para Usuários</Link>
          </Button>
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
                        <TableCell>{calculateAge(dep.birthdate)} anos</TableCell>
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
