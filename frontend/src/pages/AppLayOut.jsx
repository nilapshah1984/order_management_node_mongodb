import Sidebar from "./SideBar";
import { Outlet } from "react-router-dom";
import Navbar1 from "../Navbar1";
import "../StyleCSS/Main.css";



function ApplayOut() {
  return (
    <>
      <div className="Main-AppLayout">
        <Navbar1 />
        <div className="styelApply">
          <Sidebar />
          <div className="main">
            <div className="Container-aaplayout">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default ApplayOut;
