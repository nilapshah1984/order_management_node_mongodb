import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import "../StyleCSS/Customer.css";
import { Modal, Pagination } from "antd";

function ItemPrice({ setShowItem, item: selectedItem, onUpdateStock }) {
  const [itemprice, setItemsprice] = useState([]);
  const [editprice, setEditprice] = useState(null);
  const [formData, setFormData] = useState({
    price: "",
    qty: "",
    date: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortField, setSortField] = useState("price");
  const [sortOrder, setSortOrder] = useState("asc");

  const itemsPricePage = 5;


  useEffect(() => {
    if (selectedItem) {
      loadItemsprice(selectedItem, currentPage);
    }
  }, [selectedItem, currentPage]);


  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const loadItemsprice = async (selectedItem, pageNumber) => {
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/itemprices?item=${selectedItem.item}&page=${pageNumber}&sortField=${sortField}&sortOrder=${sortOrder}`
      );
      // console.log("Fetched item prices:", data);

      setItemsprice(data.items || []);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalCount);
    } catch (err) {
      console.log("Error in loadItemsprice: ", err);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editprice) {
        response = await axios.put(
          `http://localhost:8000/api/itemprices/${editprice._id}`,
          formData,
          {headers: { "Content-Type": "multipart/form-data" }}
        );
      } else {
        response = await axios.post(
          "http://localhost:8000/api/itemprice",
          { ...formData, item: selectedItem.item },
          {headers: { "Content-Type": "multipart/form-data" }}
        );
      }
      const { data } = response;
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(
          editprice
            ? "Item Price Updated Successfully!"
            : "Item Price Added Successfully!"
        );
        loadItemsprice(selectedItem);
        resetForm();
        setEditprice(null);

        const totalQty = itemprice.reduce((total, price) => total + Number(price.qty), 0);
        onUpdateStock(totalQty);

        await axios.put(`http://localhost:8000/api/items/${selectedItem._id}`, {
          stock: totalQty, 
        });
      }
    } catch (err) {
      console.log("Error in handleSubmit: ", err);
      toast.error("Something went wrong.");
    }
  };


  const resetForm = () => {
    setFormData({
      price: "",
      qty: "",
      date: "",
    });
    setEditprice(null);
  };


  const handleEdit = (itemprice) => {
    setEditprice(itemprice);
    setFormData({
      price: itemprice.price,
      qty: itemprice.qty,
      date: itemprice.date ? itemprice.date.split("T")[0] : "",
    });
  };


  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:8000/api/itemprices/${id}`
      );

      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(`Item Price is deleted`);
        loadItemsprice();
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong.");
      loadItemsprice(selectedItem);
    }
  };


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    loadItemsprice(selectedItem, pageNumber);

    const totalQty = itemprice.reduce((total, price) => total + Number(price.qty), 0);
    onUpdateStock(totalQty); 

    console.log("Page Changed to:", pageNumber);
    console.log("Current Page after change:", pageNumber);
  };


  const sortItems = (column) => {
    const sortedData = [...itemprice];
    if (sortField === column && sortOrder === "asc") {
      sortedData.sort((a, b) => (a[column] < b[column] ? 1 : -1));
      setSortOrder("desc");
    } else {
      sortedData.sort((a, b) => (a[column] > b[column] ? 1 : -1));
      setSortOrder("asc");
    }
    setItemsprice(sortedData);
    setSortField(column);
  };


  return (
    <>
      <div>
        <form onSubmit={handleSubmit} className="customer-form">
          <h1>Add / Edit Item Stock</h1>

          <div className="form-divide">
            <div className="item-namediv">
              <label className="item-form__label">Item Name: </label>
              <p className="itemname">{selectedItem.item}</p>
            </div>
            <div className="item-value">
              <label className="item-form__label">Purchase Price :</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Price"
                required
                className="item-form__input"
              />
            </div>
            <div className="item-value">
              <label className="item-form__label"> Date : </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                placeholder="Date"
                required
                className="item-form__input"
              />
            </div>
            <div className="item-value">
              <label className="item-form__label"> QTY : </label>
              <input
                type="number"
                name="qty"
                value={formData.qty}
                onChange={handleInputChange}
                placeholder="Quantity"
                required
                className="item-form__input"
              />
            </div>
          </div>
          <div className="item-value">
            <button type="submit" className="StyledButton1">
              {editprice ? "Update" : "Save"}
            </button>
            <button
              type="button"
              className="StyledButton11"
              onClick={resetForm}
            >
              Clear
            </button>
          </div>
        </form>
        <div>
          <h2 className="itempricename">
            Item Prices for {selectedItem.item}:
          </h2>
          <table className="table table-bordered table-striped table-hover shadow">
            <thead className="table-secondary">
              <tr>
                <th onClick={() => sortItems("price")}>
                  Price{" "}
                  {sortField === "price"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>
                <th onClick={() => sortItems("qty")}>
                  Quantity{" "}
                  {sortField === "qty" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th onClick={() => sortItems("date")}>
                  Date{" "}
                  {sortField === "date"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {itemprice?.map((price) => (
                <tr key={price._id}>
                  <td>{price.price}</td>
                  <td>{price.qty}</td>
                  <td>{new Date(price.date).toLocaleDateString()}</td>
                  <td>
                    <div className="button-group">
                      <button
                        className="btns1"
                        onClick={() => handleEdit(price)}
                      >
                        <BiSolidEdit />
                      </button>
                      <button
                        className="btns2"
                        onClick={() => handleDelete(price._id)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          
          {itemprice.length > 0 &&
            itemprice.reduce((total, price) => total + Number(price.qty), 0) >
              0 && (
              <p>
                Total Qty:{" "}
                {itemprice.reduce(
                  (total, price) => total + Number(price.qty),
                  0
                )}
              </p>
            )}

          <Pagination
            current={currentPage}
            total={totalItems}
            pageSize={itemsPricePage}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}

export default ItemPrice;
