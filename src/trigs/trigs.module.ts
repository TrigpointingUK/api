import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trig } from './entities/trig.entity';
import { TrigsService } from './trigs.service';
import { TrigsController } from './trigs.controller';
import { AuthzModule } from '../authz/authz.module';
import { CoordsService } from 'src/coords/coords.service';

@Module({
  imports: [TypeOrmModule.forFeature([Trig]), AuthzModule],
  controllers: [TrigsController],
  providers: [TrigsService, CoordsService],
  exports: [TrigsService],
})
export class TrigsModule {}
