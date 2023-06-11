import {User} from "../../user/schema/user.schema";
import {Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";


export type EtudiantDocument = HydratedDocument<Etudiant>;

@Schema()
export class Etudiant extends User{


}

export const EtudiantSchema = SchemaFactory.createForClass(Etudiant);
