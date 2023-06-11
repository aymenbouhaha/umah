import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose from "mongoose";
import {Etudiant} from "../../etudiant/schema/etudiant.schema";



@Schema()
export class Demande {

    _id;

    @Prop({required : true})
    accepted : boolean


    @Prop({type: mongoose.Types.ObjectId , ref : "Etudiant" , required : true})
    etudiant : Etudiant


}

export const DemandeSchema = SchemaFactory.createForClass(Demande);
