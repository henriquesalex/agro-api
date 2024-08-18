import { Module } from '@nestjs/common';
import { Producer } from './entities/producer.entity';
import { ProducerService } from './producer.service';
import { ProducerController } from './producer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Producer])],
  providers: [ProducerService],
  controllers: [ProducerController]
})
export class ProducerModule {}
