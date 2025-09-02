'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface BackButtonProps {
  children?: React.ReactNode;
}

export function BackButton({ children = 'Voltar' }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <Button variant="outline" onClick={handleBack}>
      <ChevronLeft className="mr-2 h-4 w-4" />
      {children}
    </Button>
  );
}
