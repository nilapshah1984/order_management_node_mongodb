import React, { useEffect, useState } from "react";
import { BiEdit, BiTrash } from "react-icons/bi";
import { Tooltip, Popconfirm   } from "antd";
import { MdDelete } from "react-icons/md";
import styled from "styled-components";
import toast from "react-hot-toast";
import axios from "axios";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  font-size: 20px;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
  font-size: 19px;
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

const SalesItem = ({ currentCpoId, salesItems, onEdit }) => {
  const [totalCustomerPOLocal, setTotalCustomerPOLocal] = useState(0);

  useEffect(() => {
    calculateTotalPrice(salesItems);
  }, [salesItems]);

  const calculateTotalPrice = (items) => {
    const total = items.reduce((sum, item) => {
      const qty = item.qty || 0;
      const cost = item.cost || 0;
      const tax = item.tax || 0;

      const basePrice = qty * cost;
      const taxAmount = (basePrice * tax) / 100;
      const finalPrice = basePrice + taxAmount;
      return sum + finalPrice;
    }, 0);
    setTotalCustomerPOLocal(total);
  };

  const handleDeleteItem = async (id) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:8000/api/itempos/${id}`
      );
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(`${data.message}`);
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      toast.error("Failed to delete item");
    }
  };

  return (
    <>
      <Table>
        <thead>
          <HeadTr>
            <Th>Item</Th>
            <Th>Qty</Th>
            <Th>Unit Cost</Th>
            <Th>Tax</Th>
            <Th>Sales Price</Th>
            <Th>Action</Th>
          </HeadTr>
        </thead>
        <tbody>
          {salesItems.length > 0 ? (
            salesItems.map((item) => (
              <Tr key={item._id}>
                <Td>{item.item?.item || "N/A"}</Td>
                <Td>{item.qty}</Td>
                <Td>{item.cost}</Td>
                <Td>{item.tax}%</Td>
                <Td>{item.salesPrice}</Td>
                <Td>
                  <div className="button-group">
                    <Tooltip title="Edit">
                      <button onClick={() => onEdit(item)} className="btns1">
                        <BiEdit className="icon-size" />
                      </button>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Popconfirm
                        placement="topLeft"
                        title="Are you sure to delete this customer?"
                        onConfirm={() => handleDeleteItem(item._id)}
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
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan="6"></Td>
            </Tr>
          )}
        </tbody>
      </Table>
      <div>Total Sales Price: ₹{totalCustomerPOLocal.toFixed(2)}</div>
    </>
  );
};

export default SalesItem;
