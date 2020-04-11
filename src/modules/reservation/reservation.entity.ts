import {  IsNotEmpty, IsString, Length } from 'class-validator';

export class ReservationDto {

    @IsString()
    @Length(10)
    @IsNotEmpty()
    userCode: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}



