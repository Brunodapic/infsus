import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { BreakdownsModule } from './breakdowns/breakdowns.module';
import * as connectionOptions from './ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(connectionOptions),
    UserModule,
    BreakdownsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
