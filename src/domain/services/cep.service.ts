import {Address} from "@/domain/entities/entities";

export interface CepService {
  fetchAddress(cep: string): Promise<CepAddress | null>
}

export type CepAddress = Omit<Address, 'complement' | 'number'>;
