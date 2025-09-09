"use client";

import { useMemo, useState } from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/infrastructure/utils';

type Props = {
  value?: string; // ISO string or 'YYYY-MM-DDTHH:mm'
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function DateTimePicker({ value, onChange, placeholder = 'Selecione data e hora', className }: Props) {
  const [open, setOpen] = useState(false);

  const date = useMemo(() => (value ? new Date(value) : undefined), [value]);
  const [timeStr, setTimeStr] = useState<string>(() => (date ? toTime(date) : '12:00'));

  const display = useMemo(() => (date ? formatDisplay(date) : placeholder), [date, placeholder]);

  function handleSelect(d?: Date) {
    const dt = mergeDateAndTime(d || new Date(), timeStr);
    onChange?.(toIsoLocal(dt));
  }

  function handleTimeChange(t: string) {
    setTimeStr(t);
    if (date) onChange?.(toIsoLocal(mergeDateAndTime(date, t)));
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-label="Selecionar data e hora"
          className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground', className)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {display}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <div className="flex flex-col md:flex-row gap-3 p-3">
          <Calendar mode="single" selected={date} onSelect={handleSelect} initialFocus />
          <div className="flex items-center gap-2 px-2 pb-2">
            <Clock className="h-4 w-4" />
            <Input type="time" value={timeStr} onChange={(e) => handleTimeChange(e.target.value)} className="w-[110px]" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function toTime(d: Date) {
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

function mergeDateAndTime(d: Date, time: string) {
  const [hh, mm] = time.split(':').map((n) => parseInt(n, 10));
  const out = new Date(d);
  out.setHours(hh || 0, mm || 0, 0, 0);
  return out;
}

function toIsoLocal(d: Date) {
  // Preserve local timezone; format to YYYY-MM-DDTHH:mm
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day}T${hh}:${mm}`;
}

function formatDisplay(d: Date) {
  return `${d.toLocaleDateString()} ${toTime(d)}`;
}
