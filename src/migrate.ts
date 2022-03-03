import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';
import { MigrateModule } from './migrate/migrate.module';

async function bootstrap() {
  await CommandFactory.run(MigrateModule, ['debug', 'log', 'warn', 'error']);
}

bootstrap();
