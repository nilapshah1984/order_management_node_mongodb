import "../StyleCSS/Main.css";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaUser, FaTruck, FaBoxes, FaFileInvoice, FaShoppingCart } from "react-icons/fa";




function MainPage() {
  return (
    <ul className="nav-list">
      <div className="nav-link-background">
      <li>
        <NavLink className="nav-link" to="/dashboard"><FaTachometerAlt /> Dashboard </NavLink>
      </li>
      <li>
        <NavLink className="nav-link" to="/customer"><FaUser /> Customer </NavLink>
      </li>
      <li>
        <NavLink className="nav-link" to="/suppliers"> <FaTruck /> Suppliers </NavLink>
      </li>
      <li>
        <NavLink className="nav-link" to="/items"> <FaBoxes /> Items Master </NavLink>
      </li>
      <li>
        <NavLink className="nav-link" to="/sales"> <FaFileInvoice /> Customer PO </NavLink>
      </li>
      <li>
        <NavLink className="nav-link" to="/purchaseorder"> <FaShoppingCart /> Purchase Order  </NavLink>
      </li>
      </div>
    </ul>
  );
}

export default MainPage;

