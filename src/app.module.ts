import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrigsModule } from './trigs/trigs.module';
import { LogsModule } from './logs/logs.module';
import { PhotosModule } from './photos/photos.module';
import { UsersModule } from './users/users.module';
import { AuthzModule } from './authz/authz.module';
import { CoordsService } from './coords/coords.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: '/cloudsql/trigpointinguk:europe-west1:trigpointing-6b5de36a',
        username: 'postgres',
        password: configService.get('POSTGRES_PASSWORD'),
        database: 'tme',
        autoLoadEntities: true,
        synchronize: true,
        migrationsTableName: 'migration',
        migrations: ['src/migration/*.ts'],
        cli: { migrationsDir: 'src/migration' },
        extra: {
          socketPath: '/cloudsql/trigpointinguk:europe-west1:trigpointing-6b5de36a'
        },
      }),
    }),
    TrigsModule,
    LogsModule,
    PhotosModule,
    UsersModule,
    AuthzModule,
  ],
  controllers: [AppController],
  providers: [ConfigService, AppService, CoordsService],
})
export class AppModule {}
