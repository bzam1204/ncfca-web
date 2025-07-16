// src/lib/services/cep.service.ts


import {ViaCepResponse} from "@/types/via-cep.types";

export const fetchAddressByCep = async (cep: string): Promise<ViaCepResponse> => {
  const formattedCep = cep.replace(/\D/g, ''); // Remove caracteres não numéricos

  if (formattedCep.length !== 8) {
    throw new Error('CEP deve conter 8 dígitos.');
  }

  const response = await fetch(`https://viacep.com.br/ws/${formattedCep}/json/`);

  if (!response.ok) {
    throw new Error('Falha ao buscar o CEP.');
  }

  const data: ViaCepResponse = await response.json();

  if (data.erro) {
    throw new Error('CEP não encontrado.');
  }

  return data;
};
