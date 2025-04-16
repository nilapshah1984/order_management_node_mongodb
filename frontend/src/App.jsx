import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Signin from "./Login-Form/Signin";
import Home from "./pages/Home";
import ForgotPassword from "./Login-Form/ForgotPassword";
import ApplayOut from "./pages/AppLayOut";
import Dashboard from "./Dashboard/Dashboard";
import ManageCustomer from "./Customers/ManageCustomer";
import ManageSuppliers from "./Suppliers/ManageSuppliers";
import ManageItem from "./Item-Master/ManageItem";
import ManagePurchase from "./Purchase-Order/ManagePurchase";
import GlobalStyle from "./GlobalStyled";
import ItemPrice from "./Item-Master/ItemPrice";
import { Toaster } from "react-hot-toast";
import ManageCPO from "./Customer-Order/ManageCPO"


function App() {
  return (
    <>
      <BrowserRouter>
        <GlobalStyle />
        <Toaster/>
        <Routes> 
          <Route path="/" exact element={<Home/>} />
          <Route path="signin" element={<Signin />} />
          <Route path="forgot" element={<ForgotPassword />} />  
          <Route exact element={<ApplayOut />}>
          <Route index path="dashboard" element={<Dashboard />} />
          <Route path="customer" element={<ManageCustomer />} />
          <Route path="suppliers" element={<ManageSuppliers />} />
          <Route path="items" element={<ManageItem />} />
          <Route path="items/itemsprice" element={<ItemPrice />} />
          <Route path="sales" element={<ManageCPO/>} />          
          <Route path="purchaseorder" element={<ManagePurchase />} />
        </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;











// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import "./App.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Signin from "./Login-Form/Signin";
// import Home from "./pages/Home";
// import ForgotPassword from "./Login-Form/ForgotPassword";
// import Dashboard from "./Dashboard/Dashboard";
// import ManageCustomer from "./Customers/ManageCustomer";
// import ManageSuppliers from "./Suppliers/ManageSuppliers";
// import ManageItem from "./Item-Master/ManageItem";
// import ManagePurchase from "./Purchase-Order/ManagePurchase";
// import AddCustomer from "./AddCustomer";
// import GlobalStyle from "./GlobalStyled";
// import ItemPrice from "./Item-Master/ItemPrice";
// import { Toaster } from "react-hot-toast";
// import ManageCPO from "./Customer-Order/ManageCPO";
// import ProtectedRoute from "./SecurePro/ProtectedRoute";
// import AppLayout from "./pages/AppLayOut"

// function App() {
//   return (
//     <>
//       <BrowserRouter>
//         <GlobalStyle />
//         <Toaster />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/signin" element={<Signin />} />
//           <Route path="/forgot" element={<ForgotPassword />} />

//           <Route element={<ProtectedRoute />}>
//             <Route element={<AppLayout />}>
//               <Route path="/dashboard" element={<Dashboard />} />
//               <Route path="/customer" element={<ManageCustomer />} />
//               <Route path="/suppliers" element={<ManageSuppliers />} />
//               <Route path="/items" element={<ManageItem />} />
//               <Route path="/items/itemsprice" element={<ItemPrice />} />
//               <Route path="/sales" element={<ManageCPO />} />
//               <Route path="/purchaseorder" element={<ManagePurchase />} />
//               <Route path="/addcustomer" element={<AddCustomer />} />
//             </Route>
//           </Route>
//         </Routes>
//       </BrowserRouter>
//     </>
//   );
// }

// export default App;

