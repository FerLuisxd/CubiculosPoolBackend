import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserSchema } from './user.entity';
import { validate } from 'class-validator';

@Injectable()
export class UserService {
    private number = 0
    constructor(@InjectModel('users') private userModel: Model<any>) { }

    getHello(): string {
        return 'Hello World!';
    }

    async saveNewUser(user: User) {
        try {
            user.inRoom =false
            user.hoursLeft ={
                todayHours:2,
                tomorrowHours:2
            }
            user.secondaryHoursLeft = 2
            user.points = 0
            user.inRoom = false
            user.name = `Usuario ${++this.number}`
            
            const createdUser = new this.userModel(user)
            return await createdUser.save()
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }

    }
}
