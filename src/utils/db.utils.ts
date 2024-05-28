import mongoose from "mongoose";

const DB_URI = "mongodb+srv://lucamattei05:admin@cluster0.fhjhm9h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to database
const connect = async () => {
  try {
    await mongoose.connect(DB_URI);
  } catch (error) {
    console.error("Error connecting to database: ", error);
  }
};

export default connect;
