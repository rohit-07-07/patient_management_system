import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'Bill ID is required' })
  @IsString()
  billId: string;
}
