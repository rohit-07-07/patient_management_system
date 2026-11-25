import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-order')
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.paymentsService.createOrder(createOrderDto);
  }

  @Post('verify')
  verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto) {
    return this.paymentsService.verifyPayment(verifyPaymentDto);
  }

  @Get('history')
  getAllPayments() {
    return this.paymentsService.getAllPayments();
  }

  @Get(':id')
  getPaymentDetails(@Param('id') id: string) {
    return this.paymentsService.getPaymentDetails(id);
  }
}
