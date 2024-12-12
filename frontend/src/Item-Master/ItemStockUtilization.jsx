import styled from "styled-components";
import "../StyleCSS/Customer.css";



function ItemStockUtilization({ item: selectedItem }) {
  return (
    <>
      <div className="itemStockDetails">
        <h1 style={{ textAlign: "center" }}>Item Stock Utilization</h1>
        <div>
          <div className="ButtonContainerstockdetails">
            <h3>Item Name: {selectedItem.item}</h3>
            <h3>Item Category: {selectedItem.category}</h3>
            <h3>Brand: {selectedItem.brand}</h3>
          </div>
        </div>
        <div className="ButtonContainer">
          <div>
            <h3>Item Stock:</h3>
            <table className="table table-bordered table-striped table-hover shadow">
              <thead className="table-secondary">
                <tr>
                  <th>Date</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Purchase Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{selectedItem.date}</td>
                  <td>{selectedItem.stock}</td>
                  <td>{selectedItem.unit}</td>
                  <td>{selectedItem.price}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <h3>Item Utilization:</h3>
            <table className="table table-bordered table-striped table-hover shadow">
              <thead className="table-secondary">
                <tr>
                  <th>PO Date</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Purchase Order</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{selectedItem.date}</td>
                  <td>{selectedItem.qty}</td>
                  <td>{selectedItem.unit}</td>
                  <td>{selectedItem.po}</td>
                </tr>
                <tr>
                  <td>02/10/2024</td>
                  <td>5</td>
                  <td>PCS</td>
                  <td>PO001</td>
                </tr>
                <tr>
                  <td>11/10/2024</td>
                  <td>8</td>
                  <td>PCS</td>
                  <td>PO002</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="ButtonContainer">
          <span>Total Item Stock: {selectedItem.stock} </span>
          <span>Item Utilization: </span>
          <span>Available Stock: </span>
        </div>
      </div>
    </>
  );
}

export default ItemStockUtilization;
