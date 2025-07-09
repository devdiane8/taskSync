export class CreateTodoDto {
  title: string;
  description?: string;
  personId: number;
  isDone?: boolean;
  priority?: number;
  startDate?: Date;
  endDate?: Date;
  labels?: string[];
}

export class UpdateTodoDto {
  title?: string;
  description?: string;
  personId?: number;
  isDone?: boolean;
  priority?: number;
  startDate?: Date;
  endDate?: Date;
  labels?: string[];
}

export class TodoFiltersDto {
  title?: string;
  description?: string;
  personId?: number;
  isDone?: boolean;
  priority?: number;
  startDateStart?: string;
  startDateEnd?: string;
  endDateStart?: string;
  endDateEnd?: string;
  createdAtStart?: string;
  createdAtEnd?: string;
  updatedAtStart?: string;
  updatedAtEnd?: string;
  labels?: string[];
}

export class TodoFilterRequestDto {
  page?: number;
  limit?: number;
  filters?: TodoFiltersDto;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class TodoDto {
  id: number;
  title: string;
  description?: string;
  personId: number;
  isDone: boolean;
  priority?: number;
  startDate?: Date;
  endDate?: Date;
  labels: string[];
  createdAt: Date;
  updatedAt: Date;
  person?: {
    id: number;
    name: string;
    email: string;
  };
}
