import {Body, Controller, Post} from '@nestjs/common';
import { AuthService } from './auth.service';
import {LoginDto} from "./dto/login.dto";
import {ProfesseurService} from "../professeur/professeur.service";
import {EtudiantService} from "../etudiant/etudiant.service";
import {SignUpDto} from "../user/dto/sign-up.dto";
import {SignUpProfesseurDto} from "../professeur/dto/sign-up-professeur.dto";

@Controller('auth')
export class AuthController {
  constructor(
      private readonly authService: AuthService,
      private professeurService : ProfesseurService,
      private etudiantService : EtudiantService
  ) {}



  @Post("login")
  login(@Body() loginDto : LoginDto){
    return this.authService.login(loginDto)
  }


  @Post("/register/etudiant")
  signUpStudent(@Body() signUpDto : SignUpDto){
    return this.etudiantService.signUpStudent(signUpDto)
  }


  @Post("/register/professeur")
  signProfesseur(@Body() signUpProfesseur : SignUpProfesseurDto){
    return this.professeurService.signUpProfesseur(signUpProfesseur)
  }



}
