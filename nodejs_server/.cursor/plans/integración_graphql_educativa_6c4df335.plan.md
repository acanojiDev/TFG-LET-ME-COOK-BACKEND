---
name: Integración GraphQL Educativa
overview: Plan educativo para integrar GraphQL junto a la API REST existente, explicando conceptos fundamentales y manteniendo la arquitectura actual donde tanto los resolvers de GraphQL como los controladores REST llaman a los mismos servicios que usan Prisma.
todos:
  - id: install-dependencies
    content: Instalar apollo-server-express para integrar GraphQL con Express
    status: completed
  - id: create-base-schema
    content: "Crear schema base de GraphQL: tipos, queries y mutations para el módulo de Posts"
    status: completed
    dependencies:
      - install-dependencies
  - id: create-post-resolvers
    content: Crear resolvers de Posts que llamen a PostService (reutilizando servicios existentes)
    status: completed
    dependencies:
      - create-base-schema
  - id: configure-apollo-server
    content: Configurar Apollo Server en src/graphql/index.ts uniendo schemas y resolvers
    status: completed
    dependencies:
      - create-post-resolvers
  - id: integrate-express
    content: Integrar Apollo Server como middleware en src/index.ts sin romper rutas REST
    status: completed
    dependencies:
      - configure-apollo-server
  - id: test-graphql-playground
    content: Probar GraphQL Playground y hacer queries de ejemplo para verificar funcionamiento
    status: completed
    dependencies:
      - integrate-express
---

# Plan de Integración GraphQL -

Guía Educativa

## 📚 Conceptos Fundamentales de GraphQL

### ¿Qué es GraphQL?

GraphQL es un **lenguaje de consulta** y un **sistema de ejecución** para APIs. A diferencia de REST donde tienes múltiples endpoints, GraphQL tiene **un solo endpoint** (`/graphql`) donde los clientes especifican exactamente qué datos quieren.

### Diferencias Clave con REST

**REST:**

- Múltiples endpoints: `/api/posts`, `/api/posts/:id`, `/api/users/:id/posts`
- El servidor decide qué datos devolver (over-fetching o under-fetching)
- Métodos HTTP: GET, POST, PUT, DELETE

**GraphQL:**

- Un solo endpoint: `/graphql`
- El cliente decide qué campos quiere (solo pide lo que necesita)
- Operaciones: Query (lectura), Mutation (escritura), Subscription (tiempo real)

### Componentes de GraphQL

1. **Schema (Type Definitions)**: Define los tipos de datos y operaciones disponibles

- Similar a tus `post.schema.ts` pero en lenguaje GraphQL Schema Definition Language (SDL)

2. **Resolvers**: Funciones que resuelven cada campo del schema

- Similar a tus controladores, pero más granulares (un resolver por campo)
- Aquí llamarás a tus servicios existentes

3. **Query**: Operación para leer datos (equivalente a GET en REST)
4. **Mutation**: Operación para modificar datos (equivalente a POST/PUT/DELETE en REST)

## 🏗️ Arquitectura Propuesta

```javascript
Cliente REST → Controlador → Servicio → Prisma
Cliente GraphQL → Resolver → Servicio → Prisma
```

**Ambos comparten los mismos servicios**, solo cambia la capa de entrada.

## 📋 Estructura de Archivos a Crear

### 1. Schema de GraphQL (`src/graphql/schema/`)

Necesitarás crear archivos `.graphql` o `.ts` con las definiciones de tipos:

- `types.graphql` o `types.ts` - Define los tipos base (Post, User, Comment, etc.)
- `queries.graphql` o `queries.ts` - Define las queries (operaciones de lectura)
- `mutations.graphql` o `mutations.ts` - Define las mutations (operaciones de escritura)

**Ejemplo conceptual de un Post:**

```graphql
type Post {
  id: ID!
  user_id: ID!
  type: String!
  content: String
  media_url: String
  created_at: String
  user: User  # Relación
  likesCount: Int  # Campo calculado
  commentsCount: Int
}
```



### 2. Resolvers (`src/graphql/resolvers/`)

Un resolver por módulo que mapea cada campo/operación a tus servicios:

- `post.resolvers.ts` - Resolvers para posts
- `user.resolvers.ts` - Resolvers para usuarios
- etc.

**Ejemplo conceptual:**

```typescript
export const postResolvers = {
  Query: {
    // Equivalente a GET /api/posts
    posts: async (parent, args, context) => {
      return await PostService.getFeedPosts(args.limit, args.user_id, args.cursor);
    },
    // Equivalente a GET /api/posts/:id
    post: async (parent, args, context) => {
      return await PostService.getPostById(args.id);
    }
  },
  Mutation: {
    // Equivalente a POST /api/posts
    createPost: async (parent, args, context) => {
      return await PostService.createPost(args.input);
    }
  }
}
```



### 3. Configuración Principal (`src/graphql/index.ts`)

Une los schemas y resolvers, y crea el servidor GraphQL.

### 4. Integración con Express (`src/index.ts`)

Agregar Apollo Server como middleware de Express (puede coexistir con tus rutas REST).

## 🎯 Pasos de Implementación

### Paso 1: Instalar Apollo Server Express

Ya tienes `apollo-server` pero necesitas `apollo-server-express` para integrarlo con Express.

### Paso 2: Crear el Schema Base

Empezar con un schema simple para Posts (tu módulo más completo) para entender el concepto.

### Paso 3: Crear Resolvers

Mapear las operaciones GraphQL a tus servicios existentes.

### Paso 4: Configurar Apollo Server

Integrar GraphQL en tu Express sin romper las rutas REST existentes.

### Paso 5: Probar con GraphQL Playground

Apollo Server incluye una interfaz visual para probar queries.

## 🔑 Conceptos Importantes

### Context

El tercer parámetro de los resolvers contiene información de la petición (usuario autenticado, headers, etc.). Similar a `req` en Express.

### Args

El segundo parámetro contiene los argumentos de la query/mutation. Similar a `req.params` y `req.body` en REST.

### Type Resolvers

Para campos que no están directamente en la base de datos (como `user: User` en Post), necesitas resolvers específicos.

### Input Types

Para mutations complejas, defines tipos de entrada (similar a tus schemas de Zod).

## ⚠️ Consideraciones

1. **Autenticación**: Necesitarás adaptar tu middleware de auth para GraphQL
2. **Validación**: Puedes seguir usando Zod o usar GraphQL's built-in validation
3. **Errores**: GraphQL tiene su propio formato de errores
4. **Paginación**: GraphQL tiene convenciones específicas (cursors, connections)

## 📁 Archivos Específicos a Modificar/Crear

1. **Nuevos archivos:**

- `src/graphql/schema/types.ts` - Definiciones de tipos
- `src/graphql/schema/queries.ts` - Definiciones de queries
- `src/graphql/schema/mutations.ts` - Definiciones de mutations
- `src/graphql/resolvers/post.resolvers.ts` - Resolvers de posts
- `src/graphql/index.ts` - Configuración de Apollo Server

2. **Archivos a modificar:**

- `src/index.ts` - Agregar Apollo Server middleware
- `package.json` - Agregar `apollo-server-express` si no está

3. **Archivos que NO tocarás:**

- Tus servicios (`src/services/`) - Se reutilizan tal cual
- Tus controladores REST - Siguen funcionando
- Prisma - No cambia nada

## 🎓 Orden de Aprendizaje Recomendado

1. **Empezar simple**: Un solo tipo (Post) con una query básica
2. **Agregar mutations**: Crear/actualizar posts
3. **Relaciones**: Agregar el campo `user` a Post
4. **Paginación**: Implementar cursor-based pagination
5. **Autenticación**: Integrar tu middleware de auth
6. **Expandir**: Agregar otros módulos (Users, Comments, etc.)

## 🧪 Testing

GraphQL Playground (incluido en Apollo Server) te permite:

- Ver la documentación automática del schema
- Escribir y probar queries
- Ver las respuestas en tiempo real

**Ejemplo de query que podrás hacer:**

```graphql
query {
  posts(limit: 5, user_id: "uuid-aqui") {
    id
    content
    user {
      username
      photo_url
    }
    likesCount
  }
}










```