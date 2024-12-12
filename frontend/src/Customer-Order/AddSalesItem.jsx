// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import styled from "styled-components";

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

// function AddSalesItem({ setAddClick, setEditing, refresh }) {
//   const [salesItems, setSalesItems] = useState([]);

//   const loadSalesItems = async () => {
//     try {
//       const { data } = await axios.get("http://localhost:8000/api/itempos");
//       console.log("Loaded Sales Items: ", data);  
//       setSalesItems(data);
//     } catch (err) {
//       console.error('Error loading sales items:', err);
//       toast.error('Failed to load sales items');
//     }
//   };
  

//   useEffect(() => {
//     loadSalesItems();
//   }, [refresh]);

//   const handleEditItem = (item) => {
//     setEditing(item); 
//     setAddClick(true); 
//   };

//   const handleDeleteItem = async (itemId) => {
//     try {
//       const { data } = await axios.delete(`http://localhost:8000/api/itempos/${itemId}`);
//       if (data?.error) {
//         toast.error(data.error);
//       } else {
//         toast.success(`${data.item.item} has been deleted`);
//         loadSalesItems();
//       }
//     } catch (err) {
//       console.error('Error deleting item:', err);
//       toast.error('Failed to delete item');
//     }
//   };

//   return (
//     <Table>
//       <thead>
//         <HeadTr>
//           <Th>Item</Th>
//           <Th>Qty</Th>
//           <Th>Unit Cost</Th>
//           <Th>Tax</Th>
//           <Th>Sales Price</Th>
//           <Th>Action</Th>
//         </HeadTr>
//       </thead>
//       <tbody>
//         {salesItems.length > 0 ? (
//           salesItems.map((item) => (
//             <Tr key={item._id}>
//               <Td>{item.item}</Td>
//               <Td>{item.qty}</Td>
//               <Td>{item.cost}</Td>
//               <Td>{item.tax}</Td>
//               <Td>{item.salesPrice}</Td>
//               <Td>
//                 <button className="btns" onClick={() => handleEditItem(item)}>Edit</button>
//                 <button className="btns" onClick={() => handleDeleteItem(item._id)}>Delete</button>
//               </Td>
//             </Tr>
//           ))
//         ) : (
//           <Tr>
//             <Td colSpan="6">No items available.</Td>
//           </Tr>
//         )}
//       </tbody>
//     </Table>
//   );
// }

// export default AddSalesItem;

