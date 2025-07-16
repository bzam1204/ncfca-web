// src/hooks/useNotify.ts
'use client';

import {toast} from 'sonner';

// Este hook abstrai a implementação do toast
export const useNotify = () => {
  const notify = {
    success : (message: string) => {
      toast.success('Sucesso', {
        description : message,
        duration : 3000,
      });
    },
    error : (message: string) => {
      toast.error('Erro', {
        description : message,
        duration : 5000,
        action : {label : 'Fechar', onClick : () => toast.dismiss()},
      });
    },
    // Podemos adicionar outros tipos como 'info' ou 'warning' no futuro.
  };

  return notify;
};