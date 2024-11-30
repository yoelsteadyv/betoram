import express from "express";
import db from "./config/database.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import router from "./routes/index.js";

dotenv.config();
const app = express();

app.use((req, res, next) => {
  console.log("CORS Middleware executed for", req.method, req.path); // Debug
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "https://fetoram.vercel.app");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS,PATCH"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, X-CSRF-Token"
  );
  if (req.method === "OPTIONS") {
    res.sendStatus(200); // Preflight request selesai
    return;
  }
  next();
});


// Middleware lainnya
app.use(cookieParser());
app.use(express.json());

// Rute tes
app.get("/", (req, res) => {
  res.status(200).json({ msg: "Server berjalan dengan baik!" });
});

app.use(express.json)

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

// Menangani deployment di Vercel
const handler = app; // Handler ini digunakan untuk Vercel
export default handler; // Penting untuk Vercel agar mengenali server Express
