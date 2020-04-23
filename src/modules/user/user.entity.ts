import { IsNotEmpty, IsEmail, IsString, IsNumber, IsBoolean, IsObject } from 'class-validator';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

class HoursLeft {
    @ApiProperty({example:2})
    todayHours: number
    @ApiProperty({example:2})
   tomorrowHours: number
    @ApiProperty({example:2})
    secondaryHours : number
}
export class User {

    constructor(obj){
        this.name= obj.name
        this.userCode= obj.userCode ?? obj.username
        this.userCode = this.userCode.toUpperCase()
        this.email= `${this.userCode}@upc.edu.pe`
    }

    _id: string

    @IsEmail()
    @ApiProperty({example:'correo@hotmail.com'})
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:'Luis'})
    name: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({example:15})
    points: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:'u201711333'})
    userCode: string;

    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({example:false})
    inRoom: boolean;

    @IsNotEmpty()
    @IsObject()
    @ApiProperty({type:HoursLeft})
    hoursLeft: HoursLeft;
}


export const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    userCode: { type: String, required: true },
    hoursLeft: { type: Object, required: true },
    points: { type: Number, required: true },
    inRoom: { type: Boolean, required: true },
    token: { type: String, required: false },
})

