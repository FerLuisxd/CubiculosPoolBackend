import {  IsNotEmpty, IsString, Length, IsArray, IsNumber, IsBoolean } from 'class-validator';
import * as mongoose from 'mongoose';

export class RoomDto {


   _id:string
   @IsString()
   @IsNotEmpty()
   office:string
   @IsString()
   @IsNotEmpty()
   code:string
   @IsString()
   @IsNotEmpty()
   building:string
   @IsNumber()
   @IsNotEmpty()
   seats:number
   @IsString()
   @IsNotEmpty()
   floor:string
   @IsArray()
   @IsNotEmpty()
   features:Array<string>
   @IsBoolean()
   @IsNotEmpty()
   busy:boolean
    
}



export const RoomSchema = new mongoose.Schema({
    office: { type: String, required: true },
    code: { type: String, required: true },
    building: { type: String, required: true },
    seats: { type: Number, required: true },
    floor: { type: String, required: true },
    features: { type: Array, required: true },
    busy: {type:Boolean, required: true}
})
