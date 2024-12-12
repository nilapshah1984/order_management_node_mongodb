import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import moment from "moment";
import "../StyleCSS/Customer.css";

const AddOrEditPItem = ({ customerId, editpo, setShowAddOrEdit, availableQty, purchaseEditing  }) => {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState("");
  const [availableQTY, SetAvailableQTY] = useState(availableQty);
  const [altqty, setAltqty] = useState("");
  const [reaminQTY, SetRemainQTY] = useState();
  const [unitCost, setUnitCost] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const existingStockValue = 9; 

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    if (editpo) {
      setItem(editpo.item);
      SetAvailableQTY(editpo.availableQTY)
      setAltqty(editpo.altqty);
      SetRemainQTY(editpo.reaminQTY)
      setUnitCost(editpo.unitCost);
      setPurchasePrice(editpo.purchasePrice);
      setInvoiceNo(editpo.invoiceNo);
      setInvoiceDate(editpo.invoiceDate);
    } else {
      setItem("");
      SetAvailableQTY(availableQty)
      setAltqty("");
      setUnitCost("");
      setPurchasePrice("");
      setInvoiceNo("");
      setInvoiceDate("");
    }
  }, [editpo, availableQty]);

  useEffect(() => {
    if (altqty && unitCost) {
      const calculatedPrice = parseFloat(altqty) * parseFloat(unitCost);
      setPurchasePrice(calculatedPrice.toFixed(2));
    } else {
      setPurchasePrice("");
    }
  }, [altqty, unitCost]);


  useEffect(() => {
    if(altqty !== "") {
      const remainingQty = availableQTY - parseInt(altqty);
      SetRemainQTY(remainingQty >= 0 ? remainingQty : 0); 
    } else{
      SetRemainQTY(availableQTY);
    }
  },[altqty, availableQTY]);


  const loadItems = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/items");
      if (Array.isArray(data.items)) {
        setItems(data.items);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error("Error loading items:", err);
      toast.error("Error loading items");
    }
  };



  const handleItemChange = (e) => {
    const selectedItemId = e.target.value;
    setItem(selectedItemId);
  
    const selectedItem = items.find((i) => i._id === selectedItemId);
    if (selectedItem) {
      const stock = selectedItem.stock ;
      SetAvailableQTY(stock);
      // setAltqty(stock);
      console.log(`Selected item: ${selectedItem.item}, Stock: ${stock}`);
    } else {
      console.log("Selected item not found");
    }
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Current purchaseEditing:", purchaseEditing);

      if (!item || !altqty || !unitCost || !invoiceNo || !invoiceDate) {
        toast.error("Please fill all required fields.");
        return;
      }
    
      if (!purchaseEditing || !purchaseEditing._id) {
        toast.error("Purchase order is not selected or invalid.");
        return;
      }

      const formData = new FormData();
      formData.append("customerId", customerId);
      formData.append("purchaseOrderId", purchaseEditing._id);
      formData.append("item", item);
      formData.append("altqty", altqty);
      formData.append("unitCost", unitCost);
      formData.append("purchasePrice", purchasePrice);
      formData.append("invoiceNo", invoiceNo);
      formData.append("invoiceDate", invoiceDate);
  
      const apiUrl = editpo
        ? `http://localhost:8000/api/itemppos/${editpo._id}`
        : "http://localhost:8000/api/itemppo";
  
      const method = editpo ? "put" : "post";
  
      const { data } = await axios[method](apiUrl, formData);
  
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(
          `${data.item || "Item"} details ${
            editpo ? "updated" : "added"
          } successfully`
        );
        setShowAddOrEdit(false);
      }
    } catch (err) {
      console.error("Save Error:", err.response || err);
      toast.error("Error adding/updating item");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="salesorder-form">
      <h3 className="salesorder-form-heading">Add / Edit Item</h3>
      <div className="customer-form">
        <label htmlFor="item" className="customer-form__label">
          Item Name:
        </label>
        <select
          id="item"
          value={item}
          onChange={handleItemChange}
          className="customer-form__input"
        >
          <option value="">Select an item</option>
          {items.map((item) => (
            <option key={item._id} value={item._id}>
              {item.item}
            </option>
          ))}
        </select>

        <label htmlFor="qty" className="customer-form__label">
          Availble Qty:
        </label>
        <input 
          type="number" 
          id="availableQty" 
          value={availableQTY}
          className="customer-form__input22" 
          readOnly
        />

        <label htmlFor="qty" className="customer-form__label">
          Allocated Qty:
        </label>
        <input
          type="number"
          id="qty"
          value={altqty}
          onChange={(e) => setAltqty(e.target.value)}
          className="customer-form__input"          
        />

        <label htmlFor="qty" className="customer-form__label">
          Remaining Qty:
        </label>
        <input 
          type="number" 
          id="remainingQty" 
          value={reaminQTY || 0} 
          className="customer-form__input22" 
          readOnly
        />

        <label htmlFor="unitCost" className="customer-form__label">
          Unit Cost:
        </label>
        <input
          type="text"
          id="unitCost"
          value={unitCost}
          onChange={(e) => setUnitCost(e.target.value)}
          className="customer-form__input"
        />

        <label htmlFor="purchasePrice" className="customer-form__label">
          Purchase Price:
        </label>
        <input
          type="text"
          id="purchasePrice"
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(e.target.value)}
          className="customer-form__input"
        />

        <label htmlFor="invoiceNo" className="customer-form__label">
          Invoice No.:
        </label>
        <input
          type="text"
          id="invoiceNo"
          value={invoiceNo}
          onChange={(e) => setInvoiceNo(e.target.value)}
          className="customer-form__input"
        />

        <label htmlFor="invoiceDate" className="customer-form__label">
          Invoice Date:
        </label>
        <input
          type="date"
          id="invoiceDate"
          value={invoiceDate}
          onChange={(e) => setInvoiceDate(e.target.value)}
          className="customer-form__input"
        />
      </div>
      <div className="ButtonContainer1">
        <button type="submit" className="StyledButton1">
          Save
        </button>
        <button
          type="button"
          className="StyledButton11"
          onClick={() => setShowAddOrEdit(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddOrEditPItem;
