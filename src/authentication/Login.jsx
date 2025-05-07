import { Button, Popover, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import jwt_decode from 'jwt-decode';
import axios from "axios";

function Login() {
  const [values, setValues] = useState({
    email:"",
    password:""
  });
  
 const {setUser,setIsLoggedIn} = useContext(UserContext);
 const navigate = useNavigate();

 const handleSubmit = (event) => {
  event.preventDefault();
  axios.post("http://localhost:8080/auth/login", values)
      .then(res => {
          if (res.data.status === "success") {
              const token = res.data.token;
              try {
                  const decode = jwt_decode(token);
                  if (!decode || !decode.role || !decode.sub) {
                      throw new Error("Invalid token");
                  }
                  localStorage.setItem("token", token);
                  setUser({
                      email: decode.sub,
                      name: decode.name,
                      role: decode.role,
                  });
                  setIsLoggedIn(true);
                  if (decode.role === "admin") navigate('/admin');
                  else if (decode.role === "user") navigate('/user');
                  else navigate('/');
              } catch (err) {
                  console.error("Token decoding failed:", err);
                  localStorage.removeItem("token");
                  alert("Invalid token received from server.");
              }
          } else {
              localStorage.removeItem("token");
              alert("Invalid email or password");
          }
      })
      .catch(err => {
          localStorage.removeItem("token");
          console.log("Login error:", err);
          alert("Login failed. Please try again.");
      });
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues, 
      [name]: value, 
    }));
  };
  return (
    <>
      <div className="container">
      <Popover
          open={true}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
            <form onSubmit={handleSubmit}>
          <TextField
            hiddenLabel
            type="email"
            name="email"
            value={values.email}
            onChange={handleInputChange}
          /><br />
          <TextField
            type="password"
            name="password"
            hiddenLabel
            value={values.password}
            onChange={handleInputChange}
          />
          <br />
          <Button type="submit" variant="contained">Login</Button>
          </form>
       </Popover>
      </div>
    </>
  );
}
export default Login;
