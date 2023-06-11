import { Module } from '@nestjs/common';
import { LeconService } from './lecon.service';
import { LeconController } from './lecon.controller';

@Module({
  controllers: [LeconController],
  providers: [LeconService]
})
export class LeconModule {}
