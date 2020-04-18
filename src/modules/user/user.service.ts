import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.entity';

@Injectable()
export class UserService {
    private number = 0
    constructor(@InjectModel('users') private userModel: Model<any>) { }

    async saveNew(user: User) {
        try {
            user.inRoom =false
            user.hoursLeft ={
                todayHours:2,
                tomorrowHours:2
            }
            user.secondaryHoursLeft = 2
            user.points = 0
            user.inRoom = false
            user.name = user.name ?? `Usuario ${++this.number}`
            
            const createdUser = new this.userModel(user)
            return await createdUser.save()
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }

    async findOne(user: User) {
        try {
            return await this.userModel.findOne({userCode:user.userCode})
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }

    async getAll(){
        try{
            return await this.userModel.find()
        } catch(error){
            throw new InternalServerErrorException(error.message)
        }
    }

    async getOneById(id){
        return this.userModel.findOne({_id:id})
    }

    async getOneByCode(userCode){
        return this.userModel.findOne({userCode:userCode})
    }
}
