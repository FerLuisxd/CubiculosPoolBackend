import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserSchema } from './user.entity';
import { validate } from 'class-validator';

@Injectable()
export class UserService {
    constructor(@InjectModel('users') private userModel: Model<any>) { }

    getHello(): string {
        return 'Hello World!';
    }

    async saveNewUser(user: User) {
        try {
            const createdUser = new this.userModel(user)
            return await createdUser.save()
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }

    }
}
