import mongoose, { Document, Schema } from "mongoose";

export interface IHospital extends Document {
  hospitalName: string;
  hospitalType: "Public" | "Private";
  registrationNumber: string;
  phoneNumber: string;
  officialEmail: string;
  password: string;
  fullAddress: string;
  state: string;
  lga: string;
  contactPersonName: string;
  contactPersonRole: string;
  contactPersonPhone: string;
}

const HospitalSchema: Schema = new Schema(
  {
    hospitalName: { type: String, required: true },
    hospitalType: { type: String, enum: ["Public", "Private"], required: true },
    registrationNumber: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    officialEmail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullAddress: { type: String, required: true },
    state: { type: String, required: true },
    lga: { type: String, required: true },
    contactPersonName: { type: String, required: true },
    contactPersonRole: { type: String, required: true },
    contactPersonPhone: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IHospital>("Hospital", HospitalSchema);
