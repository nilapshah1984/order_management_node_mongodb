import React, { useState, useEffect } from "react";
import SalesOrder from "../Customer-Order/CustomerPo";
import { BiAddToQueue, BiEdit, BiSearch } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { Modal, Tooltip, Pagination, Popconfirm } from "antd";
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
  const [pageSize] = useState(10);
  const [cpoList, setCpoList] = useState([]);
  const [selectedCpoId, setSelectedCpoId] = useState();
  const [filteredCPOs, setFilteredCPOs] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    loadCpo(currentPage);
    loadCpoList();
    loadSalesItems();
  }, [currentPage]);

  const loadCpoList = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/customerpos");
      console.log("CPO:", data);
    } catch (err) {
      console.error("Error loading customers:", err);
    }
  };

  const loadCpo = async (page) => {
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/customerpos?page=${page}&limit=${6}`
      );
      setCustomerpo(data.customers || []);
      setTotalPages(data.totalPages || 1);

      const uniqueCustomers = Array.from(
        new Set(data.customers.map((item) => JSON.stringify(item.customern)))
      ).map((cust) => JSON.parse(cust));
      console.log("CPO Customers:", uniqueCustomers);

      setCustomer(uniqueCustomers);
    } catch (err) {
      console.error("Error loading CPO:", err);
    }
  };

  const loadSalesItems = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8000/api/itempos`);
      setSalesItems(data || []);
    } catch (err) {
      console.error("Error loading sales items for CPO:", err);
      toast.error("Failed to load sales items");
    }
  };

  const handleEditItem = (item) => {
    setEditingCpo(item);
    setVisible(true);
    setCurrentCpoId(item._id);
  };

  const handleCpoSelect = (cpoId) => {
    setSelectedCpoId(cpoId);
  };

  const handleDelete = async (itemId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:8000/api/customerpos/${itemId}`
      );
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        loadCpo(currentPage);
      }
    } catch (err) {
      console.error("Error deleting CPO:", err);
    }
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredCPO = customern
    ? customerpo.filter((item) => item.customern?._id === customern)
    : customerpo;

  useEffect(() => {
    if (customern) {
      const cposForSelectedCustomer = customerpo.filter(
        (item) => item.customern?._id === customern
      );
      setFilteredCPOs(cposForSelectedCustomer);
      setSelectedCpoId(null);
    } else {
      setFilteredCPOs([]);
    }
  }, [customern, customerpo]);

  const displayedCPO = selectedCpoId
    ? filteredCPOs.filter((item) => item._id === selectedCpoId)
    : filteredCPO;

  const filteredByDateCPO = orderDate
    ? displayedCPO.filter(
        (item) => new Date(item.date).toISOString().split("T")[0] === orderDate
      )
    : displayedCPO;

  const searchAll = () => {
    if (!searchInput) return filteredByDateCPO;

    return filteredByDateCPO.filter((item) => {
      const customerName = item.customern?.name.toLowerCase() || "";
      const customerPO = item.customerpo.toLowerCase();
      const date = new Date(item.date).toLocaleDateString();

      return (
        customerName.includes(searchInput.toLowerCase()) ||
        customerPO.includes(searchInput.toLowerCase()) ||
        date.includes(searchInput.toLowerCase())
      );
    });
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
                value={customer.find((c) => c._id === customern) || null}
                onChange={(selectedOption) => {
                  setCustomern(selectedOption?.value || "");
                }}
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
                className="orderinput"
              />
              <Select
                className="SearchbelDropdown"
                placeholder="Customer PO..."
                onChange={(selectedOption) => {
                  setCurrentCpoId(selectedOption.value);
                  handleCpoSelect(selectedOption.value);
                }}
                options={filteredCPOs.map((cpo) => ({
                  value: cpo._id,
                  label: cpo.customerpo,
                }))}
                isDisabled={!customern}
              />
            </div>
            <div>
              <input
                type="search"
                className="searchitem"
                placeholder="Search..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                }}
              />
              <button className="StyledButton">
                <BiSearch className="SearchIcon" />
                Search
              </button>
              <button
                className="StyledButton"
                onClick={() => {
                  setVisible(true);
                  setEditingCpo(null);
                }}
              >
                <BiAddToQueue className="Add" />
                Add CPO
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="list-name">Customer PO List:</h2>
          <table className="table table-bordered table-striped">
            <thead className="table-secondary TH-SIZE">
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
              {searchAll().map((item) => {
                const relatedSalesItems = salesItems.filter(
                  (salesItem) => salesItem.customerPo === item._id
                );

                const totalSalesPrice = relatedSalesItems.reduce(
                  (total, salesItem) => total + (salesItem.salesPrice || 0),
                  0
                );

                return (
                  <tr key={item._id} className="TD-SIZE">
                    <td>{item.customern?.name || ""}</td>
                    <td>{item.customerpo}</td>
                    <td>{new Date(item.date).toLocaleDateString()}</td>
                    <td>{totalSalesPrice.toFixed(2)}</td>
                    <td>{item.status}</td>
                    <td>
                      <div className="button-group">
                        <Tooltip title="Edit">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="btns1"
                          >
                            <BiEdit className="icon-size" />
                          </button>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <Popconfirm
                            placement="topLeft"
                            title="Are you sure to delete this customer?"
                            onConfirm={() => handleDelete(item._id)}
                            okText="Delete"
                            okButtonProps={{
                              style: {
                                backgroundColor: "red",
                                color: "white",
                                border: "none",
                              },
                            }}
                          >
                            <button className="btns2">
                              <MdDelete className="icon-size" />
                            </button>
                          </Popconfirm>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
        onCancel={() => {
          setVisible(false);
          setEditingCpo(null);
        }}
        footer={null}
        width={750}
      >
        <SalesOrder
          setVisible={setVisible}
          editingCpo={editingCpo}
          refreshData={loadCpo}
          refreshCustomers={loadCpoList}
          currentPage={currentPage}
          loadCpo={loadCpo}
        />
      </Modal>
    </>
  );
}

export default ManageCPO;
