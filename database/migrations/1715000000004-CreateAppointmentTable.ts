import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateAppointmentTable1715000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'appointment',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'doctor_id', type: 'int' },
          { name: 'client_id', type: 'int' }, // Это теперь ссылка на таблицу user
          { name: 'visit_at', type: 'timestamp' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'appointment',
      new TableForeignKey({
        columnNames: ['doctor_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'doctor',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'appointment',
      new TableForeignKey({
        columnNames: ['client_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user', // Ссылаемся на таблицу user
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('appointment');
  }
}