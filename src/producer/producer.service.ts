import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producer } from './entities/producer.entity';
import { CreateProducerDto } from './dtos/create-producer.dto';
import { UpdateProducerDto } from './dtos/update-producer.dto';
import { validateCPF, validateCNPJ } from './utils/validators';

@Injectable()
export class ProducerService {
  constructor(
    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
  ) {}
  
  async create(createProducerDto: CreateProducerDto): Promise<Producer> {
    const { cpfOrCnpj, totalArea, farmableArea, vegetationArea } = createProducerDto;

    if (cpfOrCnpj.length === 11 && !validateCPF(cpfOrCnpj)) {
        throw new BadRequestException('Invalid CPF');
      }
    if (cpfOrCnpj.length === 14 && !validateCNPJ(cpfOrCnpj)) {
        throw new BadRequestException('Invalid CNPJ');
      }
    if (cpfOrCnpj.length !== 14 &&  cpfOrCnpj.length !== 11) {
        throw new BadRequestException('Invalid Document');
      }

    if (farmableArea + vegetationArea > totalArea) {
      throw new BadRequestException('A soma da área agricultável e vegetação não pode ser maior que a área total.');
    }

    const producer = this.producerRepository.create(createProducerDto);
    return await this.producerRepository.save(producer);
  }

  async update(id: number, updateProducerDto: UpdateProducerDto): Promise<Producer> {
    const producer = await this.producerRepository.findOneBy({ id });

    if (!producer) {
      throw new NotFoundException('Produtor não encontrado.');
    }

    const updatedProducer = Object.assign(producer, updateProducerDto);

    if (updatedProducer.farmableArea + updatedProducer.vegetationArea > updatedProducer.totalArea) {
      throw new BadRequestException('A soma da área agricultável e vegetação não pode ser maior que a área total.');
    }

    return await this.producerRepository.save(updatedProducer);
  }

  async remove(id: number): Promise<void> {
    const result = await this.producerRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Produtor não encontrado.');
    }
  }
  async findOne(id: number): Promise<Producer> {
    return await this.producerRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Producer[]> {
    return await this.producerRepository.find();
  }

  async getStatistics() {
    // Total de fazendas em quantidade
    const totalFarms = await this.producerRepository.count();

    // Total de fazendas em hectares (área total)
    const totalArea = await this.producerRepository.createQueryBuilder('producer')
      .select('SUM(producer.totalArea)', 'total')
      .getRawOne();

    // Gráfico de pizza por estado
    const farmsByState = await this.producerRepository.createQueryBuilder('producer')
      .select('producer.state', 'state')
      .addSelect('COUNT(producer.id)', 'count')
      .groupBy('producer.state')
      .getRawMany();

    // Gráfico de pizza por cultura
    const cropsData = await this.producerRepository.createQueryBuilder('producer')
    .select('producer.crops', 'crops')
    .getRawMany();

    // Processar os dados
    const cropCounts = cropsData.reduce((acc, row) => {
        const crops = row.crops.split(',').map(crop => crop.trim());
        crops.forEach(crop => {
        acc[crop] = (acc[crop] || 0) + 1;
        });
        return acc;
    }, {});

    // Converter para o formato esperado
    const crops = Object.entries(cropCounts).map(([crop, count]) => ({ crop, count }));

    // Gráfico de pizza por uso de solo (Área agricultável e vegetação)
    const landUse = await this.producerRepository.createQueryBuilder('producer')
      .select('SUM(producer.farmableArea)', 'farmableArea')
      .addSelect('SUM(producer.vegetationArea)', 'vegetationArea')
      .getRawOne();

    return {
      totalFarms,
      totalArea: totalArea.total,
      farmsByState,
      crops,
      landUse
    };
  }


}
