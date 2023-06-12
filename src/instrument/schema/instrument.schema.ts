import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";


export type InstrumentDocument = HydratedDocument<Instrument>;

@Schema()
export class Instrument {

    _id;

    @Prop({
        required: true,
        unique: true,
    })
    name: string;

    @Prop({
        required: true,
    })
    category: string;

    @Prop()
    imageUrl : string
}

export const InstrumentSchema = SchemaFactory.createForClass(Instrument);
