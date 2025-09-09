"use client";

import { forwardRef, useRef } from 'react';
import { CalendarDays } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { cn } from '@/infrastructure/utils';
import { Button } from '@/components/ui/button';

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

export const DateTimeInput = forwardRef<HTMLInputElement, Props>(function DateTimeInput(
  { value, onChange, disabled, className },
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const openPicker = () => {
    const el = inputRef.current;
    if (!el) return;
    // showPicker is supported in modern Chromium; fallback to focus/click
    if (typeof (el as any).showPicker === 'function') (el as any).showPicker();
    else el.focus();
  };
  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="datetime-local"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={cn('pr-10', className)}
      />
      <Button type="button" variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0" onClick={openPicker}>
        <CalendarDays className="h-4 w-4" />
      </Button>
    </div>
  );
});
