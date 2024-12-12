import Navbar from "../Navbar";


const Header = () => {
  return (
    <div>
      <Navbar/>
      <img
        src="login-v2.svg"
        alt="imges logo"
        style={{ width: "100%", height: "80vh" }}
      ></img>
    </div>
  );
};

export default Header;
