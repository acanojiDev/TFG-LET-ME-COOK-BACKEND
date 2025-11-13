//Zod de schemas para login/registro
import {z} from  'zod';

/*
 * Schemas para signUpSchema y signIn 
 */

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;