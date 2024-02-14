import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { GroupService } from './group.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateGroupDto } from './dto/create.dto';

@Controller('group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createGroup(@Body() body: CreateGroupDto, @Req() req) {
    return await this.groupService.createGroup(req.user.id, body);
  }
}
