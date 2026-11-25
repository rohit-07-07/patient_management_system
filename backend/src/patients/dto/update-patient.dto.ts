import { IsEmail, IsInt, Min, Max, IsIn, IsString, IsOptional } from 'class-validator';

export class UpdatePatientDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt({ message: 'Age must be a whole number' })
  @Min(0, { message: 'Age cannot be negative' })
  @Max(130, { message: 'Please provide a realistic age' })
  age?: number;

  @IsOptional()
  @IsString()
  @IsIn(['Male', 'Female', 'Other'], { message: 'Gender must be Male, Female, or Other' })
  gender?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
