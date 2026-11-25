import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { Bill } from './entities/bill.entity';
import { Patient } from '../patients/entities/patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bill, Patient])],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [BillingService]
})
export class BillingModule {}
