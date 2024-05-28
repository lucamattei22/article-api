import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
import { verifyJwt } from "utils/jwt.utils";
import { reIssueAccessToken, updateSession } from "services/session.service";
import SessionModel from "models/session.model";
import { findUser } from "services/user.service";

// Deserializza l'utente dal token di accesso
const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );

  // Se c'è un token di accesso, proviamo a decodificarlo
  if (accessToken) {
    const { decoded, expired } = verifyJwt(accessToken, "accessTokenPublicKey");

    if (decoded) {
      // Controlla se la sessione è valida
      const session = await SessionModel.findById(get(decoded, "session"));
      if (!session || !session.valid) {
        return res.status(401).send("Authorization denied");
      }

      // Controlla se l'utente esiste
      const user = await findUser({ _id: session.user });
      if (!user) {
        await updateSession({ _id: decoded }, { valid: false });
        return res.status(401).send("Authorization denied");
      }

      res.locals.user = decoded;
      return next();
    }

    const refreshToken: any = get(req, "headers.x-refresh");

    // Se il token di accesso è scaduto, proviamo a emettere un nuovo token di accesso
    if (expired && refreshToken) {
      const newAccessToken = await reIssueAccessToken({ refreshToken });

      if (newAccessToken && newAccessToken !== "") {
        res.setHeader("authorization", newAccessToken);

        const result = verifyJwt(newAccessToken as string, "accessTokenPublicKey");

        res.locals.user = result.decoded;
        return next();
      }
    }
  }

  return res.status(401).send("Authorization denied");
};

export default deserializeUser;
