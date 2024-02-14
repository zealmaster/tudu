import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AddTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsOptional()
    dueDate: Date;
}