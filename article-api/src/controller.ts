import { Request, Response } from "express";
import * as Service from "./service";
import {
  CreateTaskDto,
  UpdateTaskDto,
  partialTaskSchema,
  taskSchema,
} from "./model";

export const getTasks = async (res: Response) => {
  try {
    const tasks = await Service.findAll();
    return res.json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while fetching tasks." });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  if (!taskId) {
    return res.status(400).send("Task ID is missing ins GET request");
  }
  try {
    const task = await Service.findById(taskId);
    if (task) {
      return res.json(task);
    } else {
      return res.status(404).send(`GET: ${taskId} task not found in the database`);
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: `GET: An error occurred while fetching ${taskId} task.` });
  }
};

export const addTask = async (req: Request, res: Response) => {
  const result = taskSchema.safeParse(req.body);
  if (!result.success) {
    console.error("POST Zod error: ", result.error);
    return res.status(400).json({ success: false, errors: result.error });
  }
  console.log("POST result.data: ", JSON.stringify(result.data, null, 2));
  const newTask = await Service.create(result.data);
  return res.status(201).json({ success: true, task: newTask });
};

export const updateTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  // Check if the taskId is valid
  if (!taskId) {
    return res
      .status(400)
      .json({ success: false, message: "Task ID is missing in POST request" });
  }

  try {
    const inputData = req.body;
    const validatedResult = taskSchema.safeParse(inputData);
    console.log(
      "POST validatedResult: ",
      JSON.stringify(validatedResult, null, 2),
    );
    if (!validatedResult.success) {
      console.error("POST Zod error: ", validatedResult.error);
      return res
        .status(400)
        .json({ success: false, errors: validatedResult.error.flatten() });
    }

    const newTaskData: CreateTaskDto = validatedResult.data;

    // PUT update the entire task and if the task does not exist, create a new one
    const { data, operationType } = await Service.upsert(taskId, newTaskData);
    console.log("PUT upsert operationType: ", operationType);
    console.log("PUT upsert return data: ", JSON.stringify(data, null, 2));
    if (operationType === "insert") {
      return res.status(201).json({
        success: true,
        message: "PUT: Task created successfully",
        task: data,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Task updated successfully",
        task: data,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `PUT: An unexpected error occurred while updating ${taskId} task.`,
    });
  }
};

export const patchTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  console.log("PATCH req.params: ", JSON.stringify(req.params, null, 2));
  // Check if the taskId is valid
  if (!taskId) {
    return res
      .status(400)
      .json({ success: false, message: "PATCH: Task ID is missing" });
  }

  try {
    const inputData = req.body;
    const validatedResult = partialTaskSchema.safeParse(inputData);
    console.log(
      "PATCH validatedResult: ",
      JSON.stringify(validatedResult, null, 2),
    );
    if (!validatedResult.success) {
      console.error("PATCH Zod error: ", validatedResult.error);
      return res
        .status(400)
        .json({ success: false, errors: validatedResult.error.flatten() });
    }

    const newTaskData: UpdateTaskDto = validatedResult.data;

    const data = await Service.update(taskId, newTaskData);

    console.log("PATCH update return data: ", JSON.stringify(data, null, 2));
    if (data?.length === 0) {
      return res.status(404).json({
      success: false,
      message: `PATCH: Task ${taskId} not found in the database`,
      });
    }
    return res.status(200).json({
      success: true,
      message: `PATCH: Task ${taskId} updated successfully`,
      data: data });
  } catch (error) {
    const e = error as Error;
    const message =
      "message" in e
        ? e.message
        : `An unexpected error occurred while patching ${taskId} task.`;
    return res.status(500).json({
      success: false,
      message: message,
    });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  if (!taskId) {
    return res
      .status(400)
      .json({ success: false, message: "DELETE: Task ID is missing" });
  }
  try {
    console.log("try DELETE taskId: ", taskId)
    await Service.deleteTask(taskId);
    console.log("success DELETE taskId: ", taskId)
    return res.status(200).json({
      success: true,
      message: `Task ${taskId} deleted successfully`,
    });
  } catch (error) {
    const e = error as Error;
    const message =
      "message" in e
        ? e.message
        : `An unexpected error occurred while deleting ${taskId} task.`;
    return res.status(500).json({
      success: false,
      message,
    });
  }
};
