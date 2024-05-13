import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BreakdownsService } from './breakdowns.service';
import { CreateBreakdownDto } from './dto/create-breakdown.dto';
import { UpdateBreakdownDto } from './dto/update-breakdown.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Breakdowns')
@Controller('breakdowns')
export class BreakdownsController {
  constructor(private readonly breakdownsService: BreakdownsService) {}

  @Post()
  create(@Body() createBreakdownDto: CreateBreakdownDto) {
    return this.breakdownsService.create(createBreakdownDto);
  }

  @Get()
  findAll() {
    return this.breakdownsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.breakdownsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBreakdownDto: UpdateBreakdownDto,
  ) {
    return this.breakdownsService.update(+id, updateBreakdownDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.breakdownsService.remove(+id);
  }
}
