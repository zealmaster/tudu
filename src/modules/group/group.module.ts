import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from 'src/schema/group.schema';
import { User, UserSchema } from 'src/schema/user.schema';

@Module({
  controllers: [GroupController],
  providers: [GroupService],
  imports: [
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
})
export class GroupModule {}
