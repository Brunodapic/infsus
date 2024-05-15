import { Module } from '@nestjs/common';
import { BreakdownsService } from './breakdowns.service';
import { BreakdownsController } from './breakdowns.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Breakdown } from './entities/breakdown.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Breakdown])],
  controllers: [BreakdownsController],
  providers: [BreakdownsService],
  exports: [BreakdownsService],
})
export class BreakdownsModule {}
