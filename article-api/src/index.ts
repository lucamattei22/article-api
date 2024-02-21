import dotenv from 'dotenv';
dotenv.config();
import app from './app';

// Set up the server port and listen for connections
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
