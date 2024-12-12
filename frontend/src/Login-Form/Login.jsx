import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdEmail, MdVisibility, MdVisibilityOff } from "react-icons/md";
import Header from "../Header/Header";
import ApplayOut from "../pages/AppLayOut";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth";
import axios from "axios";
import "../StyleCSS/Main.css";

function Login() {
  const [auth, setAuth] = useAuth();
  const [email, setEmail] = useState("admin123@gmail.com");
   const [password, setPassword] = useState("admin123");
   //const location = useLocation();

  const [isLogin] = useState(false);
  //const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);


  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const {data} = await axios.post("http://localhost:8000/api/login", {
            email,password
          });
          console.log(data)
          if(data?.error) {
            toast.error(data.error)
          } else { 
            localStorage.setItem("auth", JSON.stringify(data))
            setAuth({...auth, token:data, user: data.user})
            toast.success("Login successfull")
            //navigate(location.state || `/dashboard/${data?.user?.role === 1 ? "admin" : "user"}`);
          }
        } catch (err) {
          console.log(err);
          toast.error("Login failed. Try again.")
        }
      };

  return (
    <>
      <div className="logins">
        {/* {isLogin ? (
          <>
            <ApplayOut />
          </>
        ) : ( */}
          <>
            <Header />
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
                <span className="error">{}</span>
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
                <span className="error">{}</span>
              </div>
              <div className="switch">
                <Link
                  to="/forgot"
                  style={{ textDecoration: "none", float: "right" }}
                >
                  Forgot Password?
                </Link>
              </div>
              <button type="submit">Sign-in</button>
            </form>
          </>
        {/* )} */}
      </div>
    </>
  );
}

 export default Login;
// import { useState } from "react";
// import Jumbotrom from "../cards/Jumbotrom";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useAuth } from "../context/auth";
// import { useLocation, useNavigate } from "react-router-dom";


// function Login() {
//   const [email, setEmail] = useState("pk@gmail.com");
//   const [password, setPassword] = useState("1234567");

//   const navigate = useNavigate();
//   const location = useLocation();
//   const [auth, setAuth] = useAuth();

//   //console.log(process.env.REACT_APP_API)

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const {data} = await axios.post(`${window.location.origin}/api/login`, {
//         email,password
//       })
//       console.log(data)
//       if(data?.error) {
//         toast.error(data.error)
//       } else { 
//         localStorage.setItem("auth", JSON.stringify(data))
//         setAuth({...auth, token:data, user: data.user})
//         toast.success("Login successfull")
//         navigate(location.state || `/dashboard/${data?.user?.role === 1 ? "admin" : "user"}`);
//       }
//     } catch (err) {
//       console.log(err);
//       toast.error("Login failed. Try again.")
//     }
//   };
//   return (
//     <>
//       <div>
//         <Jumbotrom title="Login" />
//         <div className="container mt-5">
//           <div className="row">
//             <div className="col-md-6 offset-md-3">
//               <form onSubmit={handleSubmit}>
//                 <input
//                   type="email"
//                   className="form-control mb-4 p-2"
//                   placeholder="Enter your email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <input
//                   type="password"
//                   className="form-control mb-4 p-2"
//                   placeholder="Enter your password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <button className="btn btn-primary" type="submit">
//                   Submit
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
// export default Login;
