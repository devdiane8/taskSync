import {
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsDateString,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTodoDto {
  @ApiProperty({
    description: 'Title of the todo (minimum 3 characters)',
    example: 'Complete project documentation',
  })
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  title: string;

  @ApiPropertyOptional({
    description: 'Description of the todo',
    example: 'Write comprehensive documentation for the project',
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'ID of the person who owns this todo',
    example: 1,
  })
  @IsNumber({}, { message: 'Person ID must be a number' })
  @IsNotEmpty({ message: 'Person ID is required' })
  personId: number;

  @ApiPropertyOptional({
    description: 'Priority level of the todo',
    example: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Priority must be a number' })
  priority?: number;

  @ApiPropertyOptional({
    description: 'Start date of the todo',
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Start date must be a valid date' })
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Labels for categorizing the todo',
    example: ['work', 'urgent'],
  })
  @IsOptional()
  @IsArray({ message: 'Labels must be an array' })
  labels?: string[];
}
