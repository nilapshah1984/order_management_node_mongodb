import axios from "axios";
import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";

function isDateString(dateString) {
  return !isNaN(Date.parse(dateString));
}

function getTodayDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function Dashboard() {
  const [cpo, setCpo] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cpoList, setCpoList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [filteredCPOs, setFilteredCPOs] = useState([]);
  const [purchasePo, setPurchase] = useState([]);
  
  
  // const cpoAmount = cpo.reduce((acc, item) => acc + item.qty * item.price, 0);
  // const orderAmount = purchasePo.reduce((acc, sale) => acc + sale.qty * sale.price,0);

  useEffect(() => {
    loadCustomers();
    loadCPOs();
    loadPPO();
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
      setCpoList(data.customerpos || []);
    } catch (err) {
      console.log(err);
    }
  };

  const loadPPO = async () => {
    try {
      const { data } = await axios.get("https://localhost:8000/api/itemppos");
      setPurchase(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCustomerChange = (e) => {
    const selectedCustomerId = e.target.value;
    setSelectedCustomer(selectedCustomerId);

    const filtered = cpoList.filter(
      (cpo) => cpo.customern._id === selectedCustomerId      
    );
    setFilteredCPOs(filtered);
  };

  function handleDateChange(event) {
    const selectedDate = event.target.value;
    if (isDateString(selectedDate)) {
      console.log("Valid date:", selectedDate);
    } else {
      console.log("Invalid date:", selectedDate);
    }
  }

  const todayDate = getTodayDate();

  return (
    <>
      <div className="main-container">
        <h1>Dashboard - Profit & Loss</h1>
        <div className="StyledDiv">
          <div className="ButtonContainerDB">
            <div className="padding-5px">
              <select
                id="customer"
                value={selectedCustomer}
                className="customer-salesorder_input scrollable-dropdown"
                onChange={handleCustomerChange}
              >
                <option value="" disabled>
                  Select Customer
                </option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              <label htmlFor="orderDate" className="">
                Order Date:
              </label>
              <input
                type="date"
                id="orderDate"
                onChange={handleDateChange}
                max={todayDate}
                className="label"
              />
              To
              <input
                className="label"
                type="date"
                id="endDate"
                onChange={handleDateChange}
                max={todayDate}
              />
              <select id="cpo" className="label" disabled={!selectedCustomer}>
                <option>Select CPO</option>
                {filteredCPOs.map((cpo) => (
                <option key={cpo._id} value={cpo.customerpo}>
                  {cpo.customerpo}
                </option>
              ))}
              </select>
              <select className="label">
                <option>cpo order 1</option>
                <option>cpo order 2</option>
                <option>cpo order 3</option>
              </select>
            </div>

            <button className="StyledButton">
              <BiSearch className="SearchIcon" />
              Search
            </button>
          </div>
        </div>

        <div>
          <div className="table-Dashboard">
            <div className="tableCPR">
              <h2 className="list-name">Customer PO Details:</h2>
              <table className="table table-bordered table-striped table-hover shadow">
                <thead className="table-secondary">
                  <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Item 1</td>
                    <td> 6</td>
                    <td> 14000</td>
                  </tr>
                  <tr>
                    <td>Item 2</td>
                    <td> 7</td>
                    <td> 6000</td>
                  </tr>
                  <tr>
                    <td>Item 3</td>
                    <td> 10</td>
                    <td> 28000</td>
                  </tr>
                  <tr>
                    <td>Item 4</td>
                    <td> 10</td>
                    <td> 10000</td>
                  </tr>
                  {cpo?.map((item) => (
                    <tr key={item.id}>
                      <td>{item.item}</td>
                      <td>{item.avlqty}</td>
                      <td>{item.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h2>Order Amount: 506,000</h2>
            </div>
            <div className="tableCPR">
              <h2 className="list-name">Purchase Order</h2>
              <table className="table table-bordered table-striped table-hover shadow">
                <thead className="table-secondary">
                  <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Item 1</td>
                    <td> 5</td>
                    <td> 12000</td>
                  </tr>
                  <tr>
                    <td>Item 2</td>
                    <td> 2</td>
                    <td> 5500</td>
                  </tr>
                  <tr>
                    <td>Item 3</td>
                    <td> 5</td>
                    <td> 26000</td>
                  </tr>
                  <tr>
                    <td>Item 4</td>
                    <td> 8</td>
                    <td> 8500</td>
                  </tr>
                  {purchasePo.map((sale) => (
                    <tr key={sale.id}>
                      <td>{sale.item}</td>
                      <td>{sale.avlqty}</td>
                      <td>{sale.pprice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h2>Item Cost : 269,000</h2>
            </div>
            <div className="tableCPR">
              <h2 className="list-name">Remaining Purchase Order</h2>
              <table className="table table-bordered table-striped table-hover shadow">
                <thead className="table-secondary">
                  <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Item 1</td>
                    <td>1</td>
                    <td>10000</td>
                  </tr>
                  <tr>
                    <td>Item 2</td>
                    <td>5</td>
                    <td>4000</td>
                  </tr>
                  <tr>
                    <td>Item 3</td>
                    <td>5</td>
                    <td>24000</td>
                  </tr>
                  <tr>
                    <td>Item 4</td>
                    <td>2</td>
                    <td>8000</td>
                  </tr>
                  {purchasePo.map((rem) => (
                    <tr key={rem.id}>
                      <td>{rem.item}</td>
                      <td>{rem.remqty}</td>
                      <td>{rem.pprice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h2 className="list-name">Remaining cpo: </h2>
            </div>
          </div>

          <h2>Profit/Loss: 237,000 </h2>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
