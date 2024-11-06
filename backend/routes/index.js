import auth from "./auth.js"
import items from './items.js'
import orders from './orders.js'
import users from './users.js'
import carts from './carts.js'
 
const mountRoutes = (app) => {
  app.use('/api/', auth);
  app.use('/api/items', items);
  app.use('/api/orders', orders);
  app.use('/api/users', users);
  app.use('/api/carts', carts);
}
 
export default mountRoutes;
