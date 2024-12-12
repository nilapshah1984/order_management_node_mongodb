import { useEffect, useState } from "react";
import AddCustomer from "./AddCustomer";
import { BiAddToQueue, BiSearch, BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { Modal, Pagination, Popconfirm, Tooltip } from "antd";
import axios from "axios";
import toast from "react-hot-toast";
import "../StyleCSS/Customer.css";

function ManageCustomer() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visible, setVisible] = useState(false);
  const [editingCustomers, setEditingCustomers] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); 
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);



  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      try {
        const { data } = await axios.get(`http://localhost:8000/api/customers?search=${value}`);
        // setSuggestions(data.customers);
        // setShowSuggestions(true);

      } catch (err) {
        console.log(err);
      }
    } else {
      setSearchTerm("");
      loadCustomers(currentPage);
      setShowSuggestions(false);
    }
  };



  useEffect(() => {
    loadCustomers(currentPage);
  }, [currentPage, sortField, sortOrder]);



  const handleSearch = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8000/api/customers?search=${searchTerm}&page=1&limit=10`);
      setCustomers(data.customers);
      setTotalPages(data.totalPages);
      setCurrentPage(1); 
    } catch (err) {
      console.log('Search Error:', err);  
    }
  };
  


  const loadCustomers = async (page, sortField = "", sortOrder = "") => {
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/customers?page=${page}&limit=10&sortField=${sortField}&sortOrder=${sortOrder}${
          searchTerm ? `&search=${searchTerm}` : ""
        }`
      );
      setCustomers(data.customers);
      setTotalPages(data.totalPages); 
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (customerId) => {
    try {
      const { data } = await axios.delete(`http://localhost:8000/api/customers/${customerId}`);
      if (data?.error) {
        toast.error(data.error);
      } else {
        loadCustomers(currentPage, sortField, sortOrder);
        toast.success(`"${data.name}" is deleted`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomers(customer);
    setVisible(true);
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
    loadCustomers(page);
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
    loadCustomers(currentPage, field, order);
  };

  return (
    <>
      <div className="main-container">
        <h1>Manage Customers</h1>
        <div className="StyledDiv">
          <div className="ButtonContainer">
            <div>
              <input
                className="StyledIn"
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Search"
              />
              <button className="StyledButton" onClick={handleSearch}>
                <BiSearch className="SearchIcon" />
                Search
              </button>
            </div>
            <button className="StyledButton" onClick={() => setVisible(true)}>
              <BiAddToQueue className="Add" />
              Add Customer
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <h2 className="list-name">Customer List:</h2>
          <table className="table table-bordered table-striped table-hover shadow">
            <thead className="table-secondary">
              <tr>
                <th onClick={() => handleSort("name")}>
                  Name
                  <span>{sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}</span>
                </th>
                <th onClick={() => handleSort("email")}>
                  Email
                  <span>{sortField === "email" && (sortOrder === "asc" ? "↑" : "↓")}</span>
                </th>
                <th onClick={() => handleSort("phone")}>
                  Phone
                  <span>{sortField === "phone" && (sortOrder === "asc" ? "↑" : "↓")}</span>
                </th>
                <th onClick={() => handleSort("area")}>
                  Area
                  <span>{sortField === "area" && (sortOrder === "asc" ? "↑" : "↓")}</span>
                </th>
                <th onClick={() => handleSort("status")}>
                  Status
                  <span>{sortField === "status" && (sortOrder === "asc" ? "↑" : "↓")}</span>
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.area}</td>
                  <td>{customer.status}</td>
                  <td>
                    <div className="button-group">
                      <Tooltip title="Edit">
                        <button className="btns1" onClick={() => handleEditCustomer(customer)}>
                          <BiSolidEdit />
                        </button>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <Popconfirm
                          placement="topLeft"
                          description="Are you sure to delete this customer?"
                          onConfirm={() => handleDelete(customer._id)}
                          okText="Delete"
                        >
                          <button className="btns2">
                            <MdDelete />
                          </button>
                        </Popconfirm>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            current={currentPage}
            total={totalPages * 10}
            pageSize={10}
            onChange={onPageChange}
            showSizeChanger={false}
          />
        </div>
        <Modal
          open={visible}
          onOk={() => setVisible(false)}
          onCancel={() => setVisible(false)}
          footer={null}
        >
          <AddCustomer editingCustomer={editingCustomers} setVisible={setVisible} loadCustomers={loadCustomers} />
        </Modal>
      </div>
    </>
  );
}

export default ManageCustomer;
