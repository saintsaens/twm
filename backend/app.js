import express from "express";
import mountRoutes from "./routes/index.js";
import session from "express-session";
import connectPgSimple from "connect-pg-simple"
import passport from "passport";
import morgan from "morgan";
import cors from "cors";

import dotenv from "dotenv";
const envFile = process.env.NODE_ENV === 'render' ? '.env.render' : '.env';
dotenv.config({ path: envFile });

const port = process.env.PORT;

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Log stuff
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan(':method :url :status [:date]'));
}

// Use sessions
const PgSession = connectPgSimple(session);
app.use(session({
  store: new PgSession({
    conString: process.env.DATABASE_URL,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === "production" }
}));
app.use(passport.initialize());
app.use(passport.authenticate('session'));

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));


mountRoutes(app);

app.listen(port, () => {
  console.log(`Listening on port ${port}…`)
});
