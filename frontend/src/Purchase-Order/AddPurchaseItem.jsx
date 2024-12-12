import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiEdit, BiTrash } from "react-icons/bi";
import styled from "styled-components";
import "../StyleCSS/SalesPurchase.css";

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

function AddPurchaseItem(
  {
    customerId,
    setEditpo,
    setShowAddOrEdit,
    isEditing,
    purchaseEditing,
    filteredCPOs,

}) {
  const [items, setItems] = useState([]);
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [totalPurchasePriceLocal, setTotalPurchasePriceLocal] = useState(0);

  useEffect(() => {
    loaditems();
    loadPurchaseItems();
  }, [customerId, isEditing]);

  const loaditems = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/itemppos");
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.log(err);
      toast.error("Error loading purchase items");
    }
  };


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

  const handlePODelete = async (itemId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:8000/api/itemppos/${itemId}`
      );
      console.log(data);

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


  return (
    <>
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
          {isEditing
            ? purchaseItems.map((item) => (
                <Tr key={item._id}>
                  <Td>{item.item?.item || "N/A"}</Td>
                  <Td>{item.altqty}</Td>
                  <Td>{item.unitCost}</Td>
                  <Td>{(item.altqty * item.unitCost).toFixed(2)}</Td>
                  <Td>{item.invoiceNo}</Td>
                  <Td>{new Date(item.invoiceDate).toLocaleDateString()}</Td>
                  <Td>
                    <button onClick={() => handleEditPurchaseItem(item)}>
                      <BiEdit />
                    </button>
                    <button onClick={() => handlePODelete(item._id)}>
                      <BiTrash />
                    </button>
                  </Td>
                </Tr>
              ))
            : null}
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
  );
}

export default AddPurchaseItem;
