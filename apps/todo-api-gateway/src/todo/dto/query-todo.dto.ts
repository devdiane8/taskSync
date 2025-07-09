import { IsOptional, IsNumber, IsBoolean, IsDateString, IsArray, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class QueryTodoDto {
  @ApiPropertyOptional({ description: 'Filter by priority level', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Priority must be a number' })
  priority?: number;

  @ApiPropertyOptional({ description: 'Filter by labels', example: ['work', 'urgent'] })
  @IsOptional()
  @IsArray({ message: 'Labels must be an array' })
  labels?: string[];

  @ApiPropertyOptional({ description: 'Filter by person ID', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Person ID must be a number' })
  personId?: number;

  @ApiPropertyOptional({ description: 'Filter by completion status', example: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: 'isDone must be a boolean' })
  isDone?: boolean;

  @ApiPropertyOptional({ description: 'Filter by start date (from)', example: '2024-01-01T00:00:00Z' })
  @IsOptional()
  @IsDateString({}, { message: 'Start date must be a valid date' })
  startDate?: Date;

  @ApiPropertyOptional({ description: 'Filter by end date (to)', example: '2024-12-31T23:59:59Z' })
  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid date' })
  endDate?: Date;

  @ApiPropertyOptional({ description: 'Page number for pagination', example: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Number of items per page', example: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page size must be a number' })
  @Min(1, { message: 'Page size must be at least 1' })
  @Max(100, { message: 'Page size cannot exceed 100' })
  pageSize?: number = 10;
} 