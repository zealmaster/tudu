import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { TodoService } from './todo.service';
import { AddTaskDto } from './dto/add.dto';
import { AuthGuard } from '@nestjs/passport';
import { ShareTaskDto } from './dto/sharetask.dto';

@Controller('todo')
export class TodoController {
    constructor(
        private toDoService: TodoService
    ) {}

    @Post('task')
    @UseGuards(AuthGuard('jwt'))
    async addToDo(@Body() body: AddTaskDto, @Req() req) {
        return await this.toDoService.addToDo(req.user.email, body);
    }

    @Get('task/user')
    @UseGuards(AuthGuard('jwt'))
    async getTasksByUser(@Req() req) {
        console.log(req.user)
        return await this.toDoService.getTasksByUser(req.user.id);
    }

    @Put('task/share/:id')
    @UseGuards(AuthGuard('jwt'))
    async shareTask(@Body() body: ShareTaskDto, @Req() req, @Param() taskId: string) {
        return await this.toDoService.shareTask(req.user.id, body.email, {id: taskId});
    }
}
