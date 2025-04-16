import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "../StyleCSS/Customer.css";

const AddOrEditPItem = ({ customerId, editpo, setShowAddOrEdit, availableQty, purchaseEditing, onSuccess, customerPOs, associatedCPOs }) => {
  const [items, setItems] = useState([]); 
  const [filteredItems, setFilteredItems] = useState([]); 
  const [item, setItem] = useState("");
  const [availableQTY, setAvailableQTY] = useState(availableQty);
  const [altqty, setAltqty] = useState("");
  const [remainingQTY, setRemainingQTY] = useState(availableQty); 
  const [unitCost, setUnitCost] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");

  useEffect(() => {
    loadSalesitem(); 
  }, []);

  useEffect(() => {
    // console.log("Current PO Details on Open:", purchaseEditing); 
    if (editpo) {
      const cpoDetails = customerPOs.find(cpo => cpo.customerpo === purchaseEditing.customerpo);
      if (cpoDetails) {
        // console.log("CPO Details:", cpoDetails);
      } else {
        console.log("CPO not found for customerpo:", purchaseEditing.customerpo);
      }

      setItem(editpo.item);
      setAvailableQTY(editpo.availableQTY);
      setAltqty(editpo.altqty);
      setRemainingQTY(editpo.remainingQTY); 
      setUnitCost(editpo.unitCost);
      setPurchasePrice(editpo.purchasePrice);
      setInvoiceNo(editpo.invoiceNo);
      setInvoiceDate(editpo.invoiceDate);
    } else {
      resetForm();
    }
  }, [editpo, availableQty, purchaseEditing]);

  useEffect(() => {

    const associatedItemIds = associatedCPOs.map(cpo => cpo._id); 
    const filtered = items.filter(item => associatedItemIds.includes(item.customerPo)); 
    setFilteredItems(filtered);
    // console.log("Filtered Items based on Associated CPOs:", filtered);
  }, [items, associatedCPOs]);

  const resetForm = () => {
    setItem("");
    setAvailableQTY(availableQty);
    setAltqty("");
    setUnitCost("");
    setPurchasePrice("");
    setInvoiceNo("");
    setInvoiceDate("");
    setRemainingQTY(availableQty); 
  };

  const loadSalesitem = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/itempos");      
      console.log("SalesItem for PO:", data); 
      
      if (Array.isArray(data)) {
        const extractedItems = data.map(item => ({
          _id: item._id,
          item: item.item.item,
          qty: item.qty,
          customerPo: item.customerPo 
        }));
        setItems(extractedItems); 
        console.log("Items loaded into state:", extractedItems); 
      } else {
        setItems([]);
        console.log("No items found in the response."); 
      }
    } catch (err) {
      console.error("Error loading sales items:", err);
      // toast.error("Error loading sales items");
    }
  };

  const handleItemChange = (e) => {
    const selectedItemId = e.target.value;
    setItem(selectedItemId);

    const selectedItem = filteredItems.find((i) => i._id === selectedItemId); 
    if (selectedItem) {
      const stock = selectedItem.qty;
      setAvailableQTY(stock);
      setRemainingQTY(stock); 
      // console.log(`Selected item: ${selectedItem.item}, Stock: ${stock}`);
    } else {
      console.log("Selected item not found");
    }
  };

  useEffect(() => {
    if (altqty !== "") {
      const allocatedQty = parseInt(altqty);
      const remainingQty = availableQTY - allocatedQty;
      setRemainingQTY(remainingQty >= 0 ? remainingQty : 0); 
    } else {
      setRemainingQTY(availableQTY); 
    }
  }, [altqty, availableQTY]);

  useEffect(() => {
    if (altqty && unitCost) {
      const calculatedPrice = parseFloat(altqty) * parseFloat(unitCost);
      setPurchasePrice(calculatedPrice.toFixed(2)); 
    } else {
      setPurchasePrice(""); 
    }
  }, [altqty, unitCost]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log("Current purchaseEditing:", purchaseEditing);

      if (!item || !altqty || !unitCost || !invoiceNo || !invoiceDate) {
        toast.error("Please fill all required fields.");
        return;
      }

      if (!purchaseEditing || !purchaseEditing._id) {
        toast.error("Purchase order is not selected or invalid.");
        return;
      }

      console.log("Current PO Details on Submit:", {
        customerId,
        purchaseOrderId: purchaseEditing._id,
        item,
        altqty,
        unitCost,
        purchasePrice,
        invoiceNo,
        invoiceDate,
      });

      const formData = new FormData();
      formData.append("customerId", customerId);
      formData.append("purchaseOrderId", purchaseEditing._id);
      formData.append("item", item);
      formData.append("altqty", altqty);
      formData.append("unitCost", unitCost);
      formData.append("purchasePrice", purchasePrice);
      formData.append("invoiceNo", invoiceNo);
      formData.append("invoiceDate", invoiceDate);

      console.log("Adding item with Purchase Order ID:", purchaseEditing._id);

      const apiUrl = editpo
        ? `http://localhost:8000/api/itemppos/${editpo._id}`
        : "http://localhost:8000/api/itemppo";
      const method = editpo ? "put" : "post";

      const { data } = await axios[method](apiUrl, formData);

      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(
          `${data.item || "Purchase Item"} details ${editpo ? "updated" : "added"} successfully`
        );
        setShowAddOrEdit(false);
        onSuccess();
      }
    } catch (err) {
      console.error("Save Error:", err.response || err);
      toast.error("Error adding/updating item");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="salesorder-form">
      <h2 className="salesorder-form-heading">{editpo ? "Edit Purchase Item" : "Add Purchase Item"}</h2>
      <div className="customer-form">
        <label htmlFor="item" className="customer-form__label">
          <span>Item Name: <span className="required-field">*</span></span>
        </label>
        <select
          id="item"
          value={item}
          onChange={handleItemChange}
          className="customer-form__input"
        >
          <option value="">Select an item</option>
          {filteredItems.map((item) => ( 
            <option key={item._id} value={item._id}>
              {item.item} 
            </option>
          ))}
        </select>

        <label htmlFor="availableQty" className="customer-form__label">
          Available Qty:
        </label>
        <input 
          type="number" 
          id="availableQty" 
          value={availableQTY}
          className="customer-form__input22" 
          readOnly
        />

        <label htmlFor="qty" className="customer-form__label">          
          <span>Allocated Qty: <span className="required-field">*</span></span>
        </label>
        <input
          type="number"
          id="qty"
          value={altqty}
          onChange={(e) => setAltqty(e.target.value)}
          className="customer-form__input"          
        />

        <label htmlFor="remainingQty" className="customer-form__label">
          Remaining Qty:
        </label>
        <input 
          type="number" 
          id="remainingQty" 
          value={remainingQTY || 0} 
          className="customer-form__input22" 
          readOnly
        />

        <label htmlFor="unitCost" className="customer-form__label">          
          <span>Unit Cost: <span className="required-field">*</span></span>
        </label>
        <input
          type="text"
          id="unitCost"
          value={unitCost}
          onChange={(e) => setUnitCost(e.target.value)}
          className="customer-form__input"
          required
        />

        <label htmlFor="purchasePrice" className="customer-form__label">          
          <span>Purchase Price:<span className="required-field">*</span></span>
        </label>
        <input
          type="text"
          id="purchasePrice"
          value={purchasePrice}
          className="customer-form__input"
          readOnly 
        />

        <label htmlFor="invoiceNo" className="customer-form__label">          
          <span>Invoice No.: <span className="required-field">*</span></span>
        </label>
        <input
          type="text"
          id="invoiceNo"
          value={invoiceNo}
          onChange={(e) => setInvoiceNo(e.target.value)}
          className="customer-form__input"
          required
        />

        <label htmlFor="invoiceDate" className="customer-form__label">
          <span>Invoice Date: <span className="required-field">*</span></span>
        </label>
        <input
          type="date"
          id="invoiceDate"
          value={invoiceDate}
          onChange={(e) => setInvoiceDate(e.target.value)}
          className="customer-form__input"
          required
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