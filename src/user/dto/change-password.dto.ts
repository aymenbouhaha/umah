import {IsNotEmpty, IsString} from "class-validator";


export class ChangePasswordDto{


    @IsString()
    @IsNotEmpty()
    previousPassword : string

    @IsString()
    @IsNotEmpty()
    newPassword : string


}
