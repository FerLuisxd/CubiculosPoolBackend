import { IsNotEmpty, IsString, Length, IsDate, IsObject, IsMongoId, IsNumber, IsArray } from 'class-validator';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { type } from 'os';


export class Room {
    @ApiProperty({example:'5e99dc2766e67109b80e4257'})
    @IsMongoId()
    _id: string
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

export class AvailableDto {


    @ApiProperty({example:'5e99dc2766e67109b80e4257'})
    _id: string
    @IsString()
    @IsNotEmpty()
    @ApiProperty({type:[Room]})
    available: Array<Room>
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:'2020-07-14T00:00:00.000Z'})
    start: Date

}



export const AvailableSchema = new mongoose.Schema({
    available: { type: Object, required: true },
    start: { type: Date, required: true },
})
