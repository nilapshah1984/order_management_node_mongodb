import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Select } from "antd";
import "../StyleCSS/Customer.css";
const { Option } = Select;

function AddSuppliers({editingSuppliers, setVisible, loadSuppliers, setEditingSuppliers, handleClose}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [area, setArea] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [gstn, setGstn] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false); //new

  useEffect(() => {
    if (editingSuppliers) {
      setName(editingSuppliers.name);
      setEmail(editingSuppliers.email);
      setArea(editingSuppliers.area);
      setPhone(editingSuppliers.phone);
      setAddress(editingSuppliers.address);
      setCity(editingSuppliers.city);
      setGstn(editingSuppliers.gstn);
      setStatus(editingSuppliers.status);
    } else {
      resetForm();
    }
  }, [editingSuppliers]);

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
        const supplierData = new FormData();
        supplierData.append("name", name);
        supplierData.append("email", email);
        supplierData.append("phone", phone);
        supplierData.append("area", area);
        supplierData.append("address", address);
        supplierData.append("city", city);
        supplierData.append("gstn", gstn);
        supplierData.append("status", status);

        let data;
        if (editingSuppliers) {
            data = await axios.put(
                `http://localhost:8000
/api/suppliers/${editingSuppliers._id}`,
                supplierData
            );
        } else {
            data = await axios.post(
                "http://localhost:8000/api/supplier",
                supplierData
            );
        }
        if (data?.error) {
            toast.error(data.error);
        } else {
            setTimeout(() => {
                toast.success(`"${data.name}" is ${editingSuppliers ? "updated" : "added"}`);
                loadSuppliers(1);
                setVisible(false);
                setEditingSuppliers(null);
                handleClose();
            }, 5000); 
        }
    } catch (err) {
        console.log(err);
    } finally {
        setLoading(false);
    }
};

  const handleCancel = () => {
    resetForm();
    setEditingSuppliers(null);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="customer-form">
        <h3 className="form-heading">
          {editingSuppliers && editingSuppliers._id
            ? "Edit Supplier"
            : "Add Supplier"}
        </h3>
        <div className="customer-form">
          <label className="customer-form__label">
            <span>
              Name: <span className="required-field">*</span>
            </span>
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
            <span>
              Email: <span className="required-field">*</span>
            </span>
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
            <span>
              Phone: <span className="required-field">*</span>
            </span>
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
            <span>
              Area: <span className="required-field">*</span>
            </span>
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
            <span>
              Status: <span className="required-field">*</span>
            </span>
            <Select
              variant="false"
              className="form-select mb-3"
              size="large"
              placeholder="choose shipping"
              value={status}
              onChange={(value) => setStatus(value)}
            >
              <Option value="" disabled>Select Status</Option>
              <Option value="Active">Actvie</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </label>
          <label className="customer-form__label">
            <span>
              GSTN: <span className="required-field">*</span>
            </span>
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
            {loading  ? 
              editingSuppliers ? "Updating..." : "Saving..." : 
              editingSuppliers ? "Update" : "Add"
            }
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
          <img className="ProcessingIMG" src="./ProcessingGig.gif"></img>
        </div>
      )}
    </div>
  );
}

export default AddSuppliers;
