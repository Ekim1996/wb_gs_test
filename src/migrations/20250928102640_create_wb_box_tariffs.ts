import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
   await knex.schema.createTable("wb_box_tariffs", (table) => {
    table.increments("id").primary();

    table.string("boxDeliveryBase").notNullable();
    table.string("boxDeliveryCoefExpr").nullable();
    table.string("boxDeliveryLiter").notNullable();

    table.string("boxDeliveryMarketplaceBase").notNullable();
    table.string("boxDeliveryMarketplaceCoefExpr").nullable();
    table.string("boxDeliveryMarketplaceLiter").notNullable();

    table.string("boxStorageBase").notNullable();
    table.string("boxStorageCoefExpr").nullable();
    table.string("boxStorageLiter").notNullable();

    table.string("geoName").notNullable();
    table.string("warehouseName").notNullable();

    table.string("createdAt").defaultTo(knex.fn.now());
    table.string("updatedAt").defaultTo(knex.fn.now());
  });
}
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("wb_box_tariffs");
}