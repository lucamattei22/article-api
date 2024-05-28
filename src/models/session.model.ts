import mongoose from "mongoose";
import { UserDocument } from "./user.model";

// Definisce un'interfaccia per il documento di sessione
export interface SessionDocument extends mongoose.Document {
  user: UserDocument["_id"]; // ID dell'utente associato alla sessione
  valid: boolean; // Stato di validità della sessione
  userAgent: string; // Agente utente associato alla sessione
  createdAt: Date; // Data e ora di creazione della sessione
  updatedAt: Date; // Data e ora di aggiornamento della sessione
}

// Definisce lo schema della sessione utilizzando Mongoose
const sessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Riferimento all'ID dell'utente
    valid: { type: Boolean, default: true }, // Stato di validità predefinito: true
    userAgent: { type: String }, // Agente utente
  },
  {
    timestamps: true, // Aggiunge i timestamp di creazione e aggiornamento automaticamente
  }
);

// Crea un modello Mongoose per la sessione utilizzando lo schema definito sopra
const SessionModel = mongoose.model<SessionDocument>("Session", sessionSchema);

// Esporta il modello della sessione
export default SessionModel;
