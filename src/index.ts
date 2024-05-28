import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import connect from "utils/db.utils";

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is listening on http://localhost:${PORT}`);

  // Connessione al database
  await connect();
});
