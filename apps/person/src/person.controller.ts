import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PersonService } from './person.service';
import { Person } from './entities/person.entity';

@Controller()
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get()
  getHello(): string {
    return this.personService.getHello();
  }

  @MessagePattern('getHello')
  handleGetHello(): string {
    console.log('Person microservice received getHello message');
    return this.personService.getHello();
  }

  @MessagePattern('findAllPersons')
  async handleFindAllPersons(@Payload() data: { filters?: any; page?: number; pageSize?: number }): Promise<{ data: Person[]; total: number }> {
    console.log('Person microservice received findAllPersons message with filters:', data);
    return this.personService.findAll(data.filters, data.page, data.pageSize);
  }

  @MessagePattern('findOnePerson')
  async handleFindOnePerson(@Payload() data: { id: number }): Promise<Person | null> {
    console.log('Person microservice received findOnePerson message for id:', data.id);
    return this.personService.findOne(data.id);
  }

  @MessagePattern('findPersonByEmail')
  async handleFindPersonByEmail(@Payload() data: { email: string }): Promise<Person | null> {
    console.log('Person microservice received findPersonByEmail message for email:', data.email);
    return this.personService.findByEmail(data.email);
  }

  @MessagePattern('createPerson')
  async handleCreatePerson(@Payload() data: Partial<Person>): Promise<Person> {
    console.log('Person microservice received createPerson message:', data);
    return this.personService.create(data);
  }

  @MessagePattern('updatePerson')
  async handleUpdatePerson(@Payload() data: { id: number; personData: Partial<Person> }): Promise<Person | null> {
    console.log('Person microservice received updatePerson message for id:', data.id);
    return this.personService.update(data.id, data.personData);
  }

  @MessagePattern('removePerson')
  async handleRemovePerson(@Payload() data: { id: number }): Promise<void> {
    console.log('Person microservice received removePerson message for id:', data.id);
    return this.personService.remove(data.id);
  }

  @MessagePattern('deactivatePerson')
  async handleDeactivatePerson(@Payload() data: { id: number }): Promise<Person | null> {
    console.log('Person microservice received deactivatePerson message for id:', data.id);
    return this.personService.deactivate(data.id);
  }

  @MessagePattern('activatePerson')
  async handleActivatePerson(@Payload() data: { id: number }): Promise<Person | null> {
    console.log('Person microservice received activatePerson message for id:', data.id);
    return this.personService.activate(data.id);
  }
}
