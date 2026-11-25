import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../patients/entities/patient.entity';
import { Bill } from '../billing/entities/bill.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Bill)
    private readonly billRepository: Repository<Bill>
  ) {}

  async getSummary() {
    const totalPatients = await this.patientRepository.count();
    const totalBills = await this.billRepository.count();

    const recentPatients = await this.patientRepository.find({
      order: { createdAt: 'DESC' },
      take: 5
    });

    const bills = await this.billRepository.find();

    let totalPaidAmount = 0;
    let totalPendingAmount = 0;

    for (const b of bills) {
      const amt = Number(b.totalAmount) || 0;
      if (b.paymentStatus === 'Paid') {
        totalPaidAmount += amt;
      } else if (b.paymentStatus === 'Pending') {
        totalPendingAmount += amt;
      }
    }

    return {
      totalPatients,
      totalBills,
      totalPaidAmount: parseFloat(totalPaidAmount.toFixed(2)),
      totalPendingAmount: parseFloat(totalPendingAmount.toFixed(2)),
      recentPatients
    };
  }
}
