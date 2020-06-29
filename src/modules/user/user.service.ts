import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class UserService {
    private number = 0
    constructor(@InjectModel('users') private userModel: Model<any>) { }

    async saveNew(user: User) {
        try {
            user.inRoom =false
            user.hoursLeft ={
                todayHours:2,
                tomorrowHours:2,
                secondaryHours :2
            }
            user.points = 0
            user.inRoom = false
            user.name = user.name ?? `Usuario ${++this.number}`
            
            const createdUser = new this.userModel(user)
            return await createdUser.save()
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }
    async updateToken(id:string,token: string) {
        await this.userModel.updateOne({_id:id},{token:token})
    }
    async updateReduceHours(id:string,newHours:number,tomorrow = false) {
        if(tomorrow) await this.userModel.updateOne({_id:id},{"hoursLeft.tomorrowHours":newHours})
        else await this.userModel.updateOne({_id:id},{"hoursLeft.todayHours":newHours})
    }
    async updateReduceHoursSecondary(id:string,newHours:number) {
        return await this.userModel.updateOne({_id:id},{"hoursLeft.secondaryHours":newHours})
    }
    async updateStatus(id:string, param: boolean) {
        return await this.userModel.updateOne({_id:id},{"inRoom":param})
    }
    async findOneUserCode(userCode:string,token = false):Promise<User> {
        try {
            if(token) return await this.userModel.findOne({userCode:userCode})
            else {
                const userRes = await this.userModel.findOne({userCode:userCode})
                if(userRes){
                    userRes.token = undefined
                    return userRes
                }
                else return userRes
            }
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }
    async findOne(id,token = false):Promise<User> {
            if(token) return await this.userModel.findOne({_id:id})
            else {
                const userRes = await this.userModel.findOne({_id:id})
                if(userRes){
                    userRes.token = undefined
                    return userRes
                }
                else return userRes
            }
    }

    async getAll(){
        try{
            return await this.userModel.find()
        } catch(error){
            throw new InternalServerErrorException(error.message)
        }
    }
    
    @Cron('0 0 0 * * *')
    async cronJobHours(){
        await this.userModel.updateMany({},{
            "hoursLeft.todayHours" : 2,
            "hoursLeft.tomorrowHours" : 2
        })
        
    }


}
