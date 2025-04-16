import { useState, useEffect } from "react";
import axios from "axios";
import { BiSearch } from "react-icons/bi";
import "../StyleCSS/Customer.css";
import "../StyleCSS/SalesPurchase.css";

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
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [cpoList, setCpoList] = useState([]);
  const [selectedCPO, setSelectedCPO] = useState("");
  const [poList, setPoList] = useState([]);
  const [purchasePo, setPurchase] = useState([]);
  const [selectedPO, setSelectedPO] = useState("");
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [totalPurchasePrice, setTotalPurchasePrice] = useState(0);
  const [cpoTotalAmount, setCpoTotalAmount] = useState();
  const [remainingItems, setRemainingItems] = useState([]);

  useEffect(() => {
    loadCustomers();
    loadCPOs();
    loadPOs();
    resetDropdowns();
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
      let allCPOs = [];
      let currentPage = 1;
      let totalPages = 1;
      do {
        const { data } = await axios.get(
          `http://localhost:8000/api/customerpos?page=${currentPage}&limit=6`
        );
        allCPOs = [...allCPOs, ...data.customers];
        totalPages = data.totalPages;
        currentPage++;
      } while (currentPage <= totalPages);
      setCpoList(allCPOs);
    } catch (err) {
      console.log("Error fetching CPOs:", err);
    }
  };

  const loadPOs = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/purchases");
      const uniquePOs = [
        ...new Set(data.items.map((purchase) => purchase.purchase)),
      ];
      setPoList(
        uniquePOs.map((po) => {
          const poDetails = data.items.find((item) => item.purchase === po);
          return {
            value: po,
            label: poDetails ? poDetails.purchase : `Purchase Order ${po}`,
          };
        })
      );
    } catch (err) {
      console.log("Error fetching POs:", err);
    }
  };

  const handleCustomerChange = (event) => {
    const selectedCustomer = event.target.value;
    setSelectedCustomer(selectedCustomer);

    const filteredCPOs = cpoList.filter(
      (cpo) => cpo.customern._id === selectedCustomer
    );
    setCpoList(filteredCPOs);
    setSelectedCPO("");
    setPoList([]);
  };

  const handleCPOChange = async (event) => {
    const selectedCPO = event.target.value;
    setSelectedCPO(selectedCPO);

    const selectedCPORecord = cpoList.find(
      (cpo) => cpo.customerpo === selectedCPO
    );

    if (selectedCPORecord) {
      setCpoTotalAmount(selectedCPORecord.cpoTotal);
    } else {
      console.log("CPO record not found for:", selectedCPO);
    }

    try {
      const { data } = await axios.get("http://localhost:8000/api/itempos");
      const filteredItems = data.filter(
        (item) => item.customerPo === selectedCPORecord?._id
      );
      setCpo(filteredItems);
    } catch (error) {
      console.error("Error fetching items for selected CPO:", error);
    }

    try {
      const { data } = await axios.get("http://localhost:8000/api/purchases");
      const filteredPOs = data.items.filter(
        (po) => po.customerpo === selectedCPO
      );
      setPoList(
        filteredPOs.map((po) => ({
          value: po.purchase,
          label: po.purchase,
        }))
      );
      setSelectedPO("");
    } catch (error) {
      console.error("Error fetching POs for selected CPO:", error);
    }
  };

  const handlePOChange = async (event) => {
    const selectedPO = event.target.value;
    try {
      const { data } = await axios.get("http://localhost:8000/api/purchases");
      const selectedPurchase = data.items.find(
        (purchase) => purchase.purchase === selectedPO
      );

      if (selectedPurchase) {
        const associatedID = selectedPurchase._id;
        setSelectedPO(selectedPO);

        const itemResponse = await axios.get(
          `http://localhost:8000/api/itemppos?purchaseOrderId=${associatedID}`
        );
        const filteredItems = itemResponse.data.filter(
          (item) => item.purchaseOrderId === associatedID
        );

        const itemIds = filteredItems.map((item) => item.item.item);

        const itemDetailsResponse = await axios.get(
          `http://localhost:8000/api/items`
        );
        const itemDetailsMap = {};
        itemDetailsResponse.data.items.forEach((item) => {
          itemDetailsMap[item._id] = item.item;
        });

        const purchaseItemsWithNames = filteredItems.map((item) => {
          const itemId = item.item.item;
          return {
            ...item,
            itemName: itemDetailsMap[itemId] || "Unknown Item",
          };
        });

        setPurchaseItems(purchaseItemsWithNames);
        calculateTotalPrice(purchaseItemsWithNames);
        calculateRemainingItems(purchaseItemsWithNames);
      } else {
        console.log("No matching purchase found for selected PO.");
      }
    } catch (error) {
      console.error("Error fetching items for selected PO:", error);
    }
  };

  const calculateTotalPrice = (items) => {
    const total = items.reduce(
      (sum, item) => sum + item.altqty * item.unitCost,
      0
    );
    setTotalPurchasePrice(total);
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

  const resetDropdowns = () => {
    setSelectedCustomer("");
    setSelectedCPO("");
    setSelectedPO("");
    setCpo([]);
    setPurchaseItems([]);
    setTotalPurchasePrice(0);
    setCpoTotalAmount(0);
  };

  const handleSearch = () => {
    resetDropdowns();
  };



  const calculateRemainingItems = (purchaseItems) => {
    const remaining = cpo.reduce((acc, item) => {

      const purchaseItem = purchaseItems.find(p => p.itemName === item.item.item
      );    
      console.log("Purchase Item:", purchaseItem)  
  
      const remainingQty = purchaseItem ? item.qty - purchaseItem.altqty : item.qty;  
      console.log("remaining qty;",remainingQty)  

      if (remainingQty > 0) {
        acc.push({
          id: item.item.item, 
          item: item.item.item,
          remqty: remainingQty,
          pprice: purchaseItem ? purchaseItem.unitCost : item.salesPrice 
        });
      }
      return acc;
    }, []);
    setRemainingItems(remaining);
  };

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
                className="customer-salesorder_input22 scrollable-dropdown"
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
              <select
                id="cpo"
                className="customer-salesorder_input22"
                onChange={handleCPOChange}
              >
                <option value="">Select CPO</option>
                {cpoList.map((cpo) => (
                  <option key={cpo._id} value={cpo.customerpo}>
                    {cpo.customerpo}
                  </option>
                ))}
              </select>
              <select
                id="PO"
                className="customer-salesorder_input22"
                onChange={handlePOChange}
              >
                <option value=""> Select PO </option>
                {poList.map((po) => (
                  <option key={po.value} value={po.value}>
                    {po.label}
                  </option>
                ))}
              </select>
              <label htmlFor="orderDate" className="OrderDate">
                Order Date:
              </label>
              <input
                type="date"
                id="orderDate"
                onChange={handleDateChange}
                max={todayDate}
                className="customer-salesorder_input22"
              />
              <label htmlFor="orderDate" className="OrderDate">
                To:
              </label>
              <input
                className="customer-salesorder_input22"
                type="date"
                id="endDate"
                onChange={handleDateChange}
                max={todayDate}
              />
            </div>

            <button className="StyledButton" onClick={handleSearch}>
              <BiSearch className="SearchIcon" />
              Search
            </button>
          </div>
        </div>

        <div>
          <div className="table-Dashboard">
            <div className="tableCPR">
              <h2 className="list-name">Customer PO Details: {selectedCPO}</h2>
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
                      <td>{item.item?.item || ""}</td>
                      <td>{item.qty}</td>
                      <td>{item.salesPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h2>
                CPO Order Amount: ₹
                {cpoTotalAmount ? cpoTotalAmount.toFixed(2) : ""}
              </h2>
            </div>
            <div className="tableCPR">
              <h2 className="list-name">
                Purchase Order Details: {selectedPO}
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
                  {purchaseItems.map((item) => (
                    <tr key={item._id}>
                      <td>{item.itemName || "N/A"}</td>
                      <td>{item.altqty}</td>
                      <td>{(item.altqty * item.unitCost).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h2>Item Cost: ₹{totalPurchasePrice.toFixed(2)}</h2>
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
                  {remainingItems.map((rem) => (
                    <tr key={rem.id}>
                      <td>{rem.item}</td>
                      <td>{rem.remqty}</td>
                      <td>{rem.pprice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <h2>
            Profit/Loss: ₹
            {cpoTotalAmount && totalPurchasePrice
              ? (cpoTotalAmount - totalPurchasePrice).toFixed(2)
              : ""}
          </h2>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
