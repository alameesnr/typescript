import { Router } from "express"
import { registerUser, loginUser, getUsers, getUserById, updateUser, deleteUser } from "../controllers/authController"

const router = Router()

// Authentication routes
router.post("/signup", registerUser)
router.post("/signin", loginUser)

// CRUD routes
router.get("/users", getUsers)
router.get("/users/:id", getUserById)
router.put("/users/:id", updateUser)
router.delete("/users/:id", deleteUser)

export default router
