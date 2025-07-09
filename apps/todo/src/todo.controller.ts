import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiExtraModels,
} from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TodoService } from './todo.service';
import {
  CreateTodoDto,
  TodoDto,
  TodoFilterRequestDto,
  TodoFiltersDto,
  UpdateTodoDto,
} from './types';

@ApiTags('Todos')
@ApiExtraModels(TodoFiltersDto)
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  /** 📌 Create a todo */
  @Post()
  @ApiOperation({
    summary: 'Create a todo',
    description: 'Add a new todo task to the system.',
  })
  @ApiResponse({ status: 201, description: 'Todo created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiBody({ type: CreateTodoDto })
  async create(@Body() dto: CreateTodoDto) {
    return this.todoService.create(dto);
  }

  /** 📌 Get all todos */
  @Get()
  @ApiOperation({
    summary: 'List all todos',
    description: 'Returns all todos with pagination.',
  })
  @ApiResponse({
    status: 200,
    description: 'Todo list retrieved successfully.',
  })
  async selectAll() {
    return this.todoService.selectMany();
  }

  /** 📌 Filter todos */
  @Post('filter')
  @ApiOperation({ summary: 'Filter todos' })
  @ApiBody({ type: TodoFilterRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Filtered todo list',
    type: [TodoDto],
  })
  async filter(@Body() body: TodoFilterRequestDto) {
    const {
      page = 1,
      limit = 10,
      filters = {},
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = body;
    return this.todoService.filter(page, limit, filters, sortBy, sortOrder);
  }

  /** 📌 Get a todo by ID */
  @Get(':id')
  @ApiOperation({
    summary: 'Get a todo by ID',
    description: 'Returns a specific todo based on its ID.',
  })
  @ApiParam({ name: 'id', required: true, description: 'The todo ID' })
  @ApiResponse({ status: 200, description: 'Todo found.' })
  @ApiResponse({ status: 404, description: 'Todo not found.' })
  async selectUnique(@Param('id') id: string) {
    return this.todoService.selectUnique(parseInt(id));
  }

  /** 📌 Update a todo */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a todo',
    description: 'Modify an existing todo information.',
  })
  @ApiParam({ name: 'id', required: true, description: 'The todo ID' })
  @ApiResponse({ status: 200, description: 'Todo updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiResponse({ status: 404, description: 'Todo not found.' })
  @ApiBody({ type: UpdateTodoDto })
  async update(@Param('id') id: string, @Body() dto: UpdateTodoDto) {
    return this.todoService.update(parseInt(id), dto);
  }

  /** 📌 Delete a todo */
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a todo',
    description: 'Delete a todo from the system.',
  })
  @ApiParam({ name: 'id', required: true, description: 'The todo ID' })
  @ApiResponse({ status: 200, description: 'Todo deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Todo not found.' })
  async delete(@Param('id') id: string) {
    return this.todoService.delete(parseInt(id));
  }

  /** 📌 Mark a todo as done */
  @Patch(':id/mark-done')
  @ApiOperation({ summary: 'Mark a todo as done' })
  @ApiParam({ name: 'id', required: true, description: 'The todo ID' })
  @ApiResponse({ status: 200, description: 'Todo marked as done.' })
  async markAsDone(@Param('id') id: string) {
    return this.todoService.markAsDone(parseInt(id));
  }

  /** 📌 Mark a todo as undone */
  @Patch(':id/mark-undone')
  @ApiOperation({ summary: 'Mark a todo as undone' })
  @ApiParam({ name: 'id', required: true, description: 'The todo ID' })
  @ApiResponse({ status: 200, description: 'Todo marked as undone.' })
  async markAsUndone(@Param('id') id: string) {
    return this.todoService.markAsUndone(parseInt(id));
  }

  // Microservice message patterns
  @MessagePattern('getHello')
  handleGetHello(): string {
    console.log('Todo microservice received getHello message');
    return 'Hello from Todo Service!';
  }

  @MessagePattern('findAllTodos')
  async handleFindAllTodos(
    @Payload() data: { page?: number; limit?: number },
  ): Promise<any> {
    console.log('Todo microservice received findAllTodos message:', data);
    return this.todoService.selectMany(data.page, data.limit);
  }

  @MessagePattern('findOneTodo')
  async handleFindOneTodo(@Payload() data: { id: number }): Promise<any> {
    console.log(
      'Todo microservice received findOneTodo message for id:',
      data.id,
    );
    return this.todoService.selectUnique(data.id);
  }

  @MessagePattern('createTodo')
  async handleCreateTodo(@Payload() data: CreateTodoDto): Promise<any> {
    console.log('Todo microservice received createTodo message:', data);
    return this.todoService.create(data);
  }

  @MessagePattern('updateTodo')
  async handleUpdateTodo(
    @Payload() data: { id: number; todoData: UpdateTodoDto },
  ): Promise<any> {
    console.log(
      'Todo microservice received updateTodo message for id:',
      data.id,
    );
    return this.todoService.update(data.id, data.todoData);
  }

  @MessagePattern('removeTodo')
  async handleRemoveTodo(@Payload() data: { id: number }): Promise<any> {
    console.log(
      'Todo microservice received removeTodo message for id:',
      data.id,
    );
    return this.todoService.delete(data.id);
  }

  @MessagePattern('filterTodos')
  async handleFilterTodos(@Payload() data: TodoFilterRequestDto): Promise<any> {
    console.log('Todo microservice received filterTodos message:', data);
    const {
      page = 1,
      limit = 10,
      filters = {},
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = data;
    return this.todoService.filter(page, limit, filters, sortBy, sortOrder);
  }
}
