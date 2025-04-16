// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../StyleCSS/Customer.css";

// function ItemStockUtilization({ item: selectedItem }) {
//   const [itemPrices, setItemPrices] = useState([]);
//   const [latestPrice, setLatestPrice] = useState(null);
//   const [latestDate, setLatestDate] = useState(null);
//   const [latestQty, setLatestQty] = useState(null);
//   const [purchaseOrderDetails, setPurchaseOrderDetails] = useState([]);

//   useEffect(() => {
//     const fetchItemPrices = async () => {
//       try {
//         const { data } = await axios.get(
//           `http://localhost:8000/api/itemprices?item=${selectedItem.item}`
//         );
//         setItemPrices(data.items || []);

//         if (data.items.length > 0) {
//           const latest = data.items.reduce((prev, current) => {
//             return new Date(prev.date) > new Date(current.date)
//               ? prev
//               : current;
//           });
//           setLatestPrice(latest.price);
//           setLatestDate(latest.date);
//           setLatestQty(latest.qty);
//         }
//       } catch (err) {
//         console.log("Error fetching item prices: ", err);
//       }
//     };

//     if (selectedItem) {
//       fetchItemPrices();
//     }
//   }, [selectedItem]);

//   useEffect(() => {
//     loadPurchaseItem();
//   }, [selectedItem]);

//   const loadPurchaseItem = async () => {
//     try {
//       const { data } = await axios.get(`http://localhost:8000/api/itemppos`);

//       const matchingItems = data.filter(
//         (purchaseItem) => purchaseItem.item.item === selectedItem._id
//       );
//       console.log("Matching Purchase Items:", matchingItems);

//       if (matchingItems.length > 0) {
//         const purchaseOrders = await Promise.all(
//           matchingItems.map(async (item) => {
//             const orderDetails = await loadPurchaseOrder(item.purchaseOrderId);
//             return {
//               ...orderDetails,
//               altQty: item.altqty, 
//             };
//           })
//         );

//         setPurchaseOrderDetails(purchaseOrders.filter(order => order)); 
//       } else {
//         console.log("No matching purchase items found.");
//         setPurchaseOrderDetails([]);
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const loadPurchaseOrder = async (purchaseOrderId) => {
//     console.log("Calling loadPurchaseOrder with ID:", purchaseOrderId);
//     try {
//       const { data } = await axios.get(`http://localhost:8000/api/purchases`);
//       const purchaseOrders = data.items || [];

//       if (Array.isArray(purchaseOrders)) {
//         const matchingOrder = purchaseOrders.find(order => order._id === purchaseOrderId);
//         if (matchingOrder) {
//           return {
//             date: matchingOrder.date,
//             purchase: matchingOrder.purchase,
//           };
//         } else {
//           console.log("No matching purchase order found.");
//           return null; 
//         }
//       } else {
//         console.log("purchaseOrders is not an array.");
//         return null; 
//       }
//     } catch (err) {
//       console.log("Error fetching purchase orders:", err);
//       return null; 
//     }
//   };

//   return (
//     <>
//       <div className="itemStockDetails">
//         <h1 style={{ textAlign: "center" }}>Item Stock Utilization</h1>
//         <div>
//           <div className="ButtonContainerstockdetails">
//             <h3>Item Name: {selectedItem.item}</h3>
//             <h3>Item Category: {selectedItem.category}</h3>
//             <h3>Brand: {selectedItem.brand}</h3>
//           </div>
//         </div>
//         <div className="ButtonContainer">
//           <div>
//             <h3>Item Stock:</h3>
//             <table className="table table-bordered table-striped table-hover shadow">
//               <thead className="table-secondary">
//                 <tr>
//                   <th>Date</th>
//                   <th>Qty</th>
//                   <th>Unit</th>
//                   <th>Purchase Price</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {itemPrices.map((itemPrice, index) => (
//                   <tr key={index}>
//                     <td>{new Date(itemPrice.date).toLocaleDateString()}</td>
//                     <td>{itemPrice.qty}</td>
//                     <td>{selectedItem.unit}</td>
//                     <td>{itemPrice.price}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           <div>
//             <h3>Item Utilization:</h3>
//             <table className="table table-bordered table-striped table-hover shadow">
//               <thead className="table-secondary">
//                 <tr>
//                   <th>PO Date</th>
//                   <th>Qty</th>
//                   <th>Unit</th>
//                   <th>Purchase Order</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {purchaseOrderDetails.map((order, index) => (
//                   <tr key={index}>
//                     <td>{order.date ? new Date(order.date).toLocaleDateString() : ""}</td>
//                     <td>{order.altQty !== null ? order.altQty : ""}</td> 
//                     <td>{selectedItem.unit}</td>
//                     <td>{order.purchase || selectedItem.po}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//         <div className="ButtonContainer">
//           <span>Total Item Stock: {selectedItem.stock} </span>
//           <span>Item Utilization: {purchaseOrderDetails.reduce((total, order) => total + (order.altQty || 0), 0)}</span>
//           <span>Available Stock: {selectedItem.stock - purchaseOrderDetails.reduce((total, order) => total + (order.altQty || 0), 0)} </span>
//         </div>
//       </div>
//     </>
//   );
// }

// export default ItemStockUtilization;


import React, { useEffect, useState } from "react";
import axios from "axios";
import "../StyleCSS/Customer.css";

function ItemStockUtilization({ item: selectedItem }) {
  const [itemPrices, setItemPrices] = useState([]);
  const [latestPrice, setLatestPrice] = useState(null);
  const [latestDate, setLatestDate] = useState(null);
  const [latestQty, setLatestQty] = useState(null);
  const [purchaseOrderDetails, setPurchaseOrderDetails] = useState([]);

  useEffect(() => {
    const fetchItemPrices = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/itemprices?item=${selectedItem.item}`
        );
        setItemPrices(data.items || []);

        if (data.items.length > 0) {
          const latest = data.items.reduce((prev, current) => {
            return new Date(prev.date) > new Date(current.date)
              ? prev
              : current;
          });
          setLatestPrice(latest.price);
          setLatestDate(latest.date);
          setLatestQty(latest.qty);
        }
      } catch (err) {
        console.log("Error fetching item prices: ", err);
      }
    };

    if (selectedItem) {
      fetchItemPrices();
    }
  }, [selectedItem]);

  useEffect(() => {
    loadPurchaseItem();
  }, [selectedItem]);

  const loadPurchaseItem = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8000/api/itemppos`);

      const matchingItems = data.filter(
        (purchaseItem) => purchaseItem.item.item === selectedItem._id
      );
      // console.log("Matching Purchase Items:", matchingItems);

      if (matchingItems.length > 0) {
        const purchaseOrders = await Promise.all(
          matchingItems.map(async (item) => {
            const orderDetails = await loadPurchaseOrder(item.purchaseOrderId);
            return {
              ...orderDetails,
              altQty: item.altqty,
            };
          })
        );

        setPurchaseOrderDetails(purchaseOrders.filter((order) => order));
      } else {
        console.log("No matching purchase items found.");
        setPurchaseOrderDetails([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const loadPurchaseOrder = async (purchaseOrderId) => {
    console.log("Calling loadPurchaseOrder with ID:", purchaseOrderId);
    try {
      const { data } = await axios.get(`http://localhost:8000/api/purchases`);
      const purchaseOrders = data.items || [];

      if (Array.isArray(purchaseOrders)) {
        const matchingOrder = purchaseOrders.find(
          (order) => order._id === purchaseOrderId
        );
        if (matchingOrder) {
          return {
            date: matchingOrder.date,
            purchase: matchingOrder.purchase,
          };
        } else {
          console.log("No matching purchase order found.");
          return null;
        }
      } else {
        console.log("purchaseOrders is not an array.");
        return null;
      }
    } catch (err) {
      console.log("Error fetching purchase orders:", err);
      return null;
    }
  };

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
            <table className="table table-bordered table-striped table-hover shadow mx-2">
              <thead className="table-secondary">
                <tr>
                  <th>Date</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Purchase Price</th>
                </tr>
              </thead>
              <tbody>
                {itemPrices.map((itemPrice, index) => (
                  <tr key={index}>
                    <td>{new Date(itemPrice.date).toLocaleDateString()}</td>
                    <td>{itemPrice.qty}</td>
                    <td>{selectedItem.unit}</td>
                    <td>{itemPrice.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
          <h3>Item CPO:</h3>
          <table className="table table-bordered table-striped table-hover shadow mx-2">
            <thead className="table-secondary">
              <tr>
                <th>CPO Date</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>CPO Order</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
          <div>
            <h3>Item Utilization:</h3>
            <table className="table table-bordered table-striped table-hover shadow mx-2">
              <thead className="table-secondary">
                <tr>
                  <th>PO Date</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Purchase Order</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrderDetails.map((order, index) => (
                  <tr key={index}>
                    <td>
                      {order.date
                        ? new Date(order.date).toLocaleDateString()
                        : ""}
                    </td>
                    <td>{order.altQty !== null ? order.altQty : ""}</td>
                    <td>{selectedItem.unit}</td>
                    <td>{order.purchase || selectedItem.po}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="ButtonContainer">
          <span>Total Item Stock: {selectedItem.stock} </span>
          <span>
            Item Utilization:{" "}
            {purchaseOrderDetails.reduce(
              (total, order) => total + (order.altQty || 0),
              0
            )}
          </span>
          <span>
            Available Stock:{" "}
            {selectedItem.stock -
              purchaseOrderDetails.reduce(
                (total, order) => total + (order.altQty || 0),
                0
              )}{" "}
          </span>
        </div>
      </div>
    </>
  );
}

export default ItemStockUtilization;

