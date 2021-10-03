const SessionControllerRoute = require('./app/controllers/sessioncontroller')
const EmployeesControllerRoute = require('./app/controllers/employeescontroller')
const FaqControllerRoute = require('./app/controllers/faqcontroller')
const CalculateControllerRoute = require('./app/controllers/calculatecontroller')
const ProductsControllerRoute = require('./app/controllers/productscontroller')
const BudgetsControllerRoute = require('./app/controllers/budgetscontroller')
const OrdersControllerRoute = require('./app/controllers/orderscontroller')
const CoursesControllerRoute = require('./app/controllers/coursescontroller')

const routes = require("express").Router();
const authMiddleware = require('./app/middleware/auth');

// Definição Rotas
routes.post('/auth', SessionControllerRoute.login);
routes.get('/auth-admin', SessionControllerRoute.get);

routes.use(authMiddleware);
routes.get('/get-employees', EmployeesControllerRoute.get);
routes.post('/update-employees', EmployeesControllerRoute.update);
routes.get('/get-faqlist', FaqControllerRoute.get);
routes.post('/update-faqlist', FaqControllerRoute.update);
routes.post('/add-faqlist', FaqControllerRoute.add);
routes.post('/remove-faqlist', FaqControllerRoute.remove);
routes.post('/update-order-faqlist', FaqControllerRoute.order);
routes.get('/get-calculate', CalculateControllerRoute.get);

routes.post('/add-calculate-distance', CalculateControllerRoute.addDistance);
routes.post('/update-calculate-distance', CalculateControllerRoute.updateDistance);
routes.post('/remove-calculate-distance', CalculateControllerRoute.removeDistance);
routes.post('/add-calculate-volume', CalculateControllerRoute.addVolume);
routes.post('/update-calculate-volume', CalculateControllerRoute.updateVolume);
routes.post('/remove-calculate-volume', CalculateControllerRoute.removeVolume);
routes.post('/update-calculate-week', CalculateControllerRoute.updateWeek);
routes.post('/update-calculate-pool', CalculateControllerRoute.updatePool);

routes.get('/get-products', ProductsControllerRoute.get);
routes.post('/add-products-list', ProductsControllerRoute.addProducts);
routes.post('/update-products-list', ProductsControllerRoute.updateProducts);
routes.post('/remove-products-list', ProductsControllerRoute.removeProducts);
routes.post('/add-products-quantity', ProductsControllerRoute.addQuantity);
routes.post('/update-products-quantity', ProductsControllerRoute.updateQuantity);
routes.post('/remove-products-quantity', ProductsControllerRoute.removeQuantity);
routes.post('/update-products-sand', ProductsControllerRoute.updateSand);
routes.post('/update-products-clean', ProductsControllerRoute.updateClean);
routes.post('/add-products-valvule', ProductsControllerRoute.addValvule);
routes.post('/update-products-valvule', ProductsControllerRoute.updateValvule);
routes.post('/remove-products-valvule', ProductsControllerRoute.removeValvule);

routes.get('/get-budgets', BudgetsControllerRoute.getBudgets);
routes.get('/get-inscriptions', BudgetsControllerRoute.getInscriptions);

routes.get('/get-orders-app', OrdersControllerRoute.getOrders);
routes.get('/get-orders-courses', OrdersControllerRoute.getOrdersCourses);
routes.get('/get-historic', OrdersControllerRoute.getHistoric);
routes.post('/update-orders', OrdersControllerRoute.updateOrders);
routes.get('/get-search', OrdersControllerRoute.getSearch);
routes.get('/get-search-courses', OrdersControllerRoute.getSearchCourses);
routes.get('/get-search-budgets', BudgetsControllerRoute.getSearchBudgets);
routes.get('/get-search-budgets-courses', BudgetsControllerRoute.getSearchBudgetsCourses);
routes.post('/delete-orders', OrdersControllerRoute.deleteOrders);

routes.get('/get-courses', CoursesControllerRoute.getCourses);
routes.post('/update-courses', CoursesControllerRoute.updateCourses);
routes.post('/update-list', CoursesControllerRoute.updateList);

module.exports = routes;
