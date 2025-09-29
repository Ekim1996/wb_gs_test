import knex from "knex";
import { GoogleSheetsService } from "./services/google/sheets/google-sheets.service";
import { SyncToSheetsService } from "./services/google/sheets/sync-to-sheets.service";


async function main() {
  const db = knex({
    client: "pg",
    connection: process.env.DATABASE_URL,
  });

  const sheetsService = new GoogleSheetsService('/app/trim-karma-473513-h5-52a7d5bdbb8c.json');

  const syncService = new SyncToSheetsService(db, sheetsService);

  const spreadsheets = [
    "1yUUzuHo4K9ECTdlPXuzLioy0LFJmYMmtTEu_cXq9uwI",
    "120Q734AfD7n1TKXUG5TNP4mLnXRQNqzqrRuEvGRefuM",
    "1TteOZcKfA2zOkMl9HpUIiM9l28G7_Wn0KKU7NdWZfQc"
  ];

  for (const id of spreadsheets) {
    try {
      await syncService.exportTariffs(id, "stocks_coefs");
    } catch (e) {
      console.error(`Ошибка при выгрузке для ${id}:`, e);
    }
  }

  await db.destroy();
  console.log("Google Sheets job завершен");
}

main().catch((err) => {
  console.error("Ошибка gs-job:", err);
  process.exit(1);
});
