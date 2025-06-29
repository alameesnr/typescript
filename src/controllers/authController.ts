import type { Request, Response } from "express"
import jwt from "jsonwebtoken"
import User, { type IUser } from "../models/User"

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key"

// Register User
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body

    // Validation
    if (!username || !email || !password) {
      res.status(400).json({
        success: false,
        error: "Please provide username, email, and password",
      })
      return
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: "User with this email already exists",
      })
      return
    }

    // Create new user
    const user: IUser = new User({ username, email, password })
    await user.save()

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" })

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    })
  } catch (error: any) {
    console.error("Registration error:", error)
    res.status(500).json({
      success: false,
      error: "Registration failed",
      details: error.message,
    })
  }
}

// Login User
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: "Please provide email and password",
      })
      return
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      res.status(401).json({
        success: false,
        error: "Invalid credentials",
      })
      return
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: "Invalid credentials",
      })
      return
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" })

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    })
  } catch (error: any) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      error: "Login failed",
      details: error.message,
    })
  }
}

// Get All Users
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 })

    res.json({
      success: true,
      count: users.length,
      users,
    })
  } catch (error: any) {
    console.error("Get users error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch users",
      details: error.message,
    })
  }
}

// Get User by ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const user = await User.findById(id).select("-password")
    if (!user) {
      res.status(404).json({
        success: false,
        error: "User not found",
      })
      return
    }

    res.json({
      success: true,
      user,
    })
  } catch (error: any) {
    console.error("Get user error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch user",
      details: error.message,
    })
  }
}

// Update User
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { username, email } = req.body

    // Find and update user (excluding password from direct updates)
    const user = await User.findByIdAndUpdate(id, { username, email }, { new: true, runValidators: true }).select(
      "-password",
    )

    if (!user) {
      res.status(404).json({
        success: false,
        error: "User not found",
      })
      return
    }

    res.json({
      success: true,
      message: "User updated successfully",
      user,
    })
  } catch (error: any) {
    console.error("Update user error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to update user",
      details: error.message,
    })
  }
}

// Delete User
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const user = await User.findByIdAndDelete(id)
    if (!user) {
      res.status(404).json({
        success: false,
        error: "User not found",
      })
      return
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error: any) {
    console.error("Delete user error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to delete user",
      details: error.message,
    })
  }
}
