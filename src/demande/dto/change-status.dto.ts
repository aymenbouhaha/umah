import {IsIn, IsNotEmpty, IsString} from "class-validator";
import {RequestStatus} from "../enum/request-status";


export class ChangeStatusDto {

    @IsString()
    @IsNotEmpty()
    requestId : string

    @IsString()
    @IsNotEmpty()
    @IsIn([RequestStatus.ACCEPTED , RequestStatus.REFUSED])
    status : string

}
