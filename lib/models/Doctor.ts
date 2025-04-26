import mongoose, { Schema } from "mongoose";

interface IDoctor {
    name: string,
    email: string,
    tel: string,
    genre: string,
    password: string,
    specialite: string,
    pdpDoc: string,
    firstName: string,
    clinic: string,
}

const DoctorSchema = new Schema<IDoctor>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    tel: { type: String },
    genre: { type: String },
    password: { type: String, required: true },
    specialite: { type: String, required: true },
    pdpDoc: { type: String, default: "" },
    firstName: { type: String, required: true },
    clinic: { type: String, required: true }
})

export const Doctor = mongoose.models.Doctor || mongoose.model<IDoctor>("Doctor", DoctorSchema)