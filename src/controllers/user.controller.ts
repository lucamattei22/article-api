import { Request, Response } from "express";
import { CreateUserInput } from "schemas/user.schema";
import { deleteVehicles } from "services/vehicle.service";
import { createUser, deleteUser, findUserByEmail } from "services/user.service";

// Funzione per creare un nuovo utente
export const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) => {
  const { email } = req.body;
  const user = await findUserByEmail(email);

  // Se l'utente non esiste, crea un nuovo utente
  if (!user) {
    const newUser = await createUser(req.body);
    return res.status(201).send(newUser);
  }
  // Se l'utente esiste già, ritorna un errore 409
  return res.status(409).send("User already exists");
};

// Funzione per ottenere l'utente corrente
export const getCurrentUserHandler = async (req: Request, res: Response) => {
  // Ritorna le informazioni dell'utente corrente
  return res.send(res.locals.user);
};

// Funzione per eliminare l'utente corrente
export const deleteUserHandler = async (req: Request, res: Response) => {
  const userId = res.locals.user._id;
  // Elimina i veicoli associati all'utente
  await deleteVehicles(userId);
  // Elimina l'utente
  await deleteUser({ _id: userId });
  // Ritorna un codice di stato 200 per indicare che l'operazione è andata a buon fine
  return res.sendStatus(200);
};
