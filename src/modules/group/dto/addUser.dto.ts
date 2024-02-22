import { IsEmail, IsString } from "class-validator";

export class AddUserDto {
    @IsEmail()
    @IsString()
    email: string;
}