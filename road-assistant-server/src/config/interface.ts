import {
  ContactObject,
  LicenseObject,
  SecuritySchemeObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export interface DatabaseConfig {
  type: 'mysql' | 'postgres';
  port: number;
  host: string;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  migrationsRun: boolean;
  entities: Array<string>;
  migrations: Array<string>;
}

export interface CliTypeOrmConfig {
  entitiesDir: string;
  migrationsDir: string;
  subscribersDir: string;
}

export interface TypeOrmDataSourceConfig extends DatabaseConfig {
  ormEntities: Array<string>;
  subscribers: Array<string>;
  cli: CliTypeOrmConfig;
}

export interface SwaggerConfig {
  openapi: string;
  title: string;
  version: string;
  description?: string;
  license: LicenseObject;
  contact: ContactObject;
  authorization: SecuritySchemeObject;
}

export interface CorsConfig {
  origin: string;
  methods: Array<string>;
  credentials: boolean;
}
