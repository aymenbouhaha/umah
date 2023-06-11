import {User} from "../../user/schema/user.schema";
import {SchemaFactory} from "@nestjs/mongoose";


export class Etudiant extends User{


}

export const EtudiantSchema = SchemaFactory.createForClass(Etudiant);
