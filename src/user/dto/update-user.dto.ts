import {IsNotEmpty, IsPhoneNumber, IsString} from "class-validator";


export class UpdateUserDto {

    @IsString()
    @IsNotEmpty()
    firstname: string;

    @IsString()
    @IsNotEmpty()
    lastname: string;

    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber("TN",{message : "numéro invalide"})
    phoneNumber: string;


    @IsString()
    @IsNotEmpty()
    address: string;


}
