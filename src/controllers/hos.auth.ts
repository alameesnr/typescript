// File: src/controllers/hospital.controller.ts
import { Request, Response } from "express";
import Hospital from "../models/hos.models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Register hospital
export const registerHospital = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      hospitalName,
      hospitalType,
      registrationNumber,
      phoneNumber,
      officialEmail,
      password,
      confirmPassword,
      fullAddress,
      state,
      lga,
      contactPersonName,
      contactPersonRole,
      contactPersonPhone,
    } = req.body;

    if (
      !hospitalName ||
      !hospitalType ||
      !registrationNumber ||
      !phoneNumber ||
      !officialEmail ||
      !password ||
      !confirmPassword ||
      !fullAddress ||
      !state ||
      !lga ||
      !contactPersonName ||
      !contactPersonRole ||
      !contactPersonPhone
    ) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ message: "Passwords do not match" });
      return;
    }

    const existing = await Hospital.findOne({ officialEmail });
    if (existing) {
      res.status(400).json({ message: "Email already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hospital = new Hospital({
      hospitalName,
      hospitalType,
      registrationNumber,
      phoneNumber,
      officialEmail,
      password: hashedPassword,
      fullAddress,
      state,
      lga,
      contactPersonName,
      contactPersonRole,
      contactPersonPhone,
    });

    await hospital.save();
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Login
export const loginHospital = async (req: Request, res: Response): Promise<void> => {
  const { officialEmail, password } = req.body;
  const hospital = await Hospital.findOne({ officialEmail });

  if (!hospital) {
    res.status(404).json({ message: "Hospital not found" });
    return;
  }

  const isMatch = await bcrypt.compare(password, hospital.password);
  if (!isMatch) {
    res.status(401).json({ message: "Incorrect password" });
    return;
  }

  const token = jwt.sign({ hospitalId: hospital._id }, JWT_SECRET, { expiresIn: "1d" });
  res.status(200).json({ token });
};

// Get all hospitals
export const getAllHospitals = async (_req: Request, res: Response): Promise<void> => {
  const hospitals = await Hospital.find().select("-password");
  res.status(200).json(hospitals);
};

// Get hospital by ID
export const getHospitalById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const hospital = await Hospital.findById(id).select("-password");
  if (!hospital) {
    res.status(404).json({ message: "Hospital not found" });
    return;
  }
  res.status(200).json(hospital);
};

// Update hospital
export const updateHospital = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const update = req.body;

  try {
    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    }
    const hospital = await Hospital.findByIdAndUpdate(id, update, { new: true }).select("-password");
    if (!hospital) {
      res.status(404).json({ message: "Hospital not found" });
      return;
    }
    res.status(200).json(hospital);
  } catch (error) {
    res.status(500).json({ message: "Failed to update hospital", error });
  }
};

// Delete hospital
export const deleteHospital = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const hospital = await Hospital.findByIdAndDelete(id);
  if (!hospital) {
    res.status(404).json({ message: "Hospital not found" });
    return;
  }
  res.status(200).json({ message: "Hospital deleted successfully" });
};
