import { IsEmail, IsNotEmpty, IsInt, Min, Max, IsIn, IsString } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty({ message: 'Patient name is required' })
  name: string;

  @IsInt({ message: 'Age must be a whole number' })
  @Min(0, { message: 'Age cannot be negative' })
  @Max(130, { message: 'Please provide a realistic age' })
  age: number;

  @IsString()
  @IsNotEmpty({ message: 'Gender is required' })
  @IsIn(['Male', 'Female', 'Other'], { message: 'Gender must be Male, Female, or Other' })
  gender: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  phone: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Address is required' })
  address: string;
}
