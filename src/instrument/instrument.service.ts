import {BadRequestException, ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Instrument, InstrumentDocument} from "./schema/instrument.schema";
import {Model} from "mongoose";
import {CreateInstrumentDto} from "./dto/create-instrument.dto";
import {User} from "../user/schema/user.schema";
import {RoleEnum} from "../user/enum/role.enum";
import {UpdateInstrumentDto} from "./dto/update-instrument.dto";

@Injectable()
export class InstrumentService {


    constructor(
        @InjectModel(Instrument.name)
        private instrumentModel : Model<InstrumentDocument>
    ) {
    }


    async createInstrument(user : Partial<User>,instrumentInfo: CreateInstrumentDto,image : Express.Multer.File) {
        if (user.role!=RoleEnum.ADMIN){
            throw new UnauthorizedException()
        }
        const existingInstrument=await this.instrumentModel.findOne({name : instrumentInfo.name.toUpperCase()})
        if (existingInstrument){
            throw new BadRequestException("L'instrument existe deja")
        }
        const imageUrl=this.resolveImage(image)
        const instrument = new this.instrumentModel({
            name : instrumentInfo.name.toUpperCase(),
            category : instrumentInfo.category.toUpperCase(),
            imageUrl : imageUrl
        })
        try {
            return await instrument.save()
        } catch (e) {
            throw new BadRequestException("L'instrument n'est pas ajouté")
        }
    }


    getAllInstrument(){
        return this.instrumentModel.find()
    }

    getInstrumentByName(name : string){
        return this.instrumentModel.findOne({name : name})
    }

    getInstrumentById(id : string){
        return this.instrumentModel.findById(id)
    }

    getInstrumentsMatchingIds(idsList : string[]){
        return this.instrumentModel.find({_id : { $in : idsList}})
    }

    async removeInstrument(user: Partial<User>, id: string) {
        if (user.role != RoleEnum.ADMIN) {
            throw new UnauthorizedException()
        }
        try {
            return await this.instrumentModel.deleteOne({_id: id}).exec()
        }catch (e) {
            throw new  ConflictException("Une erreur est survenue lors de la supression")
        }
    }

    async updateInstrument(user: Partial<User>, id: string, updateInstrumentDto: UpdateInstrumentDto) {
        if (user.role != RoleEnum.ADMIN) {
            throw new UnauthorizedException()
        }
        try {
            return await this.instrumentModel.updateOne({_id: id}, {...updateInstrumentDto}, {new: true})
                .exec()
        } catch (e) {
            throw new ConflictException("Une erreur est survenue lors de la mise à jour")
        }
    }


    resolveImage(image: Express.Multer.File): string {
        let photo;
        if (image) {
            photo = image.path.replace('public', '').split('\\').join('/');
        }
        return photo;
    }


}
