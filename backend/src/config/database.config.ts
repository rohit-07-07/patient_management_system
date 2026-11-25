import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Patient } from '../patients/entities/patient.entity';
import { Bill } from '../billing/entities/bill.entity';
import { Payment } from '../payments/entities/payment.entity';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const dbType = process.env.DB_TYPE || 'postgres';

  if (dbType === 'sqlite') {
    return {
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, Patient, Bill, Payment],
      synchronize: true
    };
  }

  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'patient_management',
    entities: [User, Patient, Bill, Payment],
    synchronize: true
  };
};
