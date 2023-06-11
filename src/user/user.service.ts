import {ConflictException, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "./schema/user.schema";
import {Model} from "mongoose";
import {SignUpDto} from "./dto/sign-up.dto";
import {RoleEnum} from "./enum/role.enum";
import {UpdateUserDto} from "./dto/update-user.dto";

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>
    ) {
    }


    changePassword(email : string , newPassword : string){
        return this.userModel.updateOne({email : email}, {password : newPassword})
    }



    findUserByEmailWithPassword(email : string){
        return this.userModel.findOne({email : email})
    }


    findAll(){
        return this.userModel.find().projection({password : 0, salt : 0})
    }


    findByMail(email : string){
        return this.userModel.findOne({email : email},{password :0 , salt : 0})
    }

    async signUpUser(userInfo: SignUpDto, role: RoleEnum, salt: string) {
        const user = new this.userModel({
            ...userInfo,
            role,
            salt
        })
        try {
            return await user.save()
        }catch (e) {
            throw new ConflictException("Une Erreur est survenue veuillez réessayer")
        }
    }


    async addProfilePicture(email,imageUrl : string){
        return this.userModel.updateOne({email : email},{profileImage : imageUrl},{new : true}).exec()
    }


    async updateUser(user : Partial<User>, updateDto : UpdateUserDto){
        return this.userModel.updateOne({email : user.email}, {...updateDto}).projection({password : 0 , salt : 0}).exec()
    }


    async deleteUser(user : Partial<User>){
        return this.userModel.deleteOne({email : user.email}).exec()
    }

    resolveProfileImage(avatar: Express.Multer.File): string {
        let photo;
        if (avatar) {
            photo = avatar.path.replace('public', '').split('\\').join('/');
        }
        return photo;
    }

}
