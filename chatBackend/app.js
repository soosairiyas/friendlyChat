import express from "express";
import cors from "cors";
import userRouter from "../chatBackend/src/user/routes/user.routes.js";

export const app = express();
app.use(cors());
app.use(express.json());

// ALL API ROUTES
app.use("/api/user", userRouter);
