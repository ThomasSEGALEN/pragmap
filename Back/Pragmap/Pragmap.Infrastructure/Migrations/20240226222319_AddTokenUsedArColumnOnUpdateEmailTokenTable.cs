using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Pragmap.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTokenUsedArColumnOnUpdateEmailTokenTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "TokenUsedAt",
                table: "UpdateEmailToken",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TokenUsedAt",
                table: "UpdateEmailToken");
        }
    }
}
