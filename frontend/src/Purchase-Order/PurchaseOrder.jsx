// import React, { useEffect, useState } from "react";
// import AddPurchaseItem from "./AddPurchaseItem";
// import AddOrEditPItem from "./AddOrEditPItem";
// import axios from "axios";
// import toast from "react-hot-toast";
// import "../StyleCSS/Customer.css";
// import "../StyleCSS/SalesPurchase.css";

// const PurchaseOrder = ({
//   purchaseEditing,
//   isEditing,
//   customerId,
//   customerpO,
//   setVisible,
//   onSuccess,
//   setIsEditing,
//   setPurchaseE
// }) => {
//   const [customers, setCustomers] = useState([]);
//   const [filteredCustomers, setFilteredCustomers] = useState([]); 
//   const [customer, setCustomer] = useState("");
//   const [customerPOs, setCustomerPOs] = useState([]);
//   const [customerpo, setCustomerpo] = useState("");
//   const [purchase, setPurchase] = useState("");
//   const [date, setDate] = useState("");
//   const [status, setStatus] = useState("");
//   const [showAddOrEdit, setShowAddOrEdit] = useState(false);
//   const [editpo, setEditpo] = useState(null);
//   const [purchaseItems, setPurchaseItems] = useState([]);
//   const [filteredCPOs, setFilteredCPOs] = useState([]);
//   const [associatedCPOs, setAssociatedCPOs] = useState([]);

//   useEffect(() => {
//     if (purchaseEditing && purchaseEditing._id) {
//       const customerData = customers.find(
//         (c) => c._id === purchaseEditing.customer._id
//       );
//       setCustomer(customerData ? customerData._id : "");
//       setCustomerpo(purchaseEditing.customerpo || customerpO);
//       setPurchase(purchaseEditing.purchase);
//       setDate(
//         purchaseEditing.date
//           ? new Date(purchaseEditing.date).toISOString().split("T")[0]
//           : ""
//       );
//       setStatus(purchaseEditing.status);
//       setPurchaseItems(purchaseEditing.items || []);
//       const filtered = customerPOs.filter(
//         (po) => po.customern._id === (customerData ? customerData._id : "")
//       );
//       setFilteredCPOs(filtered);
      
//       const associated = customerPOs.filter(po => po.customern._id === (customerData ? customerData._id : ""));
//       setAssociatedCPOs(associated);
      
//       const associatedCustomerIds = associated.map(po => po.customern._id);
//       setFilteredCustomers(customers.filter(c => associatedCustomerIds.includes(c._id)));
//     } else {
//       setCustomer("");
//       setCustomerpo("");
//       setDate("");
//       setPurchase("");
//       setStatus("");
//       setPurchaseItems([]);
//       setAssociatedCPOs([]);
//       setFilteredCustomers(customers); // Reset to all customers
//     }
//   }, [purchaseEditing, customers, customerpO, customerPOs]);

//   const handleAddPurchaseItem = (newItem) => {
//     setPurchaseItems((prevItems) => [
//       ...prevItems,
//       { ...newItem, purchaseOrderId: purchaseEditing._id },
//     ]);
//   };

//   useEffect(() => {
//     loadCpo();
//   }, []);

//   const loadCpo = async () => {
//     try {
//       const { data } = await axios.get(
//         "http://localhost:8000/api/allCustomerPos"
//       );
//       console.log("CPO Customers:", data);  

//       const cpoCustomers = data.customers.map(po => po.customern);
//       const uniqueCustomers = Array.from(new Set(cpoCustomers.map(c => c._id)))
//         .map(id => cpoCustomers.find(c => c._id === id));
  
//       setCustomers(uniqueCustomers); 
//       setCustomerPOs(data.customers || []);
  
//       const associatedCustomerIds = data.customers.map(po => po.customern._id);
//       setFilteredCustomers(uniqueCustomers.filter(c => associatedCustomerIds.includes(c._id)));
//     } catch (err) {
//       console.error("Error fetching CPOs:", err);
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       if (purchaseEditing && purchaseEditing._id) {
//         const { data } = await axios.put(
//           `http://localhost:8000/api/purchases/${purchaseEditing._id}`,
//           {
//             customer,
//             customerpo,
//             date,
//             status,
//             purchase,
//             items: purchaseItems,
//           },
//           { headers: { "Content-Type": "multipart/form-data" } }
//         );
//         if (data.error) {
//           console.log(data.error);
//         } else {
//           toast.success("Purchase updated successfully!");
//           setVisible(false);
//           onSuccess();
//         }
//       } else {
//         const { data } = await axios.post(
//           "http://localhost:8000/api/purchase",
//           {
//             customer,
//             customerpo,
//             date,
//             status,
//             purchase,
//             items: purchaseItems,
//           },
//           { headers: { "Content-Type": "multipart/form-data" } }
//         );
//         if (data.error) {
//           console.log(data.error);
//         } else {
//           toast.success("Purchase created successfully!");
//           setVisible(false);
//           onSuccess();
//         }
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleCancel = () => {
//     setCustomer("");
//     setCustomerpo("");
//     setDate("");
//     setPurchase("");
//     setStatus("");
//     setPurchaseItems([]);
//     setVisible(false);
//     setPurchaseE(null);
//     setIsEditing(false);
//   };

//   const handleCustomerChange = (e) => {
//     const selectedCustomerId = e.target.value;
//     setCustomer(selectedCustomerId);
    
//     const filtered = customerPOs.filter(
//       (po) => po.customern._id === selectedCustomerId && po.status === "Active" 
//     );
//     setFilteredCPOs(filtered);
    
//     const associatedCPOs = customerPOs.filter(po => po.customern._id === selectedCustomerId);
//     console.log("Associated CPOs for the selected customer:", associatedCPOs);
    
//     const associatedCustomerIds = associatedCPOs.map(po => po.customern._id);
//     setFilteredCustomers(customers.filter(c => associatedCustomerIds.includes(c._id)));
//   };

//   return (
//     <>
//       {showAddOrEdit ? (
//         <AddOrEditPItem
//           editpo={editpo}
//           setShowAddOrEdit={setShowAddOrEdit}
//           customerId={customerId}
//           purchaseEditing={purchaseEditing}
//           onSuccess={onSuccess}
//           customerPOs={customerPOs}
//           associatedCPOs={associatedCPOs} 
//         />
//       ) : (
//         <form onSubmit={handleSubmit} className="Purchaseorder-form">
//           <div className="HEDING">
//             <h1 className="salesorder-form-heading">
//               {isEditing ? "Edit Purchase Order" : "Add Purchase Order"}
//             </h1>
//           </div>
//           <div>
//             <div className="ButtonContainer">
//               <div className="labelinputfield">
//                 <label htmlFor="customer" className="lblCPO">
//                   Customer:<span className="required-field">*</span>
//                 </label>
//                 <select
//                   id="customer"
//                   value={customer}
//                   onChange={handleCustomerChange}
//                   className="customer-salesorder_input scrollable-dropdown"
//                 >
//                   <option value="" disabled>
//                     Select Customer
//                   </option>
//                   {filteredCustomers.map((customer) => ( 
//                     <option key={customer._id} value={customer._id}>
//                       {customer.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="labelinputfield">
//                 <label htmlFor="date" className="lblCPO">
//                   Date:<span className="required-field">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   id="date"
//                   value={date}
//                   onChange={(event) => setDate(event.target.value)}
//                   className="customer-salesorder_input1"
//                 />
//               </div>
//             </div>
//             <div className="ButtonContainer">
//               <div className="labelinputfield">
//                 <label htmlFor="customerpo" className="lblCPO">
//                   CPO:<span className="required-field">*</span>
//                 </label>
//                 <select
//                   id="customerpo"
//                   value={customerpo}
//                   onChange={(e) => setCustomerpo(e.target.value)}
//                   className="customer-salesorder_input scrollable-dropdown"
//                 >
//                   <option value="" disabled>
//                     Select Customer CPO
//                   </option>
//                   {filteredCPOs.map((cpo) => (
//                     <option key={cpo._id} value={cpo.customerpo}>
//                       {cpo.customerpo}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="labelinputfield">
//                 <label htmlFor="status" className="invoice-salesorder_label">
//                   Status:<span className="required-field">*</span>
//                 </label>
//                 <select
//                   id="status"
//                   value={status}
//                   onChange={(event) => setStatus(event.target.value)}
//                   className="customer-salesorder_input1"
//                 >
//                   <option value="" disabled>Select Status</option>
//                   <option value="Active">Active</option>
//                   <option value="Inactive">Inactive</option>
//                 </select>
//               </div>
//             </div>
//             <div className="ButtonContainer">
//               <div className="labelinputfield">
//                 <label htmlFor="purchase" className="invoice-salesorder_label">
//                   Purchase No.:<span className="required-field">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="purchase"
//                   value={purchase}
//                   onChange={(event) => setPurchase(event.target.value)}
//                   className="customer-salesorder_input1"
//                 />
//               </div>
//               <div className="labelinputfield">
//                 {purchaseEditing ? (
//                   <button
//                     type="button"
//                     onClick={() => setShowAddOrEdit(true)}
//                     className="Add-P-Item"
//                   >
//                     Add Purchase Item
//                   </button>
//                 ) : (
//                   ""
//                 )}
//               </div>
//             </div>
//           </div>

//           <AddPurchaseItem
//             customerId={customer}
//             filteredCPOs={filteredCPOs}
//             setShowAddOrEdit={setShowAddOrEdit}
//             setEditpo={setEditpo}
//             isEditing={isEditing}
//             purchaseEditing={purchaseEditing}
//             onSuccess={onSuccess}
//           />

//           <div className="ButtonContainer">
//             <button type="submit" className="StyledButton1">
//               {isEditing ? "Update" : "Save"}
//             </button>
//             <button type="button" className="StyledButton11" onClick={handleCancel}>
//               Cancel
//             </button>
//           </div>
//         </form>
//       )}
//     </>
//   );
// };

// export default PurchaseOrder;



import React, { useEffect, useState } from "react";
import AddPurchaseItem from "./AddPurchaseItem";
import AddOrEditPItem from "./AddOrEditPItem";
import axios from "axios";
import toast from "react-hot-toast";
import "../StyleCSS/Customer.css";
import "../StyleCSS/SalesPurchase.css";

const PurchaseOrder = ({
  purchaseEditing,
  isEditing,
  customerId,
  customerpO,
  setVisible,
  onSuccess,
  setIsEditing,
  setPurchaseE
}) => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]); 
  const [customer, setCustomer] = useState("");
  const [customerPOs, setCustomerPOs] = useState([]);
  const [customerpo, setCustomerpo] = useState("");
  const [purchase, setPurchase] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [showAddOrEdit, setShowAddOrEdit] = useState(false);
  const [editpo, setEditpo] = useState(null);
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [filteredCPOs, setFilteredCPOs] = useState([]);
  const [associatedCPOs, setAssociatedCPOs] = useState([]);

  useEffect(() => {
    if (purchaseEditing && purchaseEditing._id) {
      const customerData = customers.find(
        (c) => c._id === purchaseEditing.customer._id
      );
      setCustomer(customerData ? customerData._id : "");
      setCustomerpo(purchaseEditing.customerpo || customerpO);
      setPurchase(purchaseEditing.purchase);
      setDate(
        purchaseEditing.date
          ? new Date(purchaseEditing.date).toISOString().split("T")[0]
          : ""
      );
      setStatus(purchaseEditing.status);
      setPurchaseItems(purchaseEditing.items || []);
      const filtered = customerPOs.filter(
        (po) => po.customern._id === (customerData ? customerData._id : "")
      );
      setFilteredCPOs(filtered);
      
      const associated = customerPOs.filter(po => po.customern._id === (customerData ? customerData._id : ""));
      setAssociatedCPOs(associated);
      
      const associatedCustomerIds = associated.map(po => po.customern._id);
      setFilteredCustomers(customers.filter(c => associatedCustomerIds.includes(c._id) && c.status === "Active"));
    } else {
      setCustomer("");
      setCustomerpo("");
      setDate("");
      setPurchase("");
      setStatus("");
      setPurchaseItems([]);
      setAssociatedCPOs([]);
      setFilteredCustomers(customers); // Reset to all customers
    }
  }, [purchaseEditing, customers, customerpO, customerPOs]);

  const handleAddPurchaseItem = (newItem) => {
    setPurchaseItems((prevItems) => [
      ...prevItems,
      { ...newItem, purchaseOrderId: purchaseEditing._id },
    ]);
  };

  useEffect(() => {
    loadCpo();
  }, []);

  const loadCpo = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/allCustomerPos"
      );
      console.log("CPO Customers:", data);  

      const cpoCustomers = data.customers.map(po => po.customern);
      const uniqueCustomers = Array.from(new Set(cpoCustomers.map(c => c._id)))
        .map(id => cpoCustomers.find(c => c._id === id));

      const activeCustomers = uniqueCustomers.filter(customer => customer.status === "Active");

      setCustomers(activeCustomers); 
      setCustomerPOs(data.customers || []);

      const associatedCustomerIds = data.customers.map(po => po.customern._id);
      setFilteredCustomers(activeCustomers.filter(c => associatedCustomerIds.includes(c._id)));
    } catch (err) {
      console.error("Error fetching CPOs:", err);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (purchaseEditing && purchaseEditing._id) {
        const { data } = await axios.put(
          `http://localhost:8000/api/purchases/${purchaseEditing._id}`,
          {
            customer,
            customerpo,
            date,
            status,
            purchase,
            items: purchaseItems,
          },
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (data.error) {
          console.log(data.error);
        } else {
          toast.success("Purchase updated successfully!");
          setVisible(false);
          onSuccess();
        }
      } else {
        const { data } = await axios.post(
          "http://localhost:8000/api/purchase",
          {
            customer,
            customerpo,
            date,
            status,
            purchase,
            items: purchaseItems,
          },
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (data.error) {
          console.log(data.error);
        } else {
          toast.success("Purchase created successfully!");
          setVisible(false);
          onSuccess();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = () => {
    setCustomer("");
    setCustomerpo("");
    setDate("");
    setPurchase("");
    setStatus("");
    setPurchaseItems([]);
    setVisible(false);
    setPurchaseE(null);
    setIsEditing(false);
  };

  const handleCustomerChange = (e) => {
    const selectedCustomerId = e.target.value;
    setCustomer(selectedCustomerId);
    
    const filtered = customerPOs.filter(
      (po) => po.customern._id === selectedCustomerId && po.status === "Active" 
    );
    setFilteredCPOs(filtered);
    
    const associatedCPOs = customerPOs.filter(po => po.customern._id === selectedCustomerId);
    console.log("Associated CPOs for the selected customer:", associatedCPOs);
    
    const associatedCustomerIds = associatedCPOs.map(po => po.customern._id);
    setFilteredCustomers(customers.filter(c => associatedCustomerIds.includes(c._id) && c.status === "Active"));
  };

  return (
    <>
      {showAddOrEdit ? (
        <AddOrEditPItem
          editpo={editpo}
          setShowAddOrEdit={setShowAddOrEdit}
          customerId={customerId}
          purchaseEditing={purchaseEditing}
          onSuccess={onSuccess}
          customerPOs={customerPOs}
          associatedCPOs={associatedCPOs} 
        />
      ) : (
        <form onSubmit={handleSubmit} className="Purchaseorder-form">
          <div className="HEDING">
            <h1 className="salesorder-form-heading">
              {isEditing ? "Edit Purchase Order" : "Add Purchase Order"}
            </h1>
          </div>
          <div>
            <div className="ButtonContainer">
              <div className="labelinputfield">
                <label htmlFor="customer" className="lblCPO">
                  Customer:<span className="required-field">*</span>
                </label>
                <select
                  id="customer"
                  value={customer}
                  onChange={handleCustomerChange}
                  className="customer-salesorder_input scrollable-dropdown"
                >
                  <option value="" disabled>
                    Select Customer
                  </option>
                  {filteredCustomers.map((customer) => ( 
                    <option key={customer._id} value={customer._id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="labelinputfield">
                <label htmlFor="date" className="lblCPO">
                  Date:<span className="required-field">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="customer-salesorder_input1"
                />
              </div>
            </div>
            <div className="ButtonContainer">
              <div className="labelinputfield">
                <label htmlFor="customerpo" className="lblCPO">
                  CPO:<span className="required-field">*</span>
                </label>
                <select
                  id="customerpo"
                  value={customerpo}
                  onChange={(e) => setCustomerpo(e.target.value)}
                  className="customer-salesorder_input scrollable-dropdown"
                >
                  <option value="" disabled>
                    Select Customer CPO
                  </option>
                  {filteredCPOs.map((cpo) => (
                    <option key={cpo._id} value={cpo.customerpo}>
                      {cpo.customerpo}
                    </option>
                  ))}
                </select>
              </div>
              <div className="labelinputfield">
                <label htmlFor="status" className="invoice-salesorder_label">
                  Status:<span className="required-field">*</span>
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="customer-salesorder_input1"
                >
                  <option value="" disabled>Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="ButtonContainer">
              <div className="labelinputfield">
                <label htmlFor="purchase" className="invoice-salesorder_label">
                  Purchase No.:<span className="required-field">*</span>
                </label>
                <input
                  type="text"
                  id="purchase"
                  value={purchase}
                  onChange={(event) => setPurchase(event.target.value)}
                  className="customer-salesorder_input1"
                />
              </div>
              <div className="labelinputfield">
                {purchaseEditing ? (
                  <button
                    type="button"
                    onClick={() => setShowAddOrEdit(true)}
                    className="Add-P-Item"
                  >
                    Add Purchase Item
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          <AddPurchaseItem
            customerId={customer}
            filteredCPOs={filteredCPOs}
            setShowAddOrEdit={setShowAddOrEdit}
            setEditpo={setEditpo}
            isEditing={isEditing}
            purchaseEditing={purchaseEditing}
            onSuccess={onSuccess}
          />

          <div className="ButtonContainer">
            <button type="submit" className="StyledButton1">
              {isEditing ? "Update" : "Save"}
            </button>
            <button type="button" className="StyledButton11" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default PurchaseOrder;