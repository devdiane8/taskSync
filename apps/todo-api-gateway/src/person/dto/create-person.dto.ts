import { IsNotEmpty, IsEmail, IsOptional, IsString, MinLength, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePersonDto {
  @ApiProperty({ description: 'First name of the person (minimum 2 characters)', example: 'John' })
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  firstName: string;

  @ApiProperty({ description: 'Last name of the person (minimum 2 characters)', example: 'Doe' })
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  lastName: string;

  @ApiProperty({ description: 'Email address of the person (must be unique)', example: 'john.doe@example.com' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiPropertyOptional({ description: 'Phone number of the person', example: '+1234567890' })
  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  phoneNumber?: string;

  @ApiPropertyOptional({ description: 'Date of birth of the person', example: '1990-01-01' })
  @IsOptional()
  @IsDateString({}, { message: 'Date of birth must be a valid date' })
  dateOfBirth?: Date;

  @ApiPropertyOptional({ description: 'Address of the person', example: '123 Main St' })
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address?: string;

  @ApiPropertyOptional({ description: 'City where the person lives', example: 'New York' })
  @IsOptional()
  @IsString({ message: 'City must be a string' })
  city?: string;

  @ApiPropertyOptional({ description: 'Country where the person lives', example: 'USA' })
  @IsOptional()
  @IsString({ message: 'Country must be a string' })
  country?: string;
}
