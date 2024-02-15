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
  ) { }

  public async createGroup(owner: string, data: CreateGroupDto) {
    const userId = new mongoose.Types.ObjectId(owner)
    const user = await this.userModel.findOne({ _id: owner });
    if (!user) return { success: false, message: 'Register to create a group.' };
    console.log(user.username)
    const newGroup = {
      name: data.name,
      owner: user.id,
    };

    const addGroup = await this.groupModel.create(newGroup);
    await addGroup.save();

    return { success: true, message: 'Group created successfully.' };
  }

  public async getGroupByOwner(id: string) {
    const ownerId = new mongoose.Types.ObjectId(id);
    const group = await this.groupModel.find({ owner: ownerId });
    return {
      success: true,
      group
    }
  }

  public async addUser(id: string, groupId: string, email: string) {
    const ownerId = new mongoose.Types.ObjectId(id);
    const owner = await this.userModel.findOne({ _id: ownerId });
    const groupIdObj = new mongoose.Types.ObjectId(groupId);
    const groupExists = await this.groupModel.findOne({ _id: groupIdObj });
    const userExists = await this.userModel.findOne({ email });

    if (!groupExists) return { success: false, message: 'Group not found.' };

    if (!userExists) return { success: false, message: 'User not found.' };

    if (groupExists.owner == owner.id) {

      for (let data of groupExists?.users) {
        if (data.email == email) {
          return { success: false, message: 'User already added' };
        }

      }

      await this.groupModel.updateOne({ _id: groupExists.id }, { $push: { users: userExists } });
      return {
        success: true,
        message: 'User added successfully.'
      }
    }
  }

  public async removeUserFromGroup(id: string, groupId: string, email: string) {
    const groupIdObj = new mongoose.Types.ObjectId(groupId);
    const ownerId = new mongoose.Types.ObjectId(id);
    const groupExists = await this.groupModel.findOne({ _id: groupIdObj });

    if (groupExists.owner.toString() !== ownerId.toString()) return {
      success: false,
      message: 'Failed to remove user from the group.'
    }

    for (let i = groupExists.users.length - 1; i >= 0; i--) {
      if (groupExists.users[i].email === email) {
        groupExists.users.splice(i, 1)[0];
        await groupExists.save()
      }
    }
    return { success: true, message: 'User removed successfully.' }
  }
}
