import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { CreateProducerDto } from './dtos/create-producer.dto';
import { UpdateProducerDto } from './dtos/update-producer.dto';

@Controller('producers')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProducerDto: CreateProducerDto) {
    return await this.producerService.create(createProducerDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateProducerDto: UpdateProducerDto,
  ) {
    return await this.producerService.update(id, updateProducerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    await this.producerService.remove(id);
  }

  @Get()
  async findAll() {
    return await this.producerService.findAll();
  }
  
  @Get('/statistics')
  async getStatistics() {
    return this.producerService.getStatistics();
  }
  
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.producerService.findOne(id);
  }

}
