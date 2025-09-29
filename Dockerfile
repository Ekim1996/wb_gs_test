FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY --from=builder /app/dist ./dist

COPY .env* ./


RUN echo "import Knex from 'knex'; import knexConfig from './knexfile'; const knex = Knex(knexConfig.development); export function parseNumber(str) { return parseFloat(str.replace(',', '.')); } export default knex;" > predb.js

RUN npx knex migrate:latest --knexfile ./dist/knexfile.js

CMD ["sh", "-c", "\
if [ \"$JOB_TYPE\" = \"WB\" ]; then \
  node dist/wb-action.js; \
elif [ \"$JOB_TYPE\" = \"GS\" ]; then \
  node dist/index.js; \
else \
  node dist/index.js; \
fi"]
