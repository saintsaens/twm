import auth from "./auth.js"
import items from './items.js'
import orders from './orders.js'
import sellers from './sellers.js'
import users from './users.js'
import carts from './carts.js'
 
const mountRoutes = (app) => {
  app.use('/', auth);
  app.use('/items', items);
  app.use('/orders', orders);
  app.use('/sellers', sellers);
  app.use('/users', users);
  app.use('/carts', carts);
}
 
export default mountRoutes;
