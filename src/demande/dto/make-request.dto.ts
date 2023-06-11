import {IsDateString, IsNotEmpty, IsString} from "class-validator";


export class MakeRequestDto {

    @IsString()
    @IsNotEmpty()
    profId : string

    @IsString()
    @IsNotEmpty()
    instrumentName : string

    @IsNotEmpty()
    @IsDateString()
    date : string


}
