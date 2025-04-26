import mongoose, { Schema, Document } from "mongoose";

interface IUser {
    name: string,
    firstName: string,
    annif: string,
    email: string,
    password: string,
    role: string,
    pdp: string,
    lieu: string,
    adresse: string,
    tel: string,
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    firstName: { type: String, required: true },
    annif: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    pdp: { type: String, default: "" },
    password: { type: String, required: true },
    role: { type: String, default: "patient" },
    lieu: { type: String, required: true },
    adresse: { type: String, required: true },
    tel: { type: String, required: true }
})

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)