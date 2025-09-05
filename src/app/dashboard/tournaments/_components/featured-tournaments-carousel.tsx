'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { CalendarDays, ArrowRight, Trophy } from 'lucide-react';

import { useFeaturedTournaments } from '@/hooks/use-featured-tournaments';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function FeaturedTournamentsCarousel() {
  const { isLoading, error, featuredTournaments } = useFeaturedTournaments();
  const items = useMemo(() => featuredTournaments ?? [], [featuredTournaments]);
  const sortedItems = useMemo(() => items.slice().sort((a, b) => a.position - b.position), [items]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="mr-3 h-6 w-6" /> Torneios em Destaque
          </CardTitle>
          <CardDescription>Explore eventos selecionados e próximos destaques.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-80" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Erro ao carregar destaques</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (!sortedItems || sortedItems.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="mr-3 h-6 w-6" /> Torneios em Destaque
        </CardTitle>
        <CardDescription>Explore eventos selecionados e próximos destaques.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
          {sortedItems.map((item) => (
            <Card key={item.id} className="min-w-[20rem] w-80 flex-shrink-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-muted-foreground" /> {item.tournamentName}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Badge variant="secondary">{item.tournamentType}</Badge>
                  <span className="flex items-center gap-1 text-sm"><CalendarDays className="h-4 w-4" /> {formatDate(item.startDate)}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end">
                <Button asChild size="sm">
                  <Link href={`/dashboard/tournaments/${item.tournamentId}`}>
                    Ver detalhes <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString();
}
