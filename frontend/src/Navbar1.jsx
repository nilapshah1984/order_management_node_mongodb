import { BiLogOutCircle,  } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useAuth } from "./context/auth.js";
import { Tooltip } from "antd";
import "./index.css";
import { FaUser } from "react-icons/fa";

function Navbar1() {
  const [auth] = useAuth();
  // console.log("user deatails", auth)
  return (
    <div className="navbar">
      <div>
        <Link style={{ textDecoration: "none" }}>
          <h2>
            <span className="span">
              <img src="home.svg" alt="home icon" />
            </span>
            Order Management
          </h2>
        </Link>
      </div>
      <div className="logout">
        <h3> <FaUser className="User"/> {auth?.user?.name} </h3>
        <Tooltip title="Logout">
          <Link to="/">
            <BiLogOutCircle className="logout-icon" />
          </Link>
        </Tooltip>
      </div>
    </div>
  );
}

export default Navbar1;
