import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { TodoService } from './todo.service';
import { AddTaskDto } from './dto/add.dto';
import { AuthGuard } from '@nestjs/passport';
import { ShareTaskDto } from './dto/sharetask.dto';
import { UserService } from '../user/user.service';

@Controller('todo')
export class TodoController {
    constructor(
        private toDoService: TodoService,
        private userService: UserService
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
        const userId = req.user.id;
        const user = await this.userService.findUserById(userId);
        if (body.email == user.email) return;
        return await this.toDoService.shareTask(userId, body.email, {id: taskId});
    }
}
