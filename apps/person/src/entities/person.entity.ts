import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { IsNotEmpty, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

@Entity('persons')
@Index(['name'], { unique: true })
@Index(['email'], { unique: true })
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least 3 characters long after trimming' })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  phoneNumber: string;

  @Column({ type: 'date', nullable: true })
  @IsOptional()
  dateOfBirth: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  @IsString({ message: 'City must be a string' })
  city: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  @IsString({ message: 'Country must be a string' })
  country: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}