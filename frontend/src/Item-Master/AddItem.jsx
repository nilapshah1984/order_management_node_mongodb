import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "../StyleCSS/Customer.css";

const AddItem = ({ editingItem, setVisible, loadItems }) => {
  const [items, setItems] = useState([]);
  const initialData = {
    item: "",
    supplier: "",
    category: "",
    brand: "",
    description: "",
    unit: "",
    price: "",
    status: "",
  };

  const [formData, setFormData] = useState({ ...initialData });
  const [suppliers, setSuppliers] = useState([]); 

  useEffect(() => {
    if (editingItem && editingItem._id) {
      setFormData(editingItem);
    } else {
      resetForm();
    }
  }, [editingItem]);

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/suppliers/all"
        );
        console.log("Fetched suppliers:", data);

        if (Array.isArray(data)) {
          setSuppliers(data);
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      }
    };
    loadSuppliers(); 
  }, []);

  const resetForm = () => {
    setFormData({ ...initialData });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(formData)
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingItem && editingItem._id) {
        res = await axios.put(
          `http://localhost:8000/api/items/${editingItem._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        res = await axios.post("http://localhost:8000/api/item", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      const { data } = res;
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(
          editingItem && editingItem._id
            ? `"${data.item}" is updated`
            : `"${data.item}" is created`
        );
        setItems((prevItems) => [data, ...prevItems]);
        setVisible(false);
        loadItems();
      }
    } catch (err) {
      if (err.response.data && err.response.data.error) {
        toast.error(err.response.data.error);
      }
      console.log("Error saving item:", err);
      setVisible(false);
    }
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="customer-form">
        <h3 className="form-heading">Add Item</h3>
        <div className="customer-form">
          <label htmlFor="name" className="customer-form__label">
            Item Name:
          </label>
          <input
            type="text"
            name="item"
            value={formData.item}
            onChange={handleInputChange}
            className="customer-form__input"
          />

          <label htmlFor="supplier" className="customer-form__label">
            Supplier:
          </label>
          <select
            name="supplier"
            value={formData.supplier} 
            onChange={handleInputChange}
            className="customer-form__input"
          >
            <option value="">Select Supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier.name} value={supplier.name}>
                {supplier.name}
              </option>
            ))}
          </select>

          <label htmlFor="category" className="customer-form__label">
            Category:
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="customer-form__input"
          />
          <label htmlFor="brand" className="customer-form__label">
            Brand:
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            className="customer-form__input"
          />


          <label htmlFor="description" className="customer-form__label">
            Description:
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="customer-form__input"
          />

          <label htmlFor="unit" className="customer-form__label">
            Unit:
          </label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
            className="customer-form__input"
          >
            <option value="KG">KG</option>
            <option value="PCS">PCS</option>
          </select>

          <label htmlFor="status" className="customer-form__label">
            Status:
          </label>
          <input
            type="checkbox"
            name="status"
            checked={formData.status === "active"}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.checked ? "active" : "inactive",
              })
            }
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
            onClick={handleCancel}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItem; 
