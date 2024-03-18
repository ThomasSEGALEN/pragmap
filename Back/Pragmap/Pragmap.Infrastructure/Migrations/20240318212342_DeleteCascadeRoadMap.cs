using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Pragmap.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DeleteCascadeRoadMap : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddForeignKey(
                name: "FK_RoadMaps_Customer_CustomerId",
                table: "RoadMaps",
                column: "CustomerId",
                principalTable: "Customer",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RoadMaps_Customer_CustomerId",
                table: "RoadMaps");
        }
    }
}
