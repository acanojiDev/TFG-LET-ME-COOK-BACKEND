# ✅ GraphQL Playground - Instrucciones de Prueba

## 🎯 Tarea Completada

Se ha creado la documentación y ejemplos para probar GraphQL Playground. El servidor GraphQL está configurado y listo para usar.

## 📋 Archivos Creados

1. **`GRAPHQL_PLAYGROUND_EXAMPLES.md`** - Documentación completa con ejemplos de queries y mutations
2. **`test-graphql.ps1`** - Script de PowerShell para verificar que GraphQL funciona
3. **`INSTRUCCIONES_GRAPHQL.md`** - Este archivo con instrucciones rápidas

## 🚀 Cómo Probar GraphQL Playground

### Paso 1: Asegúrate de que el servidor esté corriendo

El servidor debería estar iniciando automáticamente con `npm run dev`. Verifica que veas en la consola:

```
✅ Servidor corriendo en puerto 3000
🔷 GraphQL endpoint disponible en http://localhost:3000/graphql
```

### Paso 2: Accede a Apollo Studio Sandbox

Apollo Server v5 incluye **Apollo Studio Sandbox** (equivalente a GraphQL Playground):

1. Abre tu navegador y ve a: **https://studio.apollographql.com/sandbox/explorer**
2. En la parte superior, verás un campo para ingresar el endpoint
3. Ingresa: `http://localhost:3000/graphql`
4. Haz clic en "Connect" o presiona Enter

### Paso 3: Prueba tu primera query

Una vez conectado, puedes probar esta query simple:

```graphql
query {
  _empty
}
```

O si tienes datos en tu base de datos, prueba obtener posts:

```graphql
query GetPosts {
  posts(limit: 5, user_id: "TU_USER_ID_AQUI") {
    data {
      id
      content
      user {
        username
      }
      likesCount
    }
  }
}
```

**Nota:** Necesitarás reemplazar `"TU_USER_ID_AQUI"` con un `user_id` real de tu base de datos.

## 📚 Más Ejemplos

Consulta el archivo **`GRAPHQL_PLAYGROUND_EXAMPLES.md`** para ver:
- Ejemplos de todas las queries disponibles
- Ejemplos de mutations
- Cómo usar variables
- Ejemplos de queries combinadas

## 🧪 Verificar que Funciona

Puedes ejecutar el script de prueba:

```powershell
.\test-graphql.ps1
```

O hacer una petición manual desde PowerShell:

```powershell
$body = @{
    query = "{ _empty }"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/graphql" -Method POST -ContentType "application/json" -Body $body
```

## 🔍 Obtener un user_id para Pruebas

Si necesitas un `user_id` para probar las queries, puedes:

1. **Desde la base de datos:**
   ```sql
   SELECT id FROM users LIMIT 1;
   ```

2. **Desde la API REST:**
   ```bash
   GET http://localhost:3000/api/users
   ```

3. **Desde GraphQL (si tienes una query de usuarios):**
   ```graphql
   # Cuando implementes la query de usuarios
   query {
     users {
       id
       username
     }
   }
   ```

## 📖 Queries Disponibles

### Queries (Lectura)
- `posts(limit, user_id, cursor)` - Obtener feed de posts
- `post(id, user_id)` - Obtener un post por ID
- `userPosts(target_user_id, user_id)` - Posts de un usuario
- `savedPosts(user_id)` - Posts guardados

### Mutations (Escritura)
- `createPost(input)` - Crear un post
- `updatePost(id, input)` - Actualizar un post
- `deletePost(id)` - Eliminar un post
- `savePost(user_id, post_id)` - Guardar post
- `unsavePost(user_id, post_id)` - Quitar de guardados

## 🎓 Características de Apollo Studio Sandbox

- **Autocompletado**: Presiona `Ctrl+Space` para autocompletar
- **Documentación**: Haz clic en "Schema" para ver toda la documentación
- **Explorador**: Navega por los tipos y campos disponibles
- **Variables**: Usa la pestaña "Variables" para definir variables reutilizables
- **Historial**: Tus queries se guardan en el historial

## ⚠️ Solución de Problemas

### El servidor no inicia
- Verifica que no haya errores en la consola
- Asegúrate de que el puerto 3000 no esté ocupado
- Verifica que las variables de entorno estén configuradas

### No puedo conectar a Apollo Studio
- Verifica que el servidor esté corriendo: `http://localhost:3000/`
- Asegúrate de usar `http://localhost:3000/graphql` (no `https`)
- Verifica que la introspection esté habilitada (ya está en el código)

### Error "user_id es requerido"
- Todas las queries de posts requieren un `user_id` válido
- Asegúrate de usar un `user_id` que exista en tu base de datos

## ✅ Estado Actual

- ✅ Apollo Server configurado
- ✅ Schema de GraphQL definido
- ✅ Resolvers implementados
- ✅ Integración con Express completada
- ✅ Introspection habilitada
- ✅ Documentación y ejemplos creados
- ✅ Script de prueba creado

**¡Todo listo para probar GraphQL Playground!** 🎉

