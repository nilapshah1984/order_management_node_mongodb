// import { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { MdEmail, MdVisibility, MdVisibilityOff } from "react-icons/md";
// import Header from "../Header/Header";
// import ApplayOut from "../pages/AppLayOut";
// import toast from "react-hot-toast";
// import { useAuth } from "../context/auth";
// import axios from "axios";
// import "../StyleCSS/Main.css";

// function Login() {
//   const [auth, setAuth] = useAuth();
//   const [email, setEmail] = useState("admin123@gmail.com");
//    const [password, setPassword] = useState("admin123");
//    const location = useLocation();

//   const [isLogin] = useState(false);
//   const navigate = useNavigate();

//   const [showPassword, setShowPassword] = useState(false);


//   const togglePasswordVisibility = () => {
//     setShowPassword((prevShowPassword) => !prevShowPassword);
//   };

//   const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//           const {data} = await axios.post("http://localhost:8000/api/login", {
//             email,password
//           });
//           console.log(data)
//           if(data?.error) {
//             toast.error(data.error)
//           } else { 
//             localStorage.setItem("auth", JSON.stringify(data))
//             setAuth({...auth, token:data, user: data.user})
//             toast.success("Login successfull")
//             navigate(location.state || `/dashboard/${data?.user?.role === 1 ? "admin" : "user"}`);
//           }
//         } catch (err) {
//           console.log(err);
//           toast.error("Login failed. Try again.")
//         }
//       };

//   return (
//     <>
//       <div className="logins">
//         {isLogin ? (
//           <>
//             <ApplayOut />
//           </>
//         ) : (
//           <>
//             <Header />
//             <form onSubmit={handleSubmit} className="form">
//               <h2>Sign-in</h2>
//               <div className="input-groups">
//                 <div>
//                   <input
//                     type="email"
//                     placeholder="Email"
//                     name="email"
//                     onChange={(e) => setEmail(e.target.value)}
//                     value={email}
//                   />
//                   <MdEmail className="icon" />
//                 </div>
//                 <span className="error">{}</span>
//               </div>

//               <div className="input-groups">
//                 <div>
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Password"
//                     name="password"
//                     onChange={(e) => setPassword(e.target.value)}
//                     value={password}
//                   />
//                   {showPassword ? (
//                     <MdVisibilityOff
//                       className="icon"
//                       onClick={togglePasswordVisibility}
//                     />
//                   ) : (
//                     <MdVisibility
//                       className="icon"
//                       onClick={togglePasswordVisibility}
//                     />
//                   )}
//                 </div>
//                 <span className="error">{}</span>
//               </div>
//               <div className="switch">
//                 <Link
//                   to="/forgot"
//                   style={{ textDecoration: "none", float: "right" }}
//                 >
//                   Forgot Password?
//                 </Link>
//               </div>
//               <button type="submit">Sign-in</button>
//             </form>
//           </>
//         )}
//       </div>
//     </>
//   );
// }

//  export default Login;
