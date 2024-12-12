import React, { useEffect, useState } from "react";
import AddPurchaseItem from "./AddPurchaseItem";
import AddOrEditPItem from "./AddOrEditPItem";
import axios from "axios";
import toast from "react-hot-toast";
import "../StyleCSS/Customer.css";
import "../StyleCSS/SalesPurchase.css";

const PurchaseOrder = (
  { 
    purchaseEditing, 
    isEditing, 
    customerId, 
    customerpO,
    // updatePurchaseTotal 
  }) => {
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState("");
  const [customerPOs, setCustomerPOs] = useState([]);
  const [customerpo, setCustomerpo] = useState("");
  const [purchase, setPurchase] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [showAddOrEdit, setShowAddOrEdit] = useState(false);
  const [editpo, setEditpo] = useState(null);
  const [customerList, setCustomerList] = useState([]);
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [filteredCPOs, setFilteredCPOs] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [totalPurchasePrice, setTotalPurchasePrice] = useState(0);
  

console.log("purchaseEditing",purchaseEditing)
  useEffect(() => {
    if (purchaseEditing && purchaseEditing._id) {
      const customerData = customers.find(c => c._id === purchaseEditing.customer._id);
      setCustomer(customerData ? customerData._id : ""); 
      setCustomerpo(purchaseEditing.customerpo || customerpO); 
      setPurchase(purchaseEditing.purchase); 
      setDate(purchaseEditing.date ? new Date(purchaseEditing.date).toISOString().split('T')[0] : ""); // Set the date
      setStatus(purchaseEditing.status); 
      setPurchaseItems(purchaseEditing.items || []); 
      const filtered = customerPOs.filter(po => po.customern._id === (customerData ? customerData._id : ""));
      setFilteredCPOs(filtered);
    } else {
      setCustomer("");
      setCustomerpo("");
      setDate(""); 
      setPurchase("");
      setStatus("");
      setPurchaseItems([]);
    }
  }, [purchaseEditing, customers, customerpO]);


  const handleAddPurchaseItem = (newItem) => {
    setPurchaseItems((prevItems) => [
      ...prevItems,
      { ...newItem, purchaseOrderId: purchaseEditing._id },
    ]);
  };

  useEffect(() => {
    loadCustomers();
    loadCpo();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const handleDateChange = (event) => {
    const isoDate = event.target.value;
    setDate(formatDate(isoDate));
  };

  const loadCustomers = async () => {
    try {
      let allCustomers = [];
      let currentPage = 1;
      let hasMore = true;
      while (hasMore) {
        const { data } = await axios.get(
          `http://localhost:8000/api/customers?page=${currentPage}&limit=10`
        );
        const customers = data.customers;
        allCustomers = [...allCustomers, ...customers];
        if (customers.length < 10) {
          hasMore = false;
        } else {
          currentPage++;
        }
      }
      setCustomers(allCustomers);
    } catch (err) {
      console.log(err);
      setCustomers([]);
    }
  };
  const loadCpo = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/allCustomerPos"
      );
      setCustomerPOs(data.customers || []);
    } catch (err) {
      console.error("Error fetching CPOs:", err);
    }
  };

  useEffect(() => {
    setCustomerList(customers);
  }, [customers]);

 
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
        // await updatePurchaseTotal(purchaseEditing._id);
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
        // await updatePurchaseTotal(data._id);
      }
    }
  } catch (err) {
    console.log(err);
  }
};
  

  const handleAddItemClick = () => {
    setShowAddOrEdit(true);
  };

  const handleCustomerChange = (e) => {
    const selectedCustomerId = e.target.value;
    setCustomer(selectedCustomerId);
  
    const filtered = customerPOs.filter(
      (po) => po.customern._id === selectedCustomerId
    );
    setFilteredCPOs(filtered);
  };

  return (
    <>
      {showAddOrEdit ? (
        <AddOrEditPItem
          editpo={editpo}
          setShowAddOrEdit={setShowAddOrEdit}
          customerId={customerId}
          purchaseEditing={purchaseEditing} 
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
                  Customer:
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
                  {customerPOs.map((customerPO) => (
                    <option
                      key={customerPO._id}
                      value={customerPO.customern._id}
                    >
                      {customerPO.customern.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="labelinputfield">
                <label htmlFor="date" className="lblCPO">
                  Date:
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
                  CPO:
                </label>

                <select
                  id="customer"
                  value={customerpo}
                  onChange={(e) => setCustomerpo(e.target.value)}
                  className="customer-salesorder_input scrollable-dropdown"
                >
                  <option value="" disabled>
                    Select CustomerCpo
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
                  Status:
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="customer-salesorder_input1"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="ButtonContainer">
              <div className="labelinputfield">
                <label htmlFor="purchase" className="invoice-salesorder_label">
                  Purchase No. :
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
                <button
                  type="button"
                  onClick={handleAddItemClick}
                  className="Add-P-Item"
                >
                  Add Purchase Item
                </button>
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
            setTotalPurchasePrice={setTotalPurchasePrice}
            availableQty={selectedItem ? selectedItem.stock : 0}
          />


          <div className="ButtonContainer">
            <button type="submit" className="StyledButton1">
              Save
            </button>
            <button type="button" className="StyledButton11">
              Clear
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default PurchaseOrder;
