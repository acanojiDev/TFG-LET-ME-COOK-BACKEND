import { supabase } from "../../config/supabase";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authService = {
    async signUp(data: {
        email: string;
        password: string;
        username: string;
        photo_url?: string;
        bio?: string;
        location?: string;
    }){
        const {email, password, username, photo_url, bio, location} = data;

        //1. Crear usuario en Supabase Auth
        const {data: authData, error} = await supabase.auth.signUp({
            email,
            password,
        });

        if(error) throw new Error(error.message);

        const authUser = authData.user;
        if (!authUser) throw new Error("No se pudo crear el usuario.");

        //Crea perfil en prisma
        const profile = await prisma.users.create({
            data: {
                id: authUser.id, //Conectar Supabase Auth id con mi tabla
                username,
                photo_url,
                bio,
                location
            },
        });

        return { user: authUser, profile};
    },
    async login(email:string, password: string){
        const {data, error} = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if(error) throw new Error(error.message);

        return data; //Incluir toke + user
    },
};