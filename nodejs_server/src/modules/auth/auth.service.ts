import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RegisterPayload, LoginPayload, JWTPayload } from './types/';
import { email } from 'zod';

/*const prisma = new PrismaClient();

export class AuthService {
     Registrar usuario
    static async register(payload: RegisterPayload) {
        /* Validar que el usuario no exista
        const existingUser = await prisma.users.findFirst({
            where: {
                OR: [{ email: payload.email }, { username: payload.username }],
            },
        });

        if (existingUser) {
            throw new Error('El email o usuario ya esta registrado'); /* mirar seguridad
        }

        //Validar contraseña
        if (payload.password.length < 8) {
            throw new Error('La contraseña debe tener mínimo 8 caracteres');
        }

        //combino los 3 inputs en una fecha
        const birthDate = new Date(payload.day, payload.month - 1, payload.year);

        //Valido la fecha
        if (isNaN(birthDate.getTime())) {
            throw new Error('Fecha de nacimiento inválida');
        }

        //Validar edad mínima
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 16) {
            throw new Error('Debes tener al menos 16 años');
        }

        //Hasheo
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(payload.password, salt);

        //Creación de usuario
        const user = await prisma.users.create({
            data: {
                username: payload.username,
                email: payload.email,
                password_hash: passwordHash,
                birthDate: birthDate,
                registered_at: new Date(),
                updated_at: new Date()
            },
        });

        //Generar token
        const token = this.generateToken({
            userId: user.id,
            email: user.email,
            username: user.username,
        });

        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                photo_url: user.photo_url,
                bio: user.bio,
                location: user.location,
            },
        };
    }

    static async login(payload: LoginPayload) {
        //Busco por email
        const user = await prisma.users.findUnique({
            where: { email: payload.email },
        });

        if (!user) {
            throw new Error('Email o contraseña incorrectos');
        }

        //Verifico contra
        const isPasswordValid = await bcrypt.compare(
            payload.password,
            user.password_hash
        );

        if (isPasswordValid) {
            throw new Error('Email o contraseña incorrectos');
        }

        //Generar token
        const token = this.generateToken({
            userId: user.id,
            email: user.email,
            username: user.username,
        });

        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                photo_url: user.photo_url,
                bio: user.bio,
                location: user.location,
            }
        };
    }

    /**
     * Obtener usuario por token

    static async getUserProfile(userId: string) {
        const user = await prisma.users.findUnique({
            where: {id: userId},
            select: {
                id: true,
                username: true,
                email: true,
                photo_url: true,
                bio: true,
                location: true,
                registered_at: true,
                updated_at: true,
            }
        });

        if(!user){
            throw new Error('Usuario no encontrado');
        }

        return user;
    }


}*/
