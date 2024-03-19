using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Pragmap.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DeleteCascadeRoadmap : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddForeignKey(
                name: "FK_Roadmaps_Customers_CustomerId",
                table: "Roadmaps",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Roadmaps_Customers_CustomerId",
                table: "Roadmaps");
        }
    }
}
