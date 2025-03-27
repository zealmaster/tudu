import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { TodoService } from './todo.service';
import { AddTaskDto } from './dto/add.dto';
import { AuthGuard } from '@nestjs/passport';
import { ShareTaskDto } from './dto/sharetask.dto';
import { UserService } from '../user/user.service';

@Controller('todo')
export class TodoController {
  constructor(private toDoService: TodoService, private userService: UserService) {}

  @Post('task')
  @UseGuards(AuthGuard('jwt'))
  async addToDo(@Body() body: AddTaskDto, @Req() req) {
    return await this.toDoService.addToDo(req.user.email, body);
  }

  @Get('task/user')
  @UseGuards(AuthGuard('jwt'))
  async getTasksByUser(@Req() req) {
    return await this.toDoService.getTasksByUser(req.user.id, req.user.email);
  }

  @Put('task/share/:id')
  @UseGuards(AuthGuard('jwt'))
  async shareTask(@Body() body: ShareTaskDto, @Req() req, @Param() taskId: string) {
    const userId = req.user.id;
    const user = await this.userService.findUserById(userId);
    if (body.email == user.email) return;
    return await this.toDoService.shareTask({ userId, email: body.email, taskId });
  }

  @Put('task/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateTask(@Body() body, @Param() taskId: string, @Req() req) {
    return await this.toDoService.updateTask({ taskId, updateData: body, email: req.user.email });
  }

  @Delete('task/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteTask(@Param() taskId: string, @Req() req) {
    return await this.toDoService.deleteTask(taskId, req.user.email);
  }
}
