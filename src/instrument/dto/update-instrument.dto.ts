import {IsNotEmpty, IsString} from "class-validator";


export class UpdateInstrumentDto {

    @IsString()
    @IsNotEmpty()
    name : string

    @IsString()
    @IsNotEmpty()
    category : string


}
