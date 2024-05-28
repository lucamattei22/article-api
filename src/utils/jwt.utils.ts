import jwt from "jsonwebtoken";

const ACCESS_TOKEN_PRIVATE_KEY = process.env.ACCESS_TOKEN_PRIVATE_KEY || "";
const REFRESH_TOKEN_PRIVATE_KEY = process.env.REFRESH_TOKEN_PRIVATE_KEY || "";
const ACCESS_TOKEN_PUBLIC_KEY = process.env.ACCESS_TOKEN_PUBLIC_KEY || "";
const REFRESH_TOKEN_PUBLIC_KEY = process.env.REFRESH_TOKEN_PUBLIC_KEY || "";

type PrivateKEY = "accessTokenPrivateKey" | "refreshTokenPrivateKey";
type PublicKEY = "accessTokenPublicKey" | "refreshTokenPublicKey";

// Imposta la chiave privata in base al nome della chiave
const setPrivateKey = (keyName: PrivateKEY): string => {
  return keyName === "accessTokenPrivateKey" ? ACCESS_TOKEN_PRIVATE_KEY : REFRESH_TOKEN_PRIVATE_KEY;
};

// Imposta la chiave pubblica in base al nome della chiave
const setPublicKey = (keyName: PublicKEY): string => {
  return keyName === "accessTokenPublicKey" ? ACCESS_TOKEN_PUBLIC_KEY : REFRESH_TOKEN_PUBLIC_KEY;
};

// Firma un token JWT
export const signJwt = (
  object: Object,
  keyName: PrivateKEY,
  options?: jwt.SignOptions | undefined
) => {
  const signingKey = Buffer.from(setPrivateKey(keyName), "base64").toString("ascii");
  return jwt.sign(object, signingKey, { ...(options && options), algorithm: "RS256" });
};

// Verifica un token JWT
export const verifyJwt = (token: string, keyName: PublicKEY) => {
  const publicKey = Buffer.from(setPublicKey(keyName), "base64").toString("ascii");
  try {
    const decoded = jwt.verify(token, publicKey);
    return { valid: true, expired: false, decoded };
  } catch (e: any) {
    console.error("Errore durante la verifica del token: ", e);
    return { valid: false, expired: e.message === "jwt expired", decoded: null };
  }
};
