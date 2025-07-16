import {isValidCpf} from "@/lib/validators/cpf.validator";
import {z} from 'zod';

export const registerSchema = z
    .object({
      cpf : z.string().refine(isValidCpf, {message : 'Cpf Inválido'}),
      email : z.email({message : 'Por favor, insira um email válido.'}),
      phone : z.string().min(10, {message : 'Insira um telefone válido.'}),
      password : z.string().min(8, {message : 'A senha deve ter no mínimo 8 caracteres.'}),
      lastName : z.string().min(2, {message : 'O sobrenome deve ter no mínimo 2 caracteres.'}),
      firstName : z.string().min(2, {message : 'O nome deve ter no mínimo 2 caracteres.'}),
      confirmPassword : z.string(),
      address : z.object({
        city : z.string().min(3, {message : 'Cidade é obrigatória.'}),
        state : z.string().length(2, {message : 'UF deve ter 2 caracteres.'}),
        number : z.string().min(1, {message : 'Número é obrigatório.'}),
        street : z.string().min(3, {message : 'Rua é obrigatória.'}),
        zipCode : z.string().min(8, {message : 'CEP inválido.'}),
        district : z.string().min(3, {message : 'Bairro é obrigatório.'}),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message : 'As senhas não coincidem.',
      path : ['confirmPassword'],
    });

export type RegisterInput = z.infer<typeof registerSchema>;
