// Importa il modulo bcrypt per la crittografia delle password e mongoose per interagire con MongoDB
import bcrypt from "bcrypt";
import mongoose from "mongoose";

// Definisce un'interfaccia per i dati di input dell'utente
export interface UserInput {
  email: string;
  name: string;
  password: string;
}

// Definisce un'interfaccia per il documento dell'utente che estende sia UserInput che mongoose.Document
export interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  hashedPassword(next: any): Promise<Boolean>; // Metodo per criptare la password
  comparePassword(candidatePassword: string): Promise<Boolean>; // Metodo per confrontare la password
}

// Definisce lo schema dell'utente utilizzando mongoose.Schema
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true }, // Campo dell'email
    name: { type: String, required: true }, // Campo del nome
    password: { type: String, required: true }, // Campo della password
  },
  { timestamps: true } // Opzione per includere automaticamente i timestamp di creazione e aggiornamento
);

// Aggiunge un metodo per criptare la password prima di salvarla nel database
userSchema.methods.hashedPassword = async function (next: any): Promise<any> {
  let user = this as UserDocument;

  // Verifica se la password è stata modificata prima di criptarla
  if (!user.isModified("password")) {
    return next();
  }

  // Genera un sale casuale e utilizza bcrypt per criptare la password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hashSync(user.password, salt);
  user.password = hash;

  return next();
};

// Aggiunge un middleware per chiamare il metodo hashedPassword prima di salvare l'utente nel database
userSchema.pre("save", userSchema.methods.hashedPassword);

// Aggiunge un metodo per confrontare la password dell'utente con una password candidata
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as UserDocument;
  // Utilizza bcrypt per confrontare la password candidata con la password dell'utente criptata
  return bcrypt.compare(candidatePassword, user.password);
};

// Crea un modello Mongoose per l'utente utilizzando lo schema definito sopra
const UserModel = mongoose.model<UserDocument>("User", userSchema);

// Esporta il modello dell'utente
export default UserModel;
