import React, { useState, useEffect } from "react";
import PurchaseOrder from "./PurchaseOrder";
import { BiAddToQueue, BiEdit, BiSearch, BiTrash } from "react-icons/bi";
import { Modal, Tooltip } from "antd";
import axios from "axios";
import toast from "react-hot-toast";
import { Pagination } from "antd";
import Select from "react-select";

function ManagePurchase() {
  const [visible, setVisible] = useState(false);
  const [poList, setPoList] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [purchaseData, setPurchaseData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [purchaseItems, setPurchaseItems] = useState([]);

  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedCPO, setSelectedCPO] = useState("");
  const [purchaseEditing, setPurchaseE] = useState(null);
  const [associatedItems, setAssociatedItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const [purchasePrice, setPurchasePrice] = useState(null);

  useEffect(() => {
    loadPurchase();
    loadcCustomers();
    saveStockToDatabase();
  }, []);

  useEffect(() => {
    console.log("Selected Customer ID:", selectedCustomerId);
    console.log("Selected CPO:", selectedCPO);
  }, [selectedCustomerId, selectedCPO]);

  const loadcCustomers = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/customers");
      setCustomers(Array.isArray(data.customers) ? data.customers : []);
    } catch (err) {
      console.log(err);
    }
  };

  const loadPurchase = async (page = 1) => {
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/purchases?page=${page}&limit=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`
      );
      setPurchaseData(data.items);
      const uniquePOs = [
        ...new Set(data.items.map((purchase) => purchase.purchase)),
      ];
      setPoList(uniquePOs.map((po) => ({ value: po, label: po })));
      setTotalPages(Math.ceil(data.totalItems / pageSize));
      setCurrentPage(data.currentPage);
      await loadItemstock(data.items);
    } catch (err) {
      console.log(err);
    }
  };

  const onPageChange = (page) => {
    loadPurchase(page);
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
    loadPurchase(currentPage);
  };

  const handleDelete = async (itemId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:8000/api/purchases/${itemId}`
      );
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(`${data.item.customer?.name} is deleted`);
        loadPurchase();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditPurchase = (item) => {
    console.log("Editing purchase:", item);
    if (item && item._id) {
      setPurchaseE(item);
      setSelectedCustomerId(item.customer.name);
      setSelectedCPO(item.customerpo);
      setAssociatedItems(item.associatedItems || []);
      setVisible(true);
      setIsEditing(true);
      console.log("Customer ID:", item.customer.name);
      console.log("Customer PO:", item.customerpo);
    } else {
      console.error("Invalid item for editing:", item);
    }
  };

  const handleCloseModal = () => {
    console.log("Closing Modal");
    setVisible(false);
    setIsEditing(false);
    setPurchaseE(null);
    setAssociatedItems([]);
  };

  const handleAddPurchaseItem = (newItem) => {
    setPurchaseItems((prevItems) => [...prevItems, newItem]);
  };


  const saveStockToDatabase = async (itemsToSave) => {
    try {
      const saveRequests = itemsToSave.map((item) => {
        const formData = new FormData();
        formData.append("purchase", item.purchase);
        formData.append("totalPurchase", item.totalPurchase);
        return axios.post("http://localhost:8000/api/purchasetotal", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      });
      const saveResponses = await Promise.all(saveRequests);
    } catch (err) {
      console.log(
        "Error saving stock to database: ",
        err.response?.data || err.message
      );
    }
  };


  const loadItemstock = async (itemsToLoad) => {

    try {
      const purchasePiceRequests = itemsToLoad.map((item) =>
        axios.get(
          `http://localhost:8000/api/itemppos?purchaseOrderId=${item._id}`
        )
      );
      const responses = await Promise.all(purchasePiceRequests);
      const priceMap = {};

      responses.forEach((response) => {
        const itemPrices = response.data;
        itemPrices.forEach((item) => {
          const price = parseInt(item.purchasePrice || 0, 10);
          if (priceMap[item.purchaseOrderId]) {
            priceMap[item.purchaseOrderId] += price;
          } else {
            priceMap[item.purchaseOrderId] = price;
          }
        });
      });

      const updatedFilteredItems = itemsToLoad.map((item) => {
        return {
          ...item,
          totalPurchase: priceMap[item._id],
        };
      });
      await saveStockToDatabase(updatedFilteredItems);
    } catch (err) {
    }
  };



  useEffect(() => {
    if (purchaseData.length > 0) {
      loadItemstock(purchaseData);
    }
  }, [purchaseData]);

  return (
    <>
      <div className="main-container">
        <h1>Manage Purchases</h1>
        <div className="StyledDiv">
          <div className="ButtonContainer">
            <div className="Dropdown-item">
              <Select
                className="SearchbelDropdown"
                placeholder="Select Customer"
                options={customers.map((customer) => ({
                  value: customer._id,
                  label: customer.name,
                }))}
                onChange={(selectedOption) => {
                  console.log("Selected Customer:", selectedOption);
                  setSelectedCustomerId(selectedOption.value);
                }}
              />

              <label htmlFor="orderDate" className="label">
                Order Date:
              </label>
              <input
                type="date"
                id="orderDate"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <Select
                className="SearchbelDropdown"
                placeholder="Select PO.."
                options={poList}
                onChange={(selectedOption) => {
                  setSelectedCPO(selectedOption.value);
                }}
              />
            </div>

            <div>
              <button className="StyledButton" onClick={() => {}}>
                <BiSearch className="SearchIcon" />
                Search
              </button>
              <button className="StyledButton" onClick={() => setVisible(true)}>
                <BiAddToQueue className="Add" />
                Add Purchase Order
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="list-name">Order List:</h2>
          <table className="table table-bordered table-striped">
            <thead className="table-secondary">
              <tr>
                <th
                  onClick={() => handleSort("customer.name")}
                  style={{ cursor: "pointer" }}
                >
                  Customer Name{" "}
                  {sortField === "customer.name" &&
                    (sortOrder === "asc" ? "🔼" : "🔽")}
                </th>
                <th
                  onClick={() => handleSort("purchase")}
                  style={{ cursor: "pointer" }}
                >
                  Purchase Order{" "}
                  {sortField === "purchase" &&
                    (sortOrder === "asc" ? "🔼" : "🔽")}
                </th>
                <th
                  onClick={() => handleSort("customerpo")}
                  style={{ cursor: "pointer" }}
                >
                  Customer PO{" "}
                  {sortField === "customerpo" &&
                    (sortOrder === "asc" ? "🔼" : "🔽")}
                </th>
                <th
                  onClick={() => handleSort("total")}
                  style={{ cursor: "pointer" }}
                >
                  Total Purchase{" "}
                  {sortField === "total" && (sortOrder === "asc" ? "🔼" : "🔽")}
                </th>
                <th
                  onClick={() => handleSort("date")}
                  style={{ cursor: "pointer" }}
                >
                  Date{" "}
                  {sortField === "date" && (sortOrder === "asc" ? "🔼" : "🔽")}
                </th>
                <th
                  onClick={() => handleSort("status")}
                  style={{ cursor: "pointer" }}
                >
                  Status{" "}
                  {sortField === "status" &&
                    (sortOrder === "asc" ? "🔼" : "🔽")}
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(purchaseData) &&
                purchaseData.map((purchase, index) => (
                  <tr key={index}>
                    <td>{purchase.customer?.name}</td>
                    <td>{purchase.purchase}</td>
                    <td>{purchase.customerpo}</td>
                    <td>{purchase.totalPurchase || 0}</td>
                    <td>{purchase.date}</td>
                    <td>{purchase.status}</td>
                    <td>
                      <div className="button-group">
                        <Tooltip
                          title="Edit"
                          overlayInnerStyle={{
                            backgroundColor: "rgb(41, 10, 244)",
                            color: "white",
                            borderRadius: "10%",
                          }}
                        >
                          <button
                            onClick={() => handleEditPurchase(purchase)}
                            className="btns1"
                          >
                            <BiEdit />
                          </button>
                        </Tooltip>
                        <Tooltip
                          title="Delete"
                          overlayInnerStyle={{
                            backgroundColor: "rgb(244, 10, 10)",
                            color: "white",
                            borderRadius: "10%",
                          }}
                        >
                          <button
                            onClick={() => handleDelete(purchase._id)}
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
        <Modal
          open={visible}
          // onOk={() => setVisible(false)}
          onOk={handleCloseModal}
          onCancel={() => setVisible(false)}
          width={750}
          footer={null}
        >
          <PurchaseOrder
            purchaseEditing={purchaseEditing}
            customers={customers}
            isEditing={isEditing}
            customerId={selectedCustomerId}
            associatedItems={associatedItems}
            customerpO={selectedCPO}
            handleAddPurchaseItem={handleAddPurchaseItem}
            // updatePurchaseTotal={updatePurchaseTotal}
          />
        </Modal>
        <Pagination
          current={currentPage}
          total={totalPages * pageSize}
          pageSize={pageSize}
          onChange={onPageChange}
          showSizeChanger={false}
        />
      </div>
    </>
  );
}

export default ManagePurchase;
