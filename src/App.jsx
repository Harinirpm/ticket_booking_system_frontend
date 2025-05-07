import { useContext, useEffect, useState } from 'react'
import './App.css'
import { UserContext } from './UserContext';
import Login from './authentication/Login';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import User from './pages/User';
import ProtectedRoute from './ProtectedRoute';
import jwt_decode from 'jwt-decode';

function App() {

  const { user, setUser, isLoggedIn, setIsLoggedIn } = useContext(UserContext);
  //each refresh the token and user will be restore here
  useEffect(()=>{
    const token = localStorage.getItem("token");
    if(token && !user){
      try{
        const decode = jwt_decode(token);
        setUser({
          email:decode.sub,
          name:decode.name,
          role:decode.role,
        });
        setIsLoggedIn(true);
      }catch(err){
        console.error("Invalid token : ",err);
        localStorage.removeItem("token");
      }
      }
  },[user, setUser, setIsLoggedIn]);

  return (
    <>
    
      <Routes>
        <Route path='/' element={isLoggedIn?<Home />:<Login />}/>

        {/* admin */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} redirectPath='/' />}>
        <Route path='/admin' element={<Home />}/>
        </Route>

        {/* user */}
        <Route element={<ProtectedRoute allowedRoles={["user"]} redirectPath='/' />}>
        <Route path='/user' element={<User />}/>
        </Route>

      </Routes>

    </>
  )
}

export default App
