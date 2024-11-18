import passport from "passport";

const passportLoader = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
};

export default passportLoader;