import { useEffect, useState } from "react";
import AddSuppliers from "./AddSuppliers";
import { BiAddToQueue, BiSearch, BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { Modal, Popconfirm, Tooltip, Pagination } from "antd";
import axios from "axios";
import toast from "react-hot-toast";
import "../StyleCSS/Customer.css";
import AddItem from "../Item-Master/AddItem";

function ManageSupplier() {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visible, setVisible] = useState(false);
  const [editingSuppliers, setEditingSuppliers] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingItem, setEditingItem] = useState(null); 
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");


  useEffect(() => {
    loadSuppliers(currentPage, sortField, sortOrder);
  }, [currentPage, sortField, sortOrder]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async () => {
    setCurrentPage(1); 
    await loadSuppliers(1); 
  };

  // const loadSuppliers = async (page) => {
  //   try {
  //     const { data } = await axios.get(
  //       `http://localhost:8000/api/suppliers?search=${searchTerm}&page=${page}&limit=10`
  //     );
  //     setSuppliers(data.suppliers);
  //     setTotalPages(data.totalPages);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };


  const loadSuppliers = async (page, sortField = "", sortOrder = "") => {
    try {
      const query = `http://localhost:8000/api/suppliers?search=${searchTerm}&page=${page}&limit=10&sortField=${sortField}&sortOrder=${sortOrder}&_=${new Date().getTime()}`;
      const { data } = await axios.get(query);
      setSuppliers(data.suppliers);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.log(err);
    }
  };


  const handleDelete = async (supplierId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:8000/api/suppliers/${supplierId}`
      );
      if (data?.error) {
        toast.error(data.error);
      } else {
        loadSuppliers(currentPage);
        toast.success(`"${data.name}" is deleted`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditSupplier = (supplier) => {
    setEditingSuppliers(supplier);
    setVisible(true);
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
    loadSuppliers(page, sortField, sortOrder); 
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
    loadSuppliers(currentPage, field, order);
  };

  return (
    <>
      <div className="main-container">
        <h1>Manage Suppliers</h1>
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
              Add Supplier
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <h2 className="list-name">Supplier List:</h2>
          <table className="table table-bordered table-striped table-hover shadow">
            <thead className="table-secondary">
              {/* <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Area</th>
                <th>Status</th>
                <th>Action</th>
              </tr> */}
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
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier._id}>
                  <td>{supplier.name}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.phone}</td>
                  <td>{supplier.area}</td>
                  <td>{supplier.status}</td>
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
                          className="btns1"
                          onClick={() => handleEditSupplier(supplier)}
                        >
                          <BiSolidEdit />
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
                        <Popconfirm
                          placement="topLeft"
                          description="Are you sure to delete this supplier?"
                          onConfirm={() => handleDelete(supplier._id)}
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
          <AddSuppliers
            editingSuppliers={editingSuppliers}
            setVisible={setVisible}
            loadSuppliers={loadSuppliers}
          />

        </Modal>
      </div>
    </>
  );
}

export default ManageSupplier;
