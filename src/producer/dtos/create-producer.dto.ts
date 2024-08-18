import { IsNotEmpty, IsNumber, IsString, IsArray, ValidateIf } from 'class-validator';

export class CreateProducerDto {
  @IsNotEmpty()
  @IsString()
  cpfOrCnpj: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  farmName: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNumber()
  totalArea: number;

  @IsNumber()
  farmableArea: number;

  @IsNumber()
  vegetationArea: number;

  @IsArray()
  crops: string[];
}
