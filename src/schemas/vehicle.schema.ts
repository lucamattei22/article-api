import { boolean, object, string, TypeOf } from "zod";

export const createVehicleSchema = object({
  body: object({
    plate: string({ required_error: "Name is required" }),
    modell: string({ required_error: "Description is required" }),
    expiringDate: string({ required_error: "Status is required" }),
  }),
});

export const updateVehicleSchema = object({
  body: object({
    plate: string({ required_error: "Name is required" }),
    modell: string({ required_error: "Description is required" }),
    expiringDate: string({ required_error: "Status is required" }),
    status: boolean({ required_error: "Status is required" }),
  }),
});

export const patchVehicleSchema = object({
  body: object({
    name: string(),
    modell: string(),
    expiringDate: string(),
    status: boolean(),
  }).partial(),
});

export type CreateVehicleInput = TypeOf<typeof createVehicleSchema>;

export type UpdateVehicleInput = TypeOf<typeof updateVehicleSchema>;
