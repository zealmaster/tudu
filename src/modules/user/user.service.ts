import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { User } from 'src/schema/user.schema';
import { CreateUserDto } from './createUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(User.name)
    private userModel: Model<User>
  ) {}

  public async createUser(createUser: CreateUserDto) {
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  public async findAllUsers() {
    return await this.userModel.find();
  }
}
