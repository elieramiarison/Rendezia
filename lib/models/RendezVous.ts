// import mongoose, { Schema } from "mongoose";

// interface IRdv {
//     id: string,
//     date: string,
//     startTime: string,
//     endTime: string,
//     name: string,
//     doctorId: any,
//     userId: string,
//     pdp: string,
//     firstName: string,
//     email: string,
//     annif: string,
//     lieu: string,
//     adresse: string,
//     tel: string,
// }

// const rdvSchema = new Schema<IRdv>({
//     id: { type: String, required: true },
//     date: { type: String, required: true },
//     startTime: { type: String, required: true },
//     endTime: { type: String, required: true },
//     name: { type: String, required: true },
//     doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
//     userId: { type: String, required: true },
//     pdp: { type: String, required: true, ref: "User" },
//     firstName: { type: String, required: true },
//     email: { type: String, required: true },
//     annif: { type: String, required: true },
//     lieu: { type: String, required: true },
//     adresse: { type: String, required: true },
//     tel: { type: String, required: true },
// })

// export const Rdv = mongoose.models.Rdv || mongoose.model<IRdv>("Rdv", rdvSchema);

import mongoose, { Schema, Types } from "mongoose";

interface IRdv {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    name: string;
    doctorId: Types.ObjectId;
    userId: Types.ObjectId;
    pdp: string;
    firstName: string;
    email: string;
    annif: string;
    lieu: string;
    adresse: string;
    tel: string;
}

const rdvSchema = new Schema<IRdv>({
    id: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    name: { type: String, required: true },
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    pdp: { type: String },
    firstName: { type: String, required: true },
    email: { type: String, required: true },
    annif: { type: String, required: true },
    lieu: { type: String, required: true },
    adresse: { type: String, required: true },
    tel: { type: String, required: true },
});

export const Rdv = mongoose.models.Rdv || mongoose.model<IRdv>("Rdv", rdvSchema);
