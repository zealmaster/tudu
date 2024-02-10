import { IsDate, IsOptional, IsString } from "class-validator";

export class AddToDoDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsDate()
    @IsOptional()
    dueDate: Date;
}