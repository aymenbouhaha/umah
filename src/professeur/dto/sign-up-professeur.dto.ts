import {SignUpDto} from "../../user/dto/sign-up.dto";
import {IsNumber, IsNumberString, Max, Min} from "class-validator";


export class SignUpProfesseurDto extends SignUpDto{

    // @Max(99999999,)
    // @Min(10000000,)
    @IsNumberString()
    cin: string;


}
