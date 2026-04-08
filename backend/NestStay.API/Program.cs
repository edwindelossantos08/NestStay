using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using NestStay.API.Middleware;
using NestStay.Application.Interfaces.Repositories;
using NestStay.Application.Interfaces.Services;
using NestStay.Application.Services;
using NestStay.Infrastructure.Data;
using NestStay.Infrastructure.Repositories;
using NestStay.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "NestStay API", Version = "v1" });

    // Permite enviar el JWT desde Swagger UI
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header
    });

    // Aplica el esquema Bearer a todos los endpoints que lo requieran
    c.AddSecurityRequirement(doc => new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecuritySchemeReference("Bearer", doc),
            new List<string>()
        }
    });
});
builder.Services.AddControllers();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(
            builder.Configuration.GetConnectionString("DefaultConnection"))
    ));

// Registro Unit of Work y repositorios
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IPropertyRepository, PropertyRepository>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IBlockedDateRepository, BlockedDateRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();

builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPropertyService, PropertyService>();
builder.Services.AddScoped<IAvailabilityService, AvailabilityService>();
builder.Services.AddScoped<IBookingService, BookingService>();
// Registrar DbContext base para que BookingService pueda inyectarlo y manejar transacciones
builder.Services.AddScoped<DbContext>(sp => sp.GetRequiredService<ApplicationDbContext>());
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddHttpClient<BrevoEmailService>();
builder.Services.AddScoped<IEmailService>(sp => sp.GetRequiredService<BrevoEmailService>());

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // Preservar los nombres originales de los claims del JWT (sub, role, etc.)
        options.MapInboundClaims = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]!))
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// El orden importa: primero auth, luego authorization
app.UseMiddleware<ExceptionMiddleware>();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
