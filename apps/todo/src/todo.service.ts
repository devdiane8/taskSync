import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/shared';
import { Prisma } from '../../../generated/prisma';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  /** 📌 Ajouter une tâche */
  async create(todoData: {
    title: string;
    description?: string;
    personId: number;
  }) {
    // Validate title length (minimum 3 characters after trim)
    if (!todoData.title || todoData.title.trim().length < 3) {
      throw new BadRequestException('Title must be at least 3 characters long');
    }

    // Trim the title
    const normalizedData = {
      ...todoData,
      title: todoData.title.trim(),
    };

    // Remove personId from the data you send to Prisma
    const { personId, ...rest } = normalizedData;

    // Validate personId exists
    if (!personId) {
      throw new BadRequestException('Person ID is required');
    }

    // Verify person exists
    const person = await this.prisma.person.findUnique({
      where: { id: personId },
    });
    if (!person) {
      throw new BadRequestException(`Person with ID ${personId} not found`);
    }

    return this.prisma.todo.create({
      data: {
        ...rest,
        person: { connect: { id: personId } },
      },
      include: {
        person: true,
      },
    });
  }

  /** 📌 Mettre à jour une tâche */
  async update(id: number, todoData: Prisma.TodoUpdateInput) {
    const existingTodo = await this.selectUnique(id);
    if (!existingTodo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    // If the todo is already completed, prevent modifications to endDate
    if (existingTodo.isDone && todoData.endDate !== undefined) {
      throw new BadRequestException(
        'Cannot modify endDate of a completed task',
      );
    }

    // If isDone is being set to true, automatically set endDate to now
    if (todoData.isDone === true && !existingTodo.isDone) {
      todoData.endDate = new Date();
    }

    // Validate title if provided
    if (
      todoData.title &&
      typeof todoData.title === 'string' &&
      todoData.title.trim().length < 3
    ) {
      throw new BadRequestException('Title must be at least 3 characters long');
    }

    if (todoData.title && typeof todoData.title === 'string') {
      todoData.title = todoData.title.trim();
    }

    return this.prisma.todo.update({
      where: { id },
      data: todoData,
      include: {
        person: true,
      },
    });
  }

  /** 📌 Récupérer une tâche par ID */
  async selectUnique(id: number) {
    const todo = await this.prisma.todo.findUnique({
      where: { id },
      include: {
        person: true,
      },
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return todo;
  }

  /** 📌 Récupérer toutes les tâches */
  async selectMany(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [todos, totalCount] = await this.prisma.$transaction([
      this.prisma.todo.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          person: true,
        },
      }),
      this.prisma.todo.count(),
    ]);

    return {
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
      data: todos,
    };
  }

  /** 📌 Filtrer les tâches */
  async filter(
    page: number = 1,
    limit: number = 10,
    filters: any = {},
    orderBy: string = 'createdAt',
    orderDirection: 'asc' | 'desc' = 'desc',
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.TodoWhereInput = {
      title: filters.title
        ? { contains: filters.title.toLowerCase() }
        : undefined,
      description: filters.description
        ? { contains: filters.description.toLowerCase() }
        : undefined,
      personId: filters.personId ? filters.personId : undefined,
      isDone: filters.isDone !== undefined ? filters.isDone : undefined,
      priority: filters.priority ? filters.priority : undefined,
      startDate:
        filters.startDateStart || filters.startDateEnd
          ? {
              gte: filters.startDateStart
                ? new Date(filters.startDateStart)
                : undefined,
              lte: filters.startDateEnd
                ? new Date(filters.startDateEnd)
                : undefined,
            }
          : undefined,
      endDate:
        filters.endDateStart || filters.endDateEnd
          ? {
              gte: filters.endDateStart
                ? new Date(filters.endDateStart)
                : undefined,
              lte: filters.endDateEnd
                ? new Date(filters.endDateEnd)
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
      labels: filters.labels ? { hasSome: filters.labels } : undefined,
    };

    const [todos, totalCount] = await this.prisma.$transaction([
      this.prisma.todo.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [orderBy]: orderDirection,
        },
        include: {
          person: true,
        },
      }),
      this.prisma.todo.count({ where }),
    ]);

    return {
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
      data: todos,
    };
  }

  /** 📌 Supprimer une tâche */
  async delete(id: number) {
    const todo = await this.prisma.todo.findUnique({ where: { id } });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return this.prisma.todo.delete({ where: { id } });
  }

  /** 📌 Marquer une tâche comme terminée */
  async markAsDone(id: number) {
    const existingTodo = await this.selectUnique(id);
    if (!existingTodo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return this.prisma.todo.update({
      where: { id },
      data: {
        isDone: true,
        endDate: new Date(),
      },
      include: {
        person: true,
      },
    });
  }

  /** 📌 Marquer une tâche comme non terminée */
  async markAsUndone(id: number) {
    const existingTodo = await this.selectUnique(id);
    if (!existingTodo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return this.prisma.todo.update({
      where: { id },
      data: {
        isDone: false,
        endDate: null,
      },
      include: {
        person: true,
      },
    });
  }

  /** 📌 Rechercher par personne */
  async findByPerson(personId: number) {
    return this.prisma.todo.findMany({
      where: { personId },
      include: {
        person: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** 📌 Rechercher par statut */
  async findByStatus(isDone: boolean) {
    return this.prisma.todo.findMany({
      where: { isDone },
      include: {
        person: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** 📌 Rechercher par priorité */
  async findByPriority(priority: number) {
    return this.prisma.todo.findMany({
      where: { priority },
      include: {
        person: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** 📌 Rechercher par labels */
  async findByLabels(labels: string[]) {
    return this.prisma.todo.findMany({
      where: { labels: { hasSome: labels } },
      include: {
        person: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
