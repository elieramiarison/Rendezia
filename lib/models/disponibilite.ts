import mongoose, { Schema } from "mongoose";

interface IDispo {
    doctorId: any,
    nameDoc: string,
    specialiteDoc: string,
    date: string,
    startTime: string,
    endTime: string,
    clinic: string,
    tel: string,
    email: string,
    firstName: string
}

const dispoSchema = new Schema<IDispo>({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    nameDoc: { type: String, required: true },
    specialiteDoc: { type: String, },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    clinic: { type: String, required: true },
    tel: { type: String, required: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
})

export const Dispo = mongoose.models.Disponibilite || mongoose.model<IDispo>("Disponibilite", dispoSchema);