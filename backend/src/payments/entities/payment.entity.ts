import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Bill } from '../../billing/entities/bill.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  billId: string;

  @ManyToOne(() => Bill, (bill) => bill.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'billId' })
  bill: Bill;

  @Column({ type: 'varchar', length: 100 })
  razorpayOrderId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  razorpayPaymentId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  razorpaySignature: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 30, default: 'Pending' })
  paymentStatus: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
