import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TodoService } from './todo.service';
import { AddToDoDto } from './add.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('todo')
export class TodoController {
    constructor(
        private toDoService: TodoService
    ) {}

    @Post('to-do')
    @UseGuards(AuthGuard('jwt'))
    async addToDo(@Body() body: AddToDoDto) {
        return await this.toDoService.addToDo(body);
    }
}
