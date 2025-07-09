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
import { PersonService } from './person.service';
import {
  CreatePersonDto,
  PersonDto,
  PersonFilterRequestDto,
  PersonFiltersDto,
  UpdatePersonDto,
} from './types';

@ApiTags('Persons')
@ApiExtraModels(PersonFiltersDto)
@Controller('persons')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  /** 📌 Create a person */
  @Post()
  @ApiOperation({
    summary: 'Create a person',
    description: 'Add a new person to the system.',
  })
  @ApiResponse({ status: 201, description: 'Person created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiBody({ type: CreatePersonDto })
  async create(@Body() dto: CreatePersonDto) {
    return this.personService.create(dto);
  }

  /** 📌 Get all persons */
  @Get()
  @ApiOperation({
    summary: 'List all persons',
    description: 'Returns all persons with pagination.',
  })
  @ApiResponse({
    status: 200,
    description: 'Person list retrieved successfully.',
  })
  async selectAll() {
    return this.personService.selectMany();
  }

  /** 📌 Filter persons */
  @Post('filter')
  @ApiOperation({ summary: 'Filter persons' })
  @ApiBody({ type: PersonFilterRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Filtered person list',
    type: [PersonDto],
  })
  async filter(@Body() body: PersonFilterRequestDto) {
    const {
      page = 1,
      limit = 10,
      filters = {},
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = body;
    return this.personService.filter(page, limit, filters, sortBy, sortOrder);
  }

  /** 📌 Get a person by ID */
  @Get(':id')
  @ApiOperation({
    summary: 'Get a person by ID',
    description: 'Returns a specific person based on their ID.',
  })
  @ApiParam({ name: 'id', required: true, description: 'The person ID' })
  @ApiResponse({ status: 200, description: 'Person found.' })
  @ApiResponse({ status: 404, description: 'Person not found.' })
  async selectUnique(@Param('id') id: string) {
    return this.personService.selectUnique(parseInt(id));
  }

  /** 📌 Update a person */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a person',
    description: 'Modify an existing person information.',
  })
  @ApiParam({ name: 'id', required: true, description: 'The person ID' })
  @ApiResponse({ status: 200, description: 'Person updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiResponse({ status: 404, description: 'Person not found.' })
  @ApiBody({ type: UpdatePersonDto })
  async update(@Param('id') id: string, @Body() dto: UpdatePersonDto) {
    return this.personService.update(parseInt(id), dto);
  }

  /** 📌 Delete a person */
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a person',
    description: 'Delete a person from the system.',
  })
  @ApiParam({ name: 'id', required: true, description: 'The person ID' })
  @ApiResponse({ status: 200, description: 'Person deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Person not found.' })
  async delete(@Param('id') id: string) {
    return this.personService.delete(parseInt(id));
  }

  /** 📌 Activate a person */
  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a person' })
  @ApiParam({ name: 'id', required: true, description: 'The person ID' })
  @ApiResponse({ status: 200, description: 'Person activated successfully.' })
  async activate(@Param('id') id: string) {
    return this.personService.activate(parseInt(id));
  }

  /** 📌 Deactivate a person */
  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a person' })
  @ApiParam({ name: 'id', required: true, description: 'The person ID' })
  @ApiResponse({ status: 200, description: 'Person deactivated successfully.' })
  async deactivate(@Param('id') id: string) {
    return this.personService.deactivate(parseInt(id));
  }

  /** 📌 Find person by email */
  @Get('email/:email')
  @ApiOperation({ summary: 'Find person by email' })
  @ApiParam({ name: 'email', required: true, description: 'The person email' })
  @ApiResponse({ status: 200, description: 'Person found.' })
  @ApiResponse({ status: 404, description: 'Person not found.' })
  async findByEmail(@Param('email') email: string) {
    const person = await this.personService.findByEmail(email);
    if (!person) {
      throw new Error('Person not found');
    }
    return person;
  }

  /** 📌 Find person by name */
  @Get('name/:name')
  @ApiOperation({ summary: 'Find person by name' })
  @ApiParam({ name: 'name', required: true, description: 'The person name' })
  @ApiResponse({ status: 200, description: 'Person found.' })
  @ApiResponse({ status: 404, description: 'Person not found.' })
  async findByName(@Param('name') name: string) {
    const person = await this.personService.findByName(name);
    if (!person) {
      throw new Error('Person not found');
    }
    return person;
  }

  // Microservice message patterns
  @MessagePattern('getHello')
  handleGetHello(): string {
    console.log('Person microservice received getHello message');
    return 'Hello from Person Service!';
  }

  @MessagePattern('findAllPersons')
  async handleFindAllPersons(
    @Payload() data: { page?: number; limit?: number },
  ): Promise<any> {
    console.log('Person microservice received findAllPersons message:', data);
    return this.personService.selectMany(data.page, data.limit);
  }

  @MessagePattern('findOnePerson')
  async handleFindOnePerson(@Payload() data: { id: number }): Promise<any> {
    console.log(
      'Person microservice received findOnePerson message for id:',
      data.id,
    );
    return this.personService.selectUnique(data.id);
  }

  @MessagePattern('findPersonByEmail')
  async handleFindPersonByEmail(
    @Payload() data: { email: string },
  ): Promise<any> {
    console.log(
      'Person microservice received findPersonByEmail message for email:',
      data.email,
    );
    return this.personService.findByEmail(data.email);
  }

  @MessagePattern('findPersonByName')
  async handleFindPersonByName(
    @Payload() data: { name: string },
  ): Promise<any> {
    console.log(
      'Person microservice received findPersonByName message for name:',
      data.name,
    );
    return this.personService.findByName(data.name);
  }

  @MessagePattern('createPerson')
  async handleCreatePerson(@Payload() data: CreatePersonDto): Promise<any> {
    console.log('Person microservice received createPerson message:', data);
    return this.personService.create(data);
  }

  @MessagePattern('updatePerson')
  async handleUpdatePerson(
    @Payload() data: { id: number; personData: UpdatePersonDto },
  ): Promise<any> {
    console.log(
      'Person microservice received updatePerson message for id:',
      data.id,
    );
    return this.personService.update(data.id, data.personData);
  }

  @MessagePattern('removePerson')
  async handleRemovePerson(@Payload() data: { id: number }): Promise<any> {
    console.log(
      'Person microservice received removePerson message for id:',
      data.id,
    );
    return this.personService.delete(data.id);
  }

  @MessagePattern('deactivatePerson')
  async handleDeactivatePerson(@Payload() data: { id: number }): Promise<any> {
    console.log(
      'Person microservice received deactivatePerson message for id:',
      data.id,
    );
    return this.personService.deactivate(data.id);
  }

  @MessagePattern('activatePerson')
  async handleActivatePerson(@Payload() data: { id: number }): Promise<any> {
    console.log(
      'Person microservice received activatePerson message for id:',
      data.id,
    );
    return this.personService.activate(data.id);
  }

  @MessagePattern('filterPersons')
  async handleFilterPersons(
    @Payload() data: PersonFilterRequestDto,
  ): Promise<any> {
    console.log('Person microservice received filterPersons message:', data);
    const {
      page = 1,
      limit = 10,
      filters = {},
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = data;
    return this.personService.filter(page, limit, filters, sortBy, sortOrder);
  }
}
