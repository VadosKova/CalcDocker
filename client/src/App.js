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
  const [isLoginMode, setIsLoginMode] = useState(false);

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

  const calculate = async (operator) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/calculate",
        { a: Number(a), b: Number(b), operator },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(res.data.result);
    } catch (err) {
      alert("Error");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Microservice Calculator</h1>

      {!isLoggedIn ? (
        <>
          {!isLoginMode ? (
            <div>
              <h2>Register</h2>

              <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <br />

              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <br />

              <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />

              <button onClick={register}>Register</button>

              <p style={{ cursor: "pointer", color: "red" }}
                 onClick={() => setIsLoginMode(true)}>
                Already have account? Login
              </p>
            </div>
          ) : (
            <div>
              <h2>Login</h2>

              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <br />

              <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />

              <button onClick={login}>Login</button>

              <p style={{ cursor: "pointer", color: "red" }}
                 onClick={() => setIsLoginMode(false)}>
                Register new account
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          <h2>Calculator</h2>

          <input placeholder=" " onChange={(e) => setA(e.target.value)} />
          <input placeholder=" " onChange={(e) => setB(e.target.value)} />

          <br />

          <button onClick={() => calculate("+")}>+</button>
          <button onClick={() => calculate("-")}>-</button>
          <button onClick={() => calculate("*")}>*</button>
          <button onClick={() => calculate("/")}>/</button>
          <button onClick={() => calculate("%")}>%</button>

          <button
            onClick={() => {
              setA("");
              setB("");
              setResult("");
            }}
          >
            C
          </button>

          <h3>Result: {result}</h3>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              setIsLoggedIn(false);
            }}
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}

export default App;