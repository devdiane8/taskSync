import { MigrationInterface, QueryRunner, Table, Index } from 'typeorm';

export class CreateTodosTable1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'todos',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'personId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'isDone',
            type: 'boolean',
            default: false,
          },
          {
            name: 'priority',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'startDate',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'endDate',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'labels',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create indexes for better query performance
    await queryRunner.query('CREATE INDEX IDX_TODOS_PERSON_ID ON todos (personId)');
    await queryRunner.query('CREATE INDEX IDX_TODOS_IS_DONE ON todos (isDone)');
    await queryRunner.query('CREATE INDEX IDX_TODOS_PRIORITY ON todos (priority)');
    await queryRunner.query('CREATE INDEX IDX_TODOS_START_DATE ON todos (startDate)');
    await queryRunner.query('CREATE INDEX IDX_TODOS_END_DATE ON todos (endDate)');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('todos');
  }
} 