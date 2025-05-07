    import React from "react";
    import { useContext} from "react";
    import {UserContext} from "./UserContext";
    import { Navigate, Outlet } from "react-router-dom";
    const ProtectedRoute = ({allowedRoles,redirectPath = '/'}) =>{
        const {user} = useContext(UserContext);
        if(!user||!allowedRoles.includes(user.role)){
            return <Navigate to={redirectPath}/>
        }
        return <Outlet/>
    }
    export default ProtectedRoute;