import {Body, Controller, Delete, Get, Param, Patch, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import { EtudiantService } from './etudiant.service';
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {UserDecorator} from "../decorators/user.decorator";
import {User} from "../user/schema/user.schema";
import {UpdateUserDto} from "../user/dto/update-user.dto";
import {diskStorage} from "multer";
import {FileInterceptor} from "@nestjs/platform-express";
import { v4 as uuidv4 } from 'uuid';
import {ChangePasswordDto} from "../user/dto/change-password.dto";


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

  @Patch("change-password")
  @UseGuards(JwtAuthGuard)
  changePassword(@UserDecorator() user : Partial<User>, @Body() changePasswordDto : ChangePasswordDto){
    return this.etudiantService.changePassword(user,changePasswordDto)
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
    return this.etudiantService.addProfilePicture(user,profileImage)
  }

}
