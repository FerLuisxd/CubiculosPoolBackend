import {  IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
    @ApiProperty({example:'u201711338'})
    @IsString()
    @Length(10)
    @IsNotEmpty()
    userCode: string;
    @ApiProperty({example:'p4ssw0rd'})
    @IsString()
    @IsNotEmpty()
    password: string;
}


