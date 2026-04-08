using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

// URL base de la API
const string baseUrl = "http://localhost:5073";
const string propertyId = "1"; // ID de la propiedad de prueba

// Credenciales de un usuario Guest ya registrado y confirmado
const string email = "guest@test.com";
const string password = "Guest1234!";

// Paso 1: Login del usuario guest de prueba
Console.WriteLine("Autenticando usuario guest...");
string token;
using (var loginClient = new HttpClient())
{
    var loginBody = JsonSerializer.Serialize(new { email, password });
    var loginResponse = await loginClient.PostAsync(
        $"{baseUrl}/api/auth/login",
        new StringContent(loginBody, Encoding.UTF8, "application/json"));

    if (!loginResponse.IsSuccessStatusCode)
    {
        var err = await loginResponse.Content.ReadAsStringAsync();
        Console.WriteLine($"Error en login ({(int)loginResponse.StatusCode}): {err}");
        Console.WriteLine("Ajusta las credenciales en Program.cs y vuelve a intentarlo.");
        return;
    }

    var loginContent = await loginResponse.Content.ReadAsStringAsync();
    using var doc = JsonDocument.Parse(loginContent);

    // Intentar leer el token desde data.token o data directamente
    if (doc.RootElement.TryGetProperty("data", out var dataElem))
    {
        if (dataElem.ValueKind == JsonValueKind.String)
            token = dataElem.GetString()!;
        else if (dataElem.TryGetProperty("token", out var tokenElem))
            token = tokenElem.GetString()!;
        else
        {
            Console.WriteLine($"Respuesta inesperada del login: {loginContent}");
            return;
        }
    }
    else if (doc.RootElement.TryGetProperty("token", out var tokenElem))
        token = tokenElem.GetString()!;
    else
    {
        Console.WriteLine($"Respuesta inesperada del login: {loginContent}");
        return;
    }
}

Console.WriteLine("Login exitoso. Lanzando 10 requests simultáneos...\n");

// Paso 2: Lanzar 10 requests simultáneos para reservar las mismas fechas
var checkIn = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30));
var checkOut = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(35));

var tasks = Enumerable.Range(1, 10).Select(async i =>
{
    using var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization =
        new AuthenticationHeaderValue("Bearer", token);

    var body = JsonSerializer.Serialize(new
    {
        propertyId = int.Parse(propertyId),
        checkIn = checkIn.ToString("yyyy-MM-dd"),
        checkOut = checkOut.ToString("yyyy-MM-dd")
    });

    var response = await client.PostAsync(
        $"{baseUrl}/api/bookings",
        new StringContent(body, Encoding.UTF8, "application/json"));

    var content = await response.Content.ReadAsStringAsync();

    // Mostrar resultado de cada request
    Console.WriteLine($"Request {i}: {(int)response.StatusCode} - " +
        $"{(response.IsSuccessStatusCode ? "ÉXITO ✅" : "FALLIDO ❌")}");
    Console.WriteLine($"  → {content[..Math.Min(content.Length, 120)]}");

    return response.IsSuccessStatusCode;
});

var results = await Task.WhenAll(tasks);

// Resumen de la prueba
var successful = results.Count(r => r);
var failed = results.Count(r => !r);

Console.WriteLine("\n====== RESULTADO DE LA PRUEBA DE CONCURRENCIA ======");
Console.WriteLine($"Total requests:     10");
Console.WriteLine($"Exitosos:           {successful} (esperado: 1)");
Console.WriteLine($"Fallidos:           {failed} (esperado: 9)");
Console.WriteLine(successful == 1
    ? "✅ PRUEBA PASADA: Solo una reserva fue creada"
    : "❌ PRUEBA FALLIDA: Se crearon múltiples reservas");
