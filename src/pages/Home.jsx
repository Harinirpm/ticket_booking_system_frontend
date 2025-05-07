import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import {UserContext} from '../UserContext';

function Home() {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const {user} = useContext(UserContext);
    
    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const token = localStorage.getItem("token");
          console.log("Token:", token);
          const res = await axios.get("http://localhost:8080/users/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
         console.log("details :",res.data);
          setProfile(res.data);
        } catch (err) {
          setError(err.response?.data?.message || "Something went wrong");
        }
      };
  
      fetchProfile();
    }, []);
  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {profile ? (
        <div>
          <h2>Welcome, {user?.name}</h2>
          <p>{profile}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  )
}

export default Home
