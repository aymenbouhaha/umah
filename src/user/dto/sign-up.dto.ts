import {Gender} from "../enum/gender.enum";
import {IsDateString, IsEmail, IsIn, IsNotEmpty, IsPhoneNumber, IsString} from "class-validator";


export class SignUpDto{


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

    @IsDateString()
    dateBirth: string;

    @IsString()
    @IsIn(["MALE", "FEMALE"])
    gender: Gender;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    @IsEmail()
    email : string

    @IsString()
    @IsNotEmpty()
    password: string;


}
