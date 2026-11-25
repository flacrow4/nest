import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateScheduleTable1715000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'schedule',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'doctor_id', type: 'int' },
          { name: 'work_schedule', type: 'timestamp' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'schedule',
      new TableForeignKey({
        columnNames: ['doctor_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'doctor',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('schedule');
  }
}