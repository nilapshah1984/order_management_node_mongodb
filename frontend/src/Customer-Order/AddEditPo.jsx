import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../StyleCSS/Customer.css";

const AddEditPo = ({ refreshData, currentCpoId, closeAddForm, itemToEdit,  loadCPO, currentPage  }) => {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState("");
  const [qty, setQty] = useState("");
  const [cost, setCost] = useState("");
  const [tax, setTax] = useState("");
  const [salesPrice, setSalesPrice] = useState("");

  const [availableQty, setAvailableQty] = useState(0);
  const [remainingQty, setRemainingQty] = useState(0);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/api/items");
        if (Array.isArray(data.items)) {
          // setItems(data.items);
          console.log("Item:", data)
          const activeItems = data.items.filter(item => item.status === "Active");
          setItems(activeItems);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error("Error loading items:", err);
        toast.error("Had trouble loading items");
      }
    };
    loadItems();
  }, []);

  const handleItemChange = (e) => {
    const selectedItemId = e.target.value;
    setItem(selectedItemId);
    const selectedItem = items.find((i) => i._id === selectedItemId);
    if (selectedItem) {
      const stock = selectedItem.stock;
      setAvailableQty(stock);
      setRemainingQty(stock);
    } else {
      console.log("Selected item not found");
    }
  };

  useEffect(() => {
    if (qty !== "") {
      const remainingQty = availableQty - parseInt(qty);
      setRemainingQty(remainingQty >= 0 ? remainingQty : 0);
    } else {
      setRemainingQty(availableQty);
    }
  }, [qty, availableQty]);

  useEffect(() => {
    const qtyNum = parseFloat(qty) || 0;
    const costNum = parseFloat(cost) || 0;
    const taxNum = parseFloat(tax) || 0;
    const basePrice = qtyNum * costNum;
    const taxAmount = (basePrice * taxNum) / 100;
    const finalPrice = basePrice + taxAmount;
    setSalesPrice(finalPrice.toFixed(2));
  }, [qty, cost, tax]);

  useEffect(() => {
    if (itemToEdit && items.length > 0) {
      console.log("Editing Item:", itemToEdit);
      setQty(itemToEdit.qty);
      setCost(itemToEdit.cost);
      setTax(itemToEdit.tax);
      setSalesPrice(itemToEdit.salesPrice);
  
      const selectedItem = items.find((i) => i._id === itemToEdit.item._id);
      if (selectedItem) {
        setAvailableQty(selectedItem.stock);
      } else {
        setAvailableQty(0); 
      }  
      setRemainingQty(itemToEdit.remainingQty);
  
      if (typeof itemToEdit.item === "string") {
        setItem(itemToEdit.item);
      } else if (itemToEdit.item && itemToEdit.item._id) {
        setItem(itemToEdit.item._id);
      }
    } else {
      setItem("");
      setQty("");
      setCost("");
      setTax("");
      setSalesPrice("");
      setAvailableQty(0);
      setRemainingQty(0);
    }
  }, [itemToEdit, items]);



  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("item", item);
      formData.append("qty", qty);
      formData.append("cost", cost);
      formData.append("tax", tax);
      formData.append("salesPrice", salesPrice);
      formData.append("customerPo", currentCpoId);
  
      const response = await axios.post(
        "http://localhost:8000/api/itempo",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );  
      if (response.status === 201) {
        toast.success(response.data.message || "Sales Item added successfully!");
        refreshData();
        closeAddForm();
      } else {
        toast.error(response.data.error || "Unexpected error occurred.");
      }
    } catch (err) {
      console.error("Error:", err.message);
      toast.error("ERROR: Failed to add item due to server error.");
    }
  };


  const handleUpdate = async () => {
    try {
        const formData = new FormData();
        formData.append("item", item);
        formData.append("qty", qty);
        formData.append("cost", cost);
        formData.append("tax", tax);
        formData.append("salesPrice", salesPrice);
        formData.append("customerPo", itemToEdit.customerPo);

        const response = await axios.put(
            `http://localhost:8000/api/itempos/${itemToEdit._id}`,
            formData,
            {
                headers: { "Content-Type": "application/json" },
            }
        );

        if (response.status === 200) {
            toast.success(response.data.message || "Sales Item updated successfully!");
            refreshData(); 
            await loadCPO(currentPage); 
            closeAddForm();
        } else {
            toast.error(response.data.error || "Unexpected error occurred.");
        }
    } catch (err) {
        console.error("Error:", err.message);
        toast.error("ERROR: Failed to update item due to server error.");
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (itemToEdit) {
      await handleUpdate(); 
      refreshData();
    } else {
      await handleSave(); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="salesorder-form">
      <h3 className="form-heading">{itemToEdit ? "Edit" : "Add"} SalesItem</h3>
      <div className="customer-form">
        <label htmlFor="item" className="customer-form__label">
            Item: 
          <select 
            id="item" 
            value={item} onChange={handleItemChange} 
            required 
            disabled={!!itemToEdit}
            className="customer-form__input">
            <option value="">Select item</option>
            {items.map((item) => (
              <option key={item._id} value={item._id}>
                {item.item}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="availableQty" className="customer-form__label">
          Available Qty:
        </label>
        <input
          type="number"
          id="availableQty"
          value={availableQty}
          className="customer-form__input22"
          readOnly
        />

        <label htmlFor="avlqty" className="customer-form__label">
          <span>
            Allocated Qty: <span className="required-field">*</span>
          </span>
          <input
            type="number"
            id="avlqty"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="customer-form__input"
            required
          />
        </label>

        <label htmlFor="remainingQty" className="customer-form__label">
          Remaining Qty:
        </label>
        <input
          type="number"
          id="remainingQty"
          value={remainingQty}
          className="customer-form__input22"
          readOnly
        />

        <label htmlFor="cost" className="customer-form__label">
          <span>
            Unit Cost: <span className="required-field">*</span>
          </span>
          <input
            type="text"
            id="cost"
            value={cost}
            onChange={(event) => setCost(event.target.value)}
            className="customer-form__input"
            required
          />
        </label>

        <label htmlFor="tax" className="customer-form__label">
          <span>
            Tax: <span className="required-field">*</span>
          </span>
          <input
            type="text"
            id="tax"
            value={tax}
            onChange={(event) => setTax(event.target.value)}
            className="customer-form__input"
            min="0"
            max="100"
            required
          />
        </label>
        <label htmlFor="salesprice" className="customer-form__label">
          Sales Price:
          <input
            type="text"
            id="salesprice"
            value={salesPrice}
            className="customer-form__input"
            readOnly
          />
        </label>
      </div>

      <div className="ButtonContainer1">
        <button type="submit" className="StyledButton1">
          {itemToEdit ? "Update" : "Save"}
        </button>
        <button type="button" className="StyledButton11" onClick={closeAddForm}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddEditPo;
