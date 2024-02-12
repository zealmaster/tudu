import { IsEmail, IsNotEmpty } from "class-validator";

export class ShareTaskDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}