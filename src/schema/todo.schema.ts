import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "./user.schema";

@Schema()
export class ToDo {
    @Prop({
        type: mongoose.Schema.Types.ObjectId, ref: () => User 
    })
    author: User;

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
        name: 'completed',
        type: 'boolean',
        default: false
    })
    completed: boolean;

    @Prop({
        name: 'shared_with',
        default: new Array()
    })
    sharedWith: string[];
    
    @Prop({
        name: 'created_at',
        type: 'date',
        default: Date.now
    })
    createdAt: Date;

    @Prop({
        name: 'created_at',
        type: 'date',
        default: Date.now
    })
    updatedAt: Date;
}
export const ToDoSchema = SchemaFactory.createForClass(ToDo);