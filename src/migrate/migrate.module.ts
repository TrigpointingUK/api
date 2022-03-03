import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { AuthzModule } from 'src/authz/authz.module';
import { LogsModule } from 'src/logs/logs.module';
import { PhotosModule } from 'src/photos/photos.module';
import { TrigsModule } from 'src/trigs/trigs.module';
import { UsersModule } from 'src/users/users.module';
import { MigrateService } from './migrate.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: +configService.get<number>('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
        migrationsTableName: 'migration',
        migrations: ['src/migration/*.ts'],
        cli: { migrationsDir: 'src/migration' },
        extra: {
          ssl: true,
        },
        ssl: { rejectUnauthorized: false },
      }),
    }),
    TrigsModule,
    LogsModule,
    PhotosModule,
    UsersModule,
    AuthzModule,
  ],
  providers: [MigrateService],
})
export class MigrateModule {}
