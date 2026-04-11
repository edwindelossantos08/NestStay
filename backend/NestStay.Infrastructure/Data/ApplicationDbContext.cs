using Microsoft.EntityFrameworkCore;
using NestStay.Domain.Entities;
using NestStay.Domain.Enums;

namespace NestStay.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Property> Properties => Set<Property>();
    public DbSet<PropertyImage> PropertyImages => Set<PropertyImage>();
    public DbSet<BlockedDate> BlockedDates => Set<BlockedDate>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<Amenity> Amenities => Set<Amenity>();
    public DbSet<PropertyAmenity> PropertyAmenities => Set<PropertyAmenity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // --- User ---
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Email).IsUnique();
            entity.HasIndex(u => u.ConfirmationToken).IsUnique();
            entity.Property(u => u.ConfirmationToken).IsRequired(false);
            entity.Property(u => u.Roles).HasDefaultValue("Guest");
            entity.Property(u => u.AvatarUrl)
                  .HasMaxLength(500)
                  .IsRequired(false);
        });

        // --- Property ---
        modelBuilder.Entity<Property>(entity =>
        {
            entity.Property(p => p.PricePerNight).HasPrecision(10, 2);

            // ImageUrl es opcional, máximo 500 caracteres
            entity.Property(p => p.ImageUrl).HasMaxLength(500).IsRequired(false);

            // Precisión decimal(10,7) suficiente para coordenadas GPS
            entity.Property(p => p.Latitude)
                  .HasColumnType("decimal(10,7)")
                  .IsRequired(false);

            entity.Property(p => p.Longitude)
                  .HasColumnType("decimal(10,7)")
                  .IsRequired(false);

            entity.HasOne(p => p.Host)
                  .WithMany(u => u.Properties)
                  .HasForeignKey(p => p.HostId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // --- PropertyImage ---
        modelBuilder.Entity<PropertyImage>(entity =>
        {
            entity.HasKey(pi => pi.Id);

            entity.Property(pi => pi.Url)
                  .HasMaxLength(500)
                  .IsRequired();

            // Orden de visualización, default 0
            entity.Property(pi => pi.DisplayOrder)
                  .HasDefaultValue(0);

            entity.Property(pi => pi.CreatedAt)
                  .HasDefaultValueSql("CURRENT_TIMESTAMP(6)");

            // Al eliminar la propiedad se eliminan sus imágenes
            entity.HasOne(pi => pi.Property)
                  .WithMany(p => p.Images)
                  .HasForeignKey(pi => pi.PropertyId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // --- BlockedDate ---
        modelBuilder.Entity<BlockedDate>(entity =>
        {
            entity.HasIndex(b => new { b.PropertyId, b.Date }).IsUnique();
        });

        // --- Booking ---
        modelBuilder.Entity<Booking>(entity =>
        {
            entity.Property(b => b.Status)
                  .HasConversion<string>();

            entity.Property(b => b.TotalPrice).HasPrecision(10, 2);

            entity.HasOne(b => b.Property)
                  .WithMany(p => p.Bookings)
                  .HasForeignKey(b => b.PropertyId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(b => b.Guest)
                  .WithMany(u => u.Bookings)
                  .HasForeignKey(b => b.GuestId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // --- Review ---
        modelBuilder.Entity<Review>(entity =>
        {
            entity.ToTable(t => t.HasCheckConstraint("CK_Reviews_Rating", "Rating >= 1 AND Rating <= 5"));

            entity.HasOne(r => r.Booking)
                  .WithOne(b => b.Review)
                  .HasForeignKey<Review>(r => r.BookingId);

            entity.HasOne(r => r.Property)
                  .WithMany(p => p.Reviews)
                  .HasForeignKey(r => r.PropertyId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(r => r.Guest)
                  .WithMany(u => u.Reviews)
                  .HasForeignKey(r => r.GuestId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // --- Notification ---
        modelBuilder.Entity<Notification>(entity =>
        {
            entity.Property(n => n.IsRead).HasDefaultValue(false);
        });

        // --- Amenity ---
        modelBuilder.Entity<Amenity>(entity =>
        {
            entity.HasKey(a => a.Id);
            entity.Property(a => a.Name).HasMaxLength(100).IsRequired();
            entity.Property(a => a.Icon).HasMaxLength(50).IsRequired();
            entity.Property(a => a.Category).HasMaxLength(50).IsRequired();
            entity.HasIndex(a => a.Name).IsUnique();
        });

        // --- PropertyAmenity ---
        modelBuilder.Entity<PropertyAmenity>(entity =>
        {
            entity.HasKey(pa => new { pa.PropertyId, pa.AmenityId });

            entity.HasOne(pa => pa.Property)
                .WithMany(p => p.PropertyAmenities)
                .HasForeignKey(pa => pa.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(pa => pa.Amenity)
                .WithMany(a => a.PropertyAmenities)
                .HasForeignKey(pa => pa.AmenityId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // --- Seed Data ---
        modelBuilder.Entity<Amenity>().HasData(
            // Esenciales
            new Amenity { Id = 1, Name = "WiFi", Icon = "Wifi", Category = "Esenciales" },
            new Amenity { Id = 2, Name = "Cocina", Icon = "UtensilsCrossed", Category = "Esenciales" },
            new Amenity { Id = 3, Name = "Lavadora", Icon = "WashingMachine", Category = "Esenciales" },
            new Amenity { Id = 4, Name = "Aire acondicionado", Icon = "Wind", Category = "Esenciales" },
            new Amenity { Id = 5, Name = "Calefacción", Icon = "Flame", Category = "Esenciales" },
            new Amenity { Id = 6, Name = "TV", Icon = "Tv", Category = "Esenciales" },
            
            // Características especiales
            new Amenity { Id = 7, Name = "Piscina", Icon = "Waves", Category = "Características" },
            new Amenity { Id = 8, Name = "Jacuzzi", Icon = "Droplets", Category = "Características" },
            new Amenity { Id = 9, Name = "Gimnasio", Icon = "Dumbbell", Category = "Características" },
            new Amenity { Id = 10, Name = "Terraza", Icon = "Sun", Category = "Características" },
            new Amenity { Id = 11, Name = "Barbacoa", Icon = "Flame", Category = "Características" },
            
            // Seguridad
            new Amenity { Id = 12, Name = "Detector de humo", Icon = "AlertTriangle", Category = "Seguridad" },
            new Amenity { Id = 13, Name = "Extintor", Icon = "Shield", Category = "Seguridad" },
            new Amenity { Id = 14, Name = "Botiquín", Icon = "Heart", Category = "Seguridad" },
            
            // Ubicación
            new Amenity { Id = 15, Name = "Estacionamiento gratuito", Icon = "Car", Category = "Ubicación" },
            new Amenity { Id = 16, Name = "Frente al mar", Icon = "Waves", Category = "Ubicación" },
            new Amenity { Id = 17, Name = "Vista a la montaña", Icon = "Mountain", Category = "Ubicación" }
        );
    }
}
