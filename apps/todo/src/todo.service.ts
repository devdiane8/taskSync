import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { validate } from 'class-validator';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async findAll(filters?: any, page: number = 1, pageSize: number = 10): Promise<{ data: Todo[]; total: number }> {
    const queryBuilder = this.todoRepository.createQueryBuilder('todo');

    // Apply filters
    if (filters) {
      this.applyFilters(queryBuilder, filters);
    }

    // Apply pagination
    const skip = (page - 1) * pageSize;
    queryBuilder.skip(skip).take(pageSize);

    // Order by creation date (newest first)
    queryBuilder.orderBy('todo.createdAt', 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  async findOne(id: number): Promise<Todo | null> {
    return this.todoRepository.findOne({ where: { id } });
  }

  async create(todoData: Partial<Todo>): Promise<Todo> {
    // Validate title length (minimum 3 characters after trim)
    if (!todoData.title || todoData.title.trim().length < 3) {
      throw new BadRequestException('Title must be at least 3 characters long');
    }

    // Trim the title
    todoData.title = todoData.title.trim();

    // Validate personId exists (this would typically call the person service)
    if (!todoData.personId) {
      throw new BadRequestException('Person ID is required');
    }

    // TODO: Add REST call to person-service to verify personId exists
    // await this.verifyPersonExists(todoData.personId);

    const todo = this.todoRepository.create(todoData);
    const savedTodo = await this.todoRepository.save(todo);

    // TODO: Publish TASK_CREATED event to Kafka
    // await this.eventService.publish('TASK_CREATED', savedTodo);

    return savedTodo;
  }

  async update(id: number, todoData: Partial<Todo>): Promise<Todo | null> {
    const existingTodo = await this.findOne(id);
    if (!existingTodo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    // If the todo is already completed, prevent modifications to endDate
    if (existingTodo.isDone && todoData.endDate !== undefined) {
      throw new BadRequestException('Cannot modify endDate of a completed task');
    }

    // If isDone is being set to true, automatically set endDate to now
    if (todoData.isDone === true && !existingTodo.isDone) {
      todoData.endDate = new Date();
    }

    // Validate title if provided
    if (todoData.title && todoData.title.trim().length < 3) {
      throw new BadRequestException('Title must be at least 3 characters long');
    }

    if (todoData.title) {
      todoData.title = todoData.title.trim();
    }

    await this.todoRepository.update(id, todoData);
    const updatedTodo = await this.findOne(id);

    // TODO: Publish appropriate event based on changes
    // if (todoData.isDone === true && !existingTodo.isDone) {
    //   await this.eventService.publish('TASK_COMPLETED', updatedTodo);
    // } else {
    //   await this.eventService.publish('TASK_UPDATED', updatedTodo);
    // }

    return updatedTodo;
  }

  async remove(id: number): Promise<void> {
    const existingTodo = await this.findOne(id);
    if (!existingTodo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    await this.todoRepository.delete(id);

    // TODO: Publish TASK_DELETED event to Kafka
    // await this.eventService.publish('TASK_DELETED', { id });
  }

  private applyFilters(queryBuilder: SelectQueryBuilder<Todo>, filters: any): void {
    if (filters.priority !== undefined) {
      queryBuilder.andWhere('todo.priority = :priority', { priority: filters.priority });
    }

    if (filters.personId !== undefined) {
      queryBuilder.andWhere('todo.personId = :personId', { personId: filters.personId });
    }

    if (filters.isDone !== undefined) {
      queryBuilder.andWhere('todo.isDone = :isDone', { isDone: filters.isDone });
    }

    if (filters.startDate) {
      queryBuilder.andWhere('todo.startDate >= :startDate', { startDate: filters.startDate });
    }

    if (filters.endDate) {
      queryBuilder.andWhere('todo.endDate <= :endDate', { endDate: filters.endDate });
    }

    if (filters.labels && filters.labels.length > 0) {
      // For JSON array contains check
      queryBuilder.andWhere('todo.labels @> :labels', { labels: JSON.stringify(filters.labels) });
    }
  }

  // TODO: Implement person verification
  // private async verifyPersonExists(personId: number): Promise<boolean> {
  //   // Make REST call to person-service
  //   // Return true if person exists, throw error if not
  // }
}
