import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import path from "path";

//The client does NOT access .env directly
//Instead, the server loads .env and uses the variables internally
dotenv.config({ path: path.resolve('../server/.env') });

//connect to mongo db
mongoose.connect(process.env.MONGO_URI);
const connection = mongoose.connection;
connection.on('error', console.error.bind(console, "Unable to connect to database: "));
connection.once('open', () => { console.log('Connected to database!'); });

const app = express();
app.use(express.json()); 

app.get("/", (req, res) => {
  res.json({ message: "Welcome to application." });
});

app.listen(5000, (err) => {
  if (err) {
    console.log(err);
  }
  console.info("Server started on port %s.", 5000);
});
