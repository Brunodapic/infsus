import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const connectionOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'dpg-cnkujkol6cac73a8pfig-a.frankfurt-postgres.render.com',
  port: 5432,
  username: 'user',
  password: 'p090y9likdL53pdzqNfQAWr30WVLpgRg',
  database: 'infsusdb',
  ssl: { rejectUnauthorized: false },
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
  migrationsRun: true,
  synchronize: false,
};

export = connectionOptions;
