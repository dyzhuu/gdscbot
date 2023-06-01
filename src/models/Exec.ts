import mongoose, { Document, Schema } from 'mongoose';

export interface IExec {
    name: string;
}

export interface IExecModel extends IExec, Document {}

const ExecSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
    },
    {
        versionKey: false
    }
);

export default mongoose.model<IExecModel>('Exec', ExecSchema);
