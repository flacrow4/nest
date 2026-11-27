import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddConstraintsTables1715000000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Добавляем проверку возраста для таблицы "user"
    await queryRunner.query(`
      ALTER TABLE "user"
        ADD CONSTRAINT "CHK_user_age" CHECK (age >= 0 AND age <= 150);
    `);

    // Добавляем проверку статуса для таблицы "appointment"
    await queryRunner.query(`
      ALTER TABLE "appointment"
        ADD CONSTRAINT "CHK_appointment_status" CHECK (status IN ('booked', 'completed', 'cancelled'));
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаляем констрейнты в обратном порядке (хотя здесь это не критично)
    await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "CHK_appointment_status";`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "CHK_user_age";`);
  }
}