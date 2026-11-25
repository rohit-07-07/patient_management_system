import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class VerifyPaymentDto {
  @IsNotEmpty({ message: 'Bill ID is required' })
  @IsString()
  billId: string;

  @IsNotEmpty({ message: 'Razorpay Order ID is required' })
  @IsString()
  razorpayOrderId: string;

  @IsNotEmpty({ message: 'Razorpay Payment ID is required' })
  @IsString()
  razorpayPaymentId: string;

  @IsNotEmpty({ message: 'Razorpay Signature is required' })
  @IsString()
  razorpaySignature: string;

  @IsOptional()
  @IsString()
  failureReason?: string;
}
