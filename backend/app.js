import express from "express";
import itemsRouter from "./routes/items.js"
import usersRouter from "./routes/users.js"
import sellersRouter from "./routes/sellers.js"
import ordersRouter from "./routes/orders.js"
const app = express()
const port = 3001

// Middleware to parse JSON request bodies
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.use("/items", itemsRouter);
app.use("/users", usersRouter);
app.use("/sellers", sellersRouter);
app.use("/orders", ordersRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});
