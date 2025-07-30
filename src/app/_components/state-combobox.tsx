"use client"

import * as React from "react"
import {Check, ChevronsUpDown} from "lucide-react"

import {cn} from "@/infraestructure/utils"
import {Button} from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function StateCombobox({value, onValueChange}: StateComboboxProps) {
  const [open, setOpen] = React.useState(false)
  return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
          >
            {value
                ? states.find((state) => state.value.toLowerCase() === value.toLowerCase())?.label
                : "Selecione o estado..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command
              filter={(itemValue, search) => {
                const state = states.find(s => s.value === itemValue);
                if (state?.searchValue.includes(search.toLowerCase())) {
                  return 1;
                }
                return 0;
              }}
          >
            <CommandInput placeholder="Buscar estado ou sigla..." />
            <CommandList>
              <CommandEmpty>Nenhum estado encontrado.</CommandEmpty>
              <CommandGroup>
                {states.map((state) => (
                    <CommandItem
                        key={state.value}
                        value={state.value}
                        onSelect={(currentValue) => {
                          onValueChange(currentValue.toUpperCase() === value ? "" : currentValue.toUpperCase())
                          setOpen(false)
                        }}
                    >
                      {state.label}
                      <Check
                          className={cn(
                              "ml-auto",
                              value?.toLowerCase() === state.value.toLowerCase() ? "opacity-100" : "opacity-0"
                          )}
                      />
                    </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
  )
}

const states = [
  {value : 'AC', label : 'Acre'},
  {value : 'AL', label : 'Alagoas'},
  {value : 'AP', label : 'Amapá'},
  {value : 'AM', label : 'Amazonas'},
  {value : 'BA', label : 'Bahia'},
  {value : 'CE', label : 'Ceará'},
  {value : 'DF', label : 'Distrito Federal'},
  {value : 'ES', label : 'Espírito Santo'},
  {value : 'GO', label : 'Goiás'},
  {value : 'MA', label : 'Maranhão'},
  {value : 'MT', label : 'Mato Grosso'},
  {value : 'MS', label : 'Mato Grosso do Sul'},
  {value : 'MG', label : 'Minas Gerais'},
  {value : 'PA', label : 'Pará'},
  {value : 'PB', label : 'Paraíba'},
  {value : 'PR', label : 'Paraná'},
  {value : 'PE', label : 'Pernambuco'},
  {value : 'PI', label : 'Piauí'},
  {value : 'RJ', label : 'Rio de Janeiro'},
  {value : 'RN', label : 'Rio Grande do Norte'},
  {value : 'RS', label : 'Rio Grande do Sul'},
  {value : 'RO', label : 'Rondônia'},
  {value : 'RR', label : 'Roraima'},
  {value : 'SC', label : 'Santa Catarina'},
  {value : 'SP', label : 'São Paulo'},
  {value : 'SE', label : 'Sergipe'},
  {value : 'TO', label : 'Tocantins'}
].map(state => ({
  ...state,
  searchValue : `${state.value.toLowerCase()} ${state.label.toLowerCase()}`
}));

interface StateComboboxProps {
  value?: string;
  onValueChange: (value: string) => void;
}
