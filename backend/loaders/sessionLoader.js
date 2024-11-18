import session from "express-session";
import connectPgSimple from "connect-pg-simple";

const sessionLoader = (app) => {
  const PgSession = connectPgSimple(session);

  app.use(session({
    store: new PgSession({
      conString: process.env.DATABASE_URL,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "render",
      sameSite: process.env.NODE_ENV === 'render' ? 'None' : 'Lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  }));
};

export default sessionLoader;