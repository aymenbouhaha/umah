import {User} from "../../user/schema/user.schema";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Instrument} from "../../instrument/schema/instrument.schema";
import mongoose, {HydratedDocument} from "mongoose";

export type ProfesseurDocument = HydratedDocument<Professeur>;

@Schema()
export class Professeur extends User{


    @Prop({
        unique : true,
        required : true
    })
    cin : string


    @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Instrument' }] })
    instruments : Instrument[]


}

export const ProfesseurSchema = SchemaFactory.createForClass(Professeur);
