'use client';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {ShieldPlus} from 'lucide-react';

interface NonDirectorCTAProps {
  onCreateClubClick: () => void;
}

export function NonDirectorCTA({onCreateClubClick}: NonDirectorCTAProps) {
  return (
      <div className="space-y-8">
        <Card className="bg-gradient-to-br from-primary/10 to-transparent">
          <CardHeader>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center text-2xl">
                  <ShieldPlus className="mr-3 h-8 w-8 text-primary" />
                  Torne-se um Diretor de Clube
                </CardTitle>
                <CardDescription className="mt-2 max-w-prose">
                  Lidere, mentore e construa uma comunidade de debate. Crie seu próprio clube
                  e comece a gerenciar matrículas e membros hoje mesmo.
                </CardDescription>
              </div>
              <Button onClick={onCreateClubClick} size="lg" className="flex-shrink-0 cursor-pointer">
                Criar Meu Clube Agora
              </Button>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>O Movimento NCFCA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Ser um Diretor de Clube na NCFCA é mais do que uma função administrativa; é um pilar fundamental em nosso movimento internacional. Você estará na linha de frente, capacitando a próxima geração de líderes e comunicadores através da arte do debate.
            </p>
            <p>
              Suas responsabilidades incluirão a organização de encontros, a gestão de matrículas, a comunicação com os responsáveis familiares e, o mais importante, a criação de um ambiente seguro e estimulante onde os jovens podem aprimorar suas habilidades de pensamento crítico, argumentação e oratória. O impacto social do seu trabalho reverbera muito além das competições, moldando cidadãos mais conscientes e preparados para os desafios do futuro.
            </p>
          </CardContent>
        </Card>
      </div>
  );
}
