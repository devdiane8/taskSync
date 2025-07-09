import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Person } from './entities/person.entity';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private personRepository: Repository<Person>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async findAll(filters?: any, page: number = 1, pageSize: number = 10): Promise<{ data: Person[]; total: number }> {
    const queryBuilder = this.personRepository.createQueryBuilder('person');

    // Apply filters
    if (filters) {
      this.applyFilters(queryBuilder, filters);
    }

    // Apply pagination
    const skip = (page - 1) * pageSize;
    queryBuilder.skip(skip).take(pageSize);

    // Order by creation date (newest first)
    queryBuilder.orderBy('person.createdAt', 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  async findOne(id: number): Promise<Person | null> {
    return this.personRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Person | null> {
    return this.personRepository.findOne({ where: { email } });
  }

  async create(personData: Partial<Person>): Promise<Person> {
    // Validate required fields
    if (!personData.name || personData.name.trim().length < 3) {
      throw new BadRequestException('Name must be at least 3 characters long');
    }

    if (!personData.email) {
      throw new BadRequestException('Email is required');
    }

    // Check if email already exists
    const existingPerson = await this.findByEmail(personData.email);
    if (existingPerson) {
      throw new BadRequestException('Email already exists');
    }

    // Check if name already exists
    const existingPersonWithName = await this.personRepository.findOne({ where: { name: personData.name.trim() } });
    if (existingPersonWithName) {
      throw new BadRequestException('Name already exists');
    }

    // Trim strings
    personData.name = personData.name.trim();
    personData.email = personData.email.trim().toLowerCase();

    const person = this.personRepository.create(personData);
    const savedPerson = await this.personRepository.save(person);

    return savedPerson;
  }

  async update(id: number, personData: Partial<Person>): Promise<Person | null> {
    const existingPerson = await this.findOne(id);
    if (!existingPerson) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }

    // Validate name if provided
    if (personData.name && personData.name.trim().length < 3) {
      throw new BadRequestException('Name must be at least 3 characters long');
    }

    // Check email uniqueness if email is being updated
    if (personData.email && personData.email !== existingPerson.email) {
      const existingPersonWithEmail = await this.findByEmail(personData.email);
      if (existingPersonWithEmail) {
        throw new BadRequestException('Email already exists');
      }
      personData.email = personData.email.trim().toLowerCase();
    }

    // Check name uniqueness if name is being updated
    if (personData.name && personData.name !== existingPerson.name) {
      const existingPersonWithName = await this.personRepository.findOne({ where: { name: personData.name.trim() } });
      if (existingPersonWithName) {
        throw new BadRequestException('Name already exists');
      }
      personData.name = personData.name.trim();
    }

    // Trim strings
    if (personData.name) {
      personData.name = personData.name.trim();
    }

    await this.personRepository.update(id, personData);
    const updatedPerson = await this.findOne(id);

    return updatedPerson;
  }

  async remove(id: number): Promise<void> {
    const existingPerson = await this.findOne(id);
    if (!existingPerson) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }

    await this.personRepository.delete(id);
  }

  async deactivate(id: number): Promise<Person | null> {
    const existingPerson = await this.findOne(id);
    if (!existingPerson) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }

    await this.personRepository.update(id, { isActive: false });
    return this.findOne(id);
  }

  async activate(id: number): Promise<Person | null> {
    const existingPerson = await this.findOne(id);
    if (!existingPerson) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }

    await this.personRepository.update(id, { isActive: true });
    return this.findOne(id);
  }

  private applyFilters(queryBuilder: SelectQueryBuilder<Person>, filters: any): void {
    if (filters.name) {
      queryBuilder.andWhere('person.name ILIKE :name', { name: `%${filters.name}%` });
    }

    if (filters.email) {
      queryBuilder.andWhere('person.email ILIKE :email', { email: `%${filters.email}%` });
    }

    if (filters.isActive !== undefined) {
      queryBuilder.andWhere('person.isActive = :isActive', { isActive: filters.isActive });
    }

    if (filters.city) {
      queryBuilder.andWhere('person.city ILIKE :city', { city: `%${filters.city}%` });
    }

    if (filters.country) {
      queryBuilder.andWhere('person.country ILIKE :country', { country: `%${filters.country}%` });
    }
  }
}
