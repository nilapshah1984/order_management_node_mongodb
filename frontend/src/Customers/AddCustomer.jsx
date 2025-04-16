import { useState, useEffect } from "react";
import { postCustomer, putCustomer } from '../services/customerApi';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../StyleCSS/Customer.css";  

function AddCustomer({ editingCustomer, setVisible, loadCustomers, setEditingCustomers, handleClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [area, setArea] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [gstn, setGstn] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

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
        res = await putCustomer(editingCustomer._id, customerData);
      } else {
        res = await postCustomer(customerData);
      }    
      const { data } = res;
      if (data?.error) {
        toast.error(data.error);
      } else {
        setTimeout(() => {
          toast.success(
            editingCustomer && editingCustomer._id
              ? `${data.name} is updated`
              : `${data.name} is created`
          );
          loadCustomers();
          handleClose(); 
        }, 3000);
      }
    } catch (err) {
      console.log("Error saving customer:", err);
      toast.error("Error saving customer");
    }
    setLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3 className="form-heading">
          {editingCustomer && editingCustomer._id ? "Edit Customer" : "Add Customer"}
        </h3>
        <div className="customer-form">
          <label className="customer-form__label">
            <span>Customer Name: <span className="required-field">*</span></span>
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
            <span>Email: <span className="required-field">*</span></span>
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
            <span>Phone: <span className="required-field">*</span></span>
            <input
              type="tel"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="customer-form__input"
              pattern="[0-9]{10}"
              maxLength="10"
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
            <span>Area: <span className="required-field">*</span></span>
            <input
              type="text"
              name="area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="customer-form__input"
              required
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
            <span>Status: <span className="required-field">*</span></span>
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="customer-form__input"
              required
            >
              <option value="" disabled>Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
          <label className="customer-form__label">
            <span>GSTN:<span className="required-field"> *</span></span>
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
            {loading ? "" : editingCustomer ? "Update" : "Add"} 
          </button>
          <button
            type="button"
            className="StyledButton11"
            onClick={() => {
              handleClose();
              resetForm(); 
            }}
          >
            Cancel
          </button>
        </div>
      </form>
      {loading && (
        <div className="processing-modal">
          <img className="ProcessingIMG" src="./ProcessingGig.gif" alt="Processing" />
        </div>
      )}
    </div>
  );
}

export default AddCustomer;
