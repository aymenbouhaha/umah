import { Controller } from '@nestjs/common';
import { LeconService } from './lecon.service';

@Controller('lecon')
export class LeconController {
  constructor(private readonly leconService: LeconService) {}
}
