import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, model } from "mongoose";
import {Instrument} from "../../instrument/schema/instrument.schema";
import {Etudiant} from "../../etudiant/schema/etudiant.schema";
import {Professeur} from "../../professeur/schema/professeur.schema";

export type LeconDocument = HydratedDocument<Lecon>;
@Schema()
export class Lecon{
    _id;

    @Prop({type: mongoose.Types.ObjectId , ref : "Professeur" , required : true})
    professeur: Professeur;

    @Prop({type: mongoose.Types.ObjectId , ref : "Instrument" , required : true})
    instrument: Instrument;

    @Prop({ type: Date,  required : true })
    date : Date ;

    @Prop({type: mongoose.Types.ObjectId , ref : "Etudiant" , required : true})
    etudiants: Etudiant;


}

export const LeconSchema = SchemaFactory.createForClass(Lecon);

