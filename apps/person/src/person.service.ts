import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/shared';
import { Prisma } from '../../../generated/prisma';
import { KafkaProducer } from './kafka/kafka.producer';

@Injectable()
export class PersonService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly kafkaProducer: KafkaProducer,
  ) {}

  /** 📌 Ajouter une personne */
  async create(personData: Prisma.PersonCreateInput) {
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
    const existingPersonWithName = await this.prisma.person.findUnique({
      where: { name: personData.name.trim() },
    });
    if (existingPersonWithName) {
      throw new BadRequestException('Name already exists');
    }

    // Trim and normalize data
    const normalizedData = {
      ...personData,
      name: personData.name.trim(),
      email: personData.email.trim().toLowerCase(),
      phoneNumber: personData.phoneNumber?.trim(),
      city: personData.city?.trim(),
      country: personData.country?.trim(),
      address: personData.address?.trim(),
    };

    // Create person in database
    const createdPerson = await this.prisma.person.create({
      data: normalizedData,
    });

    // Publish Kafka event
    try {
      await this.kafkaProducer.publishPersonCreated(createdPerson);
    } catch (error) {
      // Log error but don't fail the operation
      console.error('Failed to publish person created event:', error);
    }

    return createdPerson;
  }

  /** 📌 Mettre à jour une personne */
  async update(id: number, personData: Prisma.PersonUpdateInput) {
    const existingPerson = await this.selectUnique(id);
    if (!existingPerson) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }

    // Validate name if provided
    if (
      personData.name &&
      typeof personData.name === 'string' &&
      personData.name.trim().length < 3
    ) {
      throw new BadRequestException('Name must be at least 3 characters long');
    }

    // Check email uniqueness if email is being updated
    if (personData.email && personData.email !== existingPerson.email) {
      const existingPersonWithEmail = await this.findByEmail(
        personData.email as string,
      );
      if (existingPersonWithEmail) {
        throw new BadRequestException('Email already exists');
      }
      personData.email = (personData.email as string).trim().toLowerCase();
    }

    // Check name uniqueness if name is being updated
    if (personData.name && personData.name !== existingPerson.name) {
      const existingPersonWithName = await this.prisma.person.findUnique({
        where: { name: (personData.name as string).trim() },
      });
      if (existingPersonWithName) {
        throw new BadRequestException('Name already exists');
      }
      personData.name = (personData.name as string).trim();
    }

    // Trim and normalize data
    if (personData.name && typeof personData.name === 'string') {
      personData.name = personData.name.trim();
    }
    if (personData.phoneNumber && typeof personData.phoneNumber === 'string') {
      personData.phoneNumber = personData.phoneNumber.trim();
    }
    if (personData.city && typeof personData.city === 'string') {
      personData.city = personData.city.trim();
    }
    if (personData.country && typeof personData.country === 'string') {
      personData.country = personData.country.trim();
    }
    if (personData.address && typeof personData.address === 'string') {
      personData.address = personData.address.trim();
    }

    return this.prisma.person.update({
      where: { id },
      data: personData,
    });
  }

  /** 📌 Récupérer une personne par ID */
  async selectUnique(id: number) {
    const person = await this.prisma.person.findUnique({ where: { id } });

    if (!person) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }

    return person;
  }

  /** 📌 Récupérer toutes les personnes */
  async selectMany(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [persons, totalCount] = await this.prisma.$transaction([
      this.prisma.person.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.person.count(),
    ]);

    return {
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
      data: persons,
    };
  }

  /** 📌 Filtrer les personnes */
  async filter(
    page: number = 1,
    limit: number = 10,
    filters: any = {},
    orderBy: string = 'createdAt',
    orderDirection: 'asc' | 'desc' = 'desc',
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.PersonWhereInput = {
      name: filters.name ? { contains: filters.name.toLowerCase() } : undefined,
      email: filters.email
        ? { contains: filters.email.toLowerCase() }
        : undefined,
      phoneNumber: filters.phoneNumber
        ? { contains: filters.phoneNumber.toLowerCase() }
        : undefined,
      city: filters.city ? { contains: filters.city.toLowerCase() } : undefined,
      country: filters.country
        ? { contains: filters.country.toLowerCase() }
        : undefined,
      address: filters.address
        ? { contains: filters.address.toLowerCase() }
        : undefined,
      isActive: filters.isActive !== undefined ? filters.isActive : undefined,
      dateOfBirth:
        filters.dateOfBirthStart || filters.dateOfBirthEnd
          ? {
              gte: filters.dateOfBirthStart
                ? new Date(filters.dateOfBirthStart)
                : undefined,
              lte: filters.dateOfBirthEnd
                ? new Date(filters.dateOfBirthEnd)
                : undefined,
            }
          : undefined,
      createdAt:
        filters.createdAtStart || filters.createdAtEnd
          ? {
              gte: filters.createdAtStart
                ? new Date(filters.createdAtStart)
                : undefined,
              lte: filters.createdAtEnd
                ? new Date(filters.createdAtEnd)
                : undefined,
            }
          : undefined,
      updatedAt:
        filters.updatedAtStart || filters.updatedAtEnd
          ? {
              gte: filters.updatedAtStart
                ? new Date(filters.updatedAtStart)
                : undefined,
              lte: filters.updatedAtEnd
                ? new Date(filters.updatedAtEnd)
                : undefined,
            }
          : undefined,
    };

    const [persons, totalCount] = await this.prisma.$transaction([
      this.prisma.person.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [orderBy]: orderDirection,
        },
      }),
      this.prisma.person.count({ where }),
    ]);

    return {
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
      data: persons,
    };
  }

  /** 📌 Supprimer une personne */
  async delete(id: number) {
    const person = await this.prisma.person.findUnique({ where: { id } });

    if (!person) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }

    return this.prisma.person.delete({ where: { id } });
  }

  /** 📌 Activer une personne */
  async activate(id: number) {
    const existingPerson = await this.selectUnique(id);
    if (!existingPerson) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }

    return this.prisma.person.update({
      where: { id },
      data: { isActive: true },
    });
  }

  /** 📌 Désactiver une personne */
  async deactivate(id: number) {
    const existingPerson = await this.selectUnique(id);
    if (!existingPerson) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }

    return this.prisma.person.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /** 📌 Rechercher par email */
  async findByEmail(email: string) {
    return this.prisma.person.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  /** 📌 Rechercher par nom */
  async findByName(name: string) {
    return this.prisma.person.findUnique({ where: { name: name.trim() } });
  }

  /** 📌 Rechercher par téléphone */
  async findByPhone(phoneNumber: string) {
    return this.prisma.person.findFirst({
      where: { phoneNumber: phoneNumber.trim() },
    });
  }

  /** 📌 Rechercher par ville */
  async findByCity(city: string) {
    return this.prisma.person.findMany({ where: { city: city.trim() } });
  }

  /** 📌 Rechercher par pays */
  async findByCountry(country: string) {
    return this.prisma.person.findMany({ where: { country: country.trim() } });
  }

  /** 📌 Rechercher par statut actif */
  async findByActiveStatus(isActive: boolean) {
    return this.prisma.person.findMany({ where: { isActive } });
  }
}
