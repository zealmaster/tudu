import { IsNotEmpty, IsString } from "class-validator";

export class AddTaskDto {
    @IsString()
    @IsNotEmpty()
    taskId: string;
}