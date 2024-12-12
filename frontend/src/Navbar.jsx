//import { IoMdContact, IoMdHome } from "react-icons/io";
import { Link } from "react-router-dom";


function Navbar() {
  return (
    <>
      <div className="navbr">
        <div>
        <Link to="/" style={{ textDecoration: "none" }}>
          <h2 className="logo">
            <span className="span">
             {/* <IoMdHome/> */}
            </span>
            Order Mangement
          </h2>
        </Link>
        </div>
        <div>
        <nav>
          {/* <IoMdContact/> */}
        </nav>
        </div>
      </div>
    </>
  );
}

export default Navbar;
