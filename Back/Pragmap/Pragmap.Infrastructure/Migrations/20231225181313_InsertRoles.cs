using Microsoft.EntityFrameworkCore.Migrations;
using Pragmap.Domain.Entities;

#nullable disable

namespace Pragmap.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InsertRoles : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { Guid.NewGuid(), Role.ADMINISTRATEUR },
                    { Guid.NewGuid(), Role.GESTIONNAIRE },
                    { Guid.NewGuid(), Role.LECTEUR },
                    { Guid.NewGuid(), Role.EDITEUR }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Name",
                keyValues: new object[]
                {
                    Role.ADMINISTRATEUR,
                    Role.GESTIONNAIRE,
                    Role.LECTEUR,
                    Role.EDITEUR
                });
        }

    }
}
