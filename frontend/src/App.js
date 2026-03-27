import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import {
  Navigate,
  Route, RouterProvider, createBrowserRouter, createRoutesFromElements
} from "react-router-dom";
import { selectIsAuthChecked, selectLoggedInUser } from './features/auth/AuthSlice';
import { Logout } from './features/auth/components/Logout';
import { Protected } from './features/auth/components/Protected';
import { useAuthCheck } from "./hooks/useAuth/useAuthCheck";
import { useFetchLoggedInUserDetails } from "./hooks/useAuth/useFetchLoggedInUserDetails";
import { AddProductPage, AdminOrdersPage, CartPage, CheckoutPage, ForgotPasswordPage, HomePage, LoginPage, OrderSuccessPage, OtpVerificationPage, ProductDetailsPage, ProductUpdatePage, ResetPasswordPage, SignupPage, UserOrdersPage, UserProfilePage, WishlistPage } from './pages';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';
import "./assets/productDescription.css";
import AIChatWidget from "./components/AIChatWidget";
import { fetchAllBrandsAsync } from './features/brands/BrandSlice';
import { fetchGuestCart } from './features/cart/CartSlice';

import { fetchAllCategoriesAsync } from './features/categories/CategoriesSlice';

function App() {
  const dispatch = useDispatch();
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const loggedInUser = useSelector(selectLoggedInUser);

  // 🛠️ SỬA LỖI TẠI ĐÂY: Gọi Hook trực tiếp, không đặt trong IF
  useAuthCheck();
  useFetchLoggedInUserDetails(loggedInUser); 

  useEffect(() => {
    if (!loggedInUser) {
        dispatch(fetchGuestCart());
    }
}, [dispatch, loggedInUser]);

  useEffect(() => {
    // Gọi cả 2 cái này thì khi đăng xuất khách mới thấy đủ danh sách
    dispatch(fetchAllCategoriesAsync());
    dispatch(fetchAllBrandsAsync()); 
  }, [dispatch]);

  const routes = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* --- CÁC ROUTE PUBLIC (KHÔNG CẦN ĐĂNG NHẬP) --- */}
        <Route path='/' element={<HomePage />} />
        <Route path='/products' element={<HomePage />} />
        <Route exact path='/product-details/:id' element={<ProductDetailsPage />} />

        <Route path='/cart' element={<CartPage />} />
        <Route path='/wishlist' element={<WishlistPage />} />
        <Route path='/checkout' element={<CheckoutPage />} />
        
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/verify-otp' element={<OtpVerificationPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/reset-password/:userId/:passwordResetToken' element={<ResetPasswordPage />} />
        
        {/* --- ROUTE CẦN ĐĂNG NHẬP CHUNG --- */}
        <Route exact path='/logout' element={<Protected><Logout /></Protected>} />

        {
          loggedInUser?.isAdmin ? (
            <>
              <Route path='/admin/dashboard' element={<Protected><AdminDashboardPage /></Protected>} />
              <Route path='/admin/product-update/:id' element={<Protected><ProductUpdatePage /></Protected>} />
              <Route path='/admin/add-product' element={<Protected><AddProductPage /></Protected>} />
              <Route path='/admin/orders' element={<Protected><AdminOrdersPage /></Protected>} />
              <Route path='*' element={<Navigate to={'/admin/dashboard'} />} />
            </>
          ) : (
            <>
              
              <Route path='/profile' element={<Protected><UserProfilePage /></Protected>} />
              <Route path='/order-success/:id' element={<Protected><OrderSuccessPage /></Protected>} />
              <Route path='/orders' element={<Protected><UserOrdersPage /></Protected>} />
              
            </>
          )
        }

        <Route path='*' element={<NotFoundPage />} />
      </>
    )
  )

  return isAuthChecked ? (
    <>
      <RouterProvider router={routes} />
      <AIChatWidget />
    </>
  ) : "";
}

export default App;