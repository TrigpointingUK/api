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
      useFactory: (configService: ConfigService) => {
        const socketPath = configService.get('POSTGRES_SOCKET');
        const extra = socketPath ? {
            socketPath: socketPath,
        } : { };

        return ({
          type: 'postgres',
          host: socketPath || configService.get('POSTGRES_HOSTNAME'),
          username: configService.get('POSTGRES_USERNAME'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DATABASE'),
          autoLoadEntities: true,
          synchronize: true,
          migrationsTableName: 'migration',
          migrations: ['src/migration/*.ts'],
          cli: { migrationsDir: 'src/migration' },
          extra: extra
        })
      },
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
