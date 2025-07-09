import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TodoService } from './todo.service';
import { Todo } from './entities/todo.entity';

@Controller()
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getHello(): string {
    return this.todoService.getHello();
  }

  @MessagePattern('getHello')
  handleGetHello(): string {
    console.log('Todo microservice received getHello message');
    return this.todoService.getHello();
  }

  @MessagePattern('findAllTodos')
  async handleFindAllTodos(@Payload() data: { filters?: any; page?: number; pageSize?: number }): Promise<{ data: Todo[]; total: number }> {
    console.log('Todo microservice received findAllTodos message with filters:', data);
    return this.todoService.findAll(data.filters, data.page, data.pageSize);
  }

  @MessagePattern('findOneTodo')
  async handleFindOneTodo(@Payload() data: { id: number }): Promise<Todo | null> {
    console.log('Todo microservice received findOneTodo message for id:', data.id);
    return this.todoService.findOne(data.id);
  }

  @MessagePattern('createTodo')
  async handleCreateTodo(@Payload() data: Partial<Todo>): Promise<Todo> {
    console.log('Todo microservice received createTodo message:', data);
    return this.todoService.create(data);
  }

  @MessagePattern('updateTodo')
  async handleUpdateTodo(@Payload() data: { id: number; todoData: Partial<Todo> }): Promise<Todo | null> {
    console.log('Todo microservice received updateTodo message for id:', data.id);
    return this.todoService.update(data.id, data.todoData);
  }

  @MessagePattern('removeTodo')
  async handleRemoveTodo(@Payload() data: { id: number }): Promise<void> {
    console.log('Todo microservice received removeTodo message for id:', data.id);
    return this.todoService.remove(data.id);
  }
}
