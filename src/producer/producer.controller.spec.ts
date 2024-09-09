import { Test, TestingModule } from '@nestjs/testing';
import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';
import { CreateProducerDto } from './dtos/create-producer.dto';

describe('ProducerController', () => {
  let controller: ProducerController;
  let service: ProducerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProducerController],
      providers: [
        {
          provide: ProducerService,
          useValue: {
            create: jest.fn().mockResolvedValue({
              id: 1,
              cpfOrCnpj: '12345678901234',
              name: 'Produtor Teste',
              farmName: 'Fazenda Teste',
              city: 'Cidade Teste',
              state: 'Estado Teste',
              totalArea: 100,
              farmableArea: 60,
              vegetationArea: 40,
              crops: ['Soja', 'Milho'],
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<ProducerController>(ProducerController);
    service = module.get<ProducerService>(ProducerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a producer', async () => {
    const createProducerDto: CreateProducerDto = {
      cpfOrCnpj: '12345678901234',
      name: 'Produtor Teste',
      farmName: 'Fazenda Teste',
      city: 'Cidade Teste',
      state: 'Estado Teste',
      totalArea: 100,
      farmableArea: 60,
      vegetationArea: 40,
      crops: ['Soja', 'Milho'],
    };

    const result = await controller.create(createProducerDto);

    expect(result).toEqual({
      id: 1,
      cpfOrCnpj: '12345678901234',
      name: 'Produtor Teste',
      farmName: 'Fazenda Teste',
      city: 'Cidade Teste',
      state: 'Estado Teste',
      totalArea: 100,
      farmableArea: 60,
      vegetationArea: 40,
      crops: ['Soja', 'Milho'],
    });
    expect(service.create).toHaveBeenCalledWith(createProducerDto);
  });
});
