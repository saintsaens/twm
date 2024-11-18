import morgan from "morgan";

const morganLoader = (app) => {
  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan(':method :url :status [:date]'));
  }
};

export default morganLoader;