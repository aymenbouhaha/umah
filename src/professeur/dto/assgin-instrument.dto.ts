import {IsArray, IsNotEmpty} from "class-validator";


export class AssginInstrumentDto {

    @IsNotEmpty()
    @IsArray()
    idList : string[]

}
