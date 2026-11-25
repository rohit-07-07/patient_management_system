import { IsNumber, Min, IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateBillDto {
  @IsOptional()
  @IsString()
  patientId?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Amount must be a numeric value' })
  @Min(1, { message: 'Amount must be greater than zero' })
  amount?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Tax must be a numeric value' })
  @Min(0, { message: 'Tax cannot be negative' })
  tax?: number;

  @IsOptional()
  @IsString()
  @IsIn(['Pending', 'Paid', 'Failed', 'Cancelled'])
  paymentStatus?: string;
}
