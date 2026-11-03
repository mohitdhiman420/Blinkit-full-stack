import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router";
import App from "../App";
import Home from "../pages/Home";
import Searchpage from "../pages/Searchpage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Forgot_password from "../pages/Forgot_password";
import Otp_verify_password from "../pages/Otp_verify_password";
import Reset_password from "../pages/Reset_password";
import UserDetailsMobileview from "../pages/UserDetailsMobileview";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Myorder from "../pages/Myorder";
import Address from "../pages/Address";
import Category from "../pages/Category";
import Subcategory from "../pages/Subcategory";
import Uploadproduct from "../pages/Uploadproduct";
import Products from "../pages/Products";
import AdminPermission from "../utils/AdminPermission";
import ProductListpage from "../pages/ProductListpage";
import ProductDisplaypage from "../pages/ProductDisplaypage";
import Displaysidebarcartmobile from "../pages/Displaysidebarcartmobile";
import CheckoutPage from "../pages/CheckoutPage";
import Success from "../pages/Success";

// const router = createBrowserRouter([
//      {
//           path:'/',
//           element:<App/>,
//           children:[
//                {
//                     path:"",
//                     element:<Home/>
//                },
//                {
//                     path:"/search",
//                     element:<Searchpage/>
//                }
//           ]
//      }
// ])

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<Home />} />
      <Route path="/search" element={<Searchpage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<Forgot_password />} />
      <Route path="/verify-password-otp" element={<Otp_verify_password />} />
      <Route path="/reset-password" element={<Reset_password />} />
      <Route path="/user-details" element={<UserDetailsMobileview />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="profile" element={<Profile />} />
        <Route
          path="my-order"
          element={
            <AdminPermission>
              <Myorder />
            </AdminPermission>
          }
        />
        <Route
          path="address"
          element={
            <AdminPermission>
              <Address />
            </AdminPermission>
          }
        />
        <Route
          path="category"
          element={
            <AdminPermission>
              <Category />
            </AdminPermission>
          }
        />
        <Route
          path="sub-category"
          element={
            <AdminPermission>
              <Subcategory />
            </AdminPermission>
          }
        />
        <Route
          path="upload-product"
          element={
            <AdminPermission>
              <Uploadproduct />
            </AdminPermission>
          }
        />
        <Route
          path="products"
          element={
            <AdminPermission>
              <Products />
            </AdminPermission>
          }
        />
      </Route>
      <Route path=":category">
        <Route path=":subcategory" element={<ProductListpage />} />
      </Route>
      <Route path="product/:product" element={<ProductDisplaypage />} />
      <Route path="cart" element={<Displaysidebarcartmobile/>}/>
      <Route path="checkout" element={<CheckoutPage/>}/>
      <Route path="success" element={<Success/>}/>
    </Route>,
  ),
);
export default router;
