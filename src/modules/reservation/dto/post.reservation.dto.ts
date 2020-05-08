import { IsNotEmpty, IsString, Length, IsDate, IsObject, IsMongoId, IsNumber, IsArray, ValidateNested, Max, Min } from 'class-validator';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { type } from 'os';
import { Type } from 'class-transformer';


export class PostRoomReservation {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:'MO'})
    office:string
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:'I708'})
    code:string
}

export class PostReservationDto {
    @IsObject()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(()=> PostRoomReservation)
    @ApiProperty({type:PostRoomReservation})
    room:PostRoomReservation

    @IsNumber()
    @Min(1)
    @IsNotEmpty()
    @ApiProperty({example:2})
    hours:number
    // @IsString()
    // @IsNotEmpty()
    // @ApiProperty({example:'u201711333'})
    // userCode: string
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:'u201711334'})
    userSecondaryCode: string
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:'2020-07-14T00:00:00.000Z'})
    start: Date

}   
