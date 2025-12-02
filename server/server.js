import express from "express";
import mongoose from "mongoose";
import morgan from 'morgan';
import dotenv from 'dotenv';
import multer from "multer";
import path from "path";
import { storage } from "./cloudinary.js";

import userRoutes from "./routes/user.routes.js";
import donationRoutes from "./routes/donation.routes.js";
import requestRoutes from "./routes/request.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

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

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.json({ message: "Welcome to application." });
});

app.use("/api/user", userRoutes);
app.use("/api/donation", donationRoutes);
app.use("/api/request", requestRoutes);
app.use("/api/notification", notificationRoutes);

app.use(morgan('dev'));

app.post("/upload", upload.single("file"), (req, res) => {
  // req.file.path is the Cloudinary URL
  res.json({
    message: "File uploaded successfully!",
    url: req.file.path,
  });
});

app.listen(5000, (err) => {
  if (err) {
    console.log(err);
  }
  console.info("Server started on port %s.", 5000);
});