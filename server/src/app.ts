import express from "express";
import createError from "http-errors";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
// import session from "express-session";
import apiRoute from "./routes/api.route.ts";
import userRoute from "./routes/user.route.ts";
import transectionRoute from "./routes/transection.route.ts";
import connectDB from './configs/DBConfig.ts'
import cookieParser from "cookie-parser";


dotenv.config();

const app = express();

connectDB()
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("dev"));
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "fallback-secret-key",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: process.env.NODE_ENV === "production",
//       httpOnly: true,
//       maxAge: 24 * 60 * 60 * 1000, // 24 hours
//     },
//   })
// );

app.get("/", async (req, res, next) => {
  res.send({ message: "Awesome it works 🐻" });
});

app.use("/api", apiRoute);
app.use("/api/user", userRoute);
app.use("/api/transection", transectionRoute);

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
