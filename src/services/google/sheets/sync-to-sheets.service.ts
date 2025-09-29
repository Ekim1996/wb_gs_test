import type { Knex } from "knex";
import { GoogleSheetsService } from "./google-sheets.service";
import { WbBoxTariff } from "../../marketplaces/wb/tariffs/interfaces/wb-box-tariff.interface";


export class SyncToSheetsService {
  constructor(private knex: Knex, private sheets: GoogleSheetsService) {}

  async exportTariffs(spreadsheetId: string, sheetName = "stocks_coefs") {
    const tariffs: WbBoxTariff[] = await this.knex<WbBoxTariff>("wb_box_tariffs").select();

    if (!tariffs.length) {
      console.log(" Нет данных для выгрузки");
      return;
    }

    const header = Object.keys(tariffs[0]);
    const rows = tariffs.map((t) => Object.values(t));

    const values = [header, ...rows];

    const range = `${sheetName}!A1`;
    await this.sheets.clear(spreadsheetId, range);
    await this.sheets.write(spreadsheetId, range, values);

    console.log(` В таблицу выгружено ${tariffs.length} строк`);
  }
}
