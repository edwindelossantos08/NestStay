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
    public DbSet<BlockedDate> BlockedDates => Set<BlockedDate>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Notification> Notifications => Set<Notification>();

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
    }
}
