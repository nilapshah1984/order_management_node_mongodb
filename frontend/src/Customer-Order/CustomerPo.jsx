import React, { useEffect, useState } from "react";
import "./salesorder.css";
import axios from "axios";
import toast from "react-hot-toast";
import "../StyleCSS/Customer.css";
import "../StyleCSS/SalesPurchase.css";
import SalesItem from "../Customer-Order/SalesItemsTable";
import AddEditPo from "./AddEditPo";

const SalesOrder = ({
  editingCpo,
  refreshData,
  setVisible,
  refreshCustomers,
  currentPage,
  loadCpo,
}) => {
  const [customern, setCustomer] = useState("");
  const [customerpo, setCustomerpo] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [customers, setCustomers] = useState([]);
  const [currentCpoId, setCurrentCpoId] = useState("");
  const [addClick, setAddClick] = useState(false);
  const [salesItems, setSalesItems] = useState([]);
  const [itemToEdit, setItemToEdit] = useState(null);


  useEffect(() => {
    if (editingCpo) {
      setCustomer(editingCpo.customern?._id || "");
      setCustomerpo(editingCpo.customerpo || "");
      setDate(
        editingCpo.date
          ? new Date(editingCpo.date).toISOString().split("T")[0]
          : ""
      );
      setStatus(editingCpo.status || "");
      setCurrentCpoId(editingCpo._id);
      loadSalesItemsForCPO(editingCpo._id);
    } else {
      resetForm();
    }
  }, [editingCpo, salesItems]); 

  const resetForm = () => {
    setCustomer("");
    setCustomerpo("");
    setDate("");
    setStatus("");
    setCurrentCpoId("");
  };

  const loadCustomer = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/customers");
      if (Array.isArray(data.customers)) {
        const activeCustomers = data.customers.filter((customer) => customer.status === "Active");
        setCustomers(activeCustomers);
      } else {
        setCustomers([]);
      }
    } catch (err) {
      console.log(err);
      setCustomers([]);
    }
  };
  

  useEffect(() => {
    loadCustomer();
  }, []);

  const loadSalesItemsForCPO = async (cpoId) => {
    if (cpoId) {
      const { data } = await axios.get(
        `http://localhost:8000/api/itempos?customerPo=${cpoId}`
      );
      setSalesItems(data);
    }
  };

  const handlePost = async () => {
    try {
      const formData = new FormData();
      formData.append("customern", customern);
      formData.append("customerpo", customerpo);
      formData.append("date", date);
      formData.append("status", status);

      await axios.post("http://localhost:8000/api/customerpo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Customer PO saved successfully");
      if (refreshCustomers) refreshCustomers();
      refreshData();
      setVisible(false);
      resetForm();
    } catch (err) {
      handleError(err);
    }
  };

  const handlePut = async () => {
    try {
      const formData = new FormData();
      formData.append("customern", customern);
      formData.append("customerpo", customerpo);
      formData.append("date", date);
      formData.append("status", status);

      await axios.put(
        `http://localhost:8000/api/customerpos/${editingCpo._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Customer PO updated successfully");
      refreshData();
      setVisible(false);
      resetForm();
    } catch (err) {
      handleError(err);
    }
  };

  const handleEditSalesItem = (item) => {
    console.log("Editing Sales Item:", item);
    setItemToEdit(item);
    setCustomer(item.customern);
    setCustomerpo(item.customerpo);
    setDate(item.date);
    setStatus(item.status);
    setCurrentCpoId(item._id);
    setAddClick(true);
  };

  const handleError = (err) => {
    if (err.response) {
      console.error("Error:", err.response.data);
      toast.error(
        `Failed to update customer PO: ${
          err.response.data.error || "Unknown error"
        }`
      );
    } else {
      console.error("Error:", err.message);
      toast.error("Failed to save customer PO: " + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingCpo && editingCpo._id) {
      await handlePut();
      await loadSalesItemsForCPO(currentCpoId);
    } else {
      await handlePost();
      await loadSalesItemsForCPO(currentCpoId);
    }
  };

  const closeAddForm = () => {
    setAddClick(false);
    setItemToEdit(null);
  };

  return (
    <>
      {addClick ? (
        <AddEditPo
          refreshData={loadSalesItemsForCPO}
          currentCpoId={currentCpoId}
          closeAddForm={closeAddForm}
          itemToEdit={itemToEdit}
          loadCPO={loadCpo}
          currentPage={currentPage}
        />
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="HEDING">
            <h3 className="form-headings">
              {editingCpo ? "Edit" : "Add"} Customer PO
            </h3>
          </div>
          <div>
            <div className="ButtonContainer">
              <div className="labelinputfield">
                <label htmlFor="customern" className="lblCPO">
                  Customer: <span className="required-field">*</span>
                </label>
                <select
                  name="customern"
                  value={customern}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="customer-salesorder_input"
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer) => (
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
                  Customer PO:<span className="required-field">*</span>
                </label>
                <input
                  type="text"
                  id="customerpo"
                  value={customerpo}
                  onChange={(e) => setCustomerpo(e.target.value)}
                  className="customer-salesorder_input1"
                />
              </div>
              <div className="labelinputfield">
                <label htmlFor="status" className="lblCPO">
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
          </div>
          {editingCpo ? (
            <button
              type="button"
              onClick={() => setAddClick(true)}
              className="StyledBtn"
            >
              Add SalesItem
            </button>
          ) : (
            ""
          )}
          <h1>{editingCpo ? "Sales Item Table" : ""}</h1>
          {editingCpo ? (
            <SalesItem
              currentCpoId={currentCpoId}
              salesItems={salesItems}
              onEdit={handleEditSalesItem}
            />
          ) : (
            ""
          )}
          <div className="ButtonContainer">
            <button type="submit" className="StyledButton1">
              {editingCpo ? "Update" : "Save"}
            </button>
            <button
              type="button"
              className="StyledButton11"
              onClick={() => {
                setVisible(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default SalesOrder;
