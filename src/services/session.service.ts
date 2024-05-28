import { get } from "lodash";
import { FilterQuery, UpdateQuery } from "mongoose";
import SessionModel, { SessionDocument } from "models/session.model";
import { signJwt, verifyJwt } from "utils/jwt.utils";
import { findUser } from "./user.service";

// Crea una nuova sessione per un utente
export const createSession = async (userId: string, userAgent?: string) => {
  const session = await SessionModel.create({ user: userId, userAgent });
  return session.toJSON();
};

// Trova le sessioni che corrispondono a una query
export const findSessions = async (query: FilterQuery<SessionDocument>) => {
  return SessionModel.find(query).lean();
};

// Aggiorna una sessione basata su una query e un aggiornamento
export const updateSession = async (
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) => {
  return SessionModel.updateOne(query, update);
};

// Rinnova un token di accesso utilizzando un token di refresh
export const reIssueAccessToken = async ({
  refreshToken,
}: {
  refreshToken: string;
}) => {
  const { decoded } = verifyJwt(refreshToken, "refreshTokenPublicKey");
  if (!decoded || !get(decoded, "session")) return "";
  
  const session = await SessionModel.findById(get(decoded, "session"));
  if (!session || !session.valid) return "";
  
  const user = await findUser({ _id: session.user });
  if (!user) return "";
  
  const accessToken = signJwt(
    { ...user, session: session._id },
    "accessTokenPrivateKey",
    { expiresIn: "15m" }
  );
  
  return accessToken;
};
