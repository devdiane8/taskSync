import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';
import { Person } from './entities/person.entity';
import { personServiceDatabaseConfig } from '@app/shared/config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(personServiceDatabaseConfig([Person])),
    TypeOrmModule.forFeature([Person]),
  ],
  controllers: [PersonController],
  providers: [PersonService],
})
export class PersonModule {}
