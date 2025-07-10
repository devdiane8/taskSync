import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiExtraModels,
  ApiQuery,
} from '@nestjs/swagger';
import { PersonService } from './person.service';
import {
  CreatePersonDto,
  PersonDto,
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

  /** 📌 Get all persons with optional filtering */
  @Get()
  @ApiOperation({
    summary: 'List all persons with optional filtering',
    description: 'Returns all persons with pagination and optional filters via query parameters.',
  })
  @ApiResponse({
    status: 200,
    description: 'Person list retrieved successfully.',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page (default: 10)' })
  @ApiQuery({ name: 'name', required: false, description: 'Filter by name (partial match)' })
  @ApiQuery({ name: 'email', required: false, description: 'Filter by email (partial match)' })
  @ApiQuery({ name: 'isActive', required: false, description: 'Filter by active status (true/false)' })
  @ApiQuery({ name: 'city', required: false, description: 'Filter by city (partial match)' })
  @ApiQuery({ name: 'country', required: false, description: 'Filter by country (partial match)' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort field (default: createdAt)' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order: asc or desc (default: desc)' })
  selectAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('isActive') isActive?: string,
    @Query('city') city?: string,
    @Query('country') country?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;
    
    // Créer un objet filters vide et ajouter seulement les propriétés définies
    const filters: any = {};
    if (name) filters.name = name;
    if (email) filters.email = email;
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    if (city) filters.city = city;
    if (country) filters.country = country;
    
    const sortByField = sortBy || 'createdAt';
    const sortOrderField = (sortOrder === 'asc' || sortOrder === 'desc') ? sortOrder : 'desc';

    return this.personService.filter(pageNum, limitNum, filters, sortByField, sortOrderField);
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
