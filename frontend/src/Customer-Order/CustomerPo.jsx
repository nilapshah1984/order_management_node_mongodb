import React, { useEffect, useState } from "react";
import "./salesorder.css";
import AddEditPo from "./AddEditPo";
import axios from "axios";
import toast from "react-hot-toast";
import "../StyleCSS/Customer.css";
import "../StyleCSS/SalesPurchase.css";
import styled from "styled-components";
import { BiEdit, BiTrash } from "react-icons/bi";
import { Tooltip } from "antd";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const HeadTr = styled(Tr)`
  background-color: #e2e3e7;
  color: black;
`;

const SalesOrder = ({
  editingCpo,
  refreshData,
  setVisible,
  currentCpoIdProp,
  refreshCustomers,
  loadSalesItemsForCPO,
  onSave,
}) => {
  const [customern, setCustomer] = useState("");
  const [customerpo, setCustomerpo] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [addClick, setAddClick] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [edits, setEditing] = useState(null);
  const [salesItems, setSalesItems] = useState([]);

  const [totalCustomerPOLocal, setTotalCustomerPOLocal] = useState(0);

  const [currentCpoId, setCurrentCpoId] = useState(
    editingCpo ? editingCpo._id : ""
  );

  useEffect(() => {
    if (editingCpo && editingCpo._id) {
      setCustomer(editingCpo.customern?._id || "");
      setCustomerpo(editingCpo.customerpo || "");
      setDate(
        editingCpo.date
          ? new Date(editingCpo.date).toISOString().split("T")[0]
          : ""
      );
      setStatus(editingCpo.status || "");
      loadSalesItemsForCPO(editingCpo._id);
    } else {
      setCustomer("");
      setCustomerpo("");
      setDate("");
      setStatus("");
      setSalesItems([]);
    }
  }, [editingCpo]);

  const loadCustomer = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/customers");
      if (Array.isArray(data.customers)) {
        setCustomers(data.customers);
      } else {
        setCustomers([]);
      }
    } catch (err) {
      console.log(err);
      setCustomers([]);
    }
  };

  const loadSalesItems = async (cpoId) => {
    if (!cpoId) {
      console.error("CPO ID is undefined");
      return;
    }
    try {
      console.log("CPOID", cpoId);
      const { data } = await axios.get(
        `http://localhost:8000/api/itempos?customerPo=${cpoId}`
      );
      setSalesItems(data);
      calculateTotalPrice(data);
    } catch (err) {
      console.error("Error loading sales items for CPO:", err);
      toast.error("Failed to load Customer PO sales items");
    }
  };

  useEffect(() => {
    if (editingCpo && editingCpo._id) {
      loadSalesItems(editingCpo._id);
    }
  }, [editingCpo]);

  useEffect(() => {
    loadCustomer();
    loadSalesItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("customern", customern);
      formData.append("customerpo", customerpo);
      formData.append("date", date);
      formData.append("status", status);

      salesItems.forEach((item) => {
        if (item && item.item) {
          formData.append("salesItems", item.item._id);
        } else {
          console.error("Invalid item in salesItems:", item);
        }
      });

      let response;
      if (editingCpo && editingCpo._id) {
        response = await axios.put(
          `http://localhost:8000/api/customerpos/${editingCpo._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await axios.post(
          "http://localhost:8000/api/customerpo",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      toast.success("Customer PO saved successfully");
      if (refreshData) refreshData();
      if (refreshCustomers) refreshCustomers();
      setVisible(false);
    } catch (err) {
      if (err.response) {
        console.error("Error saving customer PO:", err.response.data);
        toast.error(
          `Failed to save customer PO: ${
            err.response.data.error || "Unknown error"
          }`
        );
      } else {
        console.error("Error:", err.message);
        toast.error("Failed to save customer PO: " + err.message);
      }
    }
  };

  const handleAdd = () => {
    setAddClick(true);
    setEditing(null);
  };

  const handleAddItem = async (item) => {
    const newItem = { ...item, customerPo: currentCpoId };
    setSalesItems((prevItems) => [...prevItems, newItem]);
    setAddClick(false);
  };

  const handleEditItem = async (item) => {
    setEditing(item);
    setVisible(true);
    setCurrentCpoId(item._id);
    console.log("Editing CPO ID: ", item._id);
    setSalesItems([]);
    await loadSalesItemsForCPO(item._id);
  };

  useEffect(() => {
    if (editingCpo && editingCpo._id) {
      loadSalesItemsForCPO(editingCpo._id);
    }
  }, [editingCpo]);

  const handleDeleteItem = async (Id) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:8000/api/itempos/${Id}`
      );
      console.log(data);
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(`${data.message}`);
        loadSalesItems();
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      toast.error("Failed to delete item");
    }
  };


  const calculateTotalPrice = (items) => {
    const total = items.reduce((sum, item) => {
      const qty = item.qty || 0;
      const cost = item.cost || 0;
      const tax = item.tax || 0;

      const basePrice = qty * cost;
      const taxAmount = (basePrice * tax) / 100;
      const finalPrice = basePrice + taxAmount;
      console.log(
        `Item: ${item.item.item}, Qty: ${qty}, Unit Cost: ${cost}, Base Price: ${basePrice}, Tax Amount: ${taxAmount}, Final Price: ${finalPrice}`
      );
      return sum + finalPrice; 
    }, 0);
    setTotalCustomerPOLocal(total); 
  };


  useEffect(() => {
    calculateTotalPrice(salesItems);
  }, [salesItems]);

  return (
    <>
      {addClick ? (
        <AddEditPo
          refreshData={loadSalesItems}
          edits={edits}
          onAddItem={handleAddItem}
          currentCpoId={currentCpoId}
        />
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <div className="HEDING">
              <h3 className="form-headings">
                {editingCpo ? "Edit" : "Add"}Customer PO
              </h3>
            </div>
            <div>
              <div className="ButtonContainer">
                <div className="labelinputfield">
                  <label htmlFor="customern" className="lblCPO">
                    Customer:
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
                    Customer PO:
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
                    Status:
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className="customer-salesorder_input1"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <button type="button" onClick={handleAdd} className="StyledBtn">
              Add SalesItem
            </button>

            <Table>
              <thead>
                <HeadTr>
                  <Th>Item</Th>
                  <Th>Qty</Th>
                  <Th>Unit Cost</Th>
                  <Th>Tax</Th>
                  <Th>Sales Price</Th>
                  <Th>Action</Th>
                </HeadTr>
              </thead>
              <tbody>
                {salesItems.length > 0 ? (
                  salesItems.map((items) => {
                    if (!items || !items.item) {
                      return null;
                    }
                    return (
                      <Tr key={items._id}>
                        <Td>{items.item.item}</Td>
                        <Td>{items.qty}</Td>
                        <Td>{items.cost}</Td>
                        <Td>{items.tax}</Td>
                        <Td>{items.salesPrice}</Td>
                        <Td>
                          <div className="button-group">
                            <Tooltip title="Edit">
                              <button
                                onClick={() => handleEditItem(items)}
                                className="btns1"
                              >
                                <BiEdit />
                              </button>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <button
                                onClick={() => handleDeleteItem(items._id)}
                                className="btns2"
                              >
                                <BiTrash />
                              </button>
                            </Tooltip>
                          </div>
                        </Td>
                      </Tr>
                    );
                  })
                ) : (
                  <Tr>
                    <Td colSpan="6">No items available.</Td>
                  </Tr>
                )}
              </tbody>
            </Table>
            {/* <div >
              <h2>
                Total :{" "}
                {salesItems.reduce(
                  (total, items) => total + Number(items.salesPrice || 0),
                  0
                )}
              </h2>
            </div> */}
            <div className="totaldiv">
              {salesItems.length > 0 ? (
                <p>
                  <strong className="totalprice">
                    Total CustomerPO Price:
                  </strong>{" "}
                  ₹{totalCustomerPOLocal.toFixed(2)}
                </p>
              ) : null}
            </div>
            <div className="ButtonContainer">
              <button type="submit" className="StyledButton1">
                Save
              </button>
              <button type="button" className="StyledButton11">
                Clear
              </button>
            </div>
          </form>
        </>
      )}
    </>
  );
};

export default SalesOrder;
