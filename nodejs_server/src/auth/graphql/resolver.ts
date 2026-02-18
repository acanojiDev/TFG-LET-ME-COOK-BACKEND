// src/modules/auth/graphql/resolvers.ts - VERSIÓN CORRECTA
import { Context } from '../../graphql/context';
import { supabase } from '../../config/supabase';

export const resolvers = {
	Mutation: {
		/**
		 * REGISTER - Crear usuario nuevo
		 *
		 * Flujo:
		 * 1. Supabase Auth: guardar email + password
		 * 2. tabla users: crear entrada (user_type = PERSON automáticamente)
		 * 3. tabla person_profiles: guardar username, fullName, bio, photoUrl, location, birthDate
		 *
		 * Email + Password → Supabase Auth
		 * Username, Bio, FullName, PhotoUrl, Location, BirthDate → person_profiles
		 */
		register: async (_: any, args: any, ctx: Context) => {
			try {
				const {
					email,
					password,
					username,
					fullName,
					bio,
					photoUrl,
					location,
					birthDate
				} = args;

				console.log(`🔐 Registrando usuario: ${email} / username: ${username}`);

				// ===== 1. CREAR EN SUPABASE AUTH =====
				// Supabase solo guarda: email + password
				const { data: authData, error: authError } = await supabase.auth.signUp({
					email,
					password
					// NO guardar metadata aquí - solo email y password en Auth
				});

				if (authError) {
					console.error('❌ Error en Supabase Auth:', authError);
					throw new Error(`Authentication failed: ${authError.message}`);
				}

				if (!authData.user) {
					throw new Error('User creation failed');
				}

				const userId = authData.user.id;
				console.log(`✅ Usuario creado en Supabase Auth: ${userId}`);

				// ===== 2. CREAR EN TABLA USERS =====
				// Solo crear la entrada en users con user_type = PERSON
				// Automáticamente es PERSON, no RESTAURANT o BAR
				const newUser = await ctx.prisma.users.upsert({
					where: { id: userId },
					create: {
						id: userId,
						user_type: 'PERSON',
						created_at: new Date(),
						updated_at: new Date()
					},
					update: {
						updated_at: new Date()
					}
				});

				console.log(`✅ Usuario en tabla users creado: ${userId}`);

				// ===== 3. CREAR EN TABLA PERSON_PROFILES =====
				// Guardar: username, fullName, bio, photoUrl, location, birthDate
				const personProfile = await ctx.prisma.person_profiles.upsert({
					where: { user_id: userId },
					create: {
						user_id: userId,
						username: username.toLowerCase(),
						full_name: fullName || null,
						photo_url: photoUrl || null,
						bio: bio || null,
						location: location || null,
						birth_date: new Date(birthDate)
					},
					update: {
						username: username.toLowerCase(),
						full_name: fullName || null,
						photo_url: photoUrl || null,
						bio: bio || null,
						location: location || null,
						birth_date: new Date(birthDate)
					}
				});

				console.log(`✅ PersonProfile creado: ${personProfile.username}`);

				return {
					token: authData.session?.access_token || 'check-email-confirmation',
					user: {
						id: newUser.id,
						email: email,
						userType: 'PERSON',
						createdAt: newUser.created_at
					},
					personProfile: {
						userId: personProfile.user_id,
						username: personProfile.username,
						fullName: personProfile.full_name,
						bio: personProfile.bio,
						photoUrl: personProfile.photo_url,
						location: personProfile.location,
						birthDate: personProfile.birth_date
					}
				};
			} catch (error: any) {
				console.error('❌ Error en register:', error);
				throw new Error(error.message);
			}
		},

		/**
		 * LOGIN - Autenticar usuario
		 *
		 * Flujo:
		 * 1. Supabase Auth: verificar email + password
		 * 2. Obtener usuario de tabla users
		 * 3. Obtener person_profile
		 * 4. Retornar token + datos
		 *
		 * El frontend recibe el token y lo usa para sincronizar si es necesario
		 */
		login: async (_: any, args: any, ctx: Context) => {
			try {
				const { email, password } = args;

				console.log(`🔐 Login usuario: ${email}`);

				// ===== 1. LOGIN EN SUPABASE =====
				const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
					email,
					password
				});

				if (authError) {
					console.error('❌ Error en Supabase Auth:', authError);
					throw new Error(`Login failed: ${authError.message}`);
				}

				if (!authData.user || !authData.session) {
					throw new Error('Login failed');
				}

				const userId = authData.user.id;
				console.log(`✅ Login exitoso: ${userId}`);

				// ===== 2. OBTENER USUARIO DE BD =====
				let dbUser = await ctx.prisma.users.findUnique({
					where: { id: userId }
				});

				// Si no existe en BD (error), crear entrada
				if (!dbUser) {
					console.log(`⚠️ Usuario no encontrado en BD, creando entrada...`);

					dbUser = await ctx.prisma.users.create({
						data: {
							id: userId,
							user_type: 'PERSON',
							created_at: new Date(),
							updated_at: new Date()
						}
					});

					console.log(`✅ Entrada de usuario creada en BD`);
				}

				// ===== 3. OBTENER PERSON_PROFILE =====
				let personProfile = await ctx.prisma.person_profiles.findUnique({
					where: { user_id: userId }
				});

				// Si no existe person_profile (error), crear placeholder
				if (!personProfile) {
					console.log(`⚠️ PersonProfile no encontrado, creando placeholder...`);

					personProfile = await ctx.prisma.person_profiles.create({
						data: {
							user_id: userId,
							username: email.split('@')[0].toLowerCase(),
							birth_date: new Date()
						}
					});

					console.log(`✅ PersonProfile creado como placeholder`);
				}

				return {
					token: authData.session.access_token,
					user: {
						id: dbUser.id,
						email: email,
						userType: dbUser.user_type,
						createdAt: dbUser.created_at
					},
					personProfile: {
						userId: personProfile.user_id,
						username: personProfile.username,
						fullName: personProfile.full_name,
						bio: personProfile.bio,
						photoUrl: personProfile.photo_url,
						location: personProfile.location,
						birthDate: personProfile.birth_date
					}
				};
			} catch (error: any) {
				console.error('❌ Error en login:', error);
				throw new Error(error.message);
			}
		},

		/**
		 * SYNC USER - Sincronizar person_profiles después de login
		 *
		 * El frontend hace login en Supabase y obtiene el token.
		 * Luego llama esta mutation con el token en el header Authorization.
		 *
		 * Esta mutation actualiza la información en person_profiles.
		 * El ID del usuario se extrae automáticamente del JWT en el contexto.
		 */
		syncUser: async (_: any, args: any, ctx: Context) => {
			try {
				const {
					username,
					fullName,
					bio,
					photoUrl,
					location,
					birthDate
				} = args;

				// Extraer ID del usuario del JWT (viene en el contexto)
				const userId = ctx.currentUserId;

				if (!userId) {
					throw new Error('Not authenticated. Please login first.');
				}

				console.log(`🔄 Sincronizando person_profile para usuario: ${userId}`);

				// ===== ACTUALIZAR PERSON_PROFILE =====
				const personProfile = await ctx.prisma.person_profiles.upsert({
					where: { user_id: userId },
					create: {
						user_id: userId,
						username: username.toLowerCase(),
						full_name: fullName || null,
						photo_url: photoUrl || null,
						bio: bio || null,
						location: location || null,
						birth_date: new Date(birthDate)
					},
					update: {
						username: username.toLowerCase(),
						full_name: fullName || null,
						photo_url: photoUrl || null,
						bio: bio || null,
						location: location || null,
						birth_date: new Date(birthDate)
					}
				});

				console.log(`✅ PersonProfile sincronizado: ${personProfile.username}`);

				// Obtener user para retornarlo
				const user = await ctx.prisma.users.findUnique({
					where: { id: userId }
				});

				return {
					success: true,
					message: 'Usuario sincronizado correctamente',
					user: {
						id: user?.id,
						email: ctx.currentUserEmail || 'unknown@example.com',
						userType: user?.user_type || 'PERSON',
						createdAt: user?.created_at
					},
					personProfile: {
						userId: personProfile.user_id,
						username: personProfile.username,
						fullName: personProfile.full_name,
						bio: personProfile.bio,
						photoUrl: personProfile.photo_url,
						location: personProfile.location,
						birthDate: personProfile.birth_date
					}
				};
			} catch (error: any) {
				console.error('❌ Error en syncUser:', error);
				throw new Error(error.message);
			}
		},

		/**
		 * LOGOUT
		 */
		logout: async (_: any, __: any, ctx: Context) => {
			try {
				console.log(`👋 Logout usuario: ${ctx.currentUserId}`);

				const { error } = await supabase.auth.signOut();

				if (error) {
					throw new Error(`Logout failed: ${error.message}`);
				}

				console.log(`✅ Logout exitoso`);
				return true;
			} catch (error: any) {
				console.error('❌ Error en logout:', error);
				throw new Error(error.message);
			}
		}
	}
};
