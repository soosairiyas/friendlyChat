import { Router } from "express";
import {
  userRegistration,
  UserLogin,
  userLogout,
} from "../controller/user.controller.js";

const router = Router();

router.post("/userRegistration", userRegistration);
router.post("/userLoggedin", UserLogin);
router.post("/userloggedout", userLogout);

export default router;
