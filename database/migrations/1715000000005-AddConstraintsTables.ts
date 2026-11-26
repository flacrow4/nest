import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddConstraintsToTables1715000000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user"
      ADD CONSTRAINT "CHK_user_age" CHECK (age >= 0 AND age <= 150);
    `);

    await queryRunner.query(`
      ALTER TABLE "appointment"
      ADD CONSTRAINT "CHK_appointment_status" CHECK (status IN ('booked', 'completed', 'cancelled'));
    `);
    */
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "CHK_user_age";`);
    await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "CHK_appointment_status";`);
  }
}