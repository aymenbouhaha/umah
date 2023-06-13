import {Body, Controller, Get, Patch, Post, UseGuards} from '@nestjs/common';
import { DemandeService } from './demande.service';
import {UserDecorator} from "../decorators/user.decorator";
import {User} from "../user/schema/user.schema";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {MakeRequestDto} from "./dto/make-request.dto";
import {ChangeStatusDto} from "./dto/change-status.dto";

@Controller('demande')
export class DemandeController {
  constructor(private readonly demandeService: DemandeService) {

  }


  @Get()
  @UseGuards(JwtAuthGuard)
  getRequests(@UserDecorator() user : Partial<User>){
      return this.demandeService.getAllRequest(user)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createRequest(@UserDecorator() user : Partial<User>, @Body() makeRequestDto : MakeRequestDto){
    return this.demandeService.makeRequest(user,makeRequestDto)
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  updateStatus(@UserDecorator() user : Partial<User>, @Body() changeStatusDto : ChangeStatusDto){
    return this.demandeService.updateRequestStatus(user,changeStatusDto)
  }



}
