import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [result, setResult] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  const register = async () => {
    try {
      await axios.post("http://localhost:4000/register", {
        name,
        email,
        password,
      });

      alert("Registered successfully");

      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      alert("Registration failed");
    }
  };

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:4000/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      setIsLoggedIn(true);

      alert("Login successful");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Microservice Calculator</h1>

      
    </div>
  );
}

export default App;