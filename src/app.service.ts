import { Injectable } from '@nestjs/common';
import {Types} from "mongoose";

@Injectable()
export class AppService {

  isObjectIdValid(id: string): boolean {
    return Types.ObjectId.isValid(id);
  }

}
