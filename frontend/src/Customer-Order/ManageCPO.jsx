import React, { useState, useEffect } from "react";
import SalesOrder from "./CustomerPo";
import { BiAddToQueue, BiEdit, BiSearch, BiTrash } from "react-icons/bi";
import { Modal, Tooltip, Pagination } from "antd";
import axios from "axios";
import toast from "react-hot-toast";
import Select from "react-select";
import "../StyleCSS/Customer.css";

function ManageCPO() {
  const [visible, setVisible] = useState(false);
  const [customerpo, setCustomerpo] = useState([]);
  const [customern, setCustomern] = useState("");
  const [customer, setCustomer] = useState([]);
  const [editingCpo, setEditingCpo] = useState(null);
  const [orderDate, setOrderDate] = useState("");
  const [salesItems, setSalesItems] = useState([]);
  const [currentCpoId, setCurrentCpoId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [cpoList, setCpoList] = useState([]);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedCpoId, setSelectedCpoId] = useState()

  useEffect(() => {
    loadCpo(currentPage);
    loadSalesItems();
    loadCpoList();
  }, [currentPage]);

  const loadCpoList = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/customerpos");
      const extractedCustomers = data.customers.map((item) => item.customern);
      setCustomer(extractedCustomers);
    } catch (err) {
      console.log("Error loading customers:", err);
    }
  };

  const loadCpo = async (page) => {
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/customerpos?page=${page}&limit=${6}`
      );
      setCustomerpo(data.customers || []);
      setTotalPages(data.totalPages || 1);
      setCpoList(data.customers.map((item) => item.customerpo));
    } catch (err) {
      console.log(err);
    }
  };



  const loadSalesItemsForCPO = async (cpoId) => {
    if (!cpoId) {
        console.error("CPO ID is undefined");
        return; 
    }
    try {
        const { data } = await axios.get(`http://localhost:8000/api/itempos?customerPo=${cpoId}`);
        setSalesItems(data); 
    } catch (err) {
        console.error("Error loading sales items for CPO:", err);
        toast.error("Failed to load sales items");
    }
};

useEffect(() => {
  if (editingCpo && editingCpo._id) {
      loadSalesItemsForCPO(editingCpo._id); 
  }
}, [editingCpo]);


  const handleEditItem = async (item) => {
    setEditingCpo(item);
    setVisible(true);
    setCurrentCpoId(item._id); 
    console.log("Editing CPO ID: ", item._id); 
    await loadSalesItemsForCPO(item._id);
  };

  

  const handleCpoSelect = async (cpoId) => {
    setSelectedCpoId(cpoId);
    await loadSalesItemsForCPO(cpoId); 
  };


  const handleSaveSalesItems = async (newSalesItems) => {
    try {
      await axios.post(`http://localhost:8000/api/itempos`, {
        items: newSalesItems,
        customerPo: selectedCpoId, 
      });
      toast.success("Sales items saved successfully!");
      await loadSalesItemsForCPO(selectedCpoId); 
    } catch (err) {
      console.error("Error saving sales items:", err);
      toast.error("Failed to save sales items");
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:8000/api/customerpos/${itemId}`
      );
      console.log(data);
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(`${data.message}`);
        loadCpo(currentPage);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const loadSalesItems = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/itempos");
      if (Array.isArray(data) && data.length > 0) {
        setSalesItems(data);
      } else {
        setSalesItems([]);
      }
    } catch (err) {
      console.error("Error loading sales items:", err);
      toast.error("Failed to load sales items");
    }
  };


  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const refreshCustomers = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/customers");
      setCustomer(data.customers || []);
    } catch (err) {
      console.log(err);
    }
  };



  return (
    <>
      <div className="main-container">
        <h1>Manage Customer PO</h1>
        <div className="StyledDiv">
          <div className="ButtonContainer">
            <div className="Dropdown-item">
              <Select
                name="customern"
                value={customer.find((c) => c._id === customern)}
                onChange={(selectedOption) =>
                  setCustomern(selectedOption.value)
                }
                className="SearchbelDropdown"
                placeholder="Select Customer"
                options={customer.map((cust) => ({
                  value: cust._id,
                  label: cust.name,
                }))}
              />

              <label htmlFor="orderDate" className="label">
                Order Date:
              </label>
              <input
                type="date"
                id="orderDate"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
              />

              <Select
                className="SearchbelDropdown"
                placeholder="Customer PO..."
                onChange={(selectedOption) => {
                  setCurrentCpoId(selectedOption.value)
                  handleCpoSelect(selectedOption.value)
                }}
                options={cpoList.map((cpo) => ({
                  value: cpo,
                  label: cpo,
                }))}
              />
            </div>
            <div>
              <input
                type="search"
                className="searchitem"
                placeholder="Search..."
              />
              <button className="StyledButton" onClick={() => {}}>
                <BiSearch className="SearchIcon" />
                Search
              </button>
              <button className="StyledButton" onClick={() => setVisible(true)}>
                <BiAddToQueue className="Add" />
                Add CPO
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="list-name">Customer PO List:</h2>
          <table className="table table-bordered table-striped">
            <thead className="table-secondary">
              <tr>
                <th>Customer Name</th>
                <th>Customer PO</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {customerpo.map((item) => (
                <tr key={item._id}>
                  <td>{item.customern?.name}</td>
                  <td>{item.customerpo}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>{item.cpoTotal}                        </td>

                  <td>{item.status}</td>
                  <td>
                    <div className="button-group">
                      <Tooltip title="Edit">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="btns1"
                        >
                          <BiEdit />
                        </button>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="btns2"
                        >
                          <BiTrash />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          current={currentPage}
          total={totalPages * pageSize}
          pageSize={6}
          onChange={onPageChange}
          showSizeChanger={false}
        />
      </div>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={750}
      >
        <SalesOrder
          setVisible={setVisible}
          editingCpo={editingCpo}
          refreshData={loadCpo}
          currentCpoId={currentCpoId}
          refreshCustomers={refreshCustomers} // new added
          loadSalesItemsForCPO={loadSalesItemsForCPO} // new added
          onSave={handleSaveSalesItems} 
        />
      </Modal>
    </>
  );
}

export default ManageCPO;
