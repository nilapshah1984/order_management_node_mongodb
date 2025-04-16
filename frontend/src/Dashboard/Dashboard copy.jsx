import axios from "axios";
import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import "../StyleCSS/Customer.css";
import "../StyleCSS/SalesPurchase.css";

function Dashboard() {
  const [cpo, setCpo] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedCPO, setSelectedCPO] = useState("");
  const [cpoList, setCpoList] = useState([]);
  const [filteredCpoList, setFilteredCpoList] = useState([]);
  const [selectedCPOData, setSelectedCPOData] = useState([]);
  const [itemPos, setItemPos] = useState([]);

  const [salesItems, setSalesItems] = useState([]);

  useEffect(() => {
    loadCustomers();
    loadCPOs();
    loadCPoItem();
  }, []);

  const loadCustomers = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/customers");
      setCustomers(data.customers || []);
    } catch (err) {
      console.log(err);
    }
  };

  const loadCPOs = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/customerpos");
      setCpoList(data.customers || []);
    } catch (err) {
      console.log("Error fetching CPOs:", err);
    }
  };

  const loadCPoItem = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8000/api/itempos`);
      setItemPos(data);
    } catch (err) {
      console.log("Error fetching CPOs:", err);
    }
  };

  const handleCustomerChange = (event) => {
    const customerId = event.target.value;
    setSelectedCustomer(customerId);

    const filteredCPOs = cpoList.filter((cpo) => cpo.customern?._id === customerId);
    setFilteredCpoList(filteredCPOs);

    setSelectedCPO("");
    setSelectedCPOData(null);

    if (filteredCPOs.length > 0) {
      setSelectedCPOData(filteredCPOs[0]);
    }
  };

  const handleCPOChange = async (event) => {
    const selectedCPO = event.target.value;
    setSelectedCPO(selectedCPO);

    const selectedData = filteredCpoList.find((cpo) => cpo._id === selectedCPO);
    setSelectedCPOData(selectedData || null);

    try {
      const { data } = await axios.get("http://localhost:8000/api/itempos");
      const filteredItems = data.filter((item) => item.customerPo === selectedCPOData?.customerpo);
      setCpo(filteredItems);
    } catch (error) {
      console.error("Error fetching items for selected CPO:", error);
    }
  };

  return (
    <>
      <div className="main-container">
        <h1>Dashboard - Profit & Loss</h1>
        <div className="StyledDiv">
          <div className="ButtonContainerDB">
            <select id="customer" className="customer-salesorder_input22" onChange={handleCustomerChange}>
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.name}
                </option>
              ))}
            </select>

            <select id="cpo" className="customer-salesorder_input22" onChange={handleCPOChange}>
              <option value="">Select CPO</option>
              {filteredCpoList.map((cpo) => (
                <option key={cpo._id} value={cpo._id}>
                  {cpo.customerpo}
                </option>
              ))}
            </select>

            <button className="StyledButton">
              <BiSearch className="SearchIcon" />
              Search
            </button>
          </div>
        </div>

        <div className="table-Dashboard">
          <div className="tableCPR">
            <h2 className="list-name">
              Customer PO Details: {selectedCPOData ? selectedCPOData.customerpo : "No CPO Selected"}
            </h2>

            <table className="table table-bordered table-striped table-hover shadow">
              <thead className="table-secondary">
                <tr>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {cpo?.map((item) => (
                  <tr key={item.id}>
                    <td>{item.item}</td>
                    <td>{item.qty}</td>
                    <td>{item.salesPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h2>Order Amount: {""}</h2>
          </div>
        </div>

        <h2>Profit/Loss: {""}</h2>

        <h2 className="list-name">CPO Table:</h2>
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Customer PO</th>
              <th>Customer ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCpoList.map((item) => (
              <tr key={item._id} className="TD-SIZE">
                <td>{item.customern?.name}</td>
                <td>{item.customerpo}</td>
                <td>{item.customern?._id}</td>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>{item.cpoTotal}</td>
                <td>{item.status}</td>
                <td>
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>ITEM PO TABLE</h2>
        <table>

          <thead>
            <th>Item</th>
            <th>Qty</th>
            <th>Unit Cost</th>
            <th>Tax</th>
            <th>Sales Price</th> 
            <th>ID</th>  
            <th>Customer ID</th>      
          </thead>
        <tbody>
          {itemPos.length > 0 ? (
            itemPos.map((item) => (
              <tr key={item._id}>
                <td>{item.item?.item || "N/A"}</td>
                <td>{item.qty}</td>
                <td>{item.cost}</td>
                <td>{item.tax}%</td>
                <td>{item.salesPrice}</td>
                <td>{item._id}</td>
                <td>{item.customerPo?.customern?._id || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No sales items available.</td>
            </tr>
          )}
        </tbody>
        </table>
      </div>
    </>
  );
}

export default Dashboard;
