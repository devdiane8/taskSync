import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PERSON_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 3002,
        },
      },
    ]),
  ],
  controllers: [PersonController],
  providers: [PersonService],
})
export class PersonModule {}
