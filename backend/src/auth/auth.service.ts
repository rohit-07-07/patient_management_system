import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async onModuleInit() {
    const count = await this.userRepository.count();
    if (count === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const defaultUser = this.userRepository.create({
        name: 'Dr. Sarah Connor',
        email: 'admin@hospital.com',
        password: hashedPassword
      });
      await this.userRepository.save(defaultUser);
    }
  }

  async register(registerDto: RegisterDto) {
    const existing = await this.userRepository.findOne({
      where: { email: registerDto.email }
    });

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = this.userRepository.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword
    });

    await this.userRepository.save(user);

    const token = this.generateToken(user);
    const { password, ...safeUser } = user;
    return { user: safeUser, token };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.generateToken(user);
    const { password, ...safeUser } = user;
    return { user: safeUser, token };
  }

  private generateToken(user: User): string {
    const payload = { sub: user.id, email: user.email, name: user.name };
    return this.jwtService.sign(payload);
  }
}
