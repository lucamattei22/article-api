import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

// Funzione per validare il corpo della richiesta, i query e i parametri contro lo schema fornito
const validateResource =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Esegue la validazione utilizzando lo schema di Zod
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      // Se la validazione passa, chiama la funzione next() per passare al middleware successivo
      next();
    } catch (error: any) {
      // Se la validazione fallisce, ritorna un errore 400 con i dettagli dell'errore
      return res.status(400).send(error.errors);
    }
  };

export default validateResource;
