import VehicleModel, { VehicleDocument, VehicleInput } from "models/vehicle.model";
import { omit } from "lodash";

// Crea un nuovo veicolo escludendo l'ID dell'utente dai dati restituiti
export const createVehicle = async (userId: string, input: Partial<VehicleInput>) => {
  const vehicle = await VehicleModel.create({ ...input, user: userId });
  return omit(vehicle.toJSON(), "user");
};

// Ottieni tutti i veicoli di un utente escludendo l'ID dell'utente dai dati restituiti
export const getVehicles = async (userId: string) => {
  const vehicles = await VehicleModel.find({ user: userId });
  return vehicles.map((vehicle) => omit(vehicle.toJSON(), "user"));
};

// Ottieni un veicolo per ID di un utente escludendo l'ID dell'utente dai dati restituiti
export const getVehicleById = async (userId: string, vehicleId: string) => {
  const vehicle = await VehicleModel.findOne({ user: userId, _id: vehicleId });
  return omit(vehicle?.toJSON(), "user");
};

// Aggiorna un veicolo di un utente escludendo l'ID dell'utente dai dati restituiti
export const updateVehicle = async (
  userId: string,
  vehicleId: string,
  input: VehicleInput
) => {
  const vehicle = await VehicleModel.findOneAndUpdate(
    { user: userId, _id: vehicleId },
    input,
    { new: true }
  );
  return omit(vehicle?.toJSON(), "user");
};

// Cancella un veicolo di un utente escludendo l'ID dell'utente dai dati restituiti
export const deleteVehicle = async (userId: string, vehicleId: string) => {
  const vehicle = await VehicleModel.findOneAndDelete({ user: userId, _id: vehicleId });
  return omit(vehicle?.toJSON(), "user");
};

// Modifica un veicolo di un utente escludendo l'ID dell'utente dai dati restituiti
export const patchVehicle = async (
  userId: string,
  vehicleId: string,
  input: Partial<VehicleInput>
) => {
  const vehicle = await VehicleModel.findOneAndUpdate(
    { user: userId, _id: vehicleId },
    input,
    { new: true }
  );
  return omit(vehicle?.toJSON(), "user");
};

// Cancella tutti i veicoli di un utente
export const deleteVehicles = async (userId: string) => {
  const vehicles = await VehicleModel.deleteMany({ user: userId });
  return vehicles;
};
