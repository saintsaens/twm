import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";
import * as db from "../db/index.js";

const passportLoader = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const query = "SELECT * FROM users WHERE username = $1";

      try {
        const { rows } = await db.query(query, [username]);
        const user = rows[0];

        if (!user) {
          return done(null, false, { message: "Incorrect username or password." });
        }

        const isMatch = await bcrypt.compare(password, user.hashed_pw);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect username or password." });
        }

        return done(null, user);
      } catch (err) {
        console.error("Database query error:", err);
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, { id: user.id, username: user.username });
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

export default passportLoader;