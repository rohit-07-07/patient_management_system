import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from './entities/bill.entity';
import { Patient } from '../patients/entities/patient.entity';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Bill)
    private readonly billRepository: Repository<Bill>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>
  ) {}

  async onModuleInit() {
    const count = await this.billRepository.count();
    if (count === 0) {
      const patient = await this.patientRepository.findOne({ where: {} });
      if (patient) {
        const sampleBill = this.billRepository.create({
          patientId: patient.id,
          description: 'Comprehensive Health Screening & Diagnostic Blood Work',
          amount: 250.00,
          tax: 25.00,
          totalAmount: 275.00,
          paymentStatus: 'Pending'
        });
        await this.billRepository.save(sampleBill);
      }
    }
  }

  async findAll() {
    return await this.billRepository.find({
      relations: ['patient', 'payments'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string) {
    const bill = await this.billRepository.findOne({
      where: { id },
      relations: ['patient', 'payments']
    });

    if (!bill) {
      throw new NotFoundException(`Bill with ID "${id}" was not found`);
    }

    return bill;
  }

  async create(createBillDto: CreateBillDto) {
    const patient = await this.patientRepository.findOne({
      where: { id: createBillDto.patientId }
    });

    if (!patient) {
      throw new NotFoundException('Selected patient does not exist');
    }

    const amount = Number(createBillDto.amount);
    const tax = createBillDto.tax !== undefined ? Number(createBillDto.tax) : 0;
    const totalAmount = parseFloat((amount + tax).toFixed(2));

    const bill = this.billRepository.create({
      patientId: createBillDto.patientId,
      description: createBillDto.description,
      amount,
      tax,
      totalAmount,
      paymentStatus: createBillDto.paymentStatus || 'Pending'
    });

    return await this.billRepository.save(bill);
  }

  async update(id: string, updateBillDto: UpdateBillDto) {
    const bill = await this.findOne(id);

    if (updateBillDto.patientId && updateBillDto.patientId !== bill.patientId) {
      const patient = await this.patientRepository.findOne({
        where: { id: updateBillDto.patientId }
      });
      if (!patient) {
        throw new NotFoundException('Selected patient does not exist');
      }
      bill.patientId = updateBillDto.patientId;
    }

    if (updateBillDto.description !== undefined) {
      bill.description = updateBillDto.description;
    }

    if (updateBillDto.amount !== undefined) {
      bill.amount = Number(updateBillDto.amount);
    }

    if (updateBillDto.tax !== undefined) {
      bill.tax = Number(updateBillDto.tax);
    }

    bill.totalAmount = parseFloat((Number(bill.amount) + Number(bill.tax)).toFixed(2));

    if (updateBillDto.paymentStatus !== undefined) {
      bill.paymentStatus = updateBillDto.paymentStatus;
    }

    return await this.billRepository.save(bill);
  }

  async remove(id: string) {
    const bill = await this.findOne(id);
    await this.billRepository.remove(bill);
    return { success: true, message: 'Bill removed successfully', id };
  }
}
