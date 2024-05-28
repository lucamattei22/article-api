import { Express } from "express";
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionsHandler,
} from "controllers/session.controller";
import {
  createUserHandler,
  deleteUserHandler,
  getCurrentUserHandler,
} from "controllers/user.controller";
import validateResource from "middleware/validateResource";
import { createSessionSchema } from "schemas/session.schema";
import { createUserSchema } from "schemas/user.schema";
import deserializeUser from "middleware/deserializeUser";
import {
  createVehicleHandler,
  deleteVehicleHandler,
  getVehicleByIdHandler,
  getVehicleHandler,
  updateVehicleHandler,
} from "controllers/vehicle.controller";
import {
  createVehicleSchema,
  patchVehicleSchema,
  updateVehicleSchema,
} from "schemas/vehicle.schema";

const routes = (app: Express) => {
  // Creazione di un utente
  app.post("/api/users", validateResource(createUserSchema), createUserHandler);

  // Ottenere l'utente corrente
  app.get("/api/auth", deserializeUser, getCurrentUserHandler);

  // Creare una nuova sessione
  app.post("/api/sessions", validateResource(createSessionSchema), createUserSessionHandler);

  // Ottenere le sessioni dell'utente
  app.get("/api/sessions", deserializeUser, getUserSessionsHandler);

  // Logout
  app.delete("/api/sessions", deserializeUser, deleteSessionHandler);

  // Eliminare l'utente
  app.delete("/api/users", deserializeUser, deleteUserHandler);

  // Creare un veicolo
  app.post("/api/vehicles", validateResource(createVehicleSchema), deserializeUser, createVehicleHandler);

  // Ottenere i veicoli
  app.get("/api/vehicles", deserializeUser, getVehicleHandler);

  // Ottenere il veicolo per ID
  app.get("/api/vehicles/:vehicleId", deserializeUser, getVehicleByIdHandler);

  // Aggiornare il veicolo
  app.put("/api/vehicles/:vehicleId", validateResource(updateVehicleSchema), deserializeUser, updateVehicleHandler);

  // Eliminare il veicolo
  app.delete("/api/vehicles/:vehicleId", deserializeUser, deleteVehicleHandler);

  // Modificare il veicolo
  app.patch("/api/vehicles/:vehicleId", validateResource(patchVehicleSchema), deserializeUser, updateVehicleHandler);
};

export default routes;
