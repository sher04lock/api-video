import { Router } from "express";
import { VideosRouter } from "./videos.router";

export const MainRouter = Router();

MainRouter.use("/video", VideosRouter);
