import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

app.use(express.json());

app.use(
  cors({
    credentials: true,
  })
);

routes(app);

export default app;
