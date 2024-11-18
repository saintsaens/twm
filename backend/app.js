import express from "express";
import mountRoutes from "./routes/index.js";
import corsLoader from "./loaders/corsLoader.js";
import morganLoader from "./loaders/morganLoader.js";
import sessionLoader from "./loaders/sessionLoader.js";
import passportLoader from "./loaders/passportLoader.js";
import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === 'render' ? '.env.render' : '.env';
dotenv.config({ path: envFile });

const port = process.env.PORT;
const app = express();


// Middleware and app configuration
app.set('trust proxy', 1);
app.use(express.json()); // Parse JSON request bodies
morganLoader(app); // Log stuff
corsLoader(app);
sessionLoader(app);
passportLoader(app);

// Mount routes
mountRoutes(app);

app.listen(port, () => {
  console.log(`Listening on port ${port}…`)
});
