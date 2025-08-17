// File: src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Registration without email sending
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      dateOfBirth,
      phoneNumber,
      email,
      gender,
      password,
      confirmPassword,
      bloodGroup,
      genotype,
      medicalCondition,
      lastDonationDate,
      currentLocation,
      preferredRadius,
      preferredCenters,
    } = req.body;

    // Require all fields
    if (
      !name ||
      !dateOfBirth ||
      !phoneNumber ||
      !email ||
      !gender ||
      !password ||
      !confirmPassword ||
      !bloodGroup ||
      !genotype ||
      !medicalCondition ||
      !lastDonationDate ||
      !currentLocation ||
      !preferredRadius ||
      !preferredCenters
    ) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ message: 'Passwords do not match' });
      return;
    }

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ message: 'Email already registered' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      dateOfBirth,
      phoneNumber,
      email,
      gender,
      password: hashedPassword,
      bloodGroup,
      genotype,
      medicalCondition,
      lastDonationDate,
      currentLocation,
      preferredRadius,
      preferredCenters,
      isVerified: true, // no email verification needed
    });

    await user.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Dummy verifyEmail (since no email code is sent)
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  if (user.isVerified) {
    res.status(400).json({ message: 'User already verified' });
    return;
  }

  user.isVerified = true;
  await user.save();
  res.status(200).json({ message: 'Email verified successfully' });
};

// Login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password} = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ message: 'Incorrect password' });
    return;
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: '1d',
  });

  res.status(200).json({ token });
};

// Request password reset (manual, no email)
export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  // Just generate a reset code to return to client
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetCode = resetCode;
  await user.save();

  res.status(200).json({ message: 'Password reset code generated', resetCode });
};

// Reset password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, code, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.resetCode !== code) {
    res.status(400).json({ message: 'Invalid email or code' });
    return;
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetCode = undefined;
  await user.save();

  res.status(200).json({ message: 'Password reset successful' });
};

// Get all users
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  const users = await User.find();
  res.status(200).json(users);
};

// Get user by ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.status(200).json(user);
};

// Update user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const update = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, update, { new: true });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.status(200).json({ message: 'User deleted successfully' });
};
