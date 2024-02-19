import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { GroupService } from './group.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateGroupDto } from './dto/create.dto';
import { AddUserDto } from './dto/addUser.dto';
import { AddTaskDto } from './dto/addTask.dto';

@Controller('group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createGroup(@Body() body: CreateGroupDto, @Req() req) {
    return await this.groupService.createGroup(req.user.id, body);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getGroupByOwner(@Req() req) {
    return this.groupService.getGroupByOwner(req.user.id);
  }
  
  @Put('add/user/:id')
  @UseGuards(AuthGuard('jwt'))
  async addUserToGroup(@Body() body: AddUserDto, @Param() groupId: string, @Req() req) {
    return await this.groupService.addUser(req.user.id, groupId, body.email);
  }

  @Delete('/user/:id')
  @UseGuards(AuthGuard('jwt'))
  async removeUserFromGroup(@Body() body: AddUserDto, @Param() groupId: string, @Req() req) {
    return await this.groupService.removeUserFromGroup(req.user.id, groupId, body.email);
  }

  @Get('user/:id')
  @UseGuards(AuthGuard('jwt'))
  async getUsersInGroup(@Param() id: string, @Req() req) {
    return await this.groupService.getUsersInGroup(req.user.id, id);
  }

  @Put('add/task/:id')
  @UseGuards(AuthGuard('jwt'))
  async addTaskToGroup(@Body() body: AddTaskDto, @Req() req, @Param() groupId: string) {
    return await this.groupService.addTaskToGroup(req.user.id, groupId, body.taskId);
  }

  @Get('task/:id')
  @UseGuards(AuthGuard('jwt'))
  async getTasksInGroup(@Param('id') groupId: string, @Req() req) {
    return await this.groupService.getTasksInGroup(req.user.id, groupId);
  }

  @Delete('task/:id')
  @UseGuards(AuthGuard('jwt'))
  async removeTaskFromGroup(@Body() body: AddTaskDto, @Param('id') groupId: string, @Req() req) {
    return this.groupService.removeTaskFromGroup(req.user.id, groupId, body.taskId)
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  async getGroupById() {

  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  async editGroupName() {

  }

}
