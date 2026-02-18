import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
    name: string;
    description: string;
    owner: mongoose.Types.ObjectId;
    createdAt: Date;
}

const projectSchema = new Schema<IProject>({
    name: {
        type:String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
{
    timestamps: true
}
);

const Project = mongoose.model<IProject>('Project', projectSchema);

export default Project;