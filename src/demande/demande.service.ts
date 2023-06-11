import {ConflictException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {User} from "../user/schema/user.schema";
import {RoleEnum} from "../user/enum/role.enum";
import {MakeRequestDto} from "./dto/make-request.dto";
import {ProfesseurService} from "../professeur/professeur.service";
import {InjectModel} from "@nestjs/mongoose";
import {Demande} from "./schema/demande.schema";
import {Model} from "mongoose";
import {InstrumentService} from "../instrument/instrument.service";

@Injectable()
export class DemandeService {


    constructor(
        @InjectModel(Demande.name)
        private demandeModel : Model<Demande>,
        private professeurService : ProfesseurService,
        private instrumentService : InstrumentService
    ) {
    }


    async makeRequest(user: Partial<User>, makeRequestDto: MakeRequestDto) {
        if (user.role != RoleEnum.ETUDIANT) {
            throw new UnauthorizedException()
        }
        const prof = await this.professeurService.findById(makeRequestDto.profId)
        if (!prof) {
            throw new NotFoundException("le professeur n'existe pas")
        }
        const instrument = await this.instrumentService.getInstrumentByName(makeRequestDto.instrumentName)
        if (!instrument || prof.instruments.find((existingInstrument)=>instrument.name==existingInstrument.name)){
            throw new NotFoundException("L'instrument n'existe pas")
        }

        const request= new this.demandeModel({
            etudiant : user,
            professeur : prof,
            instrument : instrument,
            date : makeRequestDto.date
        })
        try {
            return await request.save()
        }catch (e){
            throw new ConflictException("Votre demande n'est pas envoyée veuillez réessayer")
        }
    }


    // async updateRequestStatus(user : Partial<User>,)
    




}
