import mongoose, { Schema, Document } from "mongoose";
import "./disponibilite";

interface IDoctor {
    name: string;
    email: string;
    tel: string;
    genre: string;
    password: string;
    specialite: string;
    pdpDoc: string;
    firstName: string;
    clinic: string;
    pdpDocDeleteHash: string;
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
    clinic: { type: String, required: true },
    pdpDocDeleteHash: { type: String, default: null }
});

DoctorSchema.pre("save", async function (this: IDoctor & Document, next) {
    try {
        await mongoose.model("Disponibilite").updateMany(
            { doctorId: this._id },
            {
                $set: {
                    nameDoc: this.name,
                    specialiteDoc: this.specialite,
                    tel: this.tel,
                    email: this.email,
                    firstName: this.firstName,
                    clinic: this.clinic,
                },
            }
        );
        next();
    } catch (error) {
        next(error as any);
    }
});

export const Doctor =
    mongoose.models.Doctor || mongoose.model<IDoctor>("Doctor", DoctorSchema);
