import { IsNotEmpty, IsString, Length, IsDate, IsObject, IsMongoId, IsNumber, IsArray, ValidateNested } from 'class-validator';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { type } from 'os';
import { Type } from 'class-transformer';


export class PostRoomReservation {
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

export class PostReservationDto {
    @IsObject()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(()=> PostReservationDto)
    room:PostRoomReservation

    @IsNumber()
    @IsNotEmpty()
    hours:number
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
    @ApiProperty({example:'2020-07-14T00:00:00.000Z'})
    start: Date

}
