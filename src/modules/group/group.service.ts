import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Group } from 'src/schema/group.schema';
import { CreateGroupDto } from './dto/create.dto';
import { User } from 'src/schema/user.schema';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name)
    private groupModel: Model<Group>,
    @InjectModel(User.name)
    private userModel: Model<User>
  ) {}

  public async createGroup(owner: string, data: CreateGroupDto) {
    const userId = new mongoose.Types.ObjectId(owner)
    const user = await this.userModel.findOne({ _id: owner });
    if (!user) return { success: false, message: 'Register to create a group.' };

    const newGroup = {
      name: data.name,
      owner: user,
    };

    const addGroup = await this.groupModel.create(newGroup);
    await addGroup.save();

    return { success: true, message: 'Group created successfully.' };
  }
}
