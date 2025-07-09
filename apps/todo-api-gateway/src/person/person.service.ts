import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

@Injectable()
export class PersonService {
  constructor(
    @Inject('PERSON_SERVICE') private readonly personClient: ClientProxy,
  ) {}

  create(createPersonDto: CreatePersonDto) {
    console.log('API Gateway sending createPerson message to person microservice');
    return this.personClient.send('createPerson', createPersonDto);
  }

  findAll() {
    console.log('API Gateway sending findAllPersons message to person microservice');
    return this.personClient.send('findAllPersons', {});
  }

  findOne(id: number) {
    console.log('API Gateway sending findOnePerson message to person microservice for id:', id);
    return this.personClient.send('findOnePerson', { id });
  }

  findByEmail(email: string) {
    console.log('API Gateway sending findPersonByEmail message to person microservice for email:', email);
    return this.personClient.send('findPersonByEmail', { email });
  }

  update(id: number, updatePersonDto: UpdatePersonDto) {
    console.log('API Gateway sending updatePerson message to person microservice for id:', id);
    return this.personClient.send('updatePerson', { id, personData: updatePersonDto });
  }

  remove(id: number) {
    console.log('API Gateway sending removePerson message to person microservice for id:', id);
    return this.personClient.send('removePerson', { id });
  }

  deactivate(id: number) {
    console.log('API Gateway sending deactivatePerson message to person microservice for id:', id);
    return this.personClient.send('deactivatePerson', { id });
  }

  activate(id: number) {
    console.log('API Gateway sending activatePerson message to person microservice for id:', id);
    return this.personClient.send('activatePerson', { id });
  }
}
