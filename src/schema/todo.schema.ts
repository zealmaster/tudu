import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "./user.schema";

@Schema()
export class ToDo {
    @Prop({
        name: 'user_id',
        type: mongoose.Schema.Types.ObjectId, ref: () => User 
    })
    user: User;

    @Prop({
        type: 'string'
    })
    title: string;

    @Prop()
    description: string;

    @Prop({
        name: 'due_date',
        type: 'date',
        default: null
    })
    dueDate: Date;

    @Prop({
        name: 'shared_with',
        type: 'string',
        default: null
    })
    sharedWith: string[];
    
    @Prop({
        name: 'created_at',
        type: 'date'
    })
    createdAt: Date;

    @Prop({
        name: 'created_at',
        type: 'date'
    })
    updatedAt: Date;
}
export const ToDoSchema = SchemaFactory.createForClass(ToDo);