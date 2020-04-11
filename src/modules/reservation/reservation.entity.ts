import { IsNotEmpty, IsString, Length, IsDate, IsObject, IsMongoId, IsNumber, IsArray } from 'class-validator';
import * as mongoose from 'mongoose';


export class Room {
    @IsMongoId()
    _id: string
    @IsNumber()
    @IsNotEmpty()
    seats: number
    @IsArray()
    @IsNotEmpty()
    features: Array<string>
}

export class ReservationDto {

    @IsString()
    @Length(10)
    @IsNotEmpty()
    userCode: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    _id: string
    @IsNotEmpty()
    @IsObject()
    room: Room
    @IsString()
    @IsNotEmpty()
    seats: Array<any>
    @IsString()
    @IsNotEmpty()
    user_code: string
    @IsString()
    @IsNotEmpty()
    user_secondary_code: string
    @IsString()
    @IsNotEmpty()
    start: Date
    @IsDate()
    @IsNotEmpty()
    end: Date

    active: boolean
}



export const ReservationSchema = new mongoose.Schema({
    userCode: { type: String, required: true },
    userSecondaryCode: { type: String, required: true },
    room: { type: Object, required: true },
    seats: { type: Array, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    active: { type: Boolean, required: true },
})
