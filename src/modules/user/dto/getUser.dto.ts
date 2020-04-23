import { IsString } from "class-validator";
import { ApiProperty, ApiParam } from "@nestjs/swagger";



export class GetUserDto {
    @IsString()
    @ApiProperty({example:'5e99dc2766e67109b80e4257', description:'Insert UserId'})
    id : string
}


