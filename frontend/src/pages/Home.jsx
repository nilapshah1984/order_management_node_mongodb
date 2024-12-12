// import { useState } from "react";
// import { useAuth } from "../context/auth";
// import { Link, useNavigate } from "react-router-dom";
// import { MdEmail, MdVisibility, MdVisibilityOff } from "react-icons/md";
// import ApplayOut from "../pages/AppLayOut";
// import axios from "axios";
// import styled from "styled-components";
// import Navbar from "../Navbar";
// import toast from "react-hot-toast";

// const StyledDiv = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   padding: 30px;
// `;

// function Home() {
//   const [auth, setAuth] = useAuth();
//   const [email, setEmail] = useState("pjangid096@gmail.com");
//   const [password, setPassword] = useState("12345678");
//   //const location = useLocation();

//   const [isLogin] = useState(false);
//   const navigate = useNavigate();

//   const [showPassword, setShowPassword] = useState(false);

//   const togglePasswordVisibility = () => {
//     setShowPassword((prevShowPassword) => !prevShowPassword);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await axios.post("http://localhost:8000/api/login", {
//         email,
//         password
//       });
//       console.log(data);
//       if (data?.error) {
//         toast.error(data.error);
//       } else {
//         localStorage.setItem("auth", JSON.stringify(data));
//         setAuth({ ...auth, token: data, user: data.user });
//         toast.success("Login successful");
//         navigate("/dashboard")
//       }
//     } catch (err) {
//       console.log(err);
//       toast.error("Login failed. Try again.");
//     }
//   };

//   return (
//     <>
//       <div>
//         {isLogin ? (
//           <ApplayOut />
//         ) : (
//           <>
//             <Navbar />
//             <StyledDiv>
//               <div className="container shadow d-flex">
//                 <div>
//                   <img
//                     src="login-v2.svg"
//                     alt="imges logo"
//                     style={{ width: "100%", height: "80vh" }}
//                   />
//                 </div>

//                 <form onSubmit={handleSubmit} className="forms shadow">
//                   <h2>Sign-in</h2>
//                   <div className="input-groups">
//                     <div>
//                       <input
//                         type="email"
//                         placeholder="Email"
//                         name="email"
//                         onChange={(e) => setEmail(e.target.value)}
//                         value={email}
//                       />
//                       <MdEmail className="icon" />
//                     </div>
//                     <span className="error"></span>
//                   </div>

//                   <div className="input-groups">
//                     <div>
//                       <input
//                         type={showPassword ? "text" : "password"}
//                         placeholder="Password"
//                         name="password"
//                         onChange={(e) => setPassword(e.target.value)}
//                         value={password}
//                       />
//                       {showPassword ? (
//                         <MdVisibilityOff
//                           className="icon"
//                           onClick={togglePasswordVisibility}
//                         />
//                       ) : (
//                         <MdVisibility
//                           className="icon"
//                           onClick={togglePasswordVisibility}
//                         />
//                       )}
//                     </div>
//                     <span className="error"></span>
//                   </div>
//                   <div className="switch">
//                     <Link
//                       to="/forgot"
//                       style={{ textDecoration: "none", float: "right" }}
//                     >
//                       Forgot Password?
//                     </Link>
//                   </div>
//                   <button className="button" type="submit">
//                     Sign-in
//                   </button>
//                 </form>
//               </div>
//             </StyledDiv>
//           </>
//         )}
//       </div>
//     </>
//   );
// }

// export default Home;






import "../StyleCSS/Main.css";
import { useState } from "react";
import { useAuth } from "../context/auth";
import { Link, useNavigate } from "react-router-dom";
import { MdEmail, MdVisibility, MdVisibilityOff } from "react-icons/md";
import ApplayOut from "../pages/AppLayOut";
import axios from "axios";
import Navbar from "../Navbar";
import toast from "react-hot-toast";

function Home() {
  const [auth, setAuth] = useAuth();
  const [email, setEmail] = useState("admin123@gmail.com");
  const [password, setPassword] = useState("admin123");
  const [isLogin] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });
      console.log(data);
      if (data?.error) {
        toast.error(data.error);
      } else {
        localStorage.setItem("auth", JSON.stringify(data));
        setAuth({ ...auth, token: data, user: data.user });
        toast.success("Login successful");
        navigate("/dashboard");
      }
    } catch (err) {
      console.log(err);
      toast.error("Login failed. Try again.");
    }
  };

  return (
    <div>
      {isLogin ? (
        <ApplayOut />
      ) : (
        <>
          <Navbar />
          <div className="home-container">
            <div className="login-form-container">
              <div>
                <img
                  src="login-v2.svg"
                  alt="imges logo"
                  className="login-img"
                />
              </div>

              <form onSubmit={handleSubmit} className="form">
                <h2>Sign-in</h2>
                <div className="input-groups">
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      name="email"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                    />
                    <MdEmail className="icon" />
                  </div>
                  <span className="error"></span>
                </div>

                <div className="input-groups">
                  <div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      name="password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                    />
                    {showPassword ? (
                      <MdVisibilityOff
                        className="icon"
                        onClick={togglePasswordVisibility}
                      />
                    ) : (
                      <MdVisibility
                        className="icon"
                        onClick={togglePasswordVisibility}
                      />
                    )}
                  </div>
                  <span className="error"></span>
                </div>
                <div className="switch">
                  <Link to="/forgot">Forgot Password?</Link>
                </div>
                <button className="button" type="submit">
                  Sign-in
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
