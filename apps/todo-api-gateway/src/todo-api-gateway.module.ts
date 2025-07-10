import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TodoApiGatewayController } from './todo-api-gateway.controller';
import { TodoApiGatewayService } from './todo-api-gateway.service';
import { TodoModule } from './todo/todo.module';
import { PersonModule } from './person/person.module';

@Module({
  imports: [
    TodoModule,
    PersonModule,
    ClientsModule.register([
      {
        name: 'PERSON_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4001,
        },
      },
      {
        name: 'TODO_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4003,
        },
      },

    ]),
  ],
  controllers: [TodoApiGatewayController],
  providers: [TodoApiGatewayService],
})
export class TodoApiGatewayModule { }
