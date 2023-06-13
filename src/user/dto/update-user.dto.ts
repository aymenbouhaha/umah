import {IsNotEmpty, IsOptional, IsPhoneNumber, IsString} from "class-validator";


export class UpdateUserDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    firstname: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    lastname: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber("TN",{message : "numéro invalide"})
    phoneNumber: string;


    @IsOptional()
    @IsString()
    @IsNotEmpty()
    address: string;


}
