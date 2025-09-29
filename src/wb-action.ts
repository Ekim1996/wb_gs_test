import Knex from 'knex';
import dotenv from 'dotenv';
import knexConfig from './knexfile';
import { WbTariffsService } from './services/marketplaces/wb/tariffs/tariffs.service';

dotenv.config();

const knex = Knex(knexConfig.development);
const wbService = new WbTariffsService(knex);

async function main() {
  try {
    await wbService.syncTariffs('2025-09-27');
    console.log("WB Job выполнен успешно");
  } catch (error) {
    console.error("Ошибка в WB Job:", error);
  } finally {
    await knex.destroy();
  }
}

main();