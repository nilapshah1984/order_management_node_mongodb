// import { useState } from "react";
// import "../StyleCSS/Main.css";
// import { Link } from "react-router-dom";
// import toast from "react-hot-toast";
// import { FaAlignJustify } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [showOtpForm, setShowOtpForm] = useState(false);
//   const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const navigate = useNavigate();

//   const handleSubmitEmail = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch("http://localhost:8000/api/forgot-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         setShowOtpForm(true);
//         toast.success("OTP sent to your email.");
//       } else {
//         toast.error(result.message || "Something went wrong. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error("Server error. Please try again later.");
//     }
//   };

//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch("http://localhost:8000/api/verify-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, otp }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         setShowOtpForm(false);
//         setShowResetPasswordForm(true);
//         toast.success("OTP verified. Please reset your password.");
//       } else {
//         toast.error(result.message || "Invalid OTP.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error("Server error. Please try again later.");
//     }
//   };

//   const handleResetPassword = async (e) => {
//     e.preventDefault();

//     if (newPassword !== confirmPassword) {
//       toast.error("Passwords do not match.");
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:8000/api/reset-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, newPassword }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         toast.success("Password reset successful.");
//         navigate("/");
//       } else {
//         toast.error(result.message || "Something went wrong.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error("Server error. Please try again later.");
//     }
//   };

//   return (
//     <>
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

//           {!showOtpForm && !showResetPasswordForm && (
//             <form onSubmit={handleSubmitEmail} className="form-forget">
//               <h2>Forgot Password</h2>
//               <div className="input-groups">
//                 <input
//                   type="email"
//                   placeholder="Enter your email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>
//               <div style={{ display: "flex", justifyContent: "space-between" }}>
//                 <button type="submit" className="StyledButton1">
//                   Submit
//                 </button>
//                 <Link to="/">
//                   <button className="StyledButton2">Back</button>
//                 </Link>
//               </div>
//             </form>
//           )}

//          {/* OTP verification form  */}
//           {showOtpForm && !showResetPasswordForm && (
//             <form onSubmit={handleVerifyOtp} className="form-forget">
//               <h2>Verify OTP</h2>
//               <div className="input-groups">
//                 <input
//                   type="text"
//                   placeholder="Enter OTP"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   required
//                 />
//               </div>
//               <div style={{ display: "flex", justifyContent: "space-between" }}>
//                 <button type="submit" className="StyledButton1">
//                   Verify OTP
//                 </button>
//                 <Link to="/">
//                   <button className="StyledButton2">Back</button>
//                 </Link>
//               </div>
//             </form>
//           )}

//           {/* Reset password form */}
//           {showResetPasswordForm && (
//             <form onSubmit={handleResetPassword} className="form-forget">
//               <h2>Reset New Password</h2>
//               <div className="input-groups">
//                 <input
//                   type="password"
//                   placeholder="New Password"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="input-groups">
//                 <input
//                   type="password"
//                   placeholder="Confirm Password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   required
//                 />
//               </div>
//               <div style={{ display: "flex", justifyContent: "space-between" }}>
//                 <button type="submit" className="StyledButton1">
//                   Submit
//                 </button>
//               </div>
//             </form>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// export default ForgotPassword;

import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8000/api/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const result = await response.json();
      if (response.ok) {
        setShowOtpForm(true);
        toast.success("OTP sent to your email.");
      } else {
        toast.error(
          result.message || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Server error. Please try again later.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const result = await response.json();
      if (response.ok) {
        setShowOtpForm(false);
        setShowResetPasswordForm(true);
        toast.success("OTP verified. Please reset your password.");
      } else {
        toast.error(result.message || "Invalid OTP.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Server error. Please try again later.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success("Password reset successful.");
        navigate("/");
      } else {
        toast.error(result.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Server error. Please try again later.");
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-card">
          {!showOtpForm && !showResetPasswordForm && (
            <form onSubmit={handleSubmitEmail} className="login-form">
              <div className="login-header">
              <p className="WB">Welcome Back</p>
              <p className="forgtpswrd">Reset Forgot Password in a few Step</p>
              </div>
              <div className="input-groups">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button type="submit" className="StyledButton1">
                  Submit
                </button>
                <Link to="/">
                  <button className="StyledButton2">Back</button>
                </Link>
              </div>
            </form>
          )}


          {showOtpForm && !showResetPasswordForm && (
            <form onSubmit={handleVerifyOtp} className="login-form">
              <h2>Verify OTP</h2>
              <div className="input-groups">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button type="submit" className="StyledButton1">
                  Verify OTP
                </button>
                <Link to="/">
                  <button className="StyledButton2">Back</button>
                </Link>
              </div>
            </form>
          )}


          {showResetPasswordForm && (
            <form onSubmit={handleResetPassword} className="login-form">
              <h2>Reset New Password</h2>
              <div className="input-groups">
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="input-groups">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button type="submit" className="StyledButton1">
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
