import express from "express";
const app = express()
const port = 3001
import mountRoutes from "./routes/index.js";

// Middleware to parse JSON request bodies
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

mountRoutes(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});
