import {User} from "../../user/schema/user.schema";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, {HydratedDocument} from "mongoose";
import {Instrument} from "../../instrument/schema/instrument.schema";


export type EtudiantDocument = HydratedDocument<Etudiant>;

@Schema()
export class Etudiant extends User{


    @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Instrument' }] })
    instruments : Instrument[]

}

export const EtudiantSchema = SchemaFactory.createForClass(Etudiant);
