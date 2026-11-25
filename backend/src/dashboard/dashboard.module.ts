import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Patient } from '../patients/entities/patient.entity';
import { Bill } from '../billing/entities/bill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Bill])],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}
