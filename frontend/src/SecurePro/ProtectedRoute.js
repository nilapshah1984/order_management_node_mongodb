// //ProtectdRoutes.js
// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../context/auth.js";

// const ProtectedRoute = () => {
//   const [auth] = useAuth();


//   if (!auth?.token) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;
