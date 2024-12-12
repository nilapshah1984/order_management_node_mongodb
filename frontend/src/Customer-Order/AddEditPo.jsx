import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../StyleCSS/Customer.css";

const AddEditPo = ({ refreshData, onAddItem, currentCpoId }) => {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState("");
  const [qty, setQty] = useState("");
  const [cost, setCost] = useState("");
  const [tax, setTax] = useState("");
  const [salesPrice, setSalesPrice] = useState("");

  //add New State
  const [availableQty, setAvailableQty] = useState(0);
  const [allocatedQty, setAllocatedQty] = useState(0);
  const [remainingQty, setRemainingQty] = useState(0);

  useEffect(() => {
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
      setAllocatedQty(0); 
      setRemainingQty(stock); 
    } else {
      console.log("Selected item not found");
    }
  };


  useEffect(() => {
    if(qty !== "") {
      const remainingQty = availableQty - parseInt(qty);
      setRemainingQty(remainingQty >= 0 ? remainingQty : 0); 
    } else{
      setRemainingQty(availableQty);
    }
  },[qty, availableQty]);



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
    console.log("Current CPO ID in AddEditPo:", currentCpoId); // Check the current CPO ID
  }, [currentCpoId]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting item for CPO ID:", currentCpoId);
      
      const formData = new FormData();
      formData.append("item", item);
      formData.append("qty", qty);
      formData.append("cost", cost);
      formData.append("tax", tax);
      formData.append("salesPrice", salesPrice);
      formData.append("customerPo", currentCpoId);
      formData.append("allocatedQty", allocatedQty);
      formData.append("availableQty", availableQty);
      formData.append("remainingQty", remainingQty);

      console.log("Sending FormData:", {
        item,
        qty,
        cost,
        tax,
        salesPrice,
        currentCpoId,
      });
      const { data } = await axios.post(
        "http://localhost:8000/api/itempo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Added Item Data:", data);

      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success("Item created successfully");
        refreshData();
        onAddItem(data);
        // Reset fields
        setItem("");
        setQty("");
        setCost("");
        setTax("");
        setSalesPrice("");
      }
    } catch (err) {
      console.error(
        "Error adding item:",
        err.response ? err.response.data : err
      );
      toast.error(
        "Error adding item: " +
          (err.response ? err.response.data.error : err.message)
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="salesorder-form">
      <h3 className="form-heading">Add SalesItem</h3>
      <div className="customer-form">
        <label htmlFor="item" className="customer-form__label">
          Item:
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
        </label>

        <label htmlFor="qty" className="customer-form__label">
          Availble Qty:
        </label>
        <input
          type="number"
          id="availableQty"
          value={availableQty}
          className="customer-form__input22"
          readOnly
        />

        <label htmlFor="avlqty" className="customer-form__label">
          Allocated Qty:
          <input
            type="number"
            id="avlqty"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="customer-form__input"
          />
        </label>

        <label htmlFor="qty" className="customer-form__label">
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
          Unit Cost:
          <input
            type="text"
            id="cost"
            value={cost}
            onChange={(event) => setCost(event.target.value)}
            className="customer-form__input"
          />
        </label>

        <label htmlFor="tax" className="customer-form__label">
          Tax :
          <input
            type="text"
            id="tax"
            value={tax}
            onChange={(event) => setTax(event.target.value)}
            className="customer-form__input"
            min="0"
            max="100"
          />
        </label>
        <label htmlFor="salesprice" className="customer-form__label">
          Sales Price:
          <input
            type="text"
            id="salesprice"
            value={salesPrice}
            onChange={(e) => setSalesPrice(e.target.value)}
            className="customer-form__input"
          />
        </label>
      </div>

      <div className="ButtonContainer1">
        <button type="submit" className="StyledButton1">
          Save
        </button>
        <button
          type="button"
          className="StyledButton11"
          onClick={() => {
            setItem("");
            setQty("");
            setCost("");
            setTax("");
            setSalesPrice("");
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddEditPo;
