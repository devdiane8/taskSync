import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { QueryTodoDto } from './dto/query-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @Inject('TODO_SERVICE') private readonly todoClient: ClientProxy,
  ) {}

  create(createTodoDto: CreateTodoDto) {
    console.log('API Gateway sending createTodo message to todo microservice');
    return this.todoClient.send('createTodo', createTodoDto);
  }

  findAll(queryDto: QueryTodoDto) {
    console.log(
      'API Gateway sending findAllTodos message to todo microservice with filters:',
      queryDto,
    );
    const { page, pageSize, ...filters } = queryDto;
    return this.todoClient.send('findAllTodos', {
      filters,
      page: page || 1,
      pageSize: pageSize || 10,
    });
  }

  findOne(id: number) {
    console.log(
      'API Gateway sending findOneTodo message to todo microservice for id:',
      id,
    );
    return this.todoClient.send('findOneTodo', { id });
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    console.log(
      'API Gateway sending updateTodo message to todo microservice for id:',
      id,
    );
    return this.todoClient.send('updateTodo', { id, todoData: updateTodoDto });
  }

  remove(id: number) {
    console.log(
      'API Gateway sending removeTodo message to todo microservice for id:',
      id,
    );
    return this.todoClient.send('removeTodo', { id });
  }
}
