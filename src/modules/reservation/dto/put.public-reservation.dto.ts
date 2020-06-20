import { IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';



export class PutPublicReservationDto {
    @IsArray()
    @IsNotEmpty()
    @ApiProperty({example:[
        'MAC', 'Apple Tv'
    ]})
    features:Array<any>
}   
