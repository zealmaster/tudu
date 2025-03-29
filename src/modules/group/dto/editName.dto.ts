import { IsNotEmpty, IsString } from "class-validator";

export class EditNameDto {
    @IsString()
    @IsNotEmpty()
    groupName: string;
}