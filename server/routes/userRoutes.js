import express from 'express';
// import { signUp } from '../controllers/userController';
import { signUp, login, updateProfile, checkAuth } from '../controllers/userController.js';
import { protectRoute } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post("/signup", signUp);
// app.post("/api/auth/signup");
userRouter.post("/login", login);
userRouter.put("/update-profile", protectRoute, updateProfile);
userRouter.get("/check", protectRoute, checkAuth);

export default userRouter;
 

