import { google } from "googleapis";
import path from "path";

export class GoogleSheetsService {
  private sheets;

  constructor(keyFilePath:string) {
    const auth = new google.auth.GoogleAuth({
      keyFile: keyFilePath,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    this.sheets = google.sheets({ version: "v4", auth });
  }

  async clear(spreadsheetId: string, range: string) {
    await this.sheets.spreadsheets.values.clear({
      spreadsheetId,
      range,
    });
    console.log(`Очищен диапазон ${range}`);
  }

  async write(spreadsheetId: string, range: string, values: any[][]) {
    await this.sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });
    console.log(` Данные записаны в Google Sheets (${range})`);
  }
}