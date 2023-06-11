import {Body, Controller, Delete, Get, Param, Patch, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import { ProfesseurService } from './professeur.service';
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {UserDecorator} from "../decorators/user.decorator";
import {User} from "../user/schema/user.schema";
import {UpdateUserDto} from "../user/dto/update-user.dto";
import {AssginInstrumentDto} from "./dto/assgin-instrument.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import { v4 as uuidv4 } from 'uuid';
import {ChangePasswordDto} from "../user/dto/change-password.dto";

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

  @Patch("change-password")
  @UseGuards(JwtAuthGuard)
  changePassword(@UserDecorator() user : Partial<User>, @Body() changePasswordDto : ChangePasswordDto){
    return this.professeurService.changePassword(user,changePasswordDto)
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

  @Patch("profile-image")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
      FileInterceptor('profileImage', {
        storage: diskStorage({
          destination: './public/uploads/profiles/avatar',
          filename: (req, file, cb) => {
            const randomName = uuidv4() + '-' + file.originalname;
            cb(null, randomName);
          },
        }),
      }),
  )
  addProfilePicture(@UserDecorator() user : Partial<User>, @UploadedFile() profileImage : Express.Multer.File){
    return this.professeurService.addProfilePicture(user,profileImage)
  }



}
