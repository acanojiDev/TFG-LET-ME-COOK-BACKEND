# Ejemplos de Queries para GraphQL Playground

Este documento contiene ejemplos de queries y mutations que puedes probar en GraphQL Playground o Apollo Studio Sandbox.

## 🚀 Acceso a GraphQL

### Opción 1: Apollo Studio Sandbox (Recomendado - Incluido por defecto)

Apollo Server v5 incluye **Apollo Studio Sandbox** que es similar a GraphQL Playground:

1. Inicia el servidor con `npm run dev` o `npm start`
2. Abre tu navegador en: `https://studio.apollographql.com/sandbox/explorer`
3. En la configuración, ingresa tu endpoint: `http://localhost:3000/graphql`
4. ¡Listo! Puedes empezar a hacer queries

### Opción 2: GraphQL Playground (Tradicional)

Si prefieres usar GraphQL Playground tradicional:

1. Instala el paquete: `npm install --save-dev graphql-playground-middleware-express`
2. Configura el middleware en `src/index.ts` (ver instrucciones abajo)
3. Accede a: `http://localhost:3000/playground`

### Opción 3: Usar herramientas externas

También puedes usar:
- **Postman**: Soporta GraphQL nativamente
- **Insomnia**: Tiene soporte completo para GraphQL
- **curl**: Para pruebas desde terminal

### Verificar que el servidor está funcionando

Puedes verificar que GraphQL está funcionando haciendo una petición simple:

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ _empty }"}'
```

O desde PowerShell:
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/graphql" -Method POST -ContentType "application/json" -Body '{"query":"{ _empty }"}'
```

## 📝 Notas Importantes

- **user_id**: Necesitarás un `user_id` válido de tu base de datos. Puedes obtenerlo consultando la tabla `users` o usando la query REST `GET /api/users`
- **post_id**: Para probar queries de posts específicos, necesitarás un `post_id` válido
- Todas las queries que requieren `user_id` lo necesitan como parámetro obligatorio

## 🔍 QUERIES (Lectura de Datos)

### 1. Obtener Feed de Posts (con paginación)

```graphql
query GetFeedPosts {
  posts(limit: 5, user_id: "TU_USER_ID_AQUI") {
    data {
      id
      user_id
      type
      content
      media_url
      created_at
      user {
        id
        username
        photo_url
      }
      likesCount
      commentsCount
      is_liked
    }
    next_cursor
    has_more
  }
}
```

**Con cursor para paginación:**
```graphql
query GetFeedPostsWithCursor {
  posts(limit: 5, user_id: "TU_USER_ID_AQUI", cursor: "2024-01-01T00:00:00.000Z") {
    data {
      id
      content
      created_at
      user {
        username
      }
      likesCount
    }
    next_cursor
    has_more
  }
}
```

### 2. Obtener un Post por ID

```graphql
query GetPostById {
  post(id: "TU_POST_ID_AQUI", user_id: "TU_USER_ID_AQUI") {
    id
    user_id
    type
    content
    media_url
    created_at
    updated_at
    user {
      id
      username
      photo_url
    }
    likesCount
    commentsCount
    is_liked
  }
}
```

**Sin verificar si está liked (user_id opcional):**
```graphql
query GetPostByIdSimple {
  post(id: "TU_POST_ID_AQUI") {
    id
    content
    user {
      username
    }
    likesCount
  }
}
```

### 3. Obtener Posts de un Usuario Específico

```graphql
query GetUserPosts {
  userPosts(target_user_id: "USER_ID_DEL_PERFIL", user_id: "TU_USER_ID_AQUI") {
    id
    type
    content
    media_url
    created_at
    user {
      username
      photo_url
    }
    likesCount
    commentsCount
    is_liked
  }
}
```

### 4. Obtener Posts Guardados (Favoritos)

```graphql
query GetSavedPosts {
  savedPosts(user_id: "TU_USER_ID_AQUI") {
    id
    type
    content
    media_url
    created_at
    user {
      username
      photo_url
    }
    likesCount
    commentsCount
    is_liked
  }
}
```

## ✏️ MUTATIONS (Modificación de Datos)

### 1. Crear un Nuevo Post

```graphql
mutation CreatePost {
  createPost(input: {
    user_id: "TU_USER_ID_AQUI"
    type: "text"
    content: "Este es mi primer post desde GraphQL!"
    media_url: null
  }) {
    id
    user_id
    type
    content
    media_url
    created_at
    user {
      username
      photo_url
    }
    likesCount
    commentsCount
  }
}
```

**Crear un post con imagen:**
```graphql
mutation CreatePostWithImage {
  createPost(input: {
    user_id: "TU_USER_ID_AQUI"
    type: "image"
    content: "Mira esta foto increíble"
    media_url: "https://ejemplo.com/imagen.jpg"
  }) {
    id
    content
    media_url
    created_at
  }
}
```

### 2. Actualizar un Post

```graphql
mutation UpdatePost {
  updatePost(
    id: "TU_POST_ID_AQUI"
    input: {
      content: "Contenido actualizado desde GraphQL"
      media_url: null
    }
  ) {
    id
    content
    media_url
    updated_at
  }
}
```

**Solo actualizar el contenido:**
```graphql
mutation UpdatePostContent {
  updatePost(
    id: "TU_POST_ID_AQUI"
    input: {
      content: "Nuevo contenido"
    }
  ) {
    id
    content
    updated_at
  }
}
```

### 3. Eliminar un Post

```graphql
mutation DeletePost {
  deletePost(id: "TU_POST_ID_AQUI")
}
```

### 4. Guardar un Post (Agregar a Favoritos)

```graphql
mutation SavePost {
  savePost(user_id: "TU_USER_ID_AQUI", post_id: "TU_POST_ID_AQUI")
}
```

### 5. Quitar un Post de Favoritos

```graphql
mutation UnsavePost {
  unsavePost(user_id: "TU_USER_ID_AQUI", post_id: "TU_POST_ID_AQUI")
}
```

## 🎯 Queries Combinadas (Múltiples Operaciones)

Puedes combinar múltiples queries en una sola petición:

```graphql
query GetMultipleData {
  # Feed de posts
  feed: posts(limit: 3, user_id: "TU_USER_ID_AQUI") {
    data {
      id
      content
      user {
        username
      }
      likesCount
    }
    has_more
  }
  
  # Posts guardados
  saved: savedPosts(user_id: "TU_USER_ID_AQUI") {
    id
    content
  }
}
```

## 🔧 Variables en GraphQL Playground

Puedes usar variables para hacer las queries más reutilizables. En la pestaña "Query Variables" (abajo a la izquierda), agrega:

```json
{
  "userId": "TU_USER_ID_AQUI",
  "postId": "TU_POST_ID_AQUI",
  "limit": 5
}
```

Y luego en la query:

```graphql
query GetFeedPosts($userId: ID!, $limit: Int) {
  posts(limit: $limit, user_id: $userId) {
    data {
      id
      content
      user {
        username
      }
    }
  }
}
```

## 📊 Ejemplo Completo: Flujo de Trabajo

1. **Obtener tu user_id** (puedes hacerlo desde REST o directamente en la base de datos)
2. **Crear un post:**
```graphql
mutation {
  createPost(input: {
    user_id: "TU_USER_ID"
    type: "text"
    content: "Post de prueba"
  }) {
    id
    content
    created_at
  }
}
```

3. **Obtener el feed para ver tu post:**
```graphql
query {
  posts(limit: 10, user_id: "TU_USER_ID") {
    data {
      id
      content
      created_at
    }
  }
}
```

4. **Guardar el post:**
```graphql
mutation {
  savePost(user_id: "TU_USER_ID", post_id: "ID_DEL_POST_CREADO")
}
```

5. **Verificar posts guardados:**
```graphql
query {
  savedPosts(user_id: "TU_USER_ID") {
    id
    content
  }
}
```

## ⚠️ Errores Comunes

1. **"El parámetro user_id es requerido"**: Asegúrate de proporcionar un `user_id` válido
2. **"El usuario no existe"**: Verifica que el `user_id` existe en la base de datos
3. **"El usuario del perfil no existe"**: Verifica que el `target_user_id` en `userPosts` existe

## 🎓 Tips para Probar

- Usa la pestaña **"Schema"** en GraphQL Playground para ver toda la documentación automática
- La pestaña **"Docs"** muestra todos los tipos, queries y mutations disponibles
- Puedes hacer clic en cualquier campo en la documentación para agregarlo automáticamente a tu query
- Usa **Ctrl+Space** (o Cmd+Space en Mac) para autocompletar en el editor

