import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Gender} from "../enum/gender.enum";


@Schema()
export class User {

    _id;

    @Prop()
    firstname: string;

    @Prop()
    lastname: string;

    @Prop()
    phoneNumber: string;

    @Prop()
    dateBirth: string;

    @Prop({ type: String, enum: Gender })
    gender: Gender;

    @Prop()
    address: string;
    @Prop()
    email: string;

    @Prop()
    profileImage: string;

    @Prop()
    role: string;

    @Prop({ default: Date.now })
    date_added: Date;

    @Prop()
    password: string;

    @Prop()
    salt: string;



}

export const UserSchema = SchemaFactory.createForClass(User);
