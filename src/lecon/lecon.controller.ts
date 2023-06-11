import {Controller, Get, UseGuards} from '@nestjs/common';
import { LeconService } from './lecon.service';
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {UserDecorator} from "../decorators/user.decorator";
import {User} from "../user/schema/user.schema";

@Controller('lecon')
export class LeconController {
  constructor(private readonly leconService: LeconService) {}


  @Get()
  @UseGuards(JwtAuthGuard)
  getCourses(@UserDecorator() user : Partial<User>){
    return this.leconService.getAllCourse(user)
  }



}
