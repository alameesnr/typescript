import { Router } from "express";
import {
  registerHospital,
  loginHospital,
  getAllHospitals,
  getHospitalById,
  updateHospital,
  deleteHospital,
} from "../controllers/hos.auth";

const router = Router();

// Auth routes
router.post("/auth/register", registerHospital);
router.post("/auth/login", loginHospital);

// Hospital CRUD routes
router.get("/hospitals", getAllHospitals);
router.get("/hospitals/:id", getHospitalById);
router.put("/hospitals/:id", updateHospital);
router.delete("/hospitals/:id", deleteHospital);

export default router;