import {  IsNotEmpty, IsString, Length } from 'class-validator';

export class AuthDto {

    @IsString()
    @Length(10)
    @IsNotEmpty()
    userCode: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
////


