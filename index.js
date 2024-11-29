import express from "express";
import db from "./config/database.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.js";

dotenv.config();
const app = express();

// Middleware CORS
app.use(cors({
  origin: "*",
  credentials: true
}));
app.options("*", cors());

// Middleware lainnya
app.use(cookieParser());
app.use(express.json());

// Rute tes
app.get("/", (req, res) => {
  res.status(200).json({ msg: "anjay" });
});

// Rute utama
app.use(router);

// Koneksi Database
db.authenticate()
  .then(() => {
    console.log("Database connected...");
    return db.sync();
  })
  .then(() => {
    console.log("Database sync");
  })
  .catch((err) => console.log("Error: " + err));

// Jalankan server
app.listen(3001, () => console.log("Server running at port 3001"));
