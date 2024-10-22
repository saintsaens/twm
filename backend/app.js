import express from "express";
import mountRoutes from "./routes/index.js";
import session from "express-session";
import connectPgSimple from "connect-pg-simple"
import passport from "passport";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT;

// Middleware to parse JSON request bodies
app.use(express.json());

const PgSession = connectPgSimple(session);
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === "production" }
}));
app.use(passport.initialize());
app.use(passport.authenticate('session'));

mountRoutes(app);

app.listen(port, () => {
  console.log(`Listening on port ${port}…`)
});
