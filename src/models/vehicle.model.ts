import mongoose from "mongoose";
import { UserDocument } from "./user.model";

// Definisce l'input per un veicolo
export interface VehicleInput {
  plate: string;
  modell: string; 
  expiringDate: string;
  status: boolean;
}

// Estende l'input del veicolo e mongoose.Document per definire un documento del veicolo
export interface VehicleDocument extends VehicleInput, mongoose.Document {
  user: UserDocument["_id"]; // Riferimento all'ID dell'utente proprietario
  createdAt: Date; // Data di creazione del documento
  updatedAt: Date; // Data di aggiornamento del documento
}

// Definisce lo schema del veicolo utilizzando mongoose.Schema
const vehicleSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    plate: { type: String, required: true },
    modell: { type: String, required: true },
    expiringDate: { type: String, required: true },
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Crea e registra il modello "Vehicle" utilizzando lo schema definito sopra
const VehicleModel = mongoose.model<VehicleDocument>("Vehicle", vehicleSchema);

// Esporta il modello del veicolo per consentirne l'utilizzo altrove nell'applicazione
export default VehicleModel;
