import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  gender: 'Male' | 'Female';
  password: string;
  bloodGroup: string;
  genotype: string;
  medicalCondition: string;
  lastDonationDate?: string;
  currentLocation: string;
  preferredRadius?: string;
  preferredCenters?: string[];
  isVerified: boolean;
  verificationCode?: string;
  resetCode?: string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  password: { type: String, required: true },
  bloodGroup: {
    type: String,
    enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
    required: true,
  },
  genotype: { type: String, enum: ['AA', 'AS', 'SS'], required: true },
  medicalCondition: { type: String, enum: ['Yes', 'No'], required: true },
  lastDonationDate: { type: String },
  currentLocation: { type: String, required: true },
  preferredRadius: { type: String },
  preferredCenters: { type: [String] },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  resetCode: { type: String },
}, { timestamps: true });

export default mongoose.model<IUser>('User', userSchema);
