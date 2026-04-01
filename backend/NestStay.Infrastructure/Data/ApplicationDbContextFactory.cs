using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

namespace NestStay.Infrastructure.Data;

// Fábrica usada solo por las herramientas de diseño (dotnet ef migrations)
public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();

        optionsBuilder.UseMySql(
            "Server=localhost;Port=3306;Database=neststay_db;User=root;Password=08081603;",
            new MySqlServerVersion(new Version(8, 0, 28)));

        return new ApplicationDbContext(optionsBuilder.Options);
    }
}
