import {  validate,IsNotEmpty, validateOrReject, IsEmail, IsString, IsNumber, IsBoolean } from 'class-validator';

class User {

    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @IsNumber()
    points: number;

    @IsString()
    userCode: string;

    @IsBoolean()
    inRoom : boolean;

    hoursLeft: number;

    hoursSecondaryLeft: number;
}



