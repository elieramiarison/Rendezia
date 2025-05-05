import mongoose, { Schema, Document } from "mongoose";
import "./RendezVous"

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

UserSchema.pre("save", async function (this: IUser & Document, next) {
    try {
        await mongoose.model("Rdv").updateMany(
            { userId: this._id },
            {
                $set: {
                    name: this.name,
                    firstName: this.firstName,
                    email: this.email,
                    tel: this.tel,
                    annif: this.annif,
                    lieu: this.lieu,
                    adresse: this.adresse,
                    pdp: this.pdp
                },
            }
        );
        next();
    } catch (error) {
        next(error as any);
    }
});

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)