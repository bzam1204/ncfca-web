// src/hooks/use-debounce.ts
'use client';

import { useState, useEffect } from 'react';

/**
 * Hook customizado para "debounce" de um valor.
 * Apenas atualiza o valor retornado após um delay especificado sem que o valor de entrada mude.
 * @param value O valor a ser "debounced".
 * @param delay O delay em milissegundos.
 * @returns O valor "debounced".
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configura um timer para atualizar o valor debounced após o delay.
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o timer se o valor mudar antes do delay terminar.
    // Isso garante que a atualização só aconteça após o usuário parar de digitar.
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]); // Re-executa o efeito apenas se o valor ou o delay mudarem.

  return debouncedValue;
}