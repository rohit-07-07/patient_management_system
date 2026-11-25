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
    const count = await this.patientRepository.count();
    if (count === 0) {
      const initialPatients = [
        {
          name: 'Eleanor Vance',
          age: 34,
          gender: 'Female',
          phone: '+1-555-0143',
          email: 'eleanor.vance@example.com',
          address: '42 Elmcrest Road, Boston, MA'
        },
        {
          name: 'Marcus Brody',
          age: 52,
          gender: 'Male',
          phone: '+1-555-0189',
          email: 'marcus.brody@example.com',
          address: '108 Oakridge Boulevard, Seattle, WA'
        },
        {
          name: 'Avery Chen',
          age: 28,
          gender: 'Other',
          phone: '+1-555-0122',
          email: 'avery.chen@example.com',
          address: '77 Pinefield Avenue, Austin, TX'
        }
      ];
      for (const p of initialPatients) {
        const item = this.patientRepository.create(p);
        await this.patientRepository.save(item);
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
