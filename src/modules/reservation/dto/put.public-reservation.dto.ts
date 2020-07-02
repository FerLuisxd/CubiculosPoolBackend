import { IsNotEmpty, IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';



export class PutPublicReservationDto {
    @IsArray()
    @IsNotEmpty()
    @ApiProperty({example:[
        'MAC', 'Apple Tv'
    ]})
    features:Array<any>
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:'Ciencias'})
    theme:string
}   
