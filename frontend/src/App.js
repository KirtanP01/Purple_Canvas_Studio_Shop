import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from 'react-bootstrap'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ProductDisplayPage from './pages/ProductDisplayPage'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import ShippingPage from './pages/ShippingPage'
import PaymentPage from "./pages/PaymentPage";
import OrderReviewPage from "./pages/OrderReviewPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import UserListPage from "./pages/UserListPage";
import UserEditPage from "./pages/UserEditPage";
import ProductListPage from "./pages/ProductListPage";
import ProductEditPage from "./pages/ProductEditPage";
import OrderListPage from "./pages/OrderListPage";

const App = () => {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Routes>
            <Route path='/order/:id' element={<OrderConfirmationPage />} />
            <Route path='/login/shipping' element={<ShippingPage />} />
            <Route path='/payment' element={<PaymentPage />} />
            <Route path='/orderReview' element={<OrderReviewPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/product/:id' element={<ProductDisplayPage />} />
            <Route path='/cart/:id?' element={<CartPage />} />
            <Route path='/admin/userlist' element={<UserListPage />} />
            <Route path='/admin/user/:id/edit' element={<UserEditPage />} />
            <Route path='/admin/productlist' element={<ProductListPage />} exact />
            <Route path='/admin/productlist/page/:pageNumber' element={<ProductListPage exact />} />
            <Route path='/admin/product/:id/edit' element={<ProductEditPage />} />
            <Route path='/admin/orderlist' element={<OrderListPage />} />
            <Route path='/search/:keyword' element={<HomePage />} exact />
            <Route path='/page/:pageNumber' element={<HomePage />} exact />
            <Route path='/search/:keyword/page/:pageNumber' element={<HomePage />} exact />
            <Route path='/' element={<HomePage />} exact />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
