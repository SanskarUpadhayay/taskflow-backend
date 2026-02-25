import mongoose, { Document, Schema } from 'mongoose';


export interface ITask extends Document {
    title: string;
    description: string;
    status: string;
    project: mongoose.Types.ObjectId;
    createdAt: Date;
}

const taskSchema = new Schema<ITask>({
    title: {
        type:String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    status: {
        type: String, 
        enum: ['todo', 'in-progress', 'done'],
        default: 'todo'
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    }
},
{
    timestamps: true
}
);

const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task;