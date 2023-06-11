import {Body, Controller, Delete, Get, Param, Patch, UseGuards} from '@nestjs/common';
import { EtudiantService } from './etudiant.service';
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {UserDecorator} from "../decorators/user.decorator";
import {User} from "../user/schema/user.schema";
import {UpdateUserDto} from "../user/dto/update-user.dto";

@Controller('etudiant')
export class EtudiantController {
  constructor(private readonly etudiantService: EtudiantService) {}


  @Get()
  findAll(){
    return this.etudiantService.findAll()
  }

  @Get(":email")
  findByEmail(@Param("email") email : string){
    return this.etudiantService.findByMail(email)
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  updateEtudiant(@UserDecorator() user : Partial<User>,@Body() updateUserDto : UpdateUserDto ){
    return this.etudiantService.updateEtudiant(user,updateUserDto)
  }


  @Delete()
  @UseGuards(JwtAuthGuard)
  deleteEtudiant(@UserDecorator() user : Partial<User>){
    return this.etudiantService.deleteEtudiant(user)
  }

}
