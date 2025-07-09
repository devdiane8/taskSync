import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { IsNotEmpty, MinLength, IsOptional, IsBoolean, IsNumber, IsDateString, IsArray, Validate } from 'class-validator';
import { Transform } from 'class-transformer';

class EndDateValidator {
  static validate(value: Date | null, args: any): boolean {
    const isDone = args.object.isDone;
    // If task is done, endDate cannot be modified (should be set to when isDone was set to true)
    if (isDone && value !== args.object.endDate) {
      return false;
    }
    return true;
  }
}

@Entity('todos')
@Index(['personId'])
@Index(['isDone'])
@Index(['priority'])
@Index(['startDate'])
@Index(['endDate'])
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(3, { 
    message: 'Title must be at least 3 characters long after trimming',
    always: true 
  })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  title: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  description: string;

  @Column({ type: 'int', nullable: false })
  @IsNumber({}, { message: 'Person ID must be a number' })
  @IsNotEmpty({ message: 'Person ID is required' })
  personId: number;

  @Column({ type: 'boolean', default: false })
  @IsBoolean({ message: 'isDone must be a boolean' })
  isDone: boolean;

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'Priority must be a number' })
  priority: number;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  @IsDateString({}, { message: 'Start date must be a valid date' })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid date' })
  @Validate(EndDateValidator, { message: 'Cannot modify endDate when task is completed' })
  endDate: Date;

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  @IsArray({ message: 'Labels must be an array' })
  labels: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}