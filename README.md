# 🏠 NestStay

Plataforma de reservas de alojamientos estilo Airbnb, desarrollada como proyecto final de Programación II.

## Stack

**Backend:** ASP.NET Core Web API · Onion Architecture · Entity Framework Core · SQL Server · JWT  
**Frontend:** React · TypeScript · TailwindCSS · shadcn/ui  
**Email:** Brevo  

## Estructura del proyecto

neststay/
├── backend/          → Solución ASP.NET Core (Onion Architecture)
├── frontend/         → Aplicación React + TypeScript
└── docs/             → Scripts SQL, evidencias, diagramas

## Módulos

- Autenticación con confirmación de cuenta por correo
- Gestión de propiedades (Host)
- Disponibilidad y fechas bloqueadas
- Reservas con manejo de estados
- Control de concurrencia
- Reseñas
- Notificaciones internas y por correo

## Ejecutar el proyecto

### Backend
cd backend/NestStay.API
dotnet run

### Frontend
cd frontend
npm install
npm run dev