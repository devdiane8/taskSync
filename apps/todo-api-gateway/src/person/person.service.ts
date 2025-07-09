import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreatePersonDto,
  UpdatePersonDto,
} from './dto';

@Injectable()
export class PersonService {
  constructor(
    @Inject('PERSON_SERVICE') private readonly personClient: ClientProxy,
  ) {}

  create(createPersonDto: CreatePersonDto) {
    console.log(
      'API Gateway sending createPerson message to person microservice',
    );
    return this.personClient.send('createPerson', createPersonDto);
  }

  selectMany(page?: number, limit?: number) {
    console.log(
      'API Gateway sending findAllPersons message to person microservice',
    );
    return this.personClient.send('findAllPersons', { page, limit });
  }

  findAll() {
    return this.selectMany();
  }

  selectUnique(id: number) {
    console.log(
      'API Gateway sending findOnePerson message to person microservice for id:',
      id,
    );
    return this.personClient.send('findOnePerson', { id });
  }

  findOne(id: number) {
    return this.selectUnique(id);
  }

  findByEmail(email: string) {
    console.log(
      'API Gateway sending findPersonByEmail message to person microservice for email:',
      email,
    );
    return this.personClient.send('findPersonByEmail', { email });
  }

  findByName(name: string) {
    console.log(
      'API Gateway sending findPersonByName message to person microservice for name:',
      name,
    );
    return this.personClient.send('findPersonByName', { name });
  }

  update(id: number, updatePersonDto: UpdatePersonDto) {
    console.log(
      'API Gateway sending updatePerson message to person microservice for id:',
      id,
    );
    return this.personClient.send('updatePerson', {
      id,
      personData: updatePersonDto,
    });
  }

  delete(id: number) {
    console.log(
      'API Gateway sending removePerson message to person microservice for id:',
      id,
    );
    return this.personClient.send('removePerson', { id });
  }

  remove(id: number) {
    return this.delete(id);
  }

  deactivate(id: number) {
    console.log(
      'API Gateway sending deactivatePerson message to person microservice for id:',
      id,
    );
    return this.personClient.send('deactivatePerson', { id });
  }

  activate(id: number) {
    console.log(
      'API Gateway sending activatePerson message to person microservice for id:',
      id,
    );
    return this.personClient.send('activatePerson', { id });
  }

  filter(
    page: number,
    limit: number,
    filters: any,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
  ) {
    console.log(
      'API Gateway sending filterPersons message to person microservice',
    );
    return this.personClient.send('filterPersons', {
      page,
      limit,
      filters,
      sortBy,
      sortOrder,
    });
  }
}
