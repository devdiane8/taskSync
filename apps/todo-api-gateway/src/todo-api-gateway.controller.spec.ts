import { Test, TestingModule } from '@nestjs/testing';
import { TodoApiGatewayController } from './todo-api-gateway.controller';
import { TodoApiGatewayService } from './todo-api-gateway.service';

describe('TodoApiGatewayController', () => {
  let todoApiGatewayController: TodoApiGatewayController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TodoApiGatewayController],
      providers: [TodoApiGatewayService],
    }).compile();

    todoApiGatewayController = app.get<TodoApiGatewayController>(TodoApiGatewayController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(todoApiGatewayController.getHello()).toBe('Hello World!');
    });
  });
});
