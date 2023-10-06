import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const POSTGRES_CONFIG: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  autoLoadEntities: true,
  synchronize: process.env.ORM_SYNC === 'true',
};
