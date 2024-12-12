import { Link } from "react-router-dom";
import AddNewCustomer from "./AddNewCustomer";



function User() {
  return (
    <>
      <div>
        <div className="navbr1">
          <Link to="/" style={{ textDecoration: "none" }}>
            <h2 className="logo">Inventory Purchase</h2>
          </Link>
          <nav className="cadd">
            <Link to="/">Logout</Link>
          </nav>
        </div>
        <AddNewCustomer />
      </div>
    </>
  );
}
export default User;
