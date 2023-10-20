import { DynamicModule, Inject, Module } from '@nestjs/common';
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { DB } from 'kysely-codegen';
import { Pool } from 'pg';
export type DatabaseConfig = {
  host: string;
  port: string;
  user: string;
  pass: string;
  database: string;
};
@Module({})
export class DatabaseModule {
  static KYSELY = 'kysely instance';
  static DbInstance: Kysely<DB>;
  static forRoot(config: DatabaseConfig): DynamicModule {
    const dialect = new PostgresDialect({
      pool: new Pool({
        database: config.database,
        host: config.host,
        user: config.user,
        port: parseInt(config.port || '5432'),
        password: config.pass,
        connectionTimeoutMillis: 500,
        max: 10,
      }),
    });
    const db = new Kysely<DB>({
      dialect,
      plugins: [new CamelCasePlugin()],
      log: ['error', 'query'],
    });
    DatabaseModule.DbInstance = db;
    const service = { provide: DatabaseModule.KYSELY, useValue: db };
    return {
      module: DatabaseModule,
      providers: [service],
      exports: [service],
      global: true,
    };
  }
  public static getDbInstance() {
    return DatabaseModule.DbInstance;
  }
}

export type Repository = Kysely<DB>;
export function InjectRepository() {
  return Inject(DatabaseModule.KYSELY);
}
