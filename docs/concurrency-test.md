# Prueba de Concurrencia — NestStay

## Prerequisitos
- API corriendo en http://localhost:5000
- Usuario Guest registrado y confirmado
- Propiedad existente sin reservas en las fechas de prueba

## Pasos
1. `dotnet run --project backend/NestStay.API`
2. Ajustar credenciales (`email`, `password`) y `propertyId` en `backend/NestStay.ConcurrencyTest/Program.cs`
3. `dotnet run --project backend/NestStay.ConcurrencyTest`

## Resultado esperado
- Exactamente 1 request exitoso (201 Created)
- Los 9 restantes con error 409 Conflict
- Mensaje: "Las siguientes fechas no están disponibles"

## Mecanismo implementado
Transacción con nivel de aislamiento Serializable en MySQL.
Garantiza que la verificación de disponibilidad y la inserción de la
reserva sean atómicas, bloqueando cualquier lectura o escritura
concurrente sobre las mismas filas hasta completar el commit.
