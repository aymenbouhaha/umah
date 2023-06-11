import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, {HydratedDocument} from "mongoose";
import {Etudiant} from "../../etudiant/schema/etudiant.schema";
import {Professeur} from "../../professeur/schema/professeur.schema";
import {RequestStatus} from "../enum/request-status";
import {Instrument} from "../../instrument/schema/instrument.schema";


export type DemandeDocument = HydratedDocument<Demande>;

@Schema()
export class Demande {

    _id;

    @Prop({required : true, type : String , enum : RequestStatus, default : RequestStatus.PENDING})
    status : RequestStatus

    @Prop({type: mongoose.Types.ObjectId , ref : "Etudiant" , required : true})
    etudiant : Etudiant

    @Prop({type : mongoose.Types.ObjectId, ref : "Professeur", required : true})
    professeur : Professeur

    @Prop({type : Date})
    date : Date

    @Prop({type : mongoose.Types.ObjectId , ref: "Instrument" , required : true})
    instrument : Instrument

}

export const DemandeSchema = SchemaFactory.createForClass(Demande);
