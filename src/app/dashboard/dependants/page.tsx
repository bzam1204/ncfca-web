// src/app/dashboard/dependants/page.tsx

import {auth} from "@/lib/auth";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {MoreHorizontal} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Dependant} from "@/domain/entities/entities";

// Função de busca de dados executada no servidor
async function getDependants(accessToken: string): Promise<Dependant[]> {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  try {
    const res = await fetch(`${BACKEND_URL}/dependants`, {
      headers : {'Authorization' : `Bearer ${accessToken}`},
      cache : 'no-store', // Sempre buscar dados frescos para esta lista
    });
    if (!res.ok) {
      console.error("Falha ao buscar dependentes:", res.status, await res.text());
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Erro de rede ao buscar dependentes:", error);
    return [];
  }
}

export default async function DependantsPage() {
  const session = await auth();
  const dependants = await getDependants(session?.accessToken ?? '');

  return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Dependentes</CardTitle>
            <CardDescription>
              Gestão dos membros da sua família.
            </CardDescription>
          </div>
          <Button>Adicionar Dependente</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Idade</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dependants.length > 0 ? (
                  dependants.map((dependant) => (
                      <TableRow key={dependant.id}>
                        <TableCell className="font-medium">{`${dependant.firstName} ${dependant.lastName}`}</TableCell>
                        <TableCell className="hidden md:table-cell">{dependant.email || (session?.user.email ?? 'N/A')}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {/* Lógica simples para calcular a idade */}
                          {new Date().getFullYear() - new Date(dependant.birthdate).getFullYear()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuItem>Editar</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                  ))
              ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Nenhum dependente encontrado.
                    </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
  );
}
