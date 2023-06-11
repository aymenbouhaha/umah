import {Controller, Get, Param} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Get()
  findAll(){
    return this.userService.findAll()
  }

  @Get(":email")
  findByEmail(@Param("email") email : string){
    return this.userService.findByMail(email)
  }


}
