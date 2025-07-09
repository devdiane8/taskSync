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
import { PersonService } from './person.service';
import {
  CreatePersonDto,
  PersonDto,
  PersonFilterRequestDto,
  PersonFiltersDto,
  UpdatePersonDto,
} from './dto';

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
  create(@Body() dto: CreatePersonDto) {
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
  selectAll() {
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
  filter(@Body() body: PersonFilterRequestDto) {
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
  selectUnique(@Param('id') id: string) {
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
  update(@Param('id') id: string, @Body() dto: UpdatePersonDto) {
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
  delete(@Param('id') id: string) {
    return this.personService.delete(parseInt(id));
  }

  /** 📌 Activate a person */
  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a person' })
  @ApiParam({ name: 'id', required: true, description: 'The person ID' })
  @ApiResponse({ status: 200, description: 'Person activated successfully.' })
  activate(@Param('id') id: string) {
    return this.personService.activate(parseInt(id));
  }

  /** 📌 Deactivate a person */
  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a person' })
  @ApiParam({ name: 'id', required: true, description: 'The person ID' })
  @ApiResponse({ status: 200, description: 'Person deactivated successfully.' })
  deactivate(@Param('id') id: string) {
    return this.personService.deactivate(parseInt(id));
  }

  /** 📌 Find person by email */
  @Get('email/:email')
  @ApiOperation({ summary: 'Find person by email' })
  @ApiParam({ name: 'email', required: true, description: 'The person email' })
  @ApiResponse({ status: 200, description: 'Person found.' })
  @ApiResponse({ status: 404, description: 'Person not found.' })
  findByEmail(@Param('email') email: string) {
    return this.personService.findByEmail(email);
  }

  /** 📌 Find person by name */
  @Get('name/:name')
  @ApiOperation({ summary: 'Find person by name' })
  @ApiParam({ name: 'name', required: true, description: 'The person name' })
  @ApiResponse({ status: 200, description: 'Person found.' })
  @ApiResponse({ status: 404, description: 'Person not found.' })
  findByName(@Param('name') name: string) {
    return this.personService.findByName(name);
  }
}
