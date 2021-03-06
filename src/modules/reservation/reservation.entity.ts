import { IsNotEmpty, IsString, Length, IsDate, IsObject, IsMongoId, IsNumber, IsArray } from 'class-validator';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { type } from 'os';


export class Room {
    @ApiProperty({example:'5e99dc2766e67109b80e4257'})
    @IsMongoId()
    _id: string
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({example:6})
    seats: number
    @IsArray()
    @IsNotEmpty()
    @ApiProperty({example:['Mac','Board']})
    features: Array<string>
}

export class ReservationDto {


    @ApiProperty({example:'5e99dc2766e67109b80e4257'})
    _id: string
    @IsNotEmpty()
    @IsObject()
    @ApiProperty({type:Room})
    room: Room
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:[{
        _id:'5e99dc2766e67109b80e4257',
        name:'Luis',
        features:[]
    }]})
    seats: Array<any>
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:'u201711333'})
    userCode: string
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:'u201711334'})
    userSecondaryCode: string
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:'4/22/2020'})
    start: Date
    @IsDate()
    @IsNotEmpty()
    @ApiProperty({example:'4/22/2020'})
    end: Date
    @ApiProperty({example:false})
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
