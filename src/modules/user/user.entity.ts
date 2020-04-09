import { validate, IsNotEmpty, validateOrReject, IsEmail, IsString, IsNumber, IsBoolean, IsObject } from 'class-validator';
import * as mongoose from 'mongoose';

class HoursLeft {

    todayHours: number

    tomorrowHours: number
}
export class User {

    constructor(obj){
        this.name= obj.name
        this.userCode= obj.userCode ?? obj.username
        this.userCode = this.userCode.toUpperCase()
        this.email= `${this.userCode}@upc.edu.pe`
    }

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    points: number;

    @IsString()
    @IsNotEmpty()
    userCode: string;

    @IsBoolean()
    @IsNotEmpty()
    inRoom: boolean;

    @IsNotEmpty()
    @IsObject()
    hoursLeft: HoursLeft;

    @IsNumber()
    @IsNotEmpty()
    secondaryHoursLeft: number
}


export const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    userCode: { type: String, required: true },
    hoursLeft: { type: Object, required: true },
    secondaryHoursLeft: { type: Number, required: true },
    points: { type: Number, required: true },
    inRoom: { type: Boolean, required: true },
})

