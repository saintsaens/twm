import items from './items.js'
import orders from './orders.js'
import sellers from './sellers.js'
import users from './users.js'
 
const mountRoutes = (app) => {
  app.use('/items', items);
  app.use('/orders', orders);
  app.use('/sellers', sellers);
  app.use('/users', users);
}
 
export default mountRoutes;
