import  { useEffect, useState } from "react";
import Header from "../Header/Header";
import Login from "./Login";
import "./Sign.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


function Signin() {
  const [login, setLogin] = useState(false);
  const [name , setName] = useState("");
  const [email , setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmits = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:8000/api/register", {
        name, email, password
      });
      console.log(data);
      if (data?.error) {
        toast.error(data.error);
      } else {
       // localStorage.setItem("auth", JSON.stringify(data));
        toast.success("Register successful");
        navigate("/")
      }
    } catch (err) {
      console.log(err);
      toast.error("Login failed. Try again.");
    }
  };

  return (
    <div className="login">
      {login ? (
        <>
          <Login />
        </>
      ) : (
        <>
          <Header />{" "}
          <form onSubmit={onSubmits} className="form">
            <h2>Sign Up</h2>
            <div className="input-group">
              <div>
                <input
                  type="name"
                  placeholder="name "
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <span className="error">{}</span>
            </div>
            <div className="input-group">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <span className="error">{}</span>
            </div>
            <div className="input-group">
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <span className="error">{}</span>
            </div>
         
            <button type="submit">Sign Up</button>
          </form>
        </>
      )}
    </div>
  );
}

export default Signin;
