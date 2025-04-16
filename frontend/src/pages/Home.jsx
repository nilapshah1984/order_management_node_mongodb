// import "../StyleCSS/Main.css";
// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { MdEmail, MdVisibility, MdVisibilityOff } from "react-icons/md";
// import { FaUser } from "react-icons/fa";
// import Signin from "../Login-Form/Signin";
// import toast from "react-hot-toast";
// import axios from "axios";

// function Home() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLogin, setIsLogin] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const togglePasswordVisibility = () => {
//     setShowPassword((prevShowPassword) => !prevShowPassword);
//   };

//   useEffect(() => {
//     const savedCredentials = JSON.parse(localStorage.getItem("credentials"));
//     if (savedCredentials) {
//       setEmail(savedCredentials.email);
//       setPassword(savedCredentials.password);
//       setRememberMe(true);
//     }
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await axios.post("http://localhost:8000/api/login", {
//         email,
//         password,
//       });
//       console.log(data);

//       if (data?.error) {
//         toast.error(data.error);
//       } else {
//         localStorage.setItem("auth", JSON.stringify(data));
//         toast.success("Login successful");
//         navigate("/dashboard");
//       }
//     } catch (err) {
//       if (err.response && err.response.data && err.response.data.error) {
//         if (err.response.data.error === "User not found") {
//           toast.error("User not found, please check your email");
//         } else if (err.response.data.error === "Incorrect password") {
//           toast.error("Incorrect password, please try again");
//         } else {
//           toast.error(err.response.data.error);
//         }
//       } else {
//         toast.error("Login failed. Try again.");
//       }
//     }
//   };

//   const handleSignUpClick = () => {
//     setIsLogin(true);
//   };

//   return (
//     <div>
//       {isLogin ? (
//         <Signin setIsLogin={setIsLogin} />
//       ) : (
//         <>
//           <div className="navbar">
//             <div>
//               <Link to="/" style={{ textDecoration: "none" }}>
//                 <h2>
//                   <span className="span">
//                     <img src="home.svg" alt="home icon" />
//                   </span>
//                   Order Management
//                 </h2>
//               </Link>
//             </div>
//             <div className="logout">
//               <h3>
//                 <FaUser className="User" />
//                 <p
//                   onClick={handleSignUpClick}
//                   style={{ cursor: "pointer" }}
//                   className="SIGNUP"
//                 >
//                   Sign UP
//                 </p>
//               </h3>
//             </div>
//           </div>

//           <div className="home-container">
//             <div className="login-form-container">
//               <div>
//                 <img
//                   src="login-v2.svg"
//                   alt="images logo"
//                   className="login-img"
//                 />
//               </div>

//               <form onSubmit={handleSubmit} className="form">
//                 <h2>Sign-in</h2>
//                 <div className="input-groups">
//                   <div>
//                     <input
//                       type="email"
//                       placeholder="Email"
//                       name="email"
//                       onChange={(e) => setEmail(e.target.value)}
//                       value={email}
//                       required
//                     />
//                     <MdEmail className="icon" />
//                   </div>
//                 </div>

//                 <div className="input-groups">
//                   <div>
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Password"
//                       name="password"
//                       onChange={(e) => setPassword(e.target.value)}
//                       value={password}
//                       required
//                     />
//                     {showPassword ? (
//                       <MdVisibilityOff
//                         className="icon"
//                         onClick={togglePasswordVisibility}
//                       />
//                     ) : (
//                       <MdVisibility
//                         className="icon"
//                         onClick={togglePasswordVisibility}
//                       />
//                     )}
//                   </div>
//                 </div>

//                 <div className="switch">
//                   <div className="buttonForget">
//                     <Link to="/forgot">
//                       <button className="StyledButton2" type="button">
//                         Forgot Password?
//                       </button>
//                     </Link>
//                   </div>
//                 </div>

//                 <button className="StyledButton1" type="submit">
//                   Login
//                 </button>
//                 <div>
//                   <input
//                     type="checkbox"
//                     checked={rememberMe}
//                     onChange={() => setRememberMe(!rememberMe)}
//                   />
//                   <label>Remember Me</label>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default Home;






// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { Link, useNavigate } from "react-router-dom";
// import "../StyleCSS/Login.css";
// import Signin from "../Login-Form/Signin";
// import CanvasBackground from "../pages/CanvasBackground";

// const Home = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLogin, setIsLogin] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const togglePasswordVisibility = () => {
//     setShowPassword((prevShowPassword) => !prevShowPassword);
//   };

//   useEffect(() => {
//     const savedCredentials = JSON.parse(localStorage.getItem("credentials"));
//     if (savedCredentials) {
//       setEmail(savedCredentials.email);
//       setPassword(savedCredentials.password);
//       setRememberMe(true);
//     }
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await axios.post("http://localhost:8000/api/login", {
//         email,
//         password,
//       });
//       console.log(data);

//       if (data?.error) {
//         toast.error(data.error);
//       } else {
//         localStorage.setItem("auth", JSON.stringify(data));
//         toast.success("Login successful");
//         navigate("/dashboard");
//       }
//     } catch (err) {
//       if (err.response && err.response.data && err.response.data.error) {
//         if (err.response.data.error === "User  not found") {
//           toast.error("User  not found, please check your email");
//         } else if (err.response.data.error === "Incorrect password") {
//           toast.error("Incorrect password, please try again");
//         } else {
//           toast.error(err.response.data.error);
//         }
//       } else {
//         toast.error("Login failed. Try again.");
//       }
//     }
//   };

//   const handleSignUpClick = () => {
//     setIsLogin(true);
//   };

//   return (
//     <div className="login-container">
//       {/* <CanvasBackground />  */}
//       {isLogin ? (
//         <Signin setIsLogin={setIsLogin} />
//       ) : (
//         <>
//           <div className="login-card">
//             <form id="loginForm" className="login-form" onSubmit={handleSubmit}>
//               <div className="login-header">
//                 <h1>Welcome Back </h1>
//                 <p className="signupline">Please sign in to continue</p>
//               </div>
//               <div className="form-group">
//                 <label htmlFor="email">Email</label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   placeholder="Enter your email"
//                   autoComplete="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//                 <div className="error"></div>
//               </div>

//               <div className="form-group">
//                 <label htmlFor="password">Password</label>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   id="password"
//                   name="password"
//                   placeholder="Enter your password"
//                   autoComplete="current-password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//                 <div className="error"></div>
//                 <span
//                   onClick={togglePasswordVisibility}
//                   style={{ cursor: "pointer" }}
//                 >
//                   {showPassword ? "Hide" : "Show"}
//                 </span>
//               </div>

//               <div className="form-group checkbox-group">
//                 <label className="checkbox-label">
//                   <input
//                     type="checkbox"
//                     id="remember"
//                     name="remember"
//                     checked={rememberMe}
//                     onChange={() => setRememberMe(!rememberMe)}
//                   />
//                   <span className="checkbox-text">Remember me</span>
//                 </label>
//               </div>

//               <button type="submit" className="login-button">
//                 Login
//               </button>

//               <div className="additional-options">
//                 <a href="forgot" id="forgotPassword">
//                   Forgot Password?
//                 </a>
//                 <span className="separator">•</span>
//                 <a href="signin" id="createAccount">
//                   Create Account
//                 </a>
//               </div>
//             </form>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Home;


 


import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../StyleCSS/Login.css";
import Signin from "../Login-Form/Signin";

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (savedCredentials) {
      setEmail(savedCredentials.email);
      setPassword(savedCredentials.password);
      setRememberMe(true);
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "" });
    setLoading(true); // Start loading

    try {
      const { data } = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      if (data?.error) {
        toast.error(data.error);
      } else {
        localStorage.setItem("auth", JSON.stringify(data));
        toast.success("Login successful");
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        const errorMsg = err.response.data.error;

        if (errorMsg === "User  not found") {
          setErrors((prev) => ({ ...prev, email: "User  not found, please check your email" }));
        } else if (errorMsg === "Incorrect password") {
          setErrors((prev) => ({ ...prev, password: "Incorrect password, please try again" }));
        } else {
          toast.error(errorMsg);
        }
      } else {
        toast.error("Login failed. Try again.");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="login-container">
      {isLogin ? (
        <Signin setIsLogin={setIsLogin} />
      ) : (
        <div className="login-card">
          <form id="loginForm" className="login-form" onSubmit={handleSubmit}>
            <div className="login-header">
              <p className="WB">Order Management </p>
              <p className="signupline">Please sign in</p>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={errors.email ? "error active" : ""}
              />
              {errors.email && <div className="error active">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={errors.password ? "error active" : ""}
              />
              {errors.password && <div className="error active">{errors.password}</div>}
              <span onClick={togglePasswordVisibility} style={{ cursor: "pointer" }}>
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <span className="checkbox-text">Remember me</span>
              </label>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging in..." : "Login"} {/* Show loading text */}
            </button>

            <div className="additional-options">
              <a href="forgot" id="forgotPassword">
                Forgot Password?
              </a>
              <span className="separator">•</span>
              <a href="signin" id="createAccount">
                Create Account
              </a>
            </div>
          </form>

          {loading && (
        <div className="processing-modal">
          <img className="ProcessingIMG" src="./ProcessingGig.gif" alt="Processing" />
        </div>
      )}
        </div>
      )}
    </div>
  );
};

export default Home;
