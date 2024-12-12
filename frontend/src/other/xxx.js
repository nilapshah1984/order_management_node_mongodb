// import React, { useEffect, useState } from "react";
// import "./salesorder.css";
// import AddSalesItem from "./AddSalesItem";
// import AddEditPo from "./AddEditPo";
// import axios from "axios";
// import toast from "react-hot-toast";
// import "../StyleCSS/Customer.css";
// import "../StyleCSS/SalesPurchase.css";

// const SalesOrder = ({ editingCpo, refreshData: parentRefreshData   }) => {
//   const [customern, setCustomer] = useState("");
//   const [customerpo, setCustomerpo] = useState("");
//   const [date, setDate] = useState("");
//   const [status, setStatus] = useState("");
//   const [addClick, setAddClick] = useState(false);
//   const [customers, setCustomers] = useState([]);
//   const [edits, setEditing] = useState(null);
//   const [refresh, setRefresh] = useState(false);


//   useEffect(() => {
//     if (editingCpo && editingCpo._id) {
//       setCustomer(editingCpo.customern?.name);
//       setCustomerpo(editingCpo.customerpo);
//       setDate(editingCpo.date);
//       setStatus(editingCpo.status);
//     } else {
//       setCustomer("");
//       setCustomerpo("");
//       setDate("");
//       setStatus("");
//     }
//   }, [editingCpo]);

//   const loadCustomer = async () => {
//     try {
//       const { data } = await axios.get("http://localhost:8000/api/customers");
//       console.log("Fetched Customers: ", data);
//       if (Array.isArray(data.customers)) {
//         setCustomers(data.customers);  
//         console.log("Set Customers: ", data.customers);
//       } else {
//         setCustomers([]);
//       }
//     } catch (err) {
//       console.log(err);
//       setCustomers([]);
//     }
//   };

//   const refreshData = () => {
//     setAddClick(!false); 
//   };


//   useEffect(() => {
//     loadCustomer();
//   }, [refresh]);




//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       let response;
//       if (editingCpo && editingCpo._id) {
//         response = await axios.put(
//           `http://localhost:8000/api/customerpos/${editingCpo._id}`,
//           { customern, customerpo, date, status }
//         );
//       } else {
//         response = await axios.post("http://localhost:8000/api/customerpo", {
//           customern,
//           customerpo,
//           date,
//           status,
//         });
//       }
  
//       console.log("Response:", response.data);
  
//       if (response.data?.error) {
//         toast.error(response.data.error);
//       } else {
//         toast.success(`"${response.data.customern}" successfully saved!`);
//         setRefresh(); 
//       }
//     } catch (err) {
//       console.log("Error during save:", err);
//       toast.error("Error saving data.");
//     }
//     refreshData();
//   };
  


//   useEffect(() => {
//     loadCustomer();
//   }, []);


//   useEffect(() => {
//     console.log("Fetched Customerss: ", customers);
//   }, [customers]);
  

//   const handleAdd = () => {
//     setAddClick(true);
//   };



  

//   return (
//     <>
//       {addClick ? (
//         <AddEditPo refreshData={refreshData} edits={edits} />
//       ) : (
//         <>
//           <form onSubmit={handleSubmit}>
//             <div className="HEDING">
//               <h3 className="form-headings">Add / Edit Customer PO</h3>
//             </div>
//             <div>
//               <div className="ButtonContainer">
//                 <div className="labelinputfield">
//                   <label htmlFor="customern" className="lblCPO">
//                     Customer:
//                   </label>

//                   <select
//                     name="customern"
//                     value={customern}
//                     onChange={(e) => setCustomer(e.target.value)}
//                     className="customer-salesorder_input"
//                   >
//                     <option value="">Select Customer</option>
//                     {customers.map((customer) => (
//                       <option key={customer._id} value={customer._id}>
//                         {customer.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="labelinputfield">
//                   <label htmlFor="date" className="lblCPO">
//                     Date:
//                   </label>
//                   <input
//                     type="date"
//                     id="date"
//                     value={date}
//                     onChange={(event) => setDate(event.target.value)}
//                     className="customer-salesorder_input1"
//                   />
//                 </div>
//               </div>
//               <div className="ButtonContainer">
//                 <div className="labelinputfield">
//                   <label htmlFor="customerpo" className="lblCPO">
//                     Customer PO
//                   </label>
//                   <input
//                     type="text"
//                     id="customerpo"
//                     value={customerpo}
//                     onChange={(e) => setCustomerpo(e.target.value)}
//                     className="customer-salesorder_input1"
//                   />
//                 </div>
//                 <div className="labelinputfield">
//                   <label htmlFor="status" className="lblCPO">
//                     Status:
//                   </label>
//                   <select
//                     id="status"
//                     value={status}
//                     onChange={(event) => setStatus(event.target.value)}
//                     className="customer-salesorder_input1"
//                   >
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//             <button
//               type="button"
//               onClick={handleAdd}
//               className="StyledBtn"
//               htmlFor="Add-Item"
//             >
//               Add Item
//             </button>
//           </form>
//           <AddSalesItem setEditing={setEditing} setAddClick={setAddClick} refresh={refreshData} />
//           <div>
//             <h2>Total : </h2>
//           </div>
//           <div className="ButtonContainer">
//             <button type="submit" className="StyledButton1">
//               Save
//             </button>
//             <button type="button" className="StyledButton11">
//               Clear
//             </button>
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default SalesOrder;