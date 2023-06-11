import {IsIn} from "class-validator";
import {RequestStatus} from "../enum/request-status";


export class ChangeStatusDto {

    @IsIn([RequestStatus.ACCEPTED , RequestStatus.REFUSED])
    status : string

}
