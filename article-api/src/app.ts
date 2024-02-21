import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import {
  getTasks,
  getTaskById,
  addTask,
  updateTask,
  deleteTask,
  patchTask,
} from "./controller";

const app = express();

app.use(express.json());

// Use cors middleware with default options for all routes
app.use(cors());

// If you need to configure CORS options, you can do so like this:
// app.use(cors({
//   origin: 'http://example.com', // Allow only this origin to access the resources
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Allowed HTTP methods
//   allowedHeaders: ['Content-Type', 'Authorization'] // Allowed HTTP headers
// }));

app.get("/api/tasks", (_: Request, res: Response) => {
  getTasks(res);
});

app.get("/api/tasks/:taskId", (req: Request, res: Response) => {
  getTaskById(req, res);
});

app.post("/api/tasks", (req: Request, res: Response) => {
  addTask(req, res);
});

app.put("/api/tasks/:taskId", (req: Request, res: Response) => {
  updateTask(req, res);
});

app.patch("/api/tasks/:taskId", (req: Request, res: Response) => {
  patchTask(req, res);
});

app.delete("/api/tasks/:taskId", (req: Request, res: Response) => {
  deleteTask(req, res);
});

// Error-handling middleware should be the last piece of middleware added

interface ExtendedError extends Error {
  status?: number;
  body?: string;
}

app.use((err: ExtendedError, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    // Handle specific parsing errors
    return res.status(400).json({ error: "Malformed JSON" });
  }
  // Default to other error handling
  res.status(500).json({ error: "MAIN: An unexpected error occurred" });
});

export default app;
