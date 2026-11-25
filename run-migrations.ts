// Обратите внимание: импорт без фигурных скобок, так как в orm-config.ts стоит export default
import AppDataSource from './database/orm-config';

AppDataSource.initialize()
  .then(async () => {
    console.log('DataSource initialized, running migrations...');
    await AppDataSource.runMigrations();
    console.log('Migrations run successfully!');
    await AppDataSource.destroy();
  })
  .catch((error: any) => { // Явно указываем тип any для error
    console.error('Error during migration run:', error);
    process.exit(1);
  });