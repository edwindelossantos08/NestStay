using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace NestStay.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAmenities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Amenities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Icon = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Category = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Amenities", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "PropertyAmenities",
                columns: table => new
                {
                    PropertyId = table.Column<int>(type: "int", nullable: false),
                    AmenityId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyAmenities", x => new { x.PropertyId, x.AmenityId });
                    table.ForeignKey(
                        name: "FK_PropertyAmenities_Amenities_AmenityId",
                        column: x => x.AmenityId,
                        principalTable: "Amenities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PropertyAmenities_Properties_PropertyId",
                        column: x => x.PropertyId,
                        principalTable: "Properties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Amenities",
                columns: new[] { "Id", "Category", "Icon", "Name" },
                values: new object[,]
                {
                    { 1, "Esenciales", "Wifi", "WiFi" },
                    { 2, "Esenciales", "UtensilsCrossed", "Cocina" },
                    { 3, "Esenciales", "WashingMachine", "Lavadora" },
                    { 4, "Esenciales", "Wind", "Aire acondicionado" },
                    { 5, "Esenciales", "Flame", "Calefacción" },
                    { 6, "Esenciales", "Tv", "TV" },
                    { 7, "Características", "Waves", "Piscina" },
                    { 8, "Características", "Droplets", "Jacuzzi" },
                    { 9, "Características", "Dumbbell", "Gimnasio" },
                    { 10, "Características", "Sun", "Terraza" },
                    { 11, "Características", "Flame", "Barbacoa" },
                    { 12, "Seguridad", "AlertTriangle", "Detector de humo" },
                    { 13, "Seguridad", "Shield", "Extintor" },
                    { 14, "Seguridad", "Heart", "Botiquín" },
                    { 15, "Ubicación", "Car", "Estacionamiento gratuito" },
                    { 16, "Ubicación", "Waves", "Frente al mar" },
                    { 17, "Ubicación", "Mountain", "Vista a la montaña" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Amenities_Name",
                table: "Amenities",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PropertyAmenities_AmenityId",
                table: "PropertyAmenities",
                column: "AmenityId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PropertyAmenities");

            migrationBuilder.DropTable(
                name: "Amenities");
        }
    }
}
