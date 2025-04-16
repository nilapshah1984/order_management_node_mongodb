// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { BiEdit, BiTrash } from "react-icons/bi";
// import styled from "styled-components";
// import { Tooltip } from "antd";

// const Table = styled.table`
//   width: 100%;
//   border-collapse: collapse;
// `;

// const Th = styled.th`
//   border: 1px solid #ddd;
//   padding: 8px;
//   text-align: left;
// `;

// const Td = styled.td`
//   border: 1px solid #ddd;
//   padding: 8px;
// `;

// const Tr = styled.tr`
//   &:nth-child(even) {
//     background-color: #f2f2f2;
//   }
// `;

// const HeadTr = styled(Tr)`
//   background-color: #e2e3e7;
//   color: black;
// `;

// function AddPurchaseItem({
//   customerId,
//   setEditpo,
//   setShowAddOrEdit,
//   isEditing,
//   purchaseEditing,
//   filteredCPOs,
//   onSuccess,
// }) {
//   const [purchaseItems, setPurchaseItems] = useState([]);
//   const [totalPurchasePriceLocal, setTotalPurchasePriceLocal] = useState(0);

//   useEffect(() => {
//     loadPurchaseItems();
//   }, [customerId, isEditing]);

//   const loadPurchaseItems = async () => {
//     if (isEditing && purchaseEditing) {
//       try {
//         const { data } = await axios.get(
//           `http://localhost:8000/api/itemppos?purchaseOrderId=${purchaseEditing._id}`
//         );
//         setPurchaseItems(Array.isArray(data) ? data : []);
//         calculateTotalPrice(data);
//       } catch (err) {
//         console.log(err);
//         toast.error("Error loading purchase items");
//       }
//     } else {
//       setPurchaseItems([]);
//     }
//   };

//   const handlePODelete = async (itemId) => {
//     try {
//       const { data } = await axios.delete(
//         `http://localhost:8000/api/itemppos/${itemId}`
//       );
//       if (data?.error) {
//         toast.error(data.error);
//       } else {
//         toast.success(`${data.item.item} is deleted`);
//         loadPurchaseItems();
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleEditPurchaseItem = (item) => {
//     setEditpo(item);
//     setShowAddOrEdit(true);
//   };

//   const calculateTotalPrice = (items) => {
//     const total = items.reduce(
//       (sum, item) => sum + item.altqty * item.unitCost,
//       0
//     );
//     setTotalPurchasePriceLocal(total);
//   };

//   useEffect(() => {
//     calculateTotalPrice(purchaseItems);
//   }, [purchaseItems]);

//   return (
//     <>
//       {isEditing && (
//         <>
//           <Table>
//             <thead>
//               <HeadTr>
//                 <Th>Item</Th>
//                 <Th>Qty</Th>
//                 <Th>Unit Cost</Th>
//                 <Th>Purchase Price</Th>
//                 <Th>Invoice No</Th>
//                 <Th>Invoice Date</Th>
//                 <Th>Action</Th>
//               </HeadTr>
//             </thead>
//             <tbody>
//               {purchaseItems.map((item) => (
//                 <Tr key={item._id}>
//                   <Td>{item.item?.item || "N/A"}</Td>
//                   <Td>{item.altqty}</Td>
//                   <Td>{item.unitCost}</Td>
//                   <Td>{(item.altqty * item.unitCost).toFixed(2)}</Td>
//                   <Td>{item.invoiceNo}</Td>
//                   <Td>{new Date(item.invoiceDate).toLocaleDateString()}</Td>
//                   <Td>
//                     <Tooltip title="Edit">
//                       <button
//                         onClick={() => handleEditPurchaseItem(item)}
//                         className="btns1"
//                       >
//                         <BiEdit className="icon-size" />
//                       </button>
//                     </Tooltip>
//                     <Tooltip title="Delete">
//                       <button
//                         onClick={() => handlePODelete(item._id)}
//                         className="btns2"
//                       >
//                         <BiTrash className="icon-size" />
//                       </button>
//                     </Tooltip>
//                   </Td>
//                 </Tr>
//               ))}
//             </tbody>
//           </Table>
//           <div className="totaldiv">
//             {purchaseItems.length > 0 ? (
//               <p>
//                 <strong className="totalprice">Total Purchase Price:</strong> ₹
//                 {totalPurchasePriceLocal.toFixed(2)}
//               </p>
//             ) : null}
//           </div>
//         </>
//       )}
//     </>
//   );
// }

// export default AddPurchaseItem;

import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiEdit, BiTrash } from "react-icons/bi";
import styled from "styled-components";
import { Tooltip } from "antd";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const HeadTr = styled(Tr)`
  background-color: #e2e3e7;
  color: black;
`;

function AddPurchaseItem({
  customerId,
  setEditpo,
  setShowAddOrEdit,
  isEditing,
  purchaseEditing,
  filteredCPOs,
  onSuccess,
}) {
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [totalPurchasePriceLocal, setTotalPurchasePriceLocal] = useState(0);
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadPurchaseItems();
    loadItems();
  }, [customerId, isEditing]);

  const loadPurchaseItems = async () => {
    if (isEditing && purchaseEditing) {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/itemppos?purchaseOrderId=${purchaseEditing._id}`
        );
        setPurchaseItems(Array.isArray(data) ? data : []);
        calculateTotalPrice(data);
      } catch (err) {
        console.log(err);
        toast.error("Error loading purchase items");
      }
    } else {
      setPurchaseItems([]);
    }
  };

  const loadItems = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/items");
      console.log("Item For:", data);
      setItems(data.items);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const handlePODelete = async (itemId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:8000
/api/itemppos/${itemId}`
      );
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(`${data.item.item} is deleted`);
        loadPurchaseItems();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditPurchaseItem = (item) => {
    setEditpo(item);
    setShowAddOrEdit(true);
  };

  const calculateTotalPrice = (items) => {
    const total = items.reduce(
      (sum, item) => sum + item.altqty * item.unitCost,
      0
    );
    setTotalPurchasePriceLocal(total);
  };

  useEffect(() => {
    calculateTotalPrice(purchaseItems);
  }, [purchaseItems]);

  const getItemNameById = (id) => {
    const foundItem = items.find((item) => item._id === id);
    return foundItem ? foundItem.item : "N/A";
  };

  return (
    <>
      {isEditing && (
        <>
          <h2>Purchase Items Details:</h2>
          <Table>
            <thead>
              <HeadTr>
                <Th>Item</Th>
                <Th>Qty</Th>
                <Th>Unit Cost</Th>
                <Th>Purchase Price</Th>
                <Th>Invoice No</Th>
                <Th>Invoice Date</Th>
                <Th>Action</Th>
              </HeadTr>
            </thead>
            <tbody>
              {purchaseItems.map((item) => (
                <Tr key={item._id}>
                  <Td>{getItemNameById(item.item?.item) || "N/A"}</Td>
                  <Td>{item.altqty}</Td>
                  <Td>{item.unitCost}</Td>
                  <Td>{(item.altqty * item.unitCost).toFixed(2)}</Td>
                  <Td>{item.invoiceNo}</Td>
                  <Td>{new Date(item.invoiceDate).toLocaleDateString()}</Td>
                  <Td>
                    <Tooltip title="Edit">
                      <button
                        onClick={() => handleEditPurchaseItem(item)}
                        className="btns1"
                      >
                        <BiEdit className="icon-size" />
                      </button>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <button
                        onClick={() => handlePODelete(item._id)}
                        className="btns2"
                      >
                        <BiTrash className="icon-size" />
                      </button>
                    </Tooltip>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
          <div className="totaldiv">
            {purchaseItems.length > 0 ? (
              <p>
                <strong className="totalprice">Total Purchase Price:</strong> ₹
                {totalPurchasePriceLocal.toFixed(2)}
              </p>
            ) : null}
          </div>
        </>
      )}
    </>
  );
}

export default AddPurchaseItem;
