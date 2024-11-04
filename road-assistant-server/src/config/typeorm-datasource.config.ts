import { configuration } from './configuration';
import { DataSource } from 'typeorm';
import { TypeOrmDataSourceConfig } from './interface';
import { config } from 'dotenv';

config();
const db = configuration().db as TypeOrmDataSourceConfig;
export default new DataSource(db);
