import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';

const connectionOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'dpg-cnkujkol6cac73a8pfig-a.frankfurt-postgres.render.com',
  port: 5432,
  username: 'user',
  password: 'p090y9likdL53pdzqNfQAWr30WVLpgRg',
  database: 'infsusdb',
  ssl: { rejectUnauthorized: false },
  entities: [User],
  migrations: ['dist/database/migrations/*.js'],
  migrationsRun: true,
  synchronize: true,
  logging: true,
};

export = connectionOptions;
