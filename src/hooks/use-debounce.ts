// src/hooks/use-debounce.ts
'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Hook customizado para "debounce" de um valor.
 * Apenas atualiza o valor retornado após um delay especificado sem que o valor de entrada mude.
 * @param value O valor a ser "debounced".
 * @param delay O delay em milissegundos.
 * @returns O valor "debounced".
 */
export function useDebounce<T>(value: T, delay: number): T {
  const isFirstRender = useRef<boolean>(true);
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  return debouncedValue;
}
