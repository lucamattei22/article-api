import { Request, Response } from "express";
import {
  createSession,
  findSessions,
  updateSession,
} from "services/session.service";
import { validatePassword } from "services/user.service";
import { signJwt } from "utils/jwt.utils";

// Funzione per creare una nuova sessione utente
export const createUserSessionHandler = async (req: Request, res: Response) => {
  // Valida la password dell'utente
  const user = await validatePassword(req.body);

  if (!user) {
    // Se le credenziali non sono valide, ritorna un errore 401
    return res.status(401).send("Invalid credentials");
  }

  // Crea una nuova sessione per l'utente
  const session = await createSession(user._id, req.get("user-agent"));

  // Crea un token di accesso (access token)
  const accessToken = signJwt(
    { ...user, session: session._id },
    "accessTokenPrivateKey",
    { expiresIn: "15m" }
  );

  // Crea un token di rinnovo (refresh token)
  const refreshToken = signJwt(
    { ...user, session: session._id },
    "refreshTokenPrivateKey",
    { expiresIn: "1y" }
  );

  // Ritorna i token di accesso e rinnovo
  return res.status(201).send({ accessToken, refreshToken });
};

// Funzione per ottenere tutte le sessioni dell'utente
export const getUserSessionsHandler = async (req: Request, res: Response) => {
  const userId = res.locals.user._id;

  // Trova tutte le sessioni valide dell'utente
  const sessions = await findSessions({ user: userId, valid: true });

  // Ritorna le sessioni trovate
  return res.send(sessions);
};

// Funzione per eliminare una sessione utente
export const deleteSessionHandler = async (req: Request, res: Response) => {
  const sessionId = res.locals.user.session;

  // Aggiorna la sessione impostandola come non valida
  await updateSession({ _id: sessionId }, { valid: false });

  // Ritorna i token di accesso e rinnovo nulli
  return res.send({
    accessToken: null,
    refreshToken: null,
  });
};
