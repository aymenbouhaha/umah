import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Gender} from "../enum/gender.enum";
import {HydratedDocument} from "mongoose";
import {RoleEnum} from "../enum/role.enum";


export type UserDocument = HydratedDocument<User>;


@Schema()
export class User {

    _id;

    @Prop({required : true})
    firstname: string;

    @Prop({required : true})
    lastname: string;

    @Prop({required : true})
    phoneNumber: string;

    @Prop({required : true})
    dateBirth: string;

    @Prop({ type: String, enum: Gender })
    gender: Gender;

    @Prop({required : true})
    address: string;
    @Prop({required : true, unique : true})
    email: string;

    @Prop()
    profileImage: string;

    @Prop({type : String , enum : RoleEnum})
    role: RoleEnum;

    @Prop({ default: Date.now })
    date_added: Date;

    @Prop({required : true})
    password: string;

    @Prop({required : true})
    salt: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
