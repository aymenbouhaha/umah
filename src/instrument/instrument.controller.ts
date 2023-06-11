import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import { InstrumentService } from './instrument.service';
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {UserDecorator} from "../decorators/user.decorator";
import {User} from "../user/schema/user.schema";
import {CreateInstrumentDto} from "./dto/create-instrument.dto";
import {UpdateInstrumentDto} from "./dto/update-instrument.dto";

@Controller('instrument')
export class InstrumentController {
  constructor(private readonly instrumentService: InstrumentService) {}


  @Post()
  @UseGuards(JwtAuthGuard)
  createInstrument(@UserDecorator() user : Partial<User>,@Body() createInstrumentDto : CreateInstrumentDto){
    return this.instrumentService.createInstrument(user,createInstrumentDto)
  }


  @Get()
  findAllInstrument(){
    return this.instrumentService.getAllInstrument()
  }


  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  deleteInstrument(@UserDecorator() user : Partial<User>,@Param("id") id : string){
    return this.instrumentService.removeInstrument(user,id)
  }


  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  updateInstrument(@UserDecorator() user : Partial<User>,@Param("id") id : string,@Body() updateDto : UpdateInstrumentDto){
    return this.instrumentService.updateInstrument(user,id,updateDto)
  }

}
