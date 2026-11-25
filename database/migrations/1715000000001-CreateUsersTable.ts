import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTable1715000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'firstname', type: 'varchar', length: '255' },
          { name: 'lastname', type: 'varchar', length: '255' },
          { name: 'age', type: 'int' },
          { name: 'policy', type: 'varchar', length: '12' }, // Полис
          // Поля для авторизации
          { name: 'email', type: 'varchar', length: '255', isUnique: true },
          { name: 'password', type: 'varchar', length: '255' },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
  }
}