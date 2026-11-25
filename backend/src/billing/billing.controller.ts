import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bills')
@UseGuards(JwtAuthGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get()
  findAll() {
    return this.billingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.billingService.findOne(id);
  }

  @Post()
  create(@Body() createBillDto: CreateBillDto) {
    return this.billingService.create(createBillDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateBillDto: UpdateBillDto
  ) {
    return this.billingService.update(id, updateBillDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.billingService.remove(id);
  }
}
