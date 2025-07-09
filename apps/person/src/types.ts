export class CreatePersonDto {
  name: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  address?: string;
  city?: string;
  country?: string;
  isActive?: boolean;
}

export class UpdatePersonDto {
  name?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  address?: string;
  city?: string;
  country?: string;
  isActive?: boolean;
}

export class PersonFiltersDto {
  name?: string;
  email?: string;
  phoneNumber?: string;
  city?: string;
  country?: string;
  address?: string;
  isActive?: boolean;
  dateOfBirthStart?: string;
  dateOfBirthEnd?: string;
  createdAtStart?: string;
  createdAtEnd?: string;
  updatedAtStart?: string;
  updatedAtEnd?: string;
}

export class PersonFilterRequestDto {
  page?: number;
  limit?: number;
  filters?: PersonFiltersDto;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class PersonDto {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  address?: string;
  city?: string;
  country?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
