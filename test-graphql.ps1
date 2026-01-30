# Script de prueba para GraphQL
# Este script verifica que GraphQL está funcionando correctamente

Write-Host "🧪 Probando GraphQL Endpoint..." -ForegroundColor Cyan
Write-Host ""

$endpoint = "http://localhost:3000/graphql"

# Query simple para verificar que el servidor responde
$testQuery = @{
    query = "{ _empty }"
} | ConvertTo-Json

try {
    Write-Host "1. Verificando que el servidor está corriendo..." -ForegroundColor Yellow
    $response = Invoke-WebRequest -Uri $endpoint -Method POST -ContentType "application/json" -Body $testQuery -ErrorAction Stop
    
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Servidor GraphQL está funcionando!" -ForegroundColor Green
        Write-Host ""
        
        # Intentar obtener el schema (introspection)
        Write-Host "2. Verificando introspection (schema)..." -ForegroundColor Yellow
        $introspectionQuery = @{
            query = "query IntrospectionQuery { __schema { queryType { name } } }"
        } | ConvertTo-Json
        
        $introspectionResponse = Invoke-WebRequest -Uri $endpoint -Method POST -ContentType "application/json" -Body $introspectionQuery -ErrorAction Stop
        
        if ($introspectionResponse.StatusCode -eq 200) {
            Write-Host "   ✅ Introspection habilitada correctamente!" -ForegroundColor Green
            Write-Host ""
            Write-Host "📝 Próximos pasos:" -ForegroundColor Cyan
            Write-Host "   1. Abre Apollo Studio Sandbox: https://studio.apollographql.com/sandbox/explorer" -ForegroundColor White
            Write-Host "   2. Configura el endpoint: $endpoint" -ForegroundColor White
            Write-Host "   3. O consulta el archivo GRAPHQL_PLAYGROUND_EXAMPLES.md para ver ejemplos de queries" -ForegroundColor White
            Write-Host ""
            Write-Host "🔗 Endpoints disponibles:" -ForegroundColor Cyan
            Write-Host "   - GraphQL: $endpoint" -ForegroundColor White
            Write-Host "   - Swagger: http://localhost:3000/api-docs" -ForegroundColor White
            Write-Host "   - REST API: http://localhost:3000/api/*" -ForegroundColor White
        } else {
            Write-Host "   ⚠️  Introspection puede no estar habilitada" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "   ❌ Error al conectar con el servidor GraphQL" -ForegroundColor Red
    Write-Host "   Asegúrate de que el servidor esté corriendo con 'npm run dev'" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Detalles del error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Prueba completada!" -ForegroundColor Green

