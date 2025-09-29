import express from 'express';
import Knex from 'knex';
import dotenv from 'dotenv';
import { WbTariffsService } from "./services/marketplaces/wb/tariffs/tariffs.service";
import knexConfig from './knexfile'; 

dotenv.config();
const app = express();

const knex = Knex(knexConfig.development);

const wbService = new WbTariffsService(knex);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(4445, async () => {
  console.log('Server has been started on port 4445');
});

