import React, { useEffect, useState } from "react";
import AddItem from "./AddItem";
import ItemStockUtilization from "./ItemStockUtilization";
import ItemPrice from "./ItemPrice";
import {BiInfoCircle,BiAddToQueue,BiPackage,BiSearch,BiSolidEdit,} from "react-icons/bi";
import Select from "react-select";
import { MdDelete } from "react-icons/md";
import { Modal, Pagination, Tooltip, Popconfirm } from "antd";
import axios from "axios";
import toast from "react-hot-toast";
import "../StyleCSS/Customer.css";

function ManageItem() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [visible, setVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [supplier, setSupplier] = useState([]);
  const [showStock, setShowStock] = useState(false);
  const [showItem, setShowItem] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("item");
  const [sortOrder, setSortOrder] = useState("asc");
  const [itemsPrice, setItemsPrice] = useState([]);
  const [totalStockQuantity, setTotalStockQuantity] = useState(0);

  const itemsPerPage = 10;

  const handleSearch = (selectedOption) => {
    if (selectedOption) {
      const filtered = items.filter(
        (item) => item.item.toLowerCase() === selectedOption.label.toLowerCase()
      );
      setFilteredItems(filtered);
      setSearchTerm(selectedOption.label);
    } else {
      setFilteredItems(items);
    }
  };

  const handleSearchItem = () => {
    if (searchTerm) {
      const filtered = items.filter((item) => {
        const matchesCategory = item.category
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesBrand = item.brand
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        return matchesCategory || matchesBrand;
      });
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      setFilteredItems(items);
    }
  }, [searchTerm, items]);

  useEffect(() => {
    loadSupplier();
  }, []);


  const loadAllSuppliers = async () => {
    let allSuppliers = [];
    let currentPage = 1;
    let hasMore = true;
    while (hasMore) {
      const supplierResponse = await axios.get(
        `http://localhost:8000
/api/suppliers?page=${currentPage}&limit=10`
      );
      const suppliers = supplierResponse.data.suppliers;
      allSuppliers = [...allSuppliers, ...suppliers];
      if (suppliers.length < 10) {
        hasMore = false;
      } else {
        currentPage++;
      }
    }
    return allSuppliers;
  };

  const loadAllItems = async () => {
    let allItems = [];
    let currentPage = 1;
    let hasMore = true;
    while (hasMore) {
      const itemResponse = await axios.get(
        `http://localhost:8000
/api/items?page=${currentPage}&limit=10`
      );
      const items = itemResponse.data.items;
      allItems = [...allItems, ...items];
      if (items.length < 10) {
        hasMore = false;
      } else {
        currentPage++;
      }
    }
    return allItems;
  };

  const loadSupplierAndItems = async () => {
    try {
      const allItems = await loadAllItems();
      const supplierIDs = allItems.map((item) => item.supplier._id);      
      const allSuppliers = await loadAllSuppliers();
      const filteredSuppliers = allSuppliers.filter((sup) =>
        supplierIDs.includes(sup._id)
      );
      setSupplier(filteredSuppliers);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  useEffect(() => {
    loadSupplierAndItems();
    loadItemstock();
    saveStockToDatabase();
    }, []);


  const handleSupplierSelect = (selectedSupplier) => {
    if (selectedSupplier) {
      const filtered = items.filter(
        (item) => item.supplier._id === selectedSupplier.value
      );
      setFilteredItems(filtered);
      setSearchTerm(selectedSupplier.label);
    } else {
      setFilteredItems(items);
    }
  };
  

  const loadSupplier = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/suppliers");
      if (Array.isArray(data)) {
        setSupplier(data);
      } else {
        setSupplier([]);
      }
    } catch (err) {
      console.log("API Error:", err);
      setSupplier([]);
    }
  };

  const loadItems = async (page = 1) => {
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/items?page=${page}&limit=${itemsPerPage}`
      );
      setItems(data.items);
      setFilteredItems(data.items);
      setTotalItems(data.totalItems);
      await loadItemstock(data.items);
      } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadItems(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (items.length > 0) {
      loadItemstock(items); 
    }
  }, [items]);

  const onPageChange = (page) => {
    setCurrentPage(page);
    loadItems(page);
  };

  const itemOptions = items.map((item) => ({
    value: item._id,
    label: item.item,
  }));

  const handleEditItem = (item) => {
    setEditingItem(item);
    setVisible(true);
  };

  const handleDelete = async (itemId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:8000/api/items/${itemId}`
      );
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(`${data.item.item} is deleted`);
        loadItems();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleShowStock = (item) => {
    setSelectedItem(item);
    setShowStock(true);
  };
  

  const handleShowItemPrice = (item) => {
    setSelectedItem(item);
    setShowItem(true);
  };
  const sortItems = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
    const sortedItems = [...filteredItems].sort((a, b) => {
      if (a[field] < b[field]) return order === "asc" ? -1 : 1;
      if (a[field] > b[field]) return order === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredItems(sortedItems);
  }


  const onUpdateStock = (newStockQuantity) => {
    setTotalStockQuantity(newStockQuantity);
  };



  const saveStockToDatabase = async (itemsToSave) => {
    try {
      const saveRequests = itemsToSave.map((item) => {
        const formData = new FormData();
        formData.append("item", item.item); 
        formData.append("stock", item.stock);     
        return axios.post("http://localhost:8000/api/updateStock", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      });  
      await Promise.all(saveRequests);
    } catch (err) {
      console.log("Error saving stock to database: ", err.response?.data || err.message);
    }
  };
  


  const loadItemstock = async (itemsToLoad) => {
    try {
      const itemStockRequests = itemsToLoad.map((item) =>
        axios.get(`http://localhost:8000/api/itemprices?item=${item.item}`)
      );       
      const responses = await Promise.all(itemStockRequests);
      const stockMap = {};    
      responses.forEach((response) => {
        const itemPrices = response.data.items;
        itemPrices.forEach((item) => {
          const qty = parseInt(item.qty || 0, 10);
          if (stockMap[item.item]) {
            stockMap[item.item] += qty; 
          } else {
            stockMap[item.item] = qty; 
          }
        });
      });  
      const updatedFilteredItems = itemsToLoad.map((item) => ({
        ...item,
        stock: stockMap[item.item] || 0, 
      }));
      setFilteredItems(updatedFilteredItems); 
      await saveStockToDatabase(updatedFilteredItems);
    } catch (err) {
      console.log("Error in loadItemstock: ", err);
    }
  };


  useEffect(() => {
    // console.log("after update filteredIemss", filteredItems);
  }, [filteredItems]);
  

  
  return (
    <>
      <div className="main-container">
        <h1>Manage Items:</h1>
        <div className="StyledDiv">
          <div className="ButtonContainer">
            <div className="Dropdown-item">
              <Select
                className="SearchbelDropdown"
                options={itemOptions}
                onChange={handleSearch}
                placeholder="Item Name..."
              />
              <Select
                className="SearchbelDropdown"
                options={supplier.map((sup) => ({
                  value: sup._id,
                  label: sup.name,
                }))}
                onChange={handleSupplierSelect}
                placeholder="Supplier Name..."
                isClearable
              />

              <input
                type="search"
                className="searchitem"
                placeholder="Search..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="StyledButton" onClick={handleSearchItem}>
                <BiSearch className="SearchIcon" />
                Search
              </button>
            </div>
            <div>
              <button className="StyledButton" onClick={() => setVisible(true)}>
                <BiAddToQueue className="Add" />
                Add Item
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="list-name">Item List Tabel:</h2>
          <div>
            <table className="table table-bordered table-striped table-hover shadow">
              <thead className="table-secondary TH-SIZE">
                <tr>
                  <th onClick={() => sortItems("item")}>
                    Item Name{" "}{sortField === "item"  ? sortOrder === "asc" ? "↑" : "↓" : "" }
                  </th>
                  <th onClick={() => sortItems("supplier.name")}>
                    Supplier{" "}{sortField === "supplier.name" ? sortOrder === "asc" ? "↑" : "↓" : ""}
                  </th>
                  <th onClick={() => sortItems("category")}>
                    Category{" "}{sortField === "category" ? sortOrder === "asc" ? "↑" : "↓": ""}
                  </th>
                  <th onClick={() => sortItems("brand")} className="">  
                    Brand{" "}{sortField === "brand" ? sortOrder === "asc" ? "↑" : "↓" : ""}
                  </th>
                  <th onClick={() => sortItems("stock")}>
                    Stock{" "}{sortField === "stock"? sortOrder === "asc" ? "↑" : "↓" : ""}
                  </th>
                  <th onClick={() => sortItems("unit")}>
                    Unit{" "}{sortField === "unit" ? sortOrder === "asc" ? "↑" : "↓": ""}
                  </th>
                  <th onClick={() => sortItems("status")}>
                    Status{" "}{sortField === "status" ? sortOrder === "asc" ? "↑" : "↓" : ""}
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems?.map((item) => (
                  <tr key={item.id} className="TD-SIZE">
                    <td>{item.item}</td>
                    <td>{item.supplier?.name || "N/A"}</td>
                    <td>{item.category}</td>
                    <td>{item.brand}</td>
                    <td>{item.stock || 0}</td> 
                    <td>{item.unit}</td>
                    <td>{item.status}</td>
                    <td>
                      <div className="button-group">
                        <Tooltip title="Edit">
                          <button
                            className="btns1"
                            onClick={() => handleEditItem(item)}
                          >
                            <BiSolidEdit className="icon-size"/>
                          </button>
                        </Tooltip>
                        <Tooltip title="Stock">
                          <button
                            className="btns1"
                            onClick={() => handleShowItemPrice(item)}
                          >
                            <BiPackage className="icon-size"/>
                          </button>
                        </Tooltip>
                        <Tooltip title="View Utilization">
                          <button
                            className="btns1"
                            onClick={() => handleShowStock(item)}
                          >
                            <BiInfoCircle className="icon-size"/>
                          </button>
                        </Tooltip>
                        <Popconfirm
                          placement="topLeft"
                          title="Are you sure to delete this customer?"
                          onConfirm={() => handleDelete(item._id)}
                          okText="Delete"
                          okButtonProps={{
                            style: { backgroundColor: "red", color: "white", border: "none" },
                          }}
                        >
                          <button className="btns2">
                            <MdDelete  className="icon-size"/>
                          </button>
                        </Popconfirm>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              current={currentPage}
              total={totalItems}
              pageSize={itemsPerPage}
              onChange={onPageChange}
            />
          </div>
        </div>
      </div>
      <Modal visible={visible} onCancel={() => setVisible(false)} footer={null} >
        <AddItem
          // item={editingItem}
          editingItem={editingItem}
          setVisible={setVisible}
          loadItems={loadItems}
          setEditingItem={setEditingItem}
          items={items} 
          onClose={() => {
            setVisible(false);
            loadItems(currentPage);
          }}
        />
      </Modal>
      <Modal
        visible={showStock}
        onCancel={() => setShowStock(false)}
        footer={null}
        width={1000}
      >
        <ItemStockUtilization
          item={selectedItem}
          onClose={() => setShowStock(false)}
        />
      </Modal>
      <Modal
        visible={showItem}
        onCancel={() => setShowItem(false)}
        footer={null}
        width={600}
      >
        <ItemPrice 
          item={selectedItem} 
          onClose={() => setShowItem(false)} 
          onUpdateStock={onUpdateStock}
          loadItems={loadItems}
        />
      </Modal>
    </>
  );
}

export default ManageItem;


