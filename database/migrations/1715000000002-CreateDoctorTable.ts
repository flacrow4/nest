import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateDoctorTable1715000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'doctor',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'firstname', type: 'varchar', length: '255' },
          { name: 'lastname', type: 'varchar', length: '255' },
          { name: 'specialization', type: 'varchar', length: '255' },
          { name: 'cabinet', type: 'varchar', length: '50' },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('doctor');
  }
}