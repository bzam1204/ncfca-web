'use client';

import { createContext, ReactNode, useCallback, useContext, useRef, useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

type ConfirmationDialogOptions = {
  title?: ReactNode;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  onConfirm?: () => void | Promise<void>;
};

type OpenDialogFn = (options: ConfirmationDialogOptions) => Promise<boolean>;

const ConfirmationDialogContext = createContext<OpenDialogFn | null>(null);

export function ConfirmationDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmationDialogOptions>({});
  const [pending, setPending] = useState(false);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const close = useCallback(() => setOpen(false), []);

  const dialog: OpenDialogFn = useCallback(async (opts) => {
    setOptions(opts);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const handleCancel = useCallback(() => {
    if (pending) return; // prevent closing while pending
    resolverRef.current?.(false);
    resolverRef.current = null;
    close();
  }, [pending, close]);

  const handleConfirm = useCallback(async () => {
    if (pending) return;
    try {
      if (options.onConfirm) {
        setPending(true);
        await options.onConfirm();
      }
      resolverRef.current?.(true);
      resolverRef.current = null;
      close();
    } catch (err) {
      // keep dialog open to allow user to retry or cancel
    } finally {
      setPending(false);
    }
  }, [options, pending, close]);

  return (
    <ConfirmationDialogContext.Provider value={dialog}>
      {children}
      <AlertDialog open={open} onOpenChange={(o) => !o && handleCancel()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {options.title ?? 'Confirmar ação'}
            </AlertDialogTitle>
            {options.description && (
              <AlertDialogDescription>{options.description}</AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending} onClick={handleCancel}>
              {options.cancelText ?? 'Cancelar'}
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant={options.variant ?? 'default'}
                onClick={handleConfirm}
                disabled={pending}
              >
                {pending ? 'Processando...' : options.confirmText ?? 'Confirmar'}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmationDialogContext.Provider>
  );
}

export function useConfirmationDialog(): OpenDialogFn {
  const ctx = useContext(ConfirmationDialogContext);
  if (!ctx) throw new Error('useConfirmationDialog must be used within ConfirmationDialogProvider');
  return ctx;
}

export type { ConfirmationDialogOptions };
