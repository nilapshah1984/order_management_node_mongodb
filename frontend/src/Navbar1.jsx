// //import { CiLogout } from "react-icons/ci";
// import { BiLogOutCircle } from "react-icons/bi";
// import { Link } from "react-router-dom";
// import { useAuth } from "./context/auth";

// function Navbar1() {
//   const [auth] = useAuth();
//   return (
//     <>
//       <div className="navbar" style={{position:"inherit"}}>
//         <div>
//         <Link to="/" style={{ textDecoration: "none" }}>
//           <h2  style={{ backgroundColor: 'white', borderRadius: '10px', padding: '8px', marginLeft: '30px' }}>
//             <span className="span">
//               <img src="home.svg" style={{marginBottom: '0.2rem', padding: '0px 5px' }} />
//             </span>
//             Order Mangement
//           </h2>
//         </Link>
//         </div>
//         <div className="logout">
//         {/* <h3>{auth?.user?.name}</h3> */}
//         <h3 style={{ backgroundColor: 'white', borderRadius: '10px', padding: '4px' }}>Shark Bytes</h3>

//         <Link to="/"><BiLogOutCircle style={{ transform: "rotate(180deg)", fontSize: "2em" }}/></Link>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Navbar1;

import { BiLogOutCircle,  } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useAuth } from "./context/auth";
import { Tooltip } from "antd";
import "./index.css";
import { FaUser } from "react-icons/fa";

function Navbar1() {
  const [auth] = useAuth();
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
        <h3> <FaUser className="User"/>  Shark Bytes</h3>
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
