import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>
  ) {}

  async onModuleInit() {
    const existingPatients = await this.patientRepository.find();
    if (existingPatients.length === 0) {
      const initialPatients = [
        {
          name: 'Ananya Iyer',
          age: 34,
          gender: 'Female',
          phone: '+91 98450 12345',
          email: 'ananya.iyer@example.com',
          address: 'Flat 302, Palm Meadows, Whitefield, Bengaluru'
        },
        {
          name: 'Vikramaditya Patil',
          age: 52,
          gender: 'Male',
          phone: '+91 98220 54321',
          email: 'vikram.patil@example.com',
          address: '12 Shivaji Nagar, Pune, Maharashtra'
        },
        {
          name: 'Rahul Deshmukh',
          age: 28,
          gender: 'Male',
          phone: '+91 99112 87654',
          email: 'rahul.deshmukh@example.com',
          address: '78 Jubilee Hills, Hyderabad, Telangana'
        },
        {
          name: 'Pooja Verma',
          age: 41,
          gender: 'Female',
          phone: '+91 98101 23456',
          email: 'pooja.verma@example.com',
          address: 'B-14 Sector 62, Noida, Uttar Pradesh'
        }
      ];
      for (const p of initialPatients) {
        const item = this.patientRepository.create(p);
        await this.patientRepository.save(item);
      }
    } else {
      for (const p of existingPatients) {
        if (p.name === 'Eleanor Vance') {
          p.name = 'Ananya Iyer';
          p.phone = '+91 98450 12345';
          p.address = 'Flat 302, Palm Meadows, Whitefield, Bengaluru';
          await this.patientRepository.save(p);
        } else if (p.name === 'Marcus Brody') {
          p.name = 'Vikramaditya Patil';
          p.phone = '+91 98220 54321';
          p.address = '12 Shivaji Nagar, Pune, Maharashtra';
          await this.patientRepository.save(p);
        } else if (p.name === 'Avery Chen') {
          p.name = 'Rahul Deshmukh';
          p.gender = 'Male';
          p.phone = '+91 99112 87654';
          p.address = '78 Jubilee Hills, Hyderabad, Telangana';
          await this.patientRepository.save(p);
        }
      }
    }
  }

  async findAll(search?: string, gender?: string) {
    const query = this.patientRepository.createQueryBuilder('patient');

    if (search && search.trim() !== '') {
      query.andWhere('LOWER(patient.name) LIKE LOWER(:search) OR LOWER(patient.email) LIKE LOWER(:search)', {
        search: `%${search.trim()}%`
      });
    }

    if (gender && gender !== 'All' && gender.trim() !== '') {
      query.andWhere('patient.gender = :gender', { gender });
    }

    query.orderBy('patient.createdAt', 'DESC');
    return await query.getMany();
  }

  async findOne(id: string) {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: ['bills']
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID "${id}" was not found`);
    }

    return patient;
  }

  async create(createPatientDto: CreatePatientDto) {
    const existing = await this.patientRepository.findOne({
      where: { email: createPatientDto.email }
    });

    if (existing) {
      throw new ConflictException('A patient with this email already exists');
    }

    const patient = this.patientRepository.create(createPatientDto);
    return await this.patientRepository.save(patient);
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    const patient = await this.findOne(id);

    if (updatePatientDto.email && updatePatientDto.email !== patient.email) {
      const existing = await this.patientRepository.findOne({
        where: { email: updatePatientDto.email }
      });
      if (existing) {
        throw new ConflictException('A patient with this email already exists');
      }
    }

    Object.assign(patient, updatePatientDto);
    return await this.patientRepository.save(patient);
  }

  async remove(id: string) {
    const patient = await this.findOne(id);
    await this.patientRepository.remove(patient);
    return { success: true, message: 'Patient removed successfully', id };
  }
}
