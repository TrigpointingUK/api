import { Global, Module } from '@nestjs/common';
import { CoordsService } from './coords.service';

@Global()
@Module({
  providers: [CoordsService],
  exports: [CoordsService]
})
export class CoordsModule {}
