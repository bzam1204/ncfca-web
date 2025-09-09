'use client';

import { useMemo } from 'react';
import { CalendarDays, Users, Info, UserPlus, UsersRound, AlertTriangle } from 'lucide-react';

import { useTournamentDetails } from '@/hooks/tournaments/use-tournament-details';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { IndividualRegistrationDialog } from '@/app/dashboard/tournaments/[id]/_components/individual-registration-dialog';
import { DuoRegistrationDialog } from '@/app/dashboard/tournaments/[id]/_components/duo-registration-dialog';

export function TournamentDetailsCard({ tournamentId }: { tournamentId: string }) {
  const { tournament, isLoading, error } = useTournamentDetails(tournamentId);

  const withinRegistrationWindow = useMemo(() => isWithinRegistrationWindow(tournament?.registrationStartDate, tournament?.registrationEndDate), [tournament?.registrationEndDate, tournament?.registrationStartDate]);

  if (isLoading) {
    return <Skeleton className="h-[320px] w-full" />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erro ao carregar torneio</AlertTitle>
        <AlertDescription>{(error as Error)?.message || 'Falha ao carregar detalhes do torneio.'}</AlertDescription>
      </Alert>
    );
  }

  if (!tournament) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Nenhum dado</AlertTitle>
        <AlertDescription>Detalhes do torneio não encontrados.</AlertDescription>
      </Alert>
    );
  }

  const disabledCta = !withinRegistrationWindow;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {tournament.name}
          <Badge variant="secondary">{tournament.type}</Badge>
        </CardTitle>
        <CardDescription className="flex flex-wrap gap-4 items-center">
          <span className="flex items-center gap-1 text-sm"><CalendarDays className="h-4 w-4" /> Início: {formatDate(tournament.startDate)}</span>
          <span className="flex items-center gap-1 text-sm"><CalendarDays className="h-4 w-4" /> Inscrições: {formatDate(tournament.registrationStartDate)} - {formatDate(tournament.registrationEndDate)}</span>
          <span className="flex items-center gap-1 text-sm"><Users className="h-4 w-4" /> Inscritos: {tournament.registrationCount}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="whitespace-pre-line text-sm text-muted-foreground">{tournament.description}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {tournament.type === 'INDIVIDUAL' && (
            <IndividualRegistrationDialog tournament={tournament} disabled={!withinRegistrationWindow}>
              <Button disabled={disabledCta} data-testid="cta-individual" className="gap-2">
                <UserPlus className="h-4 w-4" /> Inscrever (Individual)
              </Button>
            </IndividualRegistrationDialog>
          )}
          {tournament.type === 'DUO' && (
            <DuoRegistrationDialog tournament={tournament} disabled={!withinRegistrationWindow}>
              <Button disabled={disabledCta} data-testid="cta-duo" className="gap-2">
                <UsersRound className="h-4 w-4" /> Inscrever (Dupla)
              </Button>
            </DuoRegistrationDialog>
          )}
        </div>

        {!withinRegistrationWindow && (
          <Alert>
            <AlertTitle>Inscrições indisponíveis</AlertTitle>
            <AlertDescription>
              As inscrições estarão abertas de {formatDate(tournament.registrationStartDate)} até {formatDate(tournament.registrationEndDate)}.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

function isWithinRegistrationWindow(start?: string, end?: string) {
  if (!start || !end) return false;
  const now = new Date();
  const s = new Date(start);
  const e = new Date(end);
  return now >= s && now <= e;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString();
}

