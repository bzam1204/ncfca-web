import {z} from 'zod';

export const loginSchema = z.object({
  password : z.string().min(1, {message : 'A senha não pode estar em branco.'}),
  email : z.email({message : 'Por favor, insira um email válido.'}),
});

export type LoginInput = z.infer<typeof loginSchema>;
