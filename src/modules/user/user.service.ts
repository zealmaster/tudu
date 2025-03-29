import { Injectable } from '@nestjs/common';
import {InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schema/user.schema';
import { CreateUserDto } from './createUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
  ) {}

  public async createUser(createUser: CreateUserDto) {
    try {
      const userExists = await this.userModel.findOne({
        username: createUser?.username,
      });
      if (userExists)
        return {
          success: false,
          msg: 'Username already exists',
        };
      const emailExists = await this.userModel.findOne({
        email: createUser?.email,
      });
      if (emailExists)
        return {
          success: false,
          msg: 'Email already exists',
        };

      const user = {
        username: createUser.username,
        firstName: createUser.firstName,
        lastName: createUser.lastName,
        email: createUser.email,
        password: await bcrypt.hash(createUser.password, 10),
      };
      const newUser = new this.userModel(user);
      return newUser.save();
    } catch (error) {
      console.log('create user error: ', error);
    }
  }

  public async findAllUsers() {
    return await this.userModel.find();
  }

  public async findUserById(userId: string) {
    return await this.userModel.findOne({ _id: userId });
  }
}
