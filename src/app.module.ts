import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProducerModule } from './producer/producer.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '2812',
      database: 'rural_producers',
      autoLoadEntities: true,
      synchronize: true,  // Desativar em produção
    }),
    ProducerModule,
  ],
})
export class AppModule {}
