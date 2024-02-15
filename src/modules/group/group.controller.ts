import { Body, Controller, Delete, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { GroupService } from './group.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateGroupDto } from './dto/create.dto';
import { AddUserDto } from './dto/addUser.dto';

@Controller('group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createGroup(@Body() body: CreateGroupDto, @Req() req) {
    return await this.groupService.createGroup(req.user.id, body);
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
}
