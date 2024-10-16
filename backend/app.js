import express from "express";
import mountRoutes from "./routes/index.js";
const app = express();
const port = 3001;

// Middleware to parse JSON request bodies
app.use(express.json());


mountRoutes(app);

app.listen(port, () => {
  console.log(`Listening on port ${port}…`)
});
