import { IsNotEmpty, IsString } from "class-validator";

export class EditNameDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}