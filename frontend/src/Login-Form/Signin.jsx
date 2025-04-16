// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import axios from "axios";
// import "../StyleCSS/Main.css";

// function Signin({ setIsLogin }) {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const onSubmits = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await axios.post("http://localhost:8000/api/register", {
//         name, ////http://localhost:8000

//         email,
//         password,
//       });
//       if (data?.error) {
//         toast.error(data.error);
//       } else {
//         localStorage.setItem("auth", JSON.stringify(data));
//         toast.success("Register successful");
//         // navigate("/dashboard");
//         navigate("/");
//       }
//     } catch (err) {
//       toast.error("Email is Exist Registration failed. Try again.");
//     }
//   };

//   return (
//     <div>
//       <div className="navbar">
//         <div>
//           <Link to="/" style={{ textDecoration: "none" }}>
//             <h2>
//               <span className="span">
//                 <img src="home.svg" alt="home icon" />
//               </span>
//               Order Management
//             </h2>
//           </Link>
//         </div>
//       </div>

//       <div className="home-container">
//         <div className="login-form-container">
//           <div>
//             <img src="login-v2.svg" alt="images logo" className="login-img" />
//           </div>
//           <form onSubmit={onSubmits} className="Sign-Up-form">
//             <h2>Sign Up</h2>
//             <div className="input-groups">
//               <div>
//                 <input
//                   type="text"
//                   placeholder="Name"
//                   name="name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                 />
//               </div>
//             </div>
//             <div className="input-groups">
//               <div>
//                 <input
//                   type="email"
//                   placeholder="Email"
//                   name="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>
//             </div>
//             <div className="input-groups">
//               <div>
//                 <input
//                   type="password"
//                   placeholder="Password"
//                   name="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//               </div>
//             </div>

//             <div className="signup-siginin">
//               <button type="submit" className="StyledButton1">
//                 Sign Up
//               </button>
//               <p className="switch-login">
//                 Already have an account?{" "}
//                 <button className="switch-login-button" onClick={() => setIsLogin(false)}>Sign In</button>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Signin;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
// import "../StyleCSS/Main.css";
import "../StyleCSS/Login.css";

function Signin({ setIsLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmits = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:8000/api/register", {
        name, ////http://localhost:8000
        email,
        password,
      });
      if (data?.error) {
        toast.error(data.error);
      } else {
        localStorage.setItem("auth", JSON.stringify(data));
        toast.success("Register successful");
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error("Email is Exist Registration failed. Try again.");
    }
  };

  return (
    <div>
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <p className="WB">Create Account</p>
            <p className="signupline">Sign up</p>
          </div>

          <form onSubmit={onSubmits} className="login-form">
            <div className="input-groups">
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="input-groups">
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="input-groups">
              <div>
                <label>Password:</label>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="login-button">
              Login
            </button>

            <div className="additional-options">
              <a href="#" id="forgotPassword">
                Already have an account?
              </a>
              <span className="separator">•</span>
              <a href="/" id="createAccount">
                Sign in
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signin;
