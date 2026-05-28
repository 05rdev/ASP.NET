using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CMS.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddDisplayOrderAndIsActive : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_CategoriesProducts_CategoryProductId",
                table: "Products");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CategoriesProducts",
                table: "CategoriesProducts");

            migrationBuilder.RenameTable(
                name: "CategoriesProducts",
                newName: "CategoryProduct");

            migrationBuilder.AddColumn<int>(
                name: "DisplayOrder",
                table: "CategoryProduct",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "CategoryProduct",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddPrimaryKey(
                name: "PK_CategoryProduct",
                table: "CategoryProduct",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_CategoryProduct_CategoryProductId",
                table: "Products",
                column: "CategoryProductId",
                principalTable: "CategoryProduct",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_CategoryProduct_CategoryProductId",
                table: "Products");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CategoryProduct",
                table: "CategoryProduct");

            migrationBuilder.DropColumn(
                name: "DisplayOrder",
                table: "CategoryProduct");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "CategoryProduct");

            migrationBuilder.RenameTable(
                name: "CategoryProduct",
                newName: "CategoriesProducts");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CategoriesProducts",
                table: "CategoriesProducts",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_CategoriesProducts_CategoryProductId",
                table: "Products",
                column: "CategoryProductId",
                principalTable: "CategoriesProducts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
