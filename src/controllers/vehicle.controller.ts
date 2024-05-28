import { Request, Response } from "express";
import { CreateVehicleInput, UpdateVehicleInput } from "schemas/vehicle.schema";
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  patchVehicle,
} from "services/vehicle.service";

// Funzione per creare un nuovo veicolo
export const createVehicleHandler = async (
  req: Request<{}, {}, CreateVehicleInput["body"]>,
  res: Response
) => {
  const userId = res.locals.user._id;
  const vehicle = await createVehicle(userId, req.body);
  return res.status(201).send(vehicle);
};

// Funzione per ottenere tutti i veicoli
export const getVehicleHandler = async (req: Request, res: Response) => {
  const userId = res.locals.user._id;
  const vehicles = await getVehicles(userId);
  return res.send(vehicles);
};

// Funzione per ottenere un veicolo tramite ID
export const getVehicleByIdHandler = async (req: Request, res: Response) => {
  const userId = res.locals.user._id;
  // Verifica se vehicleId è un ObjectId valido
  if (!req.params.vehicleId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.sendStatus(404);
  }
  const vehicle = await getVehicleById(userId, req.params.vehicleId);
  if (!vehicle) {
    return res.sendStatus(404);
  }
  return res.send(vehicle);
};

// Funzione per aggiornare un veicolo
export const updateVehicleHandler = async (
  req: Request<{ vehicleId: string }, {}, UpdateVehicleInput["body"]>,
  res: Response
) => {
  const userId = res.locals.user._id;
  // Verifica se vehicleId è un ObjectId valido
  if (!req.params.vehicleId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.sendStatus(404);
  }
  const vehicle = await updateVehicle(userId, req.params.vehicleId, req.body);
  if (!vehicle) {
    return res.sendStatus(404);
  }
  return res.send(vehicle);
};

// Funzione per eliminare un veicolo
export const deleteVehicleHandler = async (req: Request, res: Response) => {
  const userId = res.locals.user._id;
  // Verifica se vehicleId è un ObjectId valido
  if (!req.params.vehicleId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.sendStatus(404);
  }
  const vehicle = await deleteVehicle(userId, req.params.vehicleId);
  if (!vehicle) {
    return res.sendStatus(404);
  }
  return res.send(vehicle);
};

// Funzione per patchare (modificare parzialmente) un veicolo
export const patchVehicleHandler = async (req: Request, res: Response) => {
  const userId = res.locals.user._id;
  // Verifica se vehicleId è un ObjectId valido
  if (!req.params.vehicleId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.sendStatus(404);
  }
  const vehicle = await patchVehicle(userId, req.params.vehicleId, req.body);
  if (!vehicle) {
    return res.sendStatus(404);
  }
  return res.send(vehicle);
};
