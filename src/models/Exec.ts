import mongoose, { Document, Schema } from 'mongoose';

export interface IExec {
    name: string;
    role: string;
    email: string;
    phoneNumber: string;
    dietaryRequirements: string;
    shirtSize: string | null;
    yearGraduating: number | null;
    degree: string | null;
}

export class ExecModel {
    constructor(
        public name: string,
        public role: string,
        public email: string,
        public phoneNumber: string,
        public dietaryRequirements: string,
        public shirtSize: string | null,
        public yearGraduating: string | null,
        public degree: string | null
    ) {}
}

export interface IExecModel extends IExec, Document {}

const ExecSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        role: { type: String, required: true },
        email: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        dietaryRequirements: { type: String, required: false },
        shirtSize: { type: String, required: true },
        yearGraduating: { type: String, required: true },
        degree: { type: String, required: true }
    },
    {
        versionKey: false
    }
);

export default mongoose.model<IExecModel>('Exec', ExecSchema);
