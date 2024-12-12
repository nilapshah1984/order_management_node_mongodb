import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../StyleCSS/Customer.css";  

function AddCustomer({ editingCustomer, setVisible, loadCustomers }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [area, setArea] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [gstn, setGstn] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (editingCustomer) {
      setName(editingCustomer.name);
      setEmail(editingCustomer.email);
      setArea(editingCustomer.area);
      setPhone(editingCustomer.phone);
      setAddress(editingCustomer.address);
      setCity(editingCustomer.city);
      setGstn(editingCustomer.gstn);
      setStatus(editingCustomer.status);
    } else {
      resetForm();
    }
  }, [editingCustomer]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setArea("");
    setPhone("");
    setAddress("");
    setCity("");
    setGstn("");
    setStatus("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const customerData = new FormData();
      customerData.append("name", name);
      customerData.append("email", email);
      customerData.append("phone", phone);
      customerData.append("area", area);
      customerData.append("address", address);
      customerData.append("city", city);
      customerData.append("gstn", gstn);
      customerData.append("status", status);

      let res;
      if (editingCustomer && editingCustomer._id) {
        res = await axios.put(
          `http://localhost:8000/api/customers/${editingCustomer._id}`,
          customerData
        );
      } else {
        res = await axios.post(
          "http://localhost:8000/api/customer",
          customerData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      const { data } = res;
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(
          editingCustomer && editingCustomer._id
            ? `${data.name} is updated`
            : `${data.name} is created`
        );
        loadCustomers();
      }
    } catch (err) {
      console.log("Error saving customer:", err);
      toast.error("Error saving customer");
    }
    setVisible(false);
  };

  const handleCancel = () => {
    resetForm();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3 className="form-heading">
          {editingCustomer && editingCustomer._id ? "Edit Customer" : "Add Customer"}
        </h3>
        <div className="customer-form">
          <label className="customer-form__label">
            Name:
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="customer-form__input"
              required
            />
          </label>
          <label className="customer-form__label">
            Email:
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="customer-form__input"
              required
            />
          </label>
          <label className="customer-form__label">
            Phone:
            <input
              type="tel"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="customer-form__input"
              pattern="[0-9]{10}"
              required
            />
          </label>
          <label className="customer-form__label">
            Address:
            <input
              type="text"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="customer-form__input"
            />
          </label>
          <label className="customer-form__label">
            Area:
            <input
              type="text"
              name="area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="customer-form__input"
            />
          </label>
          <label className="customer-form__label">
            City:
            <input
              type="text"
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="customer-form__input"
            />
          </label>
          <label className="customer-form__label">
            Status:
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="customer-form__input"
            >
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
          </label>
          <label className="customer-form__label">
            GSTN:
            <input
              type="text"
              name="gstn"
              value={gstn}
              onChange={(e) => setGstn(e.target.value)}
              className="customer-form__input"
              required
              pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$"
              maxLength="15"
              title="Please enter a valid 15-character GSTIN (e.g., 22AAAAA0000A1Z5)"
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
            onClick={handleCancel}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCustomer;
