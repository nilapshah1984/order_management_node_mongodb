import { Link } from "react-router-dom";
import "./index.css";
import { FaUser } from "react-icons/fa";
import { Tooltip } from "antd";
import { BiLogIn } from "react-icons/bi";



function Navbar() {
  return (
    <>
      <div className="navbar">
        <div>
          <Link to="/" style={{ textDecoration: "none" }}>
            <h2>
              <span className="span">
                <img src="home.svg" alt="home icon" />
              </span>
              Order Mangement
            </h2>
          </Link>
        </div>
        <div className="logout">
          <h3>
            <FaUser className="User" />
            <Link to="/signin" title="Signup">
              Sign UP
            </Link>
          </h3>
        </div>
      </div>
    </>
  );
}

export default Navbar;
