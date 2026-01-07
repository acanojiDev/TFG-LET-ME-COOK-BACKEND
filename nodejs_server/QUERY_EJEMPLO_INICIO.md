# Query de Ejemplo para la Pantalla "Inicio"

Este documento contiene ejemplos de queries GraphQL para obtener los datos necesarios para tu pantalla de inicio.

## 🎯 Datos Necesarios

Para tu pantalla "Inicio" necesitas:
- **Usuario**: username e imagen (photo_url del bucket de Supabase)
- **Post**: 
  - Autor (usuario) con imagen y username
  - Descripción del post
  - Tiempo estimado (time_required)
  - Dinero (money)
  - Número de likes
  - Número de comentarios
  - Número de favoritos (savedCount)

## 📝 Query Completa para la Pantalla de Inicio

### Query Básica - Obtener Feed de Posts

```graphql
query GetFeedInicio($userId: ID!, $limit: Int) {
  posts(limit: $limit, user_id: $userId) {
    data {
      id
      content
      description
      time_required
      money
      created_at
      
      # Información del autor
      user {
        id
        username
        photo_url
      }
      
      # Contadores
      likesCount
      commentsCount
      savedCount
      
      # Estado del post para el usuario actual
      is_liked
    }
    next_cursor
    has_more
  }
}
```

### Variables para la Query

En la pestaña "Variables" de Apollo Studio Sandbox, agrega:

```json
{
  "userId": "TU_USER_ID_AQUI",
  "limit": 10
}
```

## 🔍 Query Detallada con Todos los Campos

```graphql
query GetFeedInicioCompleto($userId: ID!, $limit: Int, $cursor: String) {
  posts(limit: $limit, user_id: $userId, cursor: $cursor) {
    data {
      id
      type
      content
      media_url
      description
      time_required
      money
      created_at
      updated_at
      
      # Información del autor (usuario que creó el post)
      user {
        id
        username
        photo_url
      }
      
      # Contadores
      likesCount
      commentsCount
      savedCount
      
      # Estado del post para el usuario actual
      is_liked
    }
    next_cursor
    has_more
  }
}
```

## 📱 Ejemplo de Uso en el Frontend

### Con Apollo Client (React)

```typescript
import { useQuery, gql } from '@apollo/client';

const GET_FEED_INICIO = gql`
  query GetFeedInicio($userId: ID!, $limit: Int) {
    posts(limit: $limit, user_id: $userId) {
      data {
        id
        content
        description
        time_required
        money
        created_at
        user {
          id
          username
          photo_url
        }
        likesCount
        commentsCount
        savedCount
        is_liked
      }
      next_cursor
      has_more
    }
  }
`;

function PantallaInicio() {
  const { loading, error, data, fetchMore } = useQuery(GET_FEED_INICIO, {
    variables: {
      userId: 'TU_USER_ID',
      limit: 10
    }
  });

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data.posts.data.map((post: any) => (
        <div key={post.id}>
          {/* Información del autor */}
          <div>
            <img src={post.user.photo_url} alt={post.user.username} />
            <span>{post.user.username}</span>
          </div>
          
          {/* Contenido del post */}
          <p>{post.description || post.content}</p>
          
          {/* Información adicional */}
          {post.time_required && (
            <span>⏱️ {post.time_required} min</span>
          )}
          {post.money && (
            <span>💰 ${post.money}</span>
          )}
          
          {/* Contadores */}
          <div>
            <span>❤️ {post.likesCount}</span>
            <span>💬 {post.commentsCount}</span>
            <span>⭐ {post.savedCount}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Con Fetch API (JavaScript Vanilla)

```javascript
async function obtenerFeedInicio(userId, limit = 10) {
  const query = `
    query GetFeedInicio($userId: ID!, $limit: Int) {
      posts(limit: $limit, user_id: $userId) {
        data {
          id
          content
          description
          time_required
          money
          created_at
          user {
            id
            username
            photo_url
          }
          likesCount
          commentsCount
          savedCount
          is_liked
        }
        next_cursor
        has_more
      }
    }
  `;

  const response = await fetch('http://localhost:3000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: {
        userId,
        limit
      }
    })
  });

  const result = await response.json();
  return result.data.posts;
}
```

## 🧪 Cómo Probar la Query

### Opción 1: Apollo Studio Sandbox (Recomendado)

1. Inicia el servidor: `npm run dev`
2. Abre: https://studio.apollographql.com/sandbox/explorer
3. Configura el endpoint: `http://localhost:3000/graphql`
4. Pega la query en el editor
5. Agrega las variables en la pestaña "Variables"
6. Haz clic en "Run" o presiona `Ctrl+Enter`

### Opción 2: Desde la Terminal (curl)

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetFeedInicio($userId: ID!, $limit: Int) { posts(limit: $limit, user_id: $userId) { data { id content description time_required money user { username photo_url } likesCount commentsCount savedCount } next_cursor has_more } }",
    "variables": {
      "userId": "TU_USER_ID_AQUI",
      "limit": 10
    }
  }'
```

### Opción 3: Desde PowerShell

```powershell
$query = @"
query GetFeedInicio(`$userId: ID!, `$limit: Int) {
  posts(limit: `$limit, user_id: `$userId) {
    data {
      id
      content
      description
      time_required
      money
      user {
        username
        photo_url
      }
      likesCount
      commentsCount
      savedCount
    }
    next_cursor
    has_more
  }
}
"@

$body = @{
    query = $query
    variables = @{
        userId = "TU_USER_ID_AQUI"
        limit = 10
    }
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/graphql" -Method POST -ContentType "application/json" -Body $body
```

## 📊 Estructura de la Respuesta

```json
{
  "data": {
    "posts": {
      "data": [
        {
          "id": "uuid-del-post",
          "content": "Contenido del post",
          "description": "Descripción de la receta (si es tipo recipe)",
          "time_required": 30,
          "money": null,
          "created_at": "2024-01-01T00:00:00.000Z",
          "user": {
            "id": "uuid-del-usuario",
            "username": "nombre_usuario",
            "photo_url": "https://bucket.supabase.co/storage/v1/object/public/avatars/imagen.jpg"
          },
          "likesCount": 15,
          "commentsCount": 5,
          "savedCount": 8,
          "is_liked": false
        }
      ],
      "next_cursor": "2024-01-01T00:00:00.000Z",
      "has_more": true
    }
  }
}
```

## 🔄 Paginación

Para cargar más posts, usa el `next_cursor`:

```graphql
query GetMorePosts($userId: ID!, $limit: Int, $cursor: String) {
  posts(limit: $limit, user_id: $userId, cursor: $cursor) {
    data {
      id
      # ... resto de campos
    }
    next_cursor
    has_more
  }
}
```

Variables:
```json
{
  "userId": "TU_USER_ID",
  "limit": 10,
  "cursor": "2024-01-01T00:00:00.000Z"
}
```

## ⚠️ Notas Importantes

1. **user_id**: Necesitas un `user_id` válido de tu base de datos. Puedes obtenerlo desde la tabla `users` o usando la API REST `GET /api/users`

2. **photo_url**: La imagen del usuario ya viene en `photo_url` que apunta al bucket de Supabase. Solo necesitas mostrarla directamente en tu frontend.

3. **description**: 
   - Si el post tiene una receta asociada, devuelve `recipes.description`
   - Si no, devuelve `content` del post

4. **time_required**: Solo está disponible si el post tiene una receta asociada (`type: "recipe"`)

5. **money**: Por ahora retorna `null`. Si necesitas este campo, puedes:
   - Agregarlo al schema de Prisma en la tabla `recipes` o `posts`
   - O calcularlo dinámicamente en el resolver

6. **savedCount**: Cuenta cuántos usuarios han guardado el post como favorito

## 🎯 Próximos Pasos

1. **Obtener tu user_id**: 
   ```sql
   SELECT id FROM users LIMIT 1;
   ```
   O desde REST: `GET http://localhost:3000/api/users`

2. **Probar la query** en Apollo Studio Sandbox

3. **Integrar en tu frontend** usando Apollo Client o fetch

4. **Agregar campo money** si es necesario (requiere migración de base de datos)

