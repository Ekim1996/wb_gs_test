import dotenv from 'dotenv';
import type { Knex } from 'knex';
import { WbBoxTariff } from './interfaces/wb-box-tariff.interface';
dotenv.config({ path: '.env.dev' });

export class WbTariffsService {
  constructor(private knex: Knex) {}

  private parseNumber(value: string | number): number {
    if (typeof value === 'number') return value;
    return Number(value.toString().replace(',', '.'));
  }

  private isToday(date: Date) {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
  }

  async fetchTariffs(): Promise<WbBoxTariff[]> {
    const res = await fetch(`${process.env.URL_WB_TARIFFS_BOXES}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${process.env.TOKEN_WB}`,
      },
    });

    const data = await res.json();

    const tariffs: WbBoxTariff[] = data.response.data.warehouseList.map((item: any) => ({
      boxDeliveryBase: this.parseNumber(item.boxDeliveryBase),
      boxDeliveryCoefExpr: this.parseNumber(item.boxDeliveryCoefExpr),
      boxDeliveryLiter: this.parseNumber(item.boxDeliveryLiter),
      boxDeliveryMarketplaceBase: this.parseNumber(item.boxDeliveryMarketplaceBase),
      boxDeliveryMarketplaceCoefExpr: this.parseNumber(item.boxDeliveryMarketplaceCoefExpr),
      boxDeliveryMarketplaceLiter: this.parseNumber(item.boxDeliveryMarketplaceLiter),
      boxStorageBase: this.parseNumber(item.boxStorageBase),
      boxStorageCoefExpr: this.parseNumber(item.boxStorageCoefExpr),
      boxStorageLiter: this.parseNumber(item.boxStorageLiter),
      geoName: item.geoName,
      warehouseName: item.warehouseName,
    }));

    tariffs.sort((a:any, b:any) => b.boxDeliveryCoefExpr - a.boxDeliveryCoefExpr);

    return tariffs;
  }

  async upsertTariffs(tariffs: WbBoxTariff[]) {
    const now = new Date();
    for (const tariff of tariffs) {
      const existing:any = await this.knex<WbBoxTariff>('wb_box_tariffs')
        .where({ geoName: tariff.geoName, warehouseName: tariff.warehouseName })
        .first();

      if (existing && this.isToday(new Date(existing.updatedAt))) {
        await this.knex<WbBoxTariff>('wb_box_tariffs')
          .update({ ...tariff, updatedAt: now.toISOString() })
          .where({ id: existing.id });
      } else {
        await this.knex<WbBoxTariff>('wb_box_tariffs').insert({
          ...tariff,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        });
      }
    }
  }

  async syncTariffs() {
    const tariffs = await this.fetchTariffs();
    await this.upsertTariffs(tariffs);
    console.log(`Сохранено/обновлено ${tariffs.length} записей (по updatedAt)`);
  }
}
