using Microsoft.EntityFrameworkCore.Migrations;
using Pragmap.Domain.Entities;

#nullable disable

namespace Pragmap.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InsertRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { Guid.NewGuid(), Role.ADMINISTRATOR },
                    { Guid.NewGuid(), Role.MANAGER },
		    { Guid.NewGuid(), Role.EDITOR },
                    { Guid.NewGuid(), Role.READER }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Name",
                keyValues: new object[]
                {
                    Role.ADMINISTRATOR,
                    Role.MANAGER,
		    Role.EDITOR,
                    Role.READER
                });
        }
    }
}
