import { IsNotEmpty, IsNumber, Min, IsString, IsOptional, IsIn } from 'class-validator';

export class CreateBillDto {
  @IsNotEmpty({ message: 'Patient selection is required' })
  @IsString()
  patientId: string;

  @IsNotEmpty({ message: 'Service or bill description is required' })
  @IsString()
  description: string;

  @IsNumber({}, { message: 'Amount must be a numeric value' })
  @Min(1, { message: 'Amount must be greater than zero' })
  amount: number;

  @IsOptional()
  @IsNumber({}, { message: 'Tax must be a numeric value' })
  @Min(0, { message: 'Tax cannot be negative' })
  tax?: number;

  @IsOptional()
  @IsString()
  @IsIn(['Pending', 'Paid', 'Failed', 'Cancelled'])
  paymentStatus?: string;
}
