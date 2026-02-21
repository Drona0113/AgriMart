import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import store from './store';
import './index.css';
import App from './App';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';
import ProfilePage from './pages/ProfilePage';
import KnowledgeHubPage from './pages/KnowledgeHubPage';
import KnowledgeDetailsPage from './pages/KnowledgeDetailsPage';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import FarmerRoute from './components/FarmerRoute';
import OrderListPage from './pages/admin/OrderListPage';
import ProductListPage from './pages/admin/ProductListPage';
import ProductEditPage from './pages/admin/ProductEditPage';
import UserListPage from './pages/admin/UserListPage';
import UserEditPage from './pages/admin/UserEditPage';
import KnowledgeListPage from './pages/admin/KnowledgeListPage';
import KnowledgeEditPage from './pages/admin/KnowledgeEditPage';
import FarmerProductListPage from './pages/farmer/FarmerProductListPage';
import FarmerProductEditPage from './pages/farmer/FarmerProductEditPage';
import FarmerOrderListPage from './pages/farmer/FarmerOrderListPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomePage />} />
      <Route path='/search/:keyword' element={<HomePage />} />
      <Route path='/page/:pageNumber' element={<HomePage />} />
      <Route
        path='/search/:keyword/page/:pageNumber'
        element={<HomePage />}
      />
      <Route path='/product/:id' element={<ProductPage />} />
      <Route path='/cart' element={<CartPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/knowledge' element={<KnowledgeHubPage />} />
      <Route path='/knowledge/:id' element={<KnowledgeDetailsPage />} />

      {/* Registered users */}
      <Route path='' element={<PrivateRoute />}>
        <Route path='/shipping' element={<ShippingPage />} />
        <Route path='/payment' element={<PaymentPage />} />
        <Route path='/placeorder' element={<PlaceOrderPage />} />
        <Route path='/order/:id' element={<OrderPage />} />
        <Route path='/profile' element={<ProfilePage />} />
      </Route>

      {/* Admin users */}
      <Route path='' element={<AdminRoute />}>
        <Route path='/admin/orderlist' element={<OrderListPage />} />
        <Route path='/admin/productlist' element={<ProductListPage />} />
        <Route
          path='/admin/productlist/:pageNumber'
          element={<ProductListPage />}
        />
        <Route path='/admin/userlist' element={<UserListPage />} />
        <Route path='/admin/product/:id/edit' element={<ProductEditPage />} />
        <Route path='/admin/user/:id/edit' element={<UserEditPage />} />
        <Route path='/admin/knowledgelist' element={<KnowledgeListPage />} />
        <Route
          path='/admin/knowledge/:id/edit'
          element={<KnowledgeEditPage />}
        />
      </Route>

      {/* Farmer users */}
      <Route path='' element={<FarmerRoute />}>
        <Route path='/farmer/orderlist' element={<FarmerOrderListPage />} />
        <Route path='/farmer/productlist' element={<FarmerProductListPage />} />
        <Route
          path='/farmer/productlist/:pageNumber'
          element={<FarmerProductListPage />}
        />
        <Route
          path='/farmer/product/:id/edit'
          element={<FarmerProductEditPage />}
        />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);
