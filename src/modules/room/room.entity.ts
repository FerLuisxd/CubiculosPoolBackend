import {  IsNotEmpty, IsString, Length, IsArray, IsNumber, IsBoolean } from 'class-validator';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class RoomDto {


   _id:string
   @IsString()
   @IsNotEmpty()
   @ApiProperty({example:'MO'})
   office:string
   @IsString()
   @IsNotEmpty()
   @ApiProperty({example:'I708'})
   code:string
   @IsString()
   @IsNotEmpty()
   @ApiProperty({example:'I'})
   building:string
   @IsNumber()
   @IsNotEmpty()
   @ApiProperty({example:6})
   seats:number
   @IsString()
   @IsNotEmpty()
   @ApiProperty({example:7})
   floor:number
   @IsArray()
   @IsNotEmpty()
   @ApiProperty({example:['Mac','Board']})
   features:Array<string>
    
}



export const RoomSchema = new mongoose.Schema({
    office: { type: String, required: true },
    code: { type: String, required: true },
    building: { type: String, required: true },
    seats: { type: Number, required: true },
    floor: { type: Number, required: true },
    features: { type: Array, required: true },
    busy: {type:Boolean, required: true}
})
