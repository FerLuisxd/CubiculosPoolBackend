import { IsNotEmpty, IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';



export class PostJoinPublicDto {
    @IsArray()
    @IsNotEmpty()
    @ApiProperty({example:[
        'MAC', 'Apple Tv'
    ]})
    features:Array<any>
}   
