import {Body, Controller, Delete, Get, Param, Patch, UseGuards} from '@nestjs/common';
import { ProfesseurService } from './professeur.service';
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {UserDecorator} from "../decorators/user.decorator";
import {User} from "../user/schema/user.schema";
import {UpdateUserDto} from "../user/dto/update-user.dto";
import {AssginInstrumentDto} from "./dto/assgin-instrument.dto";

@Controller('professeur')
export class ProfesseurController {
  constructor(private readonly professeurService: ProfesseurService) {}


  @Get()
  findAll(){
    return this.professeurService.findAll()
  }

  @Get(":email")
  findByEmail(@Param("email") email : string){
    return this.professeurService.findByMail(email)
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  updateProfesseur(@UserDecorator() user : Partial<User>,@Body() updateUserDto : UpdateUserDto ){
    return this.professeurService.updateProfesseur(user,updateUserDto)
  }


  @Delete()
  @UseGuards(JwtAuthGuard)
  deleteProfesseur(@UserDecorator() user : Partial<User>){
    return this.professeurService.deleteProfesseur(user)
  }


  @Patch("assign-instrument")
  @UseGuards(JwtAuthGuard)
  assignInstruments(@UserDecorator() user : Partial<User>,@Body() instrumentsDto : AssginInstrumentDto){
    return this.professeurService.assignInstrument(user, instrumentsDto)
  }



}
